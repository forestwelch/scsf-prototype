import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity.image';
import { Announcement } from '@/lib/sanity.queries';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const imageUrl = announcement.mainImage
    ? urlFor(announcement.mainImage).width(400).height(250).url()
    : null;

  const formattedDate = announcement.publishedAt
    ? new Date(announcement.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={announcement.mainImage?.alt || announcement.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {formattedDate && (
          <time className="text-sm text-gray-600 mb-2 block">{formattedDate}</time>
        )}
        <h3 className="text-xl font-semibold text-brand-charcoal mb-2">
          {announcement.title}
        </h3>
        {announcement.excerpt && (
          <p className="text-gray-700 mb-4 line-clamp-3">{announcement.excerpt}</p>
        )}
        <Link
          href={`/announcements/${announcement.slug.current}`}
          className="text-brand-bridge-orange hover:underline font-medium inline-flex items-center"
        >
          Read More
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
