/**
 * Seeds ALL hardcoded content into Sanity:
 *   - siteSettings (singleton)
 *   - heroSlide (5 carousel slides)
 *   - faq (22 Q&As across 6 categories)
 *   - membershipCategory (9 tiers)
 *
 * Safe to re-run — uses createOrReplace with stable _ids.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/seed-all.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production',
  token:     process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const BLOB = 'https://gvxwlqyeqlq01lkb.public.blob.vercel-storage.com/uploads';

// ─── Site Settings ────────────────────────────────────────────────────────────

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  orgName: 'The Skating Club of San Francisco, Inc.',
  poBox: 'P.O. BOX 320457',
  mailingCityStateZip: 'San Francisco, CA 94132',
  venueName: 'Yerba Buena Ice Skating & Bowling Center',
  venueStreet: '750 Folsom St.',
  venueCityStateZip: 'San Francisco, CA 94107',
  venuePhone: '(415) 820-3521',
  facebookUrl: 'https://www.facebook.com/scsf.org/',
  instagramUrl: 'https://www.instagram.com/explore/tags/skatingclubofsanfrancisco/',
  zeffyDonateUrl: 'https://www.zeffy.com/embed/donation-form/donate-to-support-our-club-athletes',
  zeffyNewsletterUrl: 'https://www.zeffy.com/en-US/embed/newsletter-form/sign-up-for-updates-from-the-inside-edge',
  mailchimpArchiveUrl: 'https://us5.campaign-archive.com/home/?u=fc9518edb46da79820c912377&id=7aded53f93',
  currentNewsletterUrl: `${BLOB}/inside-edge-spring-2026.html`,
  currentNewsletterLabel: 'Spring 2026',
  entryEezeUrl: 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189',
  emsUrl: 'https://www.usfsaonline.org/',
};

// ─── Hero Slides ──────────────────────────────────────────────────────────────

const heroSlides = [
  {
    _id: 'hero-slide-1',
    _type: 'heroSlide',
    headline: 'The SCSF Annual Gala',
    subtitle: 'Celebrating the artistry and dedication of our skaters',
    category: 'Annual Gala',
    imageUrl: `${BLOB}/SFSKATE_GALA_482.png`,
    imageAlt: 'SCSF Annual Gala',
    ctaLabel: 'View Programs',
    ctaHref: '/programs',
    order: 1,
    active: true,
  },
  {
    _id: 'hero-slide-2',
    _type: 'heroSlide',
    headline: 'SF Ice Theatre — Adult Team',
    subtitle: 'Four competitive theater on ice teams representing SCSF',
    category: 'San Francisco Ice Theatre',
    imageUrl: `${BLOB}/sfit-adult-2025-1024.jpg`,
    imageAlt: 'SF Ice Theatre Adult Team 2025',
    ctaLabel: 'Meet the Teams',
    ctaHref: '/programs#teams',
    order: 2,
    active: true,
  },
  {
    _id: 'hero-slide-3',
    _type: 'heroSlide',
    headline: 'SF Ice Theatre — Junior Team',
    subtitle: 'Competing at the highest levels across the country',
    category: 'San Francisco Ice Theatre',
    imageUrl: `${BLOB}/SFIT-JUNIOR-2024-1024x683-1.jpg`,
    imageAlt: 'SF Ice Theatre Junior Team 2024',
    ctaLabel: 'Our Teams',
    ctaHref: '/programs#teams',
    order: 3,
    active: true,
  },
  {
    _id: 'hero-slide-4',
    _type: 'heroSlide',
    headline: 'Skate San Francisco',
    subtitle: 'Our annual USFS-sanctioned competition',
    category: 'Competition',
    imageUrl: `${BLOB}/SFSKATE_GALA_245.png`,
    imageAlt: 'Skate San Francisco competition',
    ctaLabel: 'Competition Info',
    ctaHref: '/programs#competitions',
    order: 4,
    active: true,
  },
  {
    _id: 'hero-slide-5',
    _type: 'heroSlide',
    headline: 'A Legacy of Excellence',
    subtitle: 'National competitors, Olympians, and a passionate Bay Area community',
    category: 'Champions',
    imageUrl: `${BLOB}/sfit-adult-2023-scaled.jpg`,
    imageAlt: 'SF Ice Theatre Adult 2023',
    ctaLabel: 'Club History',
    ctaHref: '/about#history',
    order: 5,
    active: true,
  },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────

const faqs = [
  // Membership
  { _id: 'faq-m-1', category: 'Membership', order: 1, question: 'How do I join the Skating Club of San Francisco?', answer: "You can join online through our membership page. Annual membership is open to skaters of all ages and levels. Once you submit your application and dues, you'll receive confirmation and access to member benefits." },
  { _id: 'faq-m-2', category: 'Membership', order: 2, question: 'What are the membership fees?', answer: 'Membership fees vary by category (adult, junior, family). Please visit the Membership page or contact the club for the current fee schedule. Financial assistance is available for qualifying members.' },
  { _id: 'faq-m-3', category: 'Membership', order: 3, question: 'When does the membership year run?', answer: 'The SCSF membership year runs from September 1 through August 31, aligned with the US Figure Skating season.' },
  { _id: 'faq-m-4', category: 'Membership', order: 4, question: 'Do I need to be a USFS member to join SCSF?', answer: 'Yes. A valid US Figure Skating membership is required for SCSF membership. You can register with USFS at usfigureskating.org before or alongside your SCSF application.' },
  // Testing
  { _id: 'faq-t-1', category: 'Testing', order: 1, question: 'How do I register for a test session?', answer: "Test session registration is typically done through EntryEeze. Watch for announcements about upcoming test sessions on this website. Your coach will also help you determine when you're ready to test and assist with registration." },
  { _id: 'faq-t-2', category: 'Testing', order: 2, question: 'What tests does SCSF host?', answer: 'SCSF hosts test sessions for all US Figure Skating disciplines: Moves in the Field, Free Skate, Ice Dance, and Pairs. All test levels are welcome.' },
  { _id: 'faq-t-3', category: 'Testing', order: 3, question: 'Do I have to be an SCSF member to test at an SCSF test session?', answer: 'No — test sessions hosted by SCSF are open to all USFS members. However, SCSF members receive priority registration.' },
  { _id: 'faq-t-4', category: 'Testing', order: 4, question: 'Where can I see who has passed their tests?', answer: "We maintain a Tests Passed record on this website. It's updated after each test session." },
  // Competitions
  { _id: 'faq-c-1', category: 'Competitions', order: 1, question: 'What is Skate SF?', answer: "Skate SF is SCSF's annual US Figure Skating sanctioned competition. It's open to skaters from clubs throughout the region and features multiple disciplines and levels." },
  { _id: 'faq-c-2', category: 'Competitions', order: 2, question: 'How do I register for Skate SF or other competitions?', answer: 'Competition registration is handled through EntryEeze for SCSF events, and through the USFS EMS system for regional and national events. Your coach will guide you through the process.' },
  { _id: 'faq-c-3', category: 'Competitions', order: 3, question: 'Are SCSF members required to compete?', answer: 'No. Competition is entirely optional. Many members join purely for the community, coaching resources, and test opportunities.' },
  // Ice Time & Rink
  { _id: 'faq-i-1', category: 'Ice Time & Rink', order: 1, question: 'Where does SCSF skate?', answer: 'Our primary rink is Yerba Buena Ice Skating & Bowling Center at 750 Folsom St., San Francisco, CA 94107. Phone: (415) 820-3521.' },
  { _id: 'faq-i-2', category: 'Ice Time & Rink', order: 2, question: 'What freestyle sessions are available to members?', answer: 'Freestyle session availability varies by season and rink scheduling. Contact the rink directly or ask your coach for the current freestyle schedule.' },
  // Teams & Programs
  { _id: 'faq-p-1', category: 'Teams & Programs', order: 1, question: 'What is Ice Theatre?', answer: "Ice Theatre is SCSF's performance team that creates choreographed skating shows performed at the annual gala and other club events. It's open to members with solid skating fundamentals." },
  { _id: 'faq-p-2', category: 'Teams & Programs', order: 2, question: 'What is Tremors?', answer: 'Tremors is the junior performance team for younger skaters. Tremors members skate alongside Ice Theatre in the annual gala.' },
  { _id: 'faq-p-3', category: 'Teams & Programs', order: 3, question: 'How do I join Ice Theatre or Tremors?', answer: 'Reach out to a board member or ask your coach. Auditions and rehearsal schedules vary by season.' },
  // General
  { _id: 'faq-g-1', category: 'General', order: 1, question: 'How do I contact the club?', answer: 'You can reach SCSF by mail at P.O. Box 320457, San Francisco, CA 94132. For general inquiries, contact any board member — their information is listed on the About page.' },
  { _id: 'faq-g-2', category: 'General', order: 2, question: 'Is SCSF a nonprofit?', answer: 'Yes. The Skating Club of San Francisco, Inc. is a nonprofit organization dedicated to supporting figure skating in the Bay Area.' },
  { _id: 'faq-g-3', category: 'General', order: 3, question: 'How can I support the club?', answer: 'Beyond membership, you can support SCSF by volunteering at events, donating to the club fund, or sponsoring a program. Contact a board member to learn more.' },
].map(f => ({ ...f, _type: 'faq' }));

// ─── Membership Categories ────────────────────────────────────────────────────

const membershipCategories = [
  {
    _id: 'mem-1', order: 1, name: 'Home Club Adult', price: '$135', ageGroup: '18 and over', highlight: true,
    features: ['Priority test session scheduling at Home Club rates', 'Compete in US Figure Skating sanctioned competitions', 'Vote in annual Club elections', 'Eligible for Board positions & USFS official roles', '"Skating" magazine bi-monthly (1 per household)', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-2', order: 2, name: 'Home Club Junior', price: '$135', ageGroup: 'Under 18', highlight: true,
    features: ['Priority test session scheduling at Home Club rates', 'Compete in US Figure Skating sanctioned competitions', 'Eligible for Junior Council positions', '"Skating" magazine bi-monthly (1 per household)', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-3', order: 3, name: 'Introductory', price: '$70', ageGroup: 'First-time USFS members', highlight: false,
    features: ['One-time membership for skaters new to USFS', 'Home Club priority and test rates', 'Compete in US Figure Skating competitions', 'Renews at Home Club rate going forward', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-4', order: 4, name: 'Subsequent Home Club', price: '$90', ageGroup: 'Same-household members', highlight: false,
    features: ['Additional members living with a Home Club member', 'Same benefits as Adult or Junior depending on age', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-5', order: 5, name: 'Parent', price: '$50', ageGroup: 'Parents of Junior members', highlight: false,
    features: ['Required for parents of Tremors / SF Ice Theatre team members', 'Vote in Club elections on behalf of minor skater', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-6', order: 6, name: 'Coach', price: '$90', ageGroup: 'Professional coaches only', highlight: false,
    features: ['Limited membership — no voting or Board eligibility', 'Must be designated as a coach with USFS', 'Current SafeSport/SkateSafe compliance required', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-7', order: 7, name: 'Collegiate', price: '$130', ageGroup: 'Home Club college/university students', highlight: false,
    features: ['4-year membership, auto-renewed annually', 'Continue taking tests and competing', 'Full course load & enrollment proof required', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-8', order: 8, name: 'Alumni', price: '$85', ageGroup: 'Former Home Club members (3+ yrs)', highlight: false,
    features: ['For members no longer competing', 'Vote in elections and attend club functions', 'May take tests at Associate Member rates', 'Subsequent family member: $70', 'Includes US Figure Skating registration'],
  },
  {
    _id: 'mem-9', order: 9, name: 'Associate', price: '$90', ageGroup: 'USFS members at another home club', highlight: false,
    features: ['Required for Tremors / SF Ice Theatre participation', 'Priority test scheduling over non-members', 'Does NOT include USFS registration', 'Subsequent family member: $70'],
  },
].map(m => ({ ...m, _type: 'membershipCategory' }));

// ─── Import ───────────────────────────────────────────────────────────────────

async function importBatch(label, docs) {
  const tx = client.transaction();
  docs.forEach(doc => tx.createOrReplace(doc));
  await tx.commit();
  console.log(`✓ ${label}: ${docs.length} docs`);
}

console.log('Seeding Sanity with all hardcoded content…\n');
await importBatch('siteSettings', [siteSettings]);
await importBatch('heroSlides', heroSlides);
await importBatch('faqs', faqs);
await importBatch('membershipCategories', membershipCategories);
console.log('\n✅ Done. All content is now in Sanity.');
console.log('   Board members and coaches still need to be added manually in Sanity Studio.');
