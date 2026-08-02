import { client } from '@/sanity/lib/client';

// ─── Site Settings (singleton) ───────────────────────────────────────────────

export interface SiteSettings {
  orgName?: string;
  poBox?: string;
  mailingCityStateZip?: string;
  venueName?: string;
  venueStreet?: string;
  venueCityStateZip?: string;
  venuePhone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  zeffyDonateUrl?: string;
  zeffyNewsletterUrl?: string;
  mailchimpArchiveUrl?: string;
  currentNewsletterUrl?: string;
  currentNewsletterLabel?: string;
  entryEezeUrl?: string;
  emsUrl?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await client.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]`);
  return result ?? {};
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

export interface HeroSlide {
  _id: string;
  headline: string;
  subtitle?: string;
  category?: string;
  imageUrl: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return client.fetch<HeroSlide[]>(
    `*[_type == "heroSlide" && active == true] | order(order asc) {
      _id, headline, subtitle, category, imageUrl, imageAlt, ctaLabel, ctaHref
    }`
  );
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export async function getAllFaqs(): Promise<Faq[]> {
  return client.fetch<Faq[]>(
    `*[_type == "faq"] | order(category asc, order asc) {
      _id, question, answer, category, order
    }`
  );
}

// ─── Membership Categories ───────────────────────────────────────────────────

export interface MembershipCategory {
  _id: string;
  name: string;
  price: string;
  ageGroup?: string;
  highlight?: boolean;
  features?: string[];
}

export async function getAllMembershipCategories(): Promise<MembershipCategory[]> {
  return client.fetch<MembershipCategory[]>(
    `*[_type == "membershipCategory"] | order(order asc) {
      _id, name, price, ageGroup, highlight, features
    }`
  );
}

// ─── TypeScript interfaces for Sanity content types ──────────────────────────
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Announcement {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  author?: string;
  content?: any[]; // Portable text content
}

export interface Event {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  eventType: 'gala' | 'competition' | 'testSession' | 'other';
  startDate: string;
  endDate?: string;
  location?: string;
  description?: any[]; // Portable text content
  ticketLink?: string;
  isFeatured?: boolean;
  mainImage?: SanityImage;
}

export interface Coach {
  _id: string;
  name: string;
  photo?: SanityImage;
  bio?: any[];
  specialties?: string[];
  email?: string;
  phone?: string;
}

export interface BoardMember {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImage;
  bio?: any[];
  order?: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content?: any[];
}

// GROQ Queries

/**
 * Get the 3 most recent announcements
 */
export async function getLatestAnnouncements(): Promise<Announcement[]> {
  return client.fetch<Announcement[]>(
    `*[_type == "announcement" && archived != true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      author
    }`
  );
}

/**
 * Get all announcements (for list page)
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  return client.fetch<Announcement[]>(
    `*[_type == "announcement" && archived != true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      author
    }`
  );
}

/**
 * Get a single announcement by slug
 */
export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  return client.fetch<Announcement | null>(
    `*[_type == "announcement" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      mainImage,
      author
    }`,
    { slug }
  );
}

/**
 * Get featured upcoming events
 */
export async function getFeaturedEvents(): Promise<Event[]> {
  const now = new Date().toISOString();
  return client.fetch<Event[]>(
    `*[_type == "event" && isFeatured == true && startDate > $now] | order(startDate asc) {
      _id,
      title,
      slug,
      eventType,
      startDate,
      endDate,
      location,
      description,
      ticketLink,
      mainImage
    }`,
    { now }
  );
}

/**
 * Get all events
 */
export async function getAllEvents(): Promise<Event[]> {
  return client.fetch<Event[]>(
    `*[_type == "event"] | order(startDate asc) {
      _id,
      title,
      slug,
      eventType,
      startDate,
      endDate,
      location,
      description,
      ticketLink,
      isFeatured,
      mainImage
    }`
  );
}

/**
 * Get a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  return client.fetch<Event | null>(
    `*[_type == "event" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      eventType,
      startDate,
      endDate,
      location,
      description,
      ticketLink,
      isFeatured,
      mainImage
    }`,
    { slug }
  );
}

/**
 * Get all coaches
 */
export async function getAllCoaches(): Promise<Coach[]> {
  return client.fetch<Coach[]>(
    `*[_type == "coach"] | order(name asc) {
      _id,
      name,
      photo,
      bio,
      specialties,
      email,
      phone
    }`
  );
}

/**
 * Get all board members
 */
export async function getAllBoardMembers(): Promise<BoardMember[]> {
  return client.fetch<BoardMember[]>(
    `*[_type == "boardMember"] | order(order asc, name asc) {
      _id,
      name,
      role,
      photo,
      bio,
      order
    }`
  );
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      content
    }`,
    { slug }
  );
}

/**
 * Get all pages (for generateStaticParams)
 */
export async function getAllPages(): Promise<Page[]> {
  return client.fetch<Page[]>(
    `*[_type == "page" && defined(slug.current)] | order(title asc) {
      _id,
      title,
      slug
    }`
  );
}

// Tests Passed

export interface TestPassed {
  _id: string;
  skaterName: string;
  testType: 'moves' | 'freeskate' | 'dance' | 'pairs';
  testLevel: string;
  passedDate: string;
  distinction?: 'none' | 'honors' | 'distinction';
}

/**
 * Get all tests passed records, ordered by date descending
 */
export async function getAllTestsPassed(): Promise<TestPassed[]> {
  return client.fetch<TestPassed[]>(
    `*[_type == "testPassed"] | order(passedDate desc) {
      _id,
      skaterName,
      testType,
      testLevel,
      passedDate,
      distinction
    }`
  );
}

// ─── Navigation (singleton) ───────────────────────────────────────────────────

export interface NavLink {
  label: string;
  linkType: 'page' | 'custom';
  page?: { slug: { current: string } } | null;
  customPath?: string;
  openInNewTab?: boolean;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
  highlightButton?: boolean;
}

/**
 * Resolve a NavLink's raw sanity data down to a usable href.
 * "page" links build from the referenced page's slug; "custom" links are used as-is.
 */
export function resolveNavHref(link: NavLink): string {
  if (link.linkType === 'page' && link.page?.slug?.current) {
    return `/${link.page.slug.current}`;
  }
  return link.customPath || '#';
}

export async function getNavigation(): Promise<NavItem[]> {
  const result = await client.fetch<{ items?: NavItem[] } | null>(
    `*[_type == "navigation"][0] {
      items[] {
        label,
        linkType,
        "page": page->{ "slug": slug },
        customPath,
        openInNewTab,
        highlightButton,
        children[] {
          label,
          linkType,
          "page": page->{ "slug": slug },
          customPath,
          openInNewTab
        }
      }
    }`
  );
  return result?.items ?? [];
}
