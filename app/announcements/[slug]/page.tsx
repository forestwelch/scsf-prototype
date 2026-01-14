import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import { getAnnouncementBySlug, getAllAnnouncements } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.image';
import PortableText from '@/components/PortableText';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const announcements = await getAllAnnouncements();
  return announcements.map((announcement) => ({
    slug: announcement.slug.current,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) {
    return {
      title: 'Announcement Not Found',
    };
  }

  return {
    title: `${announcement.title} | SCSF Announcements`,
    description: announcement.excerpt || 'Read the latest announcement from the Skating Club of San Francisco.',
  };
}

export default async function AnnouncementPage({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) {
    notFound();
  }

  const imageUrl = announcement.mainImage
    ? urlFor(announcement.mainImage).width(1200).height(600).url()
    : null;

  const formattedDate = announcement.publishedAt
    ? new Date(announcement.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-brand-off-white">
      <Container className="py-12 md:py-16">
        <Link
          href="/announcements"
          className="text-brand-bridge-orange hover:underline inline-flex items-center mb-6"
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
          Back to Announcements
        </Link>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
          {imageUrl && (
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={imageUrl}
                alt={announcement.mainImage?.alt || announcement.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
              {announcement.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
              {formattedDate && (
                <time className="text-sm">{formattedDate}</time>
              )}
              {announcement.author && (
                <span className="text-sm">
                  By {announcement.author}
                </span>
              )}
            </div>

            {announcement.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={announcement.content} />
              </div>
            )}

            {!announcement.content && announcement.excerpt && (
              <p className="text-lg text-gray-700">{announcement.excerpt}</p>
            )}
          </div>
        </article>
      </Container>
    </div>
  );
}
