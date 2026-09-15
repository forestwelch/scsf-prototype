/**
 * One-time migration: testPassed.passedDate "YYYY-MM-DD" → "YYYY-MM",
 * and backfill testPassed.uploadedAt (new field) from _createdAt for any
 * existing record that doesn't have it yet.
 *
 * Safe to re-run — a no-op for any doc already in the new shape.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/migrate-tests-passed-month-year.mjs
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});

async function main() {
  const docs = await client.fetch(
    `*[_type == "testPassed"]{_id, _createdAt, passedDate, uploadedAt}`
  );
  console.log(`Found ${docs.length} testPassed docs.`);

  const patches = [];
  for (const doc of docs) {
    const set = {};
    if (typeof doc.passedDate === 'string' && doc.passedDate.length > 7) {
      set.passedDate = doc.passedDate.slice(0, 7);
    }
    if (!doc.uploadedAt) {
      set.uploadedAt = doc._createdAt;
    }
    if (Object.keys(set).length > 0) {
      patches.push({ id: doc._id, set });
    }
  }

  console.log(`${patches.length} doc(s) need updating.`);
  if (patches.length === 0) return;

  const BATCH = 100;
  let done = 0;
  for (let i = 0; i < patches.length; i += BATCH) {
    const batch = patches.slice(i, i + BATCH);
    const tx = client.transaction();
    batch.forEach((p) => tx.patch(p.id, { set: p.set }));
    await tx.commit();
    done += batch.length;
    process.stdout.write(`\r  ${done}/${patches.length} updated…`);
  }
  console.log(`\n✅ Done.`);
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
