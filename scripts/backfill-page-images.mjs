/**
 * backfill-page-images.mjs
 * ------------------------------------
 * The original WP → Sanity page migration (migrate-wp-to-sanity.mjs) stripped
 * ALL images when converting HTML to portable text — see its own comment:
 * "Note: Images are NOT migrated by this script." This script fixes that for
 * one or more pages, without touching any text you've already edited in
 * Sanity: it finds every <img> on the live WP page, uploads each one to
 * Sanity's asset store, and APPENDS them as image blocks to the end of that
 * page's existing `content` array. It does not delete or reorder anything
 * already there.
 *
 * After running, open the page in Sanity Studio and drag the newly-added
 * image blocks (they'll be at the bottom) up into position within the text —
 * that's a native drag in the portable text editor now that the `page`
 * schema supports inline images.
 *
 * Safe to re-run: images already uploaded/attached are skipped (tracked via
 * scripts/sanity-image-map.json + a check against the page's existing
 * content), so running this twice won't create duplicates.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/backfill-page-images.mjs about-sf-ice-theater
 *   bun --env-file=.env.local scripts/backfill-page-images.mjs slug-one slug-two slug-three
 *   (no args) defaults to just about-sf-ice-theater
 */

import { createClient } from '@sanity/client';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join } from 'path';

const WP_BASE_URL       = 'https://scsf.org/wp-json/wp/v2';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1';
const SANITY_DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production';
const SANITY_TOKEN      = process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN || '';

if (!SANITY_TOKEN) {
  console.error('❌ SANITY_TOKEN (or NEXT_PUBLIC_SANITY_TOKEN) env var is required.');
  process.exit(1);
}

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: '2024-01-01',
  token:      SANITY_TOKEN,
  useCdn:     false,
});

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAP_FILE = join(ROOT, 'scripts', 'sanity-image-map.json');

const slugs = process.argv.slice(2);
const targetSlugs = slugs.length ? slugs : ['about-sf-ice-theater'];

// ─── Load/save the WP-url → Sanity-asset-id cache ─────────────────────────────
async function loadImageMap() {
  try {
    return JSON.parse(await readFile(MAP_FILE, 'utf8'));
  } catch {
    return {};
  }
}
async function saveImageMap(map) {
  await writeFile(MAP_FILE, JSON.stringify(map, null, 2));
}

// ─── Parse <img> tags out of WP rendered HTML ─────────────────────────────────
// Prefers data-orig-file (full-resolution original) over src (often a resized
// thumbnail variant like "-1024x683"), and pulls the WP alt text along too.
function extractImages(html) {
  const images = [];
  const seen = new Set();
  const imgTagRe = /<img[^>]*>/gi;
  let m;
  while ((m = imgTagRe.exec(html)) !== null) {
    const tag = m[0];
    const origFile = tag.match(/data-orig-file="([^"]+)"/i)?.[1];
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    const alt = tag.match(/\salt="([^"]*)"/i)?.[1] || '';
    let url = origFile || src;
    if (!url) continue;
    url = url.replace(/&#038;/g, '&').split('?')[0];
    if (seen.has(url)) continue;
    seen.add(url);
    images.push({ url, alt });
  }
  return images;
}

async function fetchWpPage(slug) {
  const url = `${WP_BASE_URL}/pages?slug=${slug}&_fields=slug,title,content`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API error ${res.status} for slug "${slug}"`);
  const data = await res.json();
  if (!data.length) throw new Error(`No WP page found for slug "${slug}"`);
  return data[0];
}

async function uploadImage(url, alt, imageMap) {
  if (imageMap[url]) {
    return imageMap[url]; // already uploaded in a previous run
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = url.split('/').pop() || 'image.jpg';
  const asset = await sanity.assets.upload('image', buffer, { filename });
  imageMap[url] = asset._id;
  return asset._id;
}

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

async function backfillPage(slug, imageMap) {
  console.log(`\n📄 ${slug}`);

  let wpPage;
  try {
    wpPage = await fetchWpPage(slug);
  } catch (err) {
    console.log(`   ⚠ Skipped — couldn't fetch from WP: ${err.message}`);
    return;
  }

  const html = wpPage.content?.rendered || '';
  const images = extractImages(html);
  if (images.length === 0) {
    console.log('   No <img> tags found on the WP page — nothing to backfill.');
    return;
  }
  console.log(`   Found ${images.length} image(s) on the live WP page.`);

  const sanityDoc = await sanity.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ _id, content }`,
    { slug }
  );
  if (!sanityDoc) {
    console.log(`   ⚠ Skipped — no Sanity "page" doc with slug "${slug}" exists yet.`);
    console.log('     Create the page in Studio first, then re-run this script.');
    return;
  }

  const existingAssetIds = new Set(
    (sanityDoc.content || [])
      .filter((b) => b._type === 'image')
      .map((b) => b.asset?._ref)
      .filter(Boolean)
  );

  const newBlocks = [];
  for (const { url, alt } of images) {
    process.stdout.write(`   ⬆️  ${url.split('/').pop()}…`);
    let assetId;
    try {
      assetId = await uploadImage(url, alt, imageMap);
    } catch (err) {
      console.log(` ✗ FAILED (${err.message})`);
      continue;
    }
    if (existingAssetIds.has(assetId)) {
      console.log(' already on this page, skipping');
      continue;
    }
    newBlocks.push({
      _key: randomKey(),
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt,
    });
    existingAssetIds.add(assetId);
    console.log(' done');
  }

  if (newBlocks.length === 0) {
    console.log('   Nothing new to add — page already has all these images.');
    return;
  }

  await sanity
    .patch(sanityDoc._id)
    .setIfMissing({ content: [] })
    .append('content', newBlocks)
    .commit();

  console.log(`   ✅ Appended ${newBlocks.length} image block(s) to the end of the page's content.`);
  console.log('      Open it in Studio and drag them into position in the text.');
}

async function main() {
  console.log('🖼️  SCSF Page Image Backfill');
  console.log(`   Target page(s): ${targetSlugs.join(', ')}`);

  const imageMap = await loadImageMap();

  for (const slug of targetSlugs) {
    await backfillPage(slug, imageMap);
    await saveImageMap(imageMap); // save incrementally in case a later page fails
  }

  console.log('\n🎉 Done.');
}

main().catch((err) => {
  console.error('\n❌ Failed:', err);
  process.exit(1);
});
