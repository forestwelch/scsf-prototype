import Container from '@/components/Container';
import { getAllCoaches, getSiteSettings } from '@/lib/sanity.queries';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import Link from 'next/link';

export const metadata = {
  title: 'Club Resources | Skating Club of San Francisco',
  description: 'Resources for SCSF members: coaches, testing information, ice time, competition resources, and more.',
};

export default async function ResourcesPage() {
  const [coaches, settings] = await Promise.all([getAllCoaches(), getSiteSettings()]);

  const venue   = settings.venueName        ?? 'Yerba Buena Ice Skating & Bowling Center';
  const vStreet = settings.venueStreet      ?? '750 Folsom St.';
  const vCity   = settings.venueCityStateZip ?? 'San Francisco, CA 94107';
  const vPhone  = settings.venuePhone       ?? '(415) 820-3521';
  const entryEezeUrl = settings.entryEezeUrl ?? 'https://entryeeze.com';
  const emsUrl  = settings.emsUrl           ?? 'https://www.usfigureskating.org/ems';

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Club Resources</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Everything you need as an SCSF member — coaches, testing, ice time, competition info, and more.
          </p>
        </Container>
      </div>

      {/* Jump Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <Container>
          <nav className="flex gap-6 overflow-x-auto py-3 text-sm font-medium">
            {[
              { label: 'Support Programs', href: '#support' },
              { label: 'Competition Resources', href: '#competition' },
              { label: 'Testing', href: '#testing' },
              { label: 'SCSF Coaches', href: '#coaches' },
              { label: 'Ice Time', href: '#ice-time' },
              { label: 'Club Jackets', href: '#jackets' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-royal-blue hover:text-brand-bridge-orange transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="py-12 md:py-16 space-y-20">

        {/* Support Programs */}
        <section id="support">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Support Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Financial Assistance</h3>
              <p className="text-gray-600">
                SCSF offers need-based financial assistance to help cover membership fees and testing costs.
                Contact the board to learn more about available support.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Volunteer Opportunities</h3>
              <p className="text-gray-600">
                Help at events, on committees, or with club administration. Volunteering is a great way
                to get involved and give back to the skating community.
              </p>
            </div>
          </div>
        </section>

        {/* Competition Resources */}
        <section id="competition">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Competition Resources</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Registration Platforms</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={entryEezeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-bridge-orange hover:underline font-medium"
                    >
                      EntryEeze Portal
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Register for SCSF-hosted competitions</p>
                  </li>
                  <li>
                    <a
                      href={emsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-bridge-orange hover:underline font-medium"
                    >
                      EMS — US Figure Skating
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Official USFS event management system</p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Helpful Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.usfigureskating.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-bridge-orange hover:underline font-medium"
                    >
                      US Figure Skating
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Rules, regulations, and resources</p>
                  </li>
                  <li>
                    <a
                      href="https://www.sk8stuff.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-bridge-orange hover:underline font-medium"
                    >
                      Sk8Stuff
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Competition schedules and results</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testing */}
        <section id="testing">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">About Testing</h3>
              <p className="text-gray-600 mb-4">
                SCSF hosts multiple test sessions throughout the year for Moves in the Field, Free Skate,
                Dance, and Pairs disciplines. Tests follow official US Figure Skating standards.
              </p>
              <p className="text-gray-600">
                Check the Events calendar for upcoming test session dates. Members receive priority
                registration.
              </p>
              <Link
                href="/events"
                className="inline-block mt-4 text-brand-bridge-orange hover:underline font-medium"
              >
                View Upcoming Test Sessions →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Tests Passed</h3>
              <p className="text-gray-600 mb-4">
                Congratulations to all skaters who have passed their tests! We recognize member
                achievements in our Tests Passed record.
              </p>
              <Link
                href="/tests-passed"
                className="inline-flex items-center gap-2 bg-brand-golden-yellow text-brand-charcoal px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
              >
                View Tests Passed Record
              </Link>
            </div>
          </div>
        </section>

        {/* Coaches */}
        <section id="coaches">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-2">SCSF Coaches</h2>
          <p className="text-gray-600 mb-8">
            Our coaching staff represents decades of experience in figure skating instruction and competition.
            All SCSF coaches are USFS-credentialed.
          </p>

          {coaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <div key={coach._id} className="bg-white rounded-lg shadow-sm p-6">
                  {coach.photo && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 bg-brand-sky-blue/20">
                      <Image
                        src={urlFor(coach.photo).width(80).height(80).fit('crop').url()}
                        alt={coach.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {!coach.photo && (
                    <div className="w-20 h-20 rounded-full bg-brand-sky-blue/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-brand-royal-blue">
                        {coach.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-1">{coach.name}</h3>
                  {coach.specialties && coach.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {coach.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-brand-sky-blue/10 text-brand-royal-blue px-2 py-1 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {coach.email && (
                    <a
                      href={`mailto:${coach.email}`}
                      className="text-sm text-brand-bridge-orange hover:underline block"
                    >
                      {coach.email}
                    </a>
                  )}
                  {coach.phone && (
                    <a
                      href={`tel:${coach.phone}`}
                      className="text-sm text-gray-600 block mt-1"
                    >
                      {coach.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-gray-600 mb-4">
                View the full coach directory, including contact information and specialties.
              </p>
              <Link
                href="/scsf-coaches"
                className="inline-block bg-brand-royal-blue text-white px-5 py-2.5 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors"
              >
                SCSF Coaches Directory →
              </Link>
            </div>
          )}
        </section>

        {/* Ice Time */}
        <section id="ice-time">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Ice Time</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-3">{venue}</h3>
                <address className="not-italic text-gray-600 space-y-1">
                  <p>{vStreet}</p>
                  <p>{vCity}</p>
                  <p className="mt-2">
                    <a href={`tel:${vPhone.replace(/\D/g,'')}`} className="text-brand-bridge-orange hover:underline">
                      {vPhone}
                    </a>
                  </p>
                </address>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${vStreet}, ${vCity}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-brand-bridge-orange hover:underline font-medium text-sm"
                >
                  Get Directions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Freestyle Ice Sessions</h3>
                <p className="text-gray-600">
                  SCSF members have access to dedicated freestyle sessions. Session schedules vary by season —
                  contact the rink or your coach for current times.
                </p>
                <p className="text-gray-600 mt-3">
                  Member benefits include reduced freestyle session rates and priority booking for test sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Club Jackets */}
        <section id="jackets">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Order Club Jackets</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-6">
              Show your SCSF pride with an official club jacket. Jackets are available to members and feature
              the SCSF logo. Orders are placed periodically — check announcements for the next order window.
            </p>
            <div className="bg-brand-off-white rounded-lg p-6">
              <p className="text-sm text-gray-500">
                To place a jacket order or inquire about availability, contact the club via the information
                in the footer, or reach out to a board member at your next club event.
              </p>
            </div>
          </div>
        </section>

      </Container>
    </div>
  );
}
