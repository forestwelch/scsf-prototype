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
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const FEATURED_COUNT = 3;

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

  const featured = !q ? filtered.slice(0, FEATURED_COUNT) : [];
  const rest = !q ? filtered.slice(FEATURED_COUNT) : filtered;

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
      ) : (
        <>
          {/* Featured cards — only shown when not searching */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {featured.map((a) => (
                <Link
                  key={a._id}
                  href={`/announcements/${a.slug.current}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:ring-1 hover:ring-brand-royal-blue transition-all group flex flex-col"
                >
                  <p className="text-xs text-gray-400 mb-2">{formatDate(a.publishedAt)}</p>
                  <h3 className="font-bold text-brand-charcoal group-hover:text-brand-royal-blue leading-snug mb-2">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-3 flex-1">{a.excerpt}</p>
                  )}
                  <span className="mt-4 text-xs font-semibold text-brand-royal-blue group-hover:underline">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* All posts list */}
          {rest.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-brand-charcoal mb-3">
                {q ? 'Results' : 'All Posts'}
              </h2>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                {rest.map((a) => (
                  <Link
                    key={a._id}
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
                ))}
              </div>
            </>
          )}

          {/* Edge case: search matches only the first 3 featured posts */}
          {q && filtered.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500">No announcements match &ldquo;{query}&rdquo;.</p>
              <button onClick={() => setQuery('')} className="mt-3 text-sm text-brand-royal-blue hover:underline">
                Clear search
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
