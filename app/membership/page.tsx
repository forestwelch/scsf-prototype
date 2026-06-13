import Container from '@/components/Container';
import Link from 'next/link';

export const metadata = {
  title: 'Membership | Skating Club of San Francisco',
  description: 'Join or renew your SCSF membership. Home Club, Introductory, Associate, Parent, Coach, and more — all categories and fees listed here.',
};

const CATEGORIES = [
  {
    name: 'Home Club Adult',
    price: '$135',
    age: '18 and over',
    highlight: true,
    features: [
      'Priority test session scheduling at Home Club rates',
      'Compete in US Figure Skating sanctioned competitions',
      'Vote in annual Club elections',
      'Eligible for Board positions & USFS official roles',
      '"Skating" magazine bi-monthly (1 per household)',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Home Club Junior',
    price: '$135',
    age: 'Under 18',
    highlight: true,
    features: [
      'Priority test session scheduling at Home Club rates',
      'Compete in US Figure Skating sanctioned competitions',
      'Eligible for Junior Council positions',
      '"Skating" magazine bi-monthly (1 per household)',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Introductory',
    price: '$70',
    age: 'First-time USFS members',
    highlight: false,
    features: [
      'One-time membership for skaters new to USFS',
      'Home Club priority and test rates',
      'Compete in US Figure Skating competitions',
      'Renews at Home Club rate going forward',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Subsequent Home Club',
    price: '$90',
    age: 'Same-household members',
    highlight: false,
    features: [
      'Additional members living with a Home Club member',
      'Same benefits as Adult or Junior depending on age',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Parent',
    price: '$50',
    age: 'Parents of Junior members',
    highlight: false,
    features: [
      'Required for parents of Tremors / SF Ice Theatre team members',
      'Vote in Club elections on behalf of minor skater',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Coach',
    price: '$90',
    age: 'Professional coaches only',
    highlight: false,
    features: [
      'Limited membership — no voting or Board eligibility',
      'Must be designated as a coach with USFS',
      'Current SafeSport/SkateSafe compliance required',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Collegiate',
    price: '$130',
    age: 'Home Club college/university students',
    highlight: false,
    features: [
      '4-year membership, auto-renewed annually',
      'Continue taking tests and competing',
      'Full course load & enrollment proof required',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Alumni',
    price: '$85',
    age: 'Former Home Club members (3+ yrs)',
    highlight: false,
    features: [
      'For members no longer competing',
      'Vote in elections and attend club functions',
      'May take tests at Associate Member rates',
      'Subsequent family member: $70',
      'Includes US Figure Skating registration',
    ],
  },
  {
    name: 'Associate',
    price: '$90',
    age: 'USFS members at another home club',
    highlight: false,
    features: [
      'Required for Tremors / SF Ice Theatre participation',
      'Priority test scheduling over non-members',
      'Does NOT include USFS registration',
      'Subsequent family member: $70',
    ],
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Join or renew your SCSF membership for the 2025–26 season (July 1, 2025 – June 30, 2026).
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors"
            >
              Join / Renew on EntryEeze →
            </a>
            <a
              href="#categories"
              className="border-2 border-white/60 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors"
            >
              View Membership Categories
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-12 md:py-16 space-y-14">

        {/* Renewal notice */}
        <section id="join" className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">Join or Renew for 2025–26</h2>
          <div className="text-gray-700 space-y-4">
            <p>
              Membership renewals are processed through <strong>EntryEeze</strong>. The 2025–26 season begins
              <strong> July 1, 2025</strong>. Renew before June 30 to maintain uninterrupted testing and competition
              eligibility — and to vote in the annual club election.
            </p>
            <p>
              New to USFS? Introductory members cannot sign up for tests or competitions until July 1. If you're already
              a member, your current membership covers you for testing and competing straight through June 30.
            </p>
            <div className="bg-brand-golden-yellow/10 border border-brand-golden-yellow/40 rounded-lg p-4">
              <p className="font-semibold text-brand-charcoal mb-2">When renewing, please verify:</p>
              <ul className="text-sm space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-brand-golden-yellow font-bold shrink-0">·</span>
                  Name spelling matches exactly on both EntryEeze and USFS Members Only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-golden-yellow font-bold shrink-0">·</span>
                  Phone numbers and email addresses are current
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-golden-yellow font-bold shrink-0">·</span>
                  Your USFS number is entered in your EntryEeze account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-golden-yellow font-bold shrink-0">·</span>
                  Parent members: you cannot be a parent member if your child's home club is elsewhere
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-royal-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors"
            >
              Renew on EntryEeze
            </a>
            <a
              href="https://scsf.org/the-inside-edge-newsletter-archive/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-brand-royal-blue text-brand-royal-blue px-6 py-3 rounded-md font-semibold hover:bg-brand-royal-blue hover:text-white transition-colors"
            >
              Newsletter Archive
            </a>
          </div>
        </section>

        {/* Membership categories */}
        <section id="categories">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-2">Membership Categories</h2>
          <p className="text-gray-600 mb-8">
            All memberships run July 1 – June 30. Fees include US Figure Skating registration unless noted.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className={`bg-white rounded-lg shadow-sm p-6 flex flex-col ${cat.highlight ? 'ring-2 ring-brand-royal-blue' : ''}`}
              >
                {cat.highlight && (
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-royal-blue bg-brand-royal-blue/10 px-2 py-0.5 rounded w-fit mb-3">
                    Most Common
                  </span>
                )}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-brand-charcoal leading-tight">{cat.name}</h3>
                  <span className="text-xl font-bold text-brand-bridge-orange ml-3 shrink-0">{cat.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{cat.age}</p>
                <ul className="text-sm text-gray-700 space-y-1.5 flex-1">
                  {cat.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-brand-sky-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Midterm Transfer: $75 first member, $65 each subsequent. Subsequent Introductory: $55.
          </p>
        </section>

        {/* Volunteer + SkateSafe */}
        <section id="volunteer" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">Volunteer Commitment</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              SCSF is entirely volunteer-run. All members are expected to contribute time to club activities —
              test sessions, competitions, the Annual Gala, and more.
            </p>
            <a href="https://scsf.org/volunteer-commitment/" target="_blank" rel="noopener noreferrer"
              className="text-brand-bridge-orange hover:underline font-medium text-sm">
              Full policy →
            </a>
          </div>
          <div id="conduct" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">Code of Conduct</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              All SCSF members must abide by the Club's Code of Conduct, upholding respectful behavior on and off the
              ice for skaters, coaches, parents, and officials.
            </p>
            <a href="https://scsf.org/code-of-conduct/" target="_blank" rel="noopener noreferrer"
              className="text-brand-bridge-orange hover:underline font-medium text-sm">
              View Code of Conduct →
            </a>
          </div>
          <div id="skatesafe" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">SkateSafe / SafeSport</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              SCSF supports US Figure Skating's SkateSafe program to ensure all members have a safe skating
              environment, in compliance with the US Olympic Committee.
            </p>
            <a href="https://scsf.org/skatesafe-statement/" target="_blank" rel="noopener noreferrer"
              className="text-brand-bridge-orange hover:underline font-medium text-sm">
              SkateSafe Statement →
            </a>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-brand-royal-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Questions about membership?</h2>
          <p className="text-white/80 mb-6">Contact our membership chair or use the form on our Contact page.</p>
          <Link
            href="/contact"
            className="inline-block bg-brand-golden-yellow text-brand-charcoal px-8 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors"
          >
            Contact Us
          </Link>
        </section>

      </Container>
    </div>
  );
}
