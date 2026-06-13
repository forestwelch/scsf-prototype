/**
 * SCSF Tests Passed Migration Script
 * ------------------------------------
 * Fetches the tests-passed WP pages, parses the HTML tables,
 * and imports each test as an individual Sanity testPassed document.
 *
 * SETUP:
 *   1. npm install @sanity/client  (or bun add @sanity/client)
 *   2. Create a Sanity API token: sanity.io/manage → project → API → Tokens → Add (Editor role)
 *   3. Run:
 *        SANITY_TOKEN=your_token node scripts/migrate-tests-passed.mjs
 *
 * Or set SANITY_TOKEN in .env.local and run with:
 *        node --env-file=.env.local scripts/migrate-tests-passed.mjs
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WP_BASE_URL       = 'https://scsf.org/wp-json/wp/v2';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1';
const SANITY_DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production';
const SANITY_TOKEN      = process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN || '';
// ─────────────────────────────────────────────────────────────────────────────

if (!SANITY_TOKEN) {
  console.error('❌ SANITY_TOKEN env var is required.');
  console.error('   Run: SANITY_TOKEN=your_token node scripts/migrate-tests-passed.mjs');
  process.exit(1);
}

import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: '2024-01-01',
  token:      SANITY_TOKEN,
  useCdn:     false,
});

// Pages that contain tests-passed data, in order (newest first)
const TESTS_PASSED_SLUGS = [
  'tests-passed-2026',
  'tests-passed-2025',
  'tests-passed-2024',
  'test-passed-2023',   // note: typo on the WP site, singular "test"
];

const MONTHS = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

// ─── TEST TYPE CLASSIFIER ─────────────────────────────────────────────────────
// Dance pattern names used by USFS
const DANCE_PATTERNS = [
  'dutch waltz', 'canasta tango', 'rhythm blues', 'cha cha', 'fiesta tango',
  'swing dance', 'hickory hoedown', 'european waltz', 'foxtrot', 'american waltz',
  'tango', 'kilian', 'killian', 'blues', 'paso doble', 'march', 'viennese waltz',
  'quickstep', 'rhumba', 'rocker foxtrot', 'starlight waltz', 'ten-fox',
  'westminster waltz', 'argentine tango', 'Austrian waltz', 'silver samba',
  'gold rhumba', 'ravensburger waltz', 'silver sterling tango', 'queen\'s',
  'midnight blues', 'golden waltz', 'preliminary dance', 'pre-bronze dance',
  'bronze dance', 'silver dance', 'gold dance', 'international dance',
  'adult bronze dance', 'adult silver dance',
];

function classifyTestType(testName) {
  const lower = testName.toLowerCase();

  // Pairs
  if (lower.includes('pairs') || lower.includes('pair ')) return 'pairs';

  // Dance — check pattern names first, then keywords
  if (lower.includes('dance') || lower.includes('solo')) return 'dance';
  for (const pattern of DANCE_PATTERNS) {
    if (lower.includes(pattern)) return 'dance';
  }

  // Moves in the Field (now called Skating Skills in USFS)
  if (lower.includes('skating skills') || lower.includes('moves in the field')) return 'moves';

  // Free Skate / Singles (Singles is the old name for Free Skate levels)
  if (
    lower.includes('singles') ||
    lower.includes('free skate') ||
    lower.includes('freeskate') ||
    lower.includes('free') ||
    lower.includes('short program') ||
    lower.includes('long program')
  ) return 'freeskate';

  // Default fallback — most remaining tests are skating skills
  return 'moves';
}

// Strip honors/distinction markers (**, ***) from skater names
function cleanSkaterName(name) {
  return name.replace(/\*+$/, '').replace(/\s+$/, '').trim();
}

// Convert "January 2025" → "2025-01-15" (mid-month, avoids timezone edge cases)
function monthYearToDate(month, year) {
  const mm = MONTHS[month] || '01';
  return `${year}-${mm}-15`;
}

// ─── HTML PARSER ─────────────────────────────────────────────────────────────
function parseTestsPassedHtml(html, sourceSlug) {
  const records = [];

  // Extract month sections: find <h3>Month Year</h3> ... <table class="tablepress">
  // Strategy: split on month headers, then parse tables within each section
  const monthHeaderRe = /<h3[^>]*>(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})<\/h3>/gi;
  const tableRe = /<table[^>]*class="[^"]*tablepress[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const stripTagsRe = /<[^>]+>/g;

  // Find all month headers and their positions
  const headers = [];
  let m;
  while ((m = monthHeaderRe.exec(html)) !== null) {
    headers.push({ month: m[1], year: parseInt(m[2]), pos: m.index });
  }

  if (headers.length === 0) {
    console.warn(`   ⚠ No month headers found in ${sourceSlug}`);
    return records;
  }

  // For each month section, find the tables between this header and the next
  for (let i = 0; i < headers.length; i++) {
    const { month, year, pos } = headers[i];
    const end = headers[i + 1]?.pos ?? html.length;
    const section = html.slice(pos, end);

    // Reset table regex per section
    tableRe.lastIndex = 0;
    let tableMatch;
    while ((tableMatch = tableRe.exec(section)) !== null) {
      const tableHtml = tableMatch[0];
      rowRe.lastIndex = 0;
      let rowMatch;
      let rowIndex = 0;
      while ((rowMatch = rowRe.exec(tableHtml)) !== null) {
        rowIndex++;
        if (rowIndex === 1) continue; // skip header row

        const rowHtml = rowMatch[1];
        const cells = [];
        cellRe.lastIndex = 0;
        let cellMatch;
        while ((cellMatch = cellRe.exec(rowHtml)) !== null) {
          const text = cellMatch[1]
            .replace(stripTagsRe, '')
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, ' ')
            .replace(/&#8220;|&#8221;/g, '"')
            .replace(/&#8216;|&#8217;/g, "'")
            .replace(/&#038;/g, '&')
            .trim();
          cells.push(text);
        }

        if (cells.length >= 2) {
          const skaterName = cleanSkaterName(cells[0]);
          const testLevel  = cells[1].trim();
          if (!skaterName || !testLevel || skaterName.toLowerCase() === 'skater') continue;

          records.push({
            skaterName,
            testLevel,
            testType:   classifyTestType(testLevel),
            passedDate: monthYearToDate(month, year),
            _source:    sourceSlug,
          });
        }
      }
    }
  }

  return records;
}

// ─── FETCH & IMPORT ──────────────────────────────────────────────────────────
async function fetchPage(slug) {
  const url = `${WP_BASE_URL}/pages?slug=${slug}&_fields=slug,title,content`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API error ${res.status} for slug "${slug}"`);
  const data = await res.json();
  if (!data.length) throw new Error(`No page found for slug "${slug}"`);
  return data[0];
}

async function main() {
  console.log('🏒 SCSF Tests Passed Migration\n');

  let allRecords = [];

  for (const slug of TESTS_PASSED_SLUGS) {
    process.stdout.write(`📥 Fetching ${slug}…`);
    try {
      const page = await fetchPage(slug);
      const html = page.content?.rendered || '';
      const records = parseTestsPassedHtml(html, slug);
      console.log(` ${records.length} records`);
      allRecords = allRecords.concat(records);
    } catch (err) {
      console.log(` ⚠ SKIPPED: ${err.message}`);
    }
  }

  console.log(`\n📊 Total records to import: ${allRecords.length}`);

  if (allRecords.length === 0) {
    console.log('Nothing to import. Exiting.');
    return;
  }

  // Preview
  console.log('\nSample records:');
  allRecords.slice(0, 5).forEach(r =>
    console.log(`  ${r.passedDate} | ${r.skaterName} | [${r.testType}] ${r.testLevel}`)
  );

  // Type distribution
  const typeCounts = allRecords.reduce((acc, r) => {
    acc[r.testType] = (acc[r.testType] || 0) + 1;
    return acc;
  }, {});
  console.log('\nBy type:', typeCounts);

  // Import to Sanity in batches of 100
  console.log('\n⬆️  Importing to Sanity…');
  const BATCH = 100;
  let imported = 0;

  for (let i = 0; i < allRecords.length; i += BATCH) {
    const batch = allRecords.slice(i, i + BATCH);
    const tx = sanity.transaction();

    batch.forEach((r, j) => {
      const id = `wp-test-${r.passedDate}-${r.skaterName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}-${i + j}`;
      tx.createOrReplace({
        _id:        id,
        _type:      'testPassed',
        skaterName: r.skaterName,
        testType:   r.testType,
        testLevel:  r.testLevel,
        passedDate: r.passedDate,
      });
    });

    await tx.commit();
    imported += batch.length;
    process.stdout.write(`\r   ${imported}/${allRecords.length} imported…`);
  }

  console.log(`\n\n✅ Done — ${imported} test records imported to Sanity!`);
  console.log('   Open Sanity Studio → Tests Passed to verify.');
}

main().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
