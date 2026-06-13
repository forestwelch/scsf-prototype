/**
 * WordPress → Sanity Migration Script
 * ------------------------------------
 * Pulls posts from the WP REST API and imports them into Sanity as "announcement" documents.
 * Also pulls pages and imports them as "page" documents.
 *
 * SETUP:
 *   1. npm install node-fetch @sanity/client (or: node >= 18 has native fetch, skip node-fetch)
 *   2. Create a Sanity API token at sanity.io → Manage → API → Tokens (Editor role)
 *   3. Fill in the CONFIG section below
 *   4. node scripts/migrate-wp-to-sanity.mjs
 *
 * If your WP site requires authentication (application passwords):
 *   - WP admin → Users → Profile → Application Passwords → Add New
 *   - Set WP_USERNAME and WP_APP_PASSWORD below
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WP_BASE_URL   = 'https://scsf.org/wp-json/wp/v2';
const WP_USERNAME     = process.env.WP_USERNAME     || '';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || '';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'xi18pbe1';
const SANITY_DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || process.env.SANITY_DATASET    || 'production';
const SANITY_TOKEN      = process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN || '';
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: '2024-01-01',
  token:      SANITY_TOKEN,
  useCdn:     false,
});

function wpAuthHeaders() {
  if (!WP_USERNAME || !WP_APP_PASSWORD) return {};
  const creds = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD.replace(/\s/g, '')}`).toString('base64');
  return { Authorization: `Basic ${creds}` };
}

async function fetchAllWpItems(endpoint, extraParams = '') {
  let page = 1;
  let all = [];
  while (true) {
    const url = `${WP_BASE_URL}/${endpoint}?per_page=100&page=${page}&_fields=id,slug,title,date,excerpt,content,status,link${extraParams}`;
    const res = await fetch(url, { headers: wpAuthHeaders() });

    if (res.status === 400) break; // WP returns 400 when page exceeds total
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`WP API error ${res.status} for ${url}: ${body}`);
    }

    const data = await res.json();
    if (!data.length) break;
    all = all.concat(data);
    page++;
    if (data.length < 100) break; // last page
  }
  return all;
}

/** Convert WP HTML content to a single Sanity portable-text block (plain paragraph).
 *  For rich conversion, use the sanity-plugin-wordpress-import or html-to-portable-text packages.
 *  This keeps it dependency-light — the content is stored as one block with the raw HTML stripped.
 */
function htmlToPortableText(html) {
  if (!html) return [];
  // Very basic: strip tags, split on double newline, make paragraphs
  const stripped = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .trim();

  return stripped
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    }));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

async function migratePosts() {
  console.log('\n📥 Fetching WordPress posts…');
  // Fetch published posts first (no auth needed)
  let posts = await fetchAllWpItems('posts');
  // If WP app password is set, also fetch archived posts
  if (WP_USERNAME && WP_APP_PASSWORD) {
    console.log('   Auth set — also fetching archived posts…');
    const archived = await fetchAllWpItems('posts', '&status=archived');
    const draft    = await fetchAllWpItems('posts', '&status=draft');
    posts = [...posts, ...archived, ...draft];
  } else {
    console.log('   No WP auth set — only fetching published posts (107 archived posts skipped).');
    console.log('   Set WP_USERNAME + WP_APP_PASSWORD in the CONFIG to get archived posts.');
  }
  console.log(`   Found ${posts.length} posts`);

  if (!posts.length) return;

  const docs = posts.map((post) => {
    const slug = post.slug || slugify(post.title?.rendered || String(post.id));
    return {
      _id: `wp-post-${post.id}`,
      _type: 'announcement',
      title: post.title?.rendered?.replace(/&amp;/g, '&') || 'Untitled',
      slug: { _type: 'slug', current: slug },
      publishedAt: post.date || new Date().toISOString(),
      author: 'SCSF',
      excerpt: post.excerpt?.rendered
        ? post.excerpt.rendered.replace(/<[^>]+>/g, '').trim().slice(0, 200)
        : undefined,
      content: htmlToPortableText(post.content?.rendered || ''),
    };
  });

  console.log(`   Importing ${docs.length} announcements to Sanity…`);
  const transaction = sanity.transaction();
  docs.forEach((doc) => transaction.createOrReplace(doc));
  await transaction.commit();
  console.log(`   ✅ Done — ${docs.length} announcements imported`);
}

async function migratePages() {
  console.log('\n📥 Fetching WordPress pages…');
  const pages = await fetchAllWpItems('pages');
  console.log(`   Found ${pages.length} pages`);

  if (!pages.length) return;

  // Skip WP system pages that don't make sense in the new site
  const SKIP_SLUGS = new Set(['sample-page', 'privacy-policy', 'home']);
  const filtered = pages.filter((p) => p.status === 'publish' && !SKIP_SLUGS.has(p.slug));

  const docs = filtered.map((page) => {
    const slug = page.slug || slugify(page.title?.rendered || String(page.id));
    return {
      _id: `wp-page-${page.id}`,
      _type: 'page',
      title: page.title?.rendered?.replace(/&amp;/g, '&') || 'Untitled',
      slug: { _type: 'slug', current: slug },
      showInNav: false,
      content: htmlToPortableText(page.content?.rendered || ''),
    };
  });

  if (!docs.length) {
    console.log('   No publishable pages to import (all skipped)');
    return;
  }

  console.log(`   Importing ${docs.length} pages to Sanity…`);
  const transaction = sanity.transaction();
  docs.forEach((doc) => transaction.createOrReplace(doc));
  await transaction.commit();
  console.log(`   ✅ Done — ${docs.length} pages imported`);
}

async function main() {
  console.log('🚀 SCSF WordPress → Sanity Migration');
  console.log(`   WP source:      ${WP_BASE_URL}`);
  console.log(`   Sanity project: ${SANITY_PROJECT_ID} / ${SANITY_DATASET}`);

  try {
    await migratePosts();
    await migratePages();
    console.log('\n🎉 Migration complete! Check your Sanity Studio to review imported content.');
    console.log('   Note: Images are NOT migrated by this script. Add them manually in Studio.');
    console.log('   Note: If content looks wrong, use html-to-portable-text for richer conversion.');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

main();
