import { client } from '@/sanity/lib/client';

// TypeScript interfaces for Sanity content types
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
  showInNav?: boolean;
}

// GROQ Queries

/**
 * Get the 3 most recent announcements
 */
export async function getLatestAnnouncements(): Promise<Announcement[]> {
  return client.fetch<Announcement[]>(
    `*[_type == "announcement"] | order(publishedAt desc)[0...3] {
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
    `*[_type == "announcement"] | order(publishedAt desc) {
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
      content,
      showInNav
    }`,
    { slug }
  );
}

// Tests Passed

export interface TestPassed {
  _id: string;
  skaterName: string;
  testType: 'moves' | 'freeskate' | 'dance' | 'pairs';
  testLevel: string;
  passedDate: string;
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
      passedDate
    }`
  );
}
