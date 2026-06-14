/**
 * Deletes ALL announcement docs from Sanity, then exits.
 * Run this before reimporting to avoid stale duplicate docs.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/clean-announcements.mjs
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const ids = await client.fetch(`*[_type == "announcement"]._id`);
console.log(`Found ${ids.length} announcement docs to delete`);

if (ids.length === 0) { console.log('Nothing to delete.'); process.exit(0); }

const BATCH = 50;
let deleted = 0;
for (let i = 0; i < ids.length; i += BATCH) {
  const tx = client.transaction();
  ids.slice(i, i + BATCH).forEach(id => tx.delete(id));
  await tx.commit();
  deleted += Math.min(BATCH, ids.length - i);
  process.stdout.write(`\r  ${deleted}/${ids.length} deleted…`);
}
console.log(`\nDone — ${deleted} docs removed. Now re-run extract + import.`);
