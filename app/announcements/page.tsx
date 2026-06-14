import Container from '@/components/Container';
import { getAllAnnouncements } from '@/lib/sanity.queries';
import AnnouncementsList from './AnnouncementsList';

export const metadata = {
  title: 'Announcements | Skating Club of San Francisco',
  description: 'Stay up to date with the latest news and announcements from the Skating Club of San Francisco.',
};

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Announcements</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Stay up to date with the latest news from the Skating Club of San Francisco.
          </p>
          {announcements.length > 0 && (
            <p className="text-white/60 text-sm mt-3">{announcements.length} posts</p>
          )}
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <AnnouncementsList announcements={announcements} />
      </Container>
    </div>
  );
}
