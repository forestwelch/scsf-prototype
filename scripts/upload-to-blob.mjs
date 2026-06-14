/**
 * Uploads all files from public/uploads/ to Vercel Blob.
 * Preserves path structure: public/uploads/foo/bar.pdf → uploads/foo/bar.pdf
 * Saves a URL map to scripts/blob-url-map.json for use by the rewrite script.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/upload-to-blob.mjs
 *
 * Requires: @vercel/blob  (bun add @vercel/blob)
 */

import { put, list } from '@vercel/blob';
import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const UPLOADS_DIR = join(ROOT, 'public', 'uploads');
const MAP_FILE = join(ROOT, 'scripts', 'blob-url-map.json');

// Load existing map so we can skip already-uploaded files
let urlMap = {};
try {
  urlMap = JSON.parse(await readFile(MAP_FILE, 'utf8'));
  console.log(`Loaded existing map: ${Object.keys(urlMap).length} entries`);
} catch {
  console.log('No existing map — starting fresh');
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let uploaded = 0, skipped = 0, failed = 0;

for await (const filePath of walk(UPLOADS_DIR)) {
  const rel = relative(UPLOADS_DIR, filePath);           // e.g. 2016/05/foo.pdf
  const blobPath = `uploads/${rel}`;                     // pathname in blob store
  const wpUrl = `https://scsf.org/wp-content/uploads/${rel.replace(/\\/g, '/')}`;

  if (urlMap[wpUrl]) {
    skipped++;
    continue;
  }

  try {
    const body = await readFile(filePath);
    const result = await put(blobPath, body, {
      access: 'public',
      addRandomSuffix: false,     // keep deterministic URLs
    });
    urlMap[wpUrl] = result.url;
    uploaded++;
    if (uploaded % 10 === 0 || uploaded <= 5) {
      console.log(`✓ [${uploaded}] ${rel}`);
    }
  } catch (err) {
    console.error(`✗ FAILED: ${rel} — ${err.message}`);
    failed++;
  }
}

// Save map
await writeFile(MAP_FILE, JSON.stringify(urlMap, null, 2));

console.log(`\n=== Done: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed ===`);
console.log(`URL map saved to scripts/blob-url-map.json`);
console.log(`\nNext: bun --env-file=.env.local scripts/rewrite-blob-urls.mjs`);
