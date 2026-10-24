import Container from '@/components/Container';
import { getAllTestsPassed, getTestsPassedPhotos, getSitePage } from '@/lib/sanity.queries';
import SitePageHeader from '@/components/SitePageHeader';
import SitePageContent from '@/components/SitePageContent';
import TestsPassedClient from './TestsPassedClient';

export const metadata = {
  title: 'Tests Passed | Skating Club of San Francisco',
  description: 'Records of skating tests passed by SCSF members, organized by year and discipline.',
};

export default async function TestsPassedPage() {
  const [tests, legacyPhotos, page] = await Promise.all([getAllTestsPassed(), getTestsPassedPhotos(), getSitePage('/tests-passed')]);
  const photos = page ? page.photos ?? [] : legacyPhotos;

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <SitePageHeader route="/tests-passed" fallbackTitle="Tests Passed" fallbackDescription="Congratulations to all SCSF members who have passed their US Figure Skating tests." />

      {photos.length > 0 && (
        <Container className="pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Tests passed photos">
            {photos.map((photo) => photo.asset?.url && (
              <figure key={photo._key} className="overflow-hidden rounded-lg bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.asset.url} alt={photo.alt || ''} className="w-full h-64 object-cover" />
                {photo.caption && <figcaption className="p-3 text-sm text-gray-600">{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </Container>
      )}
      <SitePageContent route="/tests-passed" />

      {tests.length === 0 ? (
        <Container className="py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            Tests passed records are being updated. Check back soon.
          </div>
        </Container>
      ) : (
        <TestsPassedClient tests={tests} />
      )}
    </div>
  );
}
