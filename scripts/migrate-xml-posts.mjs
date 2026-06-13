/**
 * SCSF WordPress XML → Sanity Posts Migration
 * ---------------------------------------------
 * Parses the WordPress XML export and imports ALL 113 posts (including
 * archived ones) into Sanity as "announcement" documents.
 *
 * Run:
 *   bun --env-file=.env.local scripts/migrate-xml-posts.mjs path/to/export.xml
 *
 * The XML file argument is optional — defaults to the filename below.
 */

const XML_FILE      = process.argv[2] || 'theskatingclubofsanfrancisco.WordPress.2026-06-13.xml';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1';
const SANITY_DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production';
const SANITY_TOKEN      = process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN || '';

if (!SANITY_TOKEN) {
  console.error('❌ SANITY_TOKEN required. Run: bun --env-file=.env.local scripts/migrate-xml-posts.mjs');
  process.exit(1);
}

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: '2024-01-01',
  token:      SANITY_TOKEN,
  useCdn:     false,
});

function stripHtml(html) {
  if (!html) return '';
  return html
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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToPortableText(html) {
  if (!html) return [];
  const text = stripHtml(html);
  return text.split(/\n{2,}/).map(para => para.trim()).filter(Boolean).map(text => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  }));
}

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

async function main() {
  console.log(`📖 Reading ${XML_FILE}…`);
  const xmlContent = readFileSync(XML_FILE, 'utf8');

  console.log('🔍 Parsing XML…');
  const result = await parseXml(xmlContent, { explicitArray: true });
  const items = result?.rss?.channel?.[0]?.item || [];

  const posts = items.filter(item => {
    const type = item['wp:post_type']?.[0];
    return type === 'post';
  });

  console.log(`\n📊 Found ${posts.length} posts`);

  const statusCounts = {};
  posts.forEach(p => {
    const s = p['wp:status']?.[0] || 'unknown';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  console.log('   Status breakdown:', statusCounts);

  const docs = posts.map((post, i) => {
    const title   = post.title?.[0] || 'Untitled';
    const slug    = post['wp:post_name']?.[0] || slugify(title) || `post-${i}`;
    const date    = post['wp:post_date']?.[0] || post.pubDate?.[0] || new Date().toISOString();
    const status  = post['wp:status']?.[0] || 'archive';
    const content = post['content:encoded']?.[0] || '';
    const excerpt = post['excerpt:encoded']?.[0] || '';

    // Parse date — WP format is "2017-04-17 14:30:00"
    let publishedAt;
    try {
      publishedAt = new Date(date.replace(' ', 'T')).toISOString();
    } catch {
      publishedAt = new Date().toISOString();
    }

    const excerptText = stripHtml(excerpt).slice(0, 200) || stripHtml(content).slice(0, 200);

    return {
      _id:         `wp-post-${post['wp:post_id']?.[0] || i}`,
      _type:       'announcement',
      title:       title.replace(/&amp;/g, '&').replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8217;/g, "'"),
      slug:        { _type: 'slug', current: slug || `post-${i}` },
      publishedAt,
      author:      'SCSF',
      excerpt:     excerptText || undefined,
      content:     htmlToPortableText(content),
      // Store original WP status so it can be filtered in the UI
      _wpStatus:   status,
    };
  });

  console.log(`\n⬆️  Importing ${docs.length} announcements to Sanity…`);

  const BATCH = 50;
  let imported = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    const tx = sanity.transaction();
    batch.forEach(doc => tx.createOrReplace(doc));
    await tx.commit();
    imported += batch.length;
    process.stdout.write(`\r   ${imported}/${docs.length} imported…`);
  }

  console.log(`\n\n✅ Done — ${docs.length} posts imported (including ${statusCounts.archive || 0} archived).`);
  console.log('   All posts are in Sanity as "announcement" type.');
  console.log('   Archived posts are included — filter by publishedAt in the UI.');
}

main().catch(err => {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
});
