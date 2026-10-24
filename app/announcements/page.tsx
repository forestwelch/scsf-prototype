import Container from '@/components/Container';
import { findEmbed, getAllAnnouncements, getSiteSettings, getSitePage } from '@/lib/sanity.queries';
import AnnouncementsList from './AnnouncementsList';
import SitePageHeader from '@/components/SitePageHeader';
import SitePageContent from '@/components/SitePageContent';

export const metadata = {
  title: 'Announcements | Skating Club of San Francisco',
  description: 'Stay up to date with the latest news and announcements from the Skating Club of San Francisco.',
};

export default async function AnnouncementsPage() {
  const [announcements, settings, pageCopy] = await Promise.all([getAllAnnouncements(), getSiteSettings(), getSitePage('/announcements')]);
  const newsletterSignup = findEmbed(settings, 'newsletter-signup');
  const newsletterUrl = pageCopy?.announcementsNewsletterUrl || newsletterSignup?.url;
  const showNewsletter = pageCopy?.announcementsShowNewsletterSignup ?? (settings.announcementsShowNewsletterSignup === true);
  const showInstagram = pageCopy?.announcementsShowInstagram ?? (settings.announcementsShowInstagram === true);
  const instagramUrl = pageCopy?.announcementsInstagramUrl || settings.instagramUrl;

  return (
    <div className="min-h-screen bg-brand-off-white">
      <SitePageHeader route="/announcements" fallbackTitle={settings.announcementsPageTitle || 'Announcements'} fallbackDescription={settings.announcementsPageIntro || 'Stay up to date with the latest news from the Skating Club of San Francisco.'}>
          {announcements.length > 0 && (
            <p className="text-white/60 text-sm mt-3">{announcements.length} posts</p>
          )}
      </SitePageHeader>

      <Container className="py-12 md:py-16">
        {(showNewsletter && newsletterUrl || showInstagram && instagramUrl) && (
          <section className="mb-12 grid gap-6 md:grid-cols-2" aria-label="Follow club updates">
            {showNewsletter && newsletterUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">Get club updates by email</h2>
                <iframe
                  title={newsletterSignup.label || 'Newsletter signup'}
                  src={newsletterUrl}
                  className="w-full border-0"
                  height={newsletterSignup?.height || 280}
                  loading="lazy"
                />
              </div>
            )}
            {showInstagram && instagramUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">{pageCopy?.announcementsInstagramHeading || 'Follow us on Instagram'}</h2>
                <p className="text-gray-600 mb-5">{pageCopy?.announcementsInstagramIntro || 'See club photos, updates, and community news on Instagram.'}</p>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand-bridge-orange font-semibold hover:underline">Visit SCSF on Instagram →</a>
              </div>
            )}
          </section>
        )}
        <AnnouncementsList announcements={announcements} />
      </Container>
      <SitePageContent route="/announcements" />
    </div>
  );
}
