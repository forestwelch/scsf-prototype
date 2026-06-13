import Container from '@/components/Container';
import Link from 'next/link';

export const metadata = {
  title: 'Programs | Skating Club of San Francisco',
  description: 'SCSF programs including Ice Theatre, Tremors performance team, skating tests, and competitions.',
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Programs</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            From performance teams to competitive testing, SCSF offers programs for skaters at every level.
          </p>
        </Container>
      </div>

      {/* Jump Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <Container>
          <nav className="flex gap-6 overflow-x-auto py-3 text-sm font-medium">
            {[
              { label: 'Teams', href: '#teams' },
              { label: 'Tests', href: '#tests' },
              { label: 'Competitions', href: '#competitions' },
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

        {/* Teams */}
        <section id="teams">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-8">Teams</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Ice Theatre */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-brand-sky-blue to-brand-royal-blue p-8 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">SCSF Ice Theatre</h3>
                <p className="text-white/80 mt-1 text-sm">Performance Team</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Ice Theatre combines the artistry of theatre with the technical demands of figure skating.
                  Members perform in the annual gala and special club events, bringing choreographed
                  group numbers to life on the ice.
                </p>
                <p className="text-gray-600 mb-4">
                  Open to skaters with a solid foundation on the ice. No prior performance experience required —
                  just enthusiasm, commitment to rehearsals, and a love of skating.
                </p>
                <div className="bg-brand-off-white rounded-md p-4 text-sm text-gray-600">
                  <strong className="text-brand-charcoal">Interested?</strong> Reach out to a board member or
                  ask your coach about the current season&apos;s schedule and audition process.
                </div>
              </div>
            </div>

            {/* Tremors */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-brand-bridge-orange to-brand-golden-yellow p-8 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Tremors</h3>
                <p className="text-white/80 mt-1 text-sm">Junior Performance Team</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Tremors is SCSF&apos;s junior skating team, designed for younger skaters who are developing
                  their skills and want to experience the excitement of performing as part of a group.
                </p>
                <p className="text-gray-600 mb-4">
                  Tremors skaters participate in the annual gala alongside the Ice Theatre team, gaining
                  valuable stage experience and building confidence on the ice.
                </p>
                <div className="bg-brand-off-white rounded-md p-4 text-sm text-gray-600">
                  <strong className="text-brand-charcoal">Age & level requirements</strong> vary by season.
                  Contact a board member or coach for current eligibility criteria.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tests */}
        <section id="tests">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Tests</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-6 text-lg">
              SCSF hosts official US Figure Skating test sessions throughout the year. Passing tests
              is a meaningful milestone in a skater&apos;s development and unlocks new competitive opportunities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: 'Moves in the Field',
                  desc: 'Edge quality, power, and skating skill. Required for many competitive levels.',
                  color: 'bg-brand-sky-blue/10 text-brand-royal-blue',
                },
                {
                  title: 'Free Skate',
                  desc: 'Jumps, spins, and footwork sequences tested at multiple levels from Pre-Preliminary through Senior.',
                  color: 'bg-brand-golden-yellow/10 text-brand-charcoal',
                },
                {
                  title: 'Ice Dance',
                  desc: 'Pattern dances and rhythm/free dance components tested in partnership.',
                  color: 'bg-brand-bridge-orange/10 text-brand-bridge-orange',
                },
                {
                  title: 'Pairs',
                  desc: 'Side-by-side elements, lifts, and pair spins tested for competitive pairs teams.',
                  color: 'bg-brand-royal-blue/10 text-brand-royal-blue',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className={`w-2 rounded-full flex-shrink-0 ${item.color.split(' ')[0]}`} />
                  <div>
                    <h3 className="font-semibold text-brand-charcoal mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-brand-golden-yellow text-brand-charcoal px-5 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
              >
                View Upcoming Test Sessions
              </Link>
              <Link
                href="/tests-passed"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-royal-blue text-brand-royal-blue px-5 py-3 rounded-md font-semibold hover:bg-brand-royal-blue hover:text-white transition-colors"
              >
                Tests Passed Record
              </Link>
            </div>
          </div>
        </section>

        {/* Competitions */}
        <section id="competitions">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Competitions</h2>

          {/* Skate SF */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-bridge-orange rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-brand-charcoal">Skate SF</h3>
                <p className="text-brand-bridge-orange font-medium text-sm">SCSF&apos;s Annual Competition</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Skate SF is the Skating Club of San Francisco&apos;s annual competition, welcoming skaters from
              clubs across the region. It&apos;s a US Figure Skating sanctioned event featuring multiple
              disciplines and competitive levels.
            </p>
            <p className="text-gray-600">
              The competition is a highlight of the SCSF calendar — a chance for our skaters to compete
              on home ice and for the broader skating community to gather in San Francisco.
            </p>
            <Link
              href="/events"
              className="inline-block mt-4 text-brand-bridge-orange hover:underline font-medium"
            >
              Check Events for registration dates →
            </Link>
          </div>

          {/* Other Competitions */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-brand-charcoal mb-4">Regional & National Competitions</h3>
            <p className="text-gray-600 mb-4">
              SCSF members compete at regional and national levels throughout the season. Your coach
              will guide you on which competitions are appropriate for your level and goals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <a
                href="https://entryeeze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-bridge-orange hover:underline"
              >
                EntryEeze — Competition Registration
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://www.usfigureskating.org/skate/skating-opportunities/compete"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-bridge-orange hover:underline"
              >
                USFS Competition Info
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

      </Container>
    </div>
  );
}
