/**
 * Import wp-pages.ndjson → Sanity as "page" documents
 * Run from repo root:
 *   bun --env-file=.env.local scripts/import-wp-pages.mjs
 */

import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { resolve } from 'path';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1';
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production';
const TOKEN      = process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN;

if (!TOKEN) {
  console.error('❌  Set SANITY_TOKEN or NEXT_PUBLIC_SANITY_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: '2024-01-01', token: TOKEN, useCdn: false });

const NDJSON_PATH = resolve(process.cwd(), 'scripts/wp-pages.ndjson');

async function main() {
  console.log(`📖  Reading ${NDJSON_PATH}…`);

  const docs = [];
  const rl = createInterface({ input: createReadStream(NDJSON_PATH), crlfDelay: Infinity });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try { docs.push(JSON.parse(trimmed)); } catch { /* skip bad lines */ }
  }

  console.log(`📊  ${docs.length} page documents to import`);

  const BATCH = 50;
  let imported = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    const tx = client.transaction();
    batch.forEach(doc => tx.createOrReplace(doc));
    await tx.commit();
    imported += batch.length;
    process.stdout.write(`\r   ${imported}/${docs.length} imported…`);
  }

  console.log(`\n✅  Done — ${docs.length} WP pages imported as "page" type`);
  console.log('   Each page is now accessible at /[slug] on the new site');
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
