import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity.image';
import { Event } from '@/lib/sanity.queries';

interface EventCardProps {
  event: Event;
}

const eventTypeLabels: Record<Event['eventType'], string> = {
  gala: 'Annual Gala',
  competition: 'Competition',
  testSession: 'Test Session',
  other: 'Event',
};

export default function EventCard({ event }: EventCardProps) {
  const imageUrl = event.mainImage
    ? urlFor(event.mainImage).width(600).height(400).url()
    : null;

  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const endDate = event.endDate
    ? new Date(event.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const dateRange =
    endDate && startDate !== endDate ? `${startDate} - ${endDate}` : startDate;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {imageUrl && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt={event.mainImage?.alt || event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-brand-golden-yellow text-brand-charcoal px-3 py-1 rounded-full text-sm font-semibold">
            {eventTypeLabels[event.eventType]}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-brand-charcoal mb-2">
          {event.title}
        </h3>
        {dateRange && (
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Date:</span> {dateRange}
          </p>
        )}
        {event.location && (
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Location:</span> {event.location}
          </p>
        )}
        {event.description && (
          <div className="text-gray-700 mb-4 line-clamp-3">
            {/* Portable text rendering would go here - simplified for now */}
            <p>Event details available...</p>
          </div>
        )}
        <div className="flex gap-3">
          {event.ticketLink && (
            <a
              href={event.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-golden-yellow text-brand-charcoal px-6 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors"
            >
              Register
            </a>
          )}
          <Link
            href={`/events/${event.slug.current}`}
            className="border-2 border-brand-bridge-orange text-brand-bridge-orange px-6 py-2 rounded-md font-medium hover:bg-brand-bridge-orange hover:text-white transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </article>
  );
}
