'use client';

import { useState } from 'react';
import Link from 'next/link';

type Announcement = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

function getYear(dateStr?: string) {
  if (!dateStr) return 'Undated';
  return String(new Date(dateStr).getFullYear());
}

function groupByYear(items: Announcement[]) {
  const map = new Map<string, Announcement[]>();
  for (const a of items) {
    const yr = getYear(a.publishedAt);
    if (!map.has(yr)) map.set(yr, []);
    map.get(yr)!.push(a);
  }
  // years descending
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function PostRow({ a }: { a: Announcement }) {
  return (
    <Link
      href={`/announcements/${a.slug.current}`}
      className="flex items-center justify-between px-6 py-4 hover:bg-brand-off-white transition-colors group"
    >
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-royal-blue truncate">
          {a.title}
        </h3>
        {a.excerpt && (
          <p className="text-sm text-gray-500 truncate mt-0.5">{a.excerpt}</p>
        )}
      </div>
      <span className="text-sm text-gray-400 whitespace-nowrap shrink-0">
        {formatDate(a.publishedAt)}
      </span>
    </Link>
  );
}

export default function AnnouncementsList({ announcements }: { announcements: Announcement[] }) {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt || '').toLowerCase().includes(q)
      )
    : announcements;

  const grouped = groupByYear(filtered);

  return (
    <>
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent bg-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {q && (
          <p className="text-sm text-gray-500 mt-2">
            {filtered.length === 0
              ? 'No results found.'
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-2">No announcements yet.</p>
          <p className="text-gray-500 text-sm">Check back soon for updates!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No announcements match &ldquo;{query}&rdquo;.</p>
          <button onClick={() => setQuery('')} className="mt-3 text-sm text-brand-royal-blue hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([year, posts]) => (
            <div key={year}>
              <h2 className="text-lg font-bold text-brand-charcoal mb-3">{year}</h2>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                {posts.map((a) => <PostRow key={a._id} a={a} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
