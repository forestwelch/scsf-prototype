import Link from 'next/link';
import Container from '@/components/Container';

export const metadata = {
  title: 'Membership | Skating Club of San Francisco',
  description: 'Join the Skating Club of San Francisco and become part of our community of skaters, coaches, and families.',
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      <Container className="py-12 md:py-16">
        {/* Why Join Section */}
        <section id="why-join" className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-6">
            Why Join SCSF?
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Membership in the Skating Club of San Francisco opens doors to a world of opportunities
              for skaters and their families. As a member, you become part of a supportive community
              dedicated to excellence in figure skating.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Access to Test Sessions</h3>
                  <p className="text-gray-700">Priority registration for club test sessions and opportunities to advance through USFS levels.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Coaching Network</h3>
                  <p className="text-gray-700">Connect with our network of experienced coaches and find the right instructor for your needs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Competition Opportunities</h3>
                  <p className="text-gray-700">Participate in club-hosted competitions and receive support for regional and national events.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-golden-yellow rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-charcoal mb-2">Community Support</h3>
                  <p className="text-gray-700">Join a welcoming community of skaters, families, and coaches who support each other's goals.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Membership Benefits
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Priority registration for club test sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Reduced fees for club-hosted competitions and events</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Access to club ice time and practice sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Eligibility for club scholarships and support programs</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Voting rights in club elections and decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Recognition for achievements and test passes</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-golden-yellow mr-3">✓</span>
                <span>Access to club social events and community activities</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Join Now Section */}
        <section id="join" className="mb-16">
          <div className="bg-gradient-to-br from-brand-sky-blue to-brand-royal-blue rounded-lg shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join?
            </h2>
            <p className="text-xl mb-6 text-white/90">
              Become a member of the Skating Club of San Francisco today and start your journey with us.
            </p>
            <a
              href="https://entryeeze.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-golden-yellow text-brand-charcoal px-8 py-4 rounded-md font-semibold text-lg hover:bg-yellow-500 transition-colors"
            >
              Join Now via EntryEeze
            </a>
            <p className="mt-4 text-sm text-white/80">
              For questions about membership, please contact us through our{' '}
              <Link href="/contact" className="underline hover:text-white">
                contact page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Membership Policies */}
        <section id="policies" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Membership Policies
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-2">
                  Membership Categories
                </h3>
                <p className="text-gray-700 mb-2">
                  SCSF offers several membership categories to accommodate different needs:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Full Membership (Skaters)</li>
                  <li>Associate Membership (Parents/Guardians)</li>
                  <li>Coach Membership</li>
                  <li>Honorary Membership</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-2">
                  Annual Dues
                </h3>
                <p className="text-gray-700">
                  Membership dues are collected annually and vary by membership category. Please
                  contact us for current pricing information.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal mb-2">
                  Volunteer Commitment
                </h3>
                <p className="text-gray-700">
                  Members are encouraged to volunteer their time to support club events and activities.
                  Volunteer opportunities include test sessions, competitions, and special events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Code of Conduct */}
        <section id="conduct" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Code of Conduct
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-700 mb-4">
              All members of the Skating Club of San Francisco are expected to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Treat all members, coaches, and officials with respect and courtesy</li>
              <li>Maintain a positive and supportive attitude</li>
              <li>Follow all rink and club rules and regulations</li>
              <li>Support the club's mission and values</li>
              <li>Respect the rights and property of others</li>
              <li>Participate in club activities in a sportsmanlike manner</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Violations of the code of conduct may result in disciplinary action, including
              suspension or termination of membership.
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}
