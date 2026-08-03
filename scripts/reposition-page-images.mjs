/**
 * reposition-page-images.mjs
 * ------------------------------------
 * Fixes image placement after backfill-page-images.mjs. That script (safely)
 * appends images to the *end* of a page's content, which means on a page
 * like about-sf-ice-theater — 30+ images, one per team/year — every photo
 * ends up bunched at the bottom instead of next to the team it belongs to,
 * like it was on the old WP site. Moving each one into place by hand in
 * Studio would mean ~30 manual drags.
 *
 * This script does it automatically: it walks the live WP page in document
 * order, tracking which <h2> heading each <img> falls under (e.g. "2024-2025
 * Adult Team"), then finds that same heading in the Sanity page's existing
 * content and moves the image to sit right after it — matching the old
 * site's layout. It reuses already-uploaded assets from
 * scripts/sanity-image-map.json (no re-downloading/re-uploading).
 *
 * This DOES rewrite the page's `content` array (to reorder blocks), but only
 * moves existing image blocks — it does not change, remove, or reorder any
 * text. If a heading match can't be found for some image, that image is left
 * at the end (same as before) and a warning is printed so you can place it
 * by hand.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/reposition-page-images.mjs about-sf-ice-theater
 */

import { createClient } from '@sanity/client';
import { readFile } from 'fs/promises';
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

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: bun scripts/reposition-page-images.mjs <page-slug>');
  process.exit(1);
}

function decodeEntities(s) {
  return s
    .replace(/&#8211;|&#8212;/g, '-')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Walk the raw HTML top-to-bottom, tracking the most recent <h2> heading and
// associating each <img> with whichever heading currently "owns" it.
function extractHeadingImagePairs(html) {
  const pairs = [];
  let currentHeading = null;
  const tokenRe = /<h2[^>]*>([\s\S]*?)<\/h2>|<img[^>]*>/gi;
  let m;
  while ((m = tokenRe.exec(html)) !== null) {
    const tag = m[0];
    if (tag.toLowerCase().startsWith('<h2')) {
      currentHeading = decodeEntities(tag.replace(/<[^>]+>/g, ''));
    } else {
      const origFile = tag.match(/data-orig-file="([^"]+)"/i)?.[1];
      const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
      let url = (origFile || src || '').replace(/&#038;/g, '&').split('?')[0];
      if (!url) continue;
      pairs.push({ heading: currentHeading, url });
    }
  }
  return pairs;
}

function plainText(block) {
  if (block?._type !== 'block') return null;
  return decodeEntities((block.children || []).map((c) => c.text || '').join(''));
}

async function fetchWpPage(slug) {
  const url = `${WP_BASE_URL}/pages?slug=${slug}&_fields=slug,title,content`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API error ${res.status} for slug "${slug}"`);
  const data = await res.json();
  if (!data.length) throw new Error(`No WP page found for slug "${slug}"`);
  return data[0];
}

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

async function main() {
  console.log(`🔀 Repositioning images on "${slug}"\n`);

  const imageMap = JSON.parse(await readFile(MAP_FILE, 'utf8').catch(() => '{}'));

  const wpPage = await fetchWpPage(slug);
  const html = wpPage.content?.rendered || '';
  const pairs = extractHeadingImagePairs(html);
  console.log(`Found ${pairs.length} image(s) with heading context on the live WP page.`);

  const doc = await sanity.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ _id, content }`,
    { slug }
  );
  if (!doc) {
    console.error(`❌ No Sanity "page" doc with slug "${slug}" found.`);
    process.exit(1);
  }

  // Pull existing image blocks out — we're about to reinsert them in the
  // right place. Non-image blocks (all your text) are left completely alone.
  let content = doc.content || [];
  const existingImageBlocks = content.filter((b) => b._type === 'image');
  content = content.filter((b) => b._type !== 'image');

  const assetIdByUrl = {};
  for (const [url, assetId] of Object.entries(imageMap)) assetIdByUrl[url] = assetId;

  // Track, per heading, the index we should insert the *next* image after —
  // so multiple images under the same heading stack in document order
  // instead of reversing each other.
  const insertAfterIndex = {};
  let appendedToEnd = 0;
  let placed = 0;

  for (const { heading, url } of pairs) {
    const assetId = assetIdByUrl[url];
    if (!assetId) {
      console.log(`   ⚠ No uploaded asset found for ${url.split('/').pop()} — skipping (run backfill-page-images.mjs first).`);
      continue;
    }
    const existingBlock = existingImageBlocks.find((b) => b.asset?._ref === assetId);
    const newBlock = existingBlock || {
      _key: randomKey(),
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt: '',
    };

    let targetIndex = -1;
    if (heading) {
      const key = heading.toLowerCase();
      if (key in insertAfterIndex) {
        targetIndex = insertAfterIndex[key];
      } else {
        targetIndex = content.findIndex((b) => plainText(b)?.toLowerCase() === key);
      }
    }

    if (targetIndex === -1) {
      content.push(newBlock);
      appendedToEnd++;
      continue;
    }

    content.splice(targetIndex + 1, 0, newBlock);
    insertAfterIndex[heading.toLowerCase()] = targetIndex + 1; // next image under same heading goes after this one
    // Any other headings' remembered indices that come after this insertion point shift by 1.
    for (const k of Object.keys(insertAfterIndex)) {
      if (k !== heading.toLowerCase() && insertAfterIndex[k] > targetIndex) {
        insertAfterIndex[k] += 1;
      }
    }
    placed++;
  }

  console.log(`\nPlaced ${placed} image(s) under their matching heading.`);
  if (appendedToEnd) {
    console.log(`⚠ ${appendedToEnd} image(s) had no heading match and were left at the end — reposition those by hand in Studio.`);
  }

  await sanity.patch(doc._id).set({ content }).commit();
  console.log(`\n✅ Updated "${slug}". Refresh the page to see images in place.`);
}

main().catch((err) => {
  console.error('\n❌ Failed:', err);
  process.exit(1);
});
