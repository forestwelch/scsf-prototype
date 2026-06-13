import Link from 'next/link';
import Container from '@/components/Container';
import AnnouncementCard from '@/components/AnnouncementCard';
import EventCard from '@/components/EventCard';
import HeroCarousel from '@/components/HeroCarousel';
import { getLatestAnnouncements, getFeaturedEvents } from '@/lib/sanity.queries';

export default async function Home() {
  const announcements = await getLatestAnnouncements();
  const events = await getFeaturedEvents();

  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Latest Announcements Section */}
      <section className="py-16 md:py-24 bg-brand-off-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
              Latest News
            </h2>
            <Link
              href="/announcements"
              className="text-brand-bridge-orange hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement._id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">
              No announcements yet. Check back soon!
            </p>
          )}
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-8">
            Upcoming Events
          </h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.slice(0, 2).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-brand-off-white rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No upcoming events scheduled at this time.
              </p>
              <p className="text-gray-500">
                Check back soon for exciting events and competitions!
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 md:py-24 bg-brand-sky-blue/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-8 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/resources#testing"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-brand-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-brand-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">View Test Schedule</h3>
              <p className="text-sm text-gray-600">Upcoming test sessions</p>
            </Link>

            <Link
              href="/resources#coaches"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-brand-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-brand-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Meet Our Coaches</h3>
              <p className="text-sm text-gray-600">Expert coaching team</p>
            </Link>

            <Link
              href="/programs#competitions"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-brand-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-brand-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Competition Calendar</h3>
              <p className="text-sm text-gray-600">Upcoming competitions</p>
            </Link>

            <Link
              href="/support"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-brand-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-brand-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Support the Club</h3>
              <p className="text-sm text-gray-600">Donate and volunteer</p>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
