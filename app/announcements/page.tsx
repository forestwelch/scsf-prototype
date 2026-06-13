import Link from 'next/link';
import Container from '@/components/Container';
import AnnouncementCard from '@/components/AnnouncementCard';
import { getAllAnnouncements } from '@/lib/sanity.queries';

export const metadata = {
  title: 'Announcements | Skating Club of San Francisco',
  description: 'Stay up to date with the latest news and announcements from the Skating Club of San Francisco.',
};

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  // Split into featured (first 3) and rest
  const featured = announcements.slice(0, 3);
  const rest = announcements.slice(3);

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Announcements</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Stay up to date with the latest news from the Skating Club of San Francisco.
          </p>
          {announcements.length > 0 && (
            <p className="text-white/60 text-sm mt-3">
              {announcements.length} posts
            </p>
          )}
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        {announcements.length > 0 ? (
          <>
            {/* Featured / recent posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {featured.map((announcement) => (
                <AnnouncementCard key={announcement._id} announcement={announcement} />
              ))}
            </div>

            {/* Older posts as a compact list */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-brand-charcoal mb-6">More Posts</h2>
                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                  {rest.map((announcement) => {
                    const date = announcement.publishedAt
                      ? new Date(announcement.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                      : '';
                    return (
                      <Link
                        key={announcement._id}
                        href={`/announcements/${announcement.slug.current}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-brand-off-white transition-colors group"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-royal-blue truncate">
                            {announcement.title}
                          </h3>
                          {announcement.excerpt && (
                            <p className="text-sm text-gray-500 truncate mt-0.5">{announcement.excerpt}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-400 whitespace-nowrap shrink-0">{date}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">No announcements yet.</p>
            <p className="text-gray-500 text-sm">Check back soon for updates!</p>
          </div>
        )}
      </Container>
    </div>
  );
}
