import Container from '@/components/Container';
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/sanity.queries';

export const metadata = {
  title: 'Events | Skating Club of San Francisco',
  description: 'Upcoming events, galas, competitions, and test sessions hosted by the Skating Club of San Francisco.',
};

const eventTypeLabels: Record<string, string> = {
  gala: 'Annual Gala',
  competition: 'Competition',
  testSession: 'Test Session',
  other: 'Event',
};

export default async function EventsPage() {
  const allEvents = await getAllEvents();
  const now = new Date().toISOString();

  const upcoming = allEvents.filter((e) => e.startDate >= now);
  const past = allEvents.filter((e) => e.startDate < now);

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Galas, competitions, test sessions, and club events. Mark your calendars and join us on the ice.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-8">Upcoming Events</h2>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcoming.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-brand-sky-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No upcoming events scheduled.</p>
              <p className="text-gray-500 mt-2">Check back soon — events are added regularly.</p>
            </div>
          )}
        </section>

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-brand-charcoal mb-8">Past Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {past.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-sm p-6 opacity-75"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      {eventTypeLabels[event.eventType] ?? event.eventType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-2">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
