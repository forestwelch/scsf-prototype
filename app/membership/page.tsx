import Container from '@/components/Container';
import Link from 'next/link';
import { getAllMembershipCategories, getSiteSettings } from '@/lib/sanity.queries';

export const metadata = {
  title: 'Membership | Skating Club of San Francisco',
  description: 'Join or renew your SCSF membership. Home Club, Introductory, Associate, Parent, Coach, and more — all categories and fees listed here.',
};

export default async function MembershipPage() {
  const [categories, settings] = await Promise.all([
    getAllMembershipCategories(),
    getSiteSettings(),
  ]);

  const entryEezeUrl = settings.entryEezeUrl
    ?? 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189';

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Join or renew your SCSF membership for the 2025–26 season (July 1, 2025 – June 30, 2026).
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a href={entryEezeUrl} target="_blank" rel="noopener noreferrer"
              className="bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
              Join / Renew on EntryEeze →
            </a>
            <a href="#categories"
              className="border-2 border-white/60 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors">
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
              New to USFS? Introductory members cannot sign up for tests or competitions until July 1. If you&apos;re already
              a member, your current membership covers you for testing and competing straight through June 30.
            </p>
            <div className="bg-brand-golden-yellow/10 border border-brand-golden-yellow/40 rounded-lg p-4">
              <p className="font-semibold text-brand-charcoal mb-2">When renewing, please verify:</p>
              <ul className="text-sm space-y-1.5">
                {[
                  'Name spelling matches exactly on both EntryEeze and USFS Members Only',
                  'Phone numbers and email addresses are current',
                  'Your USFS number is entered in your EntryEeze account',
                  'Parent members: you cannot be a parent member if your child\'s home club is elsewhere',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand-golden-yellow font-bold shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href={entryEezeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-brand-royal-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors">
              Renew on EntryEeze
            </a>
            <Link href="/the-inside-edge-newsletter-archive"
              className="inline-block border-2 border-brand-royal-blue text-brand-royal-blue px-6 py-3 rounded-md font-semibold hover:bg-brand-royal-blue hover:text-white transition-colors">
              Newsletter Archive
            </Link>
          </div>
        </section>

        {/* Membership categories */}
        <section id="categories">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-2">Membership Categories</h2>
          <p className="text-gray-600 mb-8">
            All memberships run July 1 – June 30. Fees include US Figure Skating registration unless noted.
          </p>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div key={cat._id}
                  className={`bg-white rounded-lg shadow-sm p-6 flex flex-col ${cat.highlight ? 'ring-2 ring-brand-royal-blue' : ''}`}>
                  {cat.highlight && (
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-royal-blue bg-brand-royal-blue/10 px-2 py-0.5 rounded w-fit mb-3">
                      Most Common
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-brand-charcoal leading-tight">{cat.name}</h3>
                    <span className="text-xl font-bold text-brand-bridge-orange ml-3 shrink-0">{cat.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{cat.ageGroup}</p>
                  <ul className="text-sm text-gray-700 space-y-1.5 flex-1">
                    {(cat.features ?? []).map((f) => (
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
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              Membership categories are managed in Sanity Studio. Add them under <strong>Membership Categories</strong>.
            </div>
          )}

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
            <Link href="/volunteer-commitment" className="text-brand-bridge-orange hover:underline font-medium text-sm">
              Full policy →
            </Link>
          </div>
          <div id="conduct" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">Code of Conduct</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              All SCSF members must abide by the Club's Code of Conduct, upholding respectful behavior on and off the
              ice for skaters, coaches, parents, and officials.
            </p>
            <Link href="/code-of-conduct" className="text-brand-bridge-orange hover:underline font-medium text-sm">
              View Code of Conduct →
            </Link>
          </div>
          <div id="skatesafe" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">SkateSafe / SafeSport</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              SCSF supports US Figure Skating's SkateSafe program to ensure all members have a safe skating
              environment, in compliance with the US Olympic Committee.
            </p>
            <Link href="/skatesafe-statement" className="text-brand-bridge-orange hover:underline font-medium text-sm">
              SkateSafe Statement →
            </Link>
          </div>
        </section>

        <section className="bg-brand-royal-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Questions about membership?</h2>
          <p className="text-white/80 mb-6">Contact our membership chair or use the form on our Contact page.</p>
          <Link href="/contact"
            className="inline-block bg-brand-golden-yellow text-brand-charcoal px-8 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
            Contact Us
          </Link>
        </section>

      </Container>
    </div>
  );
}
