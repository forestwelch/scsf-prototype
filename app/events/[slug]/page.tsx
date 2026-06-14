import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import PortableText from '@/components/PortableText';
import { getEventBySlug, getAllEvents } from '@/lib/sanity.queries';
import Link from 'next/link';

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e) => ({ slug: e.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.title} | Skating Club of San Francisco`,
    description: `${event.title} — ${new Date(event.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
  };
}

const eventTypeLabels: Record<string, string> = {
  gala: 'Annual Gala',
  competition: 'Competition',
  testSession: 'Test Session',
  other: 'Event',
};

const eventTypeColors: Record<string, string> = {
  gala: 'bg-brand-golden-yellow text-brand-charcoal',
  competition: 'bg-brand-bridge-orange text-white',
  testSession: 'bg-brand-sky-blue text-white',
  other: 'bg-brand-royal-blue text-white',
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isPast = startDate < new Date();

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Events
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${eventTypeColors[event.eventType] ?? 'bg-white/20 text-white'}`}>
              {eventTypeLabels[event.eventType] ?? event.eventType}
            </span>
            {isPast && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide bg-white/10 text-white/70">
                Past Event
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDate(startDate)}
                {endDate && ` – ${formatDate(endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(startDate)}{endDate && ` – ${formatTime(endDate)}`}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="max-w-3xl">
          {/* Ticket / Registration CTA */}
          {event.ticketLink && !isPast && (
            <div className="mb-10 bg-brand-golden-yellow/10 border border-brand-golden-yellow/30 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-charcoal">Ready to join us?</p>
                <p className="text-sm text-gray-600">Tickets and registration are now open.</p>
              </div>
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors whitespace-nowrap"
              >
                Get Tickets / Register →
              </a>
            </div>
          )}

          {/* Description */}
          {event.description && event.description.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
              <PortableText value={event.description} />
            </div>
          )}

          {!event.description && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-gray-500 text-center">
              More details coming soon.
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/events"
              className="text-brand-bridge-orange hover:underline font-medium flex items-center gap-2"
            >
              ← Back to all events
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
