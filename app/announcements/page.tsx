import Container from '@/components/Container';
import { findEmbed, getAllAnnouncements, getSiteSettings } from '@/lib/sanity.queries';
import AnnouncementsList from './AnnouncementsList';

export const metadata = {
  title: 'Announcements | Skating Club of San Francisco',
  description: 'Stay up to date with the latest news and announcements from the Skating Club of San Francisco.',
};

export default async function AnnouncementsPage() {
  const [announcements, settings] = await Promise.all([getAllAnnouncements(), getSiteSettings()]);
  const newsletterSignup = findEmbed(settings, 'newsletter-signup');
  const showNewsletter = settings.announcementsShowNewsletterSignup === true;
  const showInstagram = settings.announcementsShowInstagram === true;

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings.announcementsPageTitle || 'Announcements'}</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            {settings.announcementsPageIntro || 'Stay up to date with the latest news from the Skating Club of San Francisco.'}
          </p>
          {announcements.length > 0 && (
            <p className="text-white/60 text-sm mt-3">{announcements.length} posts</p>
          )}
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        {(showNewsletter && newsletterSignup?.url || showInstagram && settings.instagramUrl) && (
          <section className="mb-12 grid gap-6 md:grid-cols-2" aria-label="Follow club updates">
            {showNewsletter && newsletterSignup?.url && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">Get club updates by email</h2>
                <iframe
                  title={newsletterSignup.label || 'Newsletter signup'}
                  src={newsletterSignup.url}
                  className="w-full border-0"
                  height={newsletterSignup.height || 280}
                  loading="lazy"
                />
              </div>
            )}
            {showInstagram && settings.instagramUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">Follow us on Instagram</h2>
                <p className="text-gray-600 mb-5">See club photos, updates, and community news on Instagram.</p>
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand-bridge-orange font-semibold hover:underline">Visit SCSF on Instagram →</a>
              </div>
            )}
          </section>
        )}
        <AnnouncementsList announcements={announcements} />
      </Container>
    </div>
  );
}
