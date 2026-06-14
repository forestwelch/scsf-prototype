/**
 * Rewrites all scsf.org/wp-content/uploads/ URLs in Sanity documents
 * to their Vercel Blob equivalents using the map from upload-to-blob.mjs.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/rewrite-blob-urls.mjs
 *
 * Safe to re-run — only patches docs that still contain old URLs.
 */

import { createClient } from '@sanity/client';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join } from 'path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAP_FILE = join(ROOT, 'scripts', 'blob-url-map.json');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const urlMap = JSON.parse(await readFile(MAP_FILE, 'utf8'));
console.log(`Loaded ${Object.keys(urlMap).length} URL mappings`);

// Rewrite any string value using the URL map
function rewriteStr(s) {
  if (!s || !s.includes('scsf.org/wp-content/uploads/')) return s;
  for (const [old, neu] of Object.entries(urlMap)) {
    if (s.includes(old)) s = s.split(old).join(neu);
    const http = old.replace('https://', 'http://');
    if (s.includes(http)) s = s.split(http).join(neu);
  }
  return s;
}

// Deep-walk any value and rewrite strings in place
function rewriteValue(val) {
  if (typeof val === 'string') return rewriteStr(val);
  if (Array.isArray(val)) return val.map(rewriteValue);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = rewriteValue(v);
    return out;
  }
  return val;
}

// Fetch all content docs
const docs = await client.fetch(
  `*[_type in ["announcement","page","event"]] { _id, _type, content, excerpt, body }`
);
console.log(`Scanning ${docs.length} docs for old upload URLs…`);

let patched = 0, clean = 0;
for (const doc of docs) {
  const before = JSON.stringify(doc);
  if (!before.includes('scsf.org/wp-content/uploads/')) { clean++; continue; }

  const rewritten = rewriteValue(doc);
  const patch = {};
  if (JSON.stringify(rewritten.content) !== JSON.stringify(doc.content)) patch.content = rewritten.content;
  if (rewritten.excerpt !== doc.excerpt) patch.excerpt = rewritten.excerpt;
  if (JSON.stringify(rewritten.body) !== JSON.stringify(doc.body)) patch.body = rewritten.body;

  if (Object.keys(patch).length === 0) { clean++; continue; }

  await client.patch(doc._id).set(patch).commit();
  patched++;
  console.log(`✓ patched ${doc._type}:${doc._id.slice(0, 20)}…`);
}

console.log(`\n=== Done: ${patched} docs rewritten, ${clean} already clean ===`);
