/**
 * seed-navigation.mjs
 * Creates/updates the singleton "navigation" document in Sanity from the
 * nav structure that used to be hardcoded in components/Header.tsx.
 *
 * For any link that matches a "page" document's slug, this links to that
 * page by reference (so editing the page's slug/title in Sanity keeps the
 * nav link correct automatically). Everything else (hardcoded Next.js
 * routes like /programs, hash anchors like /membership#join, and external
 * URLs) is stored as a plain custom path/URL.
 *
 * Safe to re-run — always overwrites the single "navigation" document.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/seed-navigation.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production',
  token:     process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

if (!client.config().token) {
  console.error('❌ SANITY_TOKEN env var is required.');
  process.exit(1);
}

// Routes that are hardcoded Next.js app routes (not Sanity `page` docs),
// even though they look like plain slugs. Never resolve these as page refs.
const HARDCODED_ROUTES = new Set([
  'about', 'announcements', 'contact', 'donate', 'events', 'faqs',
  'membership', 'programs', 'resources', 'scsf-coaches', 'tests-passed',
  'the-inside-edge-newsletter-archive',
]);

// name/href pairs, mirroring the old Header.tsx exactly
const RAW_NAV = [
  { name: 'News', href: '/announcements' },
  {
    name: 'Programs', href: '/programs',
    children: [
      { name: 'BSP Policy', href: '/bsp-policy' },
      { name: 'Coaches Support Policy', href: '/scsf-coaches-support-policy' },
      { name: 'Officials Support Program', href: '/officials-support-program' },
      { name: 'Grant Policy & Application', href: '/grant-policy' },
      { name: 'USFS Scholarships & Grants', href: '/usfs-scholarships-grants-and-awards' },
      { name: 'Graduating Seniors Program', href: '/graduating-seniors-program' },
    ],
  },
  {
    name: 'Membership', href: '/membership',
    children: [
      { name: 'Join or Renew', href: '/membership#join' },
      { name: 'Membership Categories', href: '/membership#categories' },
      { name: 'Volunteer Commitment', href: '/membership#volunteer' },
      { name: 'Code of Conduct', href: '/membership#conduct' },
      { name: 'SkateSafe', href: '/membership#skatesafe' },
      { name: 'Club Jackets', href: '/club-jackets' },
      { name: 'SkateSafe Compliance', href: '/skatesafe-compliance' },
      { name: 'Newsletter Archive', href: '/the-inside-edge-newsletter-archive' },
    ],
  },
  {
    name: 'Competition', href: '/programs#competitions',
    children: [
      { name: 'Skate San Francisco', href: '/programs#competitions' },
      { name: 'EMS Registration', href: 'https://www.usfsaonline.org/', external: true },
      { name: 'EntryEeze Portal', href: 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189', external: true },
      { name: 'CCIA Calendar', href: '/ccia-calendar' },
    ],
  },
  {
    name: 'Tests', href: '/tests-passed',
    children: [
      { name: 'Tests Passed', href: '/tests-passed' },
      { name: 'Test Registration & Schedule', href: '/resources#testing' },
      { name: 'Testing Policy & Fees', href: '/testing-policy' },
    ],
  },
  {
    name: 'Teams', href: '/programs#teams',
    children: [
      { name: 'San Francisco Ice Theatre', href: '/programs#teams' },
      { name: 'Tremors Synchronized Skating', href: 'http://tremorssf.org/', external: true },
    ],
  },
  {
    name: 'About', href: '/about',
    children: [
      { name: 'About the Club', href: '/about' },
      { name: 'Mission', href: '/about#mission' },
      { name: 'Club History', href: '/about#history' },
      { name: 'Board & Contacts', href: '/about#board' },
      { name: 'SCSF Coaches', href: '/resources#coaches' },
      { name: 'Annual Gala', href: '/annual-gala' },
      { name: 'Junior Council', href: '/junior-council' },
      { name: 'Club Bylaws', href: '/club-bylaws' },
      { name: 'Community Partners', href: '/individual-community-partners' },
      { name: 'Events', href: '/events' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  { name: 'Contact', href: '/contact' },
  { name: 'Donate', href: '/donate', highlight: true },
];

function slugFromHref(href) {
  if (!href.startsWith('/')) return null; // external
  const clean = href.slice(1).split('#')[0].split('?')[0];
  if (!clean || clean.includes('/')) return null;
  if (HARDCODED_ROUTES.has(clean)) return null;
  return clean;
}

async function resolveLink(name, href, existingPageSlugs) {
  const slug = slugFromHref(href);
  if (slug && existingPageSlugs.has(slug)) {
    return {
      label: name,
      linkType: 'page',
      page: { _type: 'reference', _ref: existingPageSlugs.get(slug) },
    };
  }
  return {
    label: name,
    linkType: 'custom',
    customPath: href,
    openInNewTab: href.startsWith('http'),
  };
}

async function main() {
  console.log('🧭 Seeding Navigation document…\n');

  const pages = await client.fetch(`*[_type == "page" && defined(slug.current)]{ _id, "slug": slug.current }`);
  const slugMap = new Map(pages.map((p) => [p.slug, p._id]));
  console.log(`Found ${pages.length} Sanity page docs to check against.`);

  const items = [];
  for (const item of RAW_NAV) {
    const base = await resolveLink(item.name, item.href, slugMap);
    const navItem = {
      _key: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      _type: 'navItem',
      ...base,
      highlightButton: !!item.highlight,
    };
    if (item.children?.length) {
      navItem.children = [];
      for (const child of item.children) {
        const childLink = await resolveLink(child.name, child.href, slugMap);
        navItem.children.push({
          _key: child.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          _type: 'navChild',
          ...childLink,
          openInNewTab: child.external || childLink.openInNewTab,
        });
      }
    }
    items.push(navItem);
  }

  await client.createOrReplace({
    _id: 'navigation',
    _type: 'navigation',
    items,
  });

  console.log(`\n✅ Navigation document seeded with ${items.length} top-level items.`);
  console.log('   Edit order, labels, and links anytime in Studio under "Navigation".');
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
