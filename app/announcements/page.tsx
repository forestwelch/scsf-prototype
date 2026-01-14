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

  return (
    <div className="min-h-screen bg-brand-off-white">
      <Container className="py-12 md:py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-brand-bridge-orange hover:underline inline-flex items-center mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
strokeLinecap="round"
              strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal">
            Announcements
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Stay up to date with the latest news from SCSF
          </p>
        </div>

        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement._id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No announcements yet.
            </p>
            <p className="text-gray-500">
              Check back soon for updates!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
