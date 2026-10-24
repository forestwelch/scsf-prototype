import Container from '@/components/Container';
import Link from 'next/link';
import { getAllMembershipCategories, getSiteSettings, getSitePage } from '@/lib/sanity.queries';
import SitePageHeader from '@/components/SitePageHeader';
import SitePageContent from '@/components/SitePageContent';

export const metadata = {
  title: 'Membership | Skating Club of San Francisco',
  description: 'Join or renew your SCSF membership. Home Club, Introductory, Associate, Parent, Coach, and more — all categories and fees listed here.',
};

export default async function MembershipPage() {
  const [categories, settings, pageCopy] = await Promise.all([
    getAllMembershipCategories(),
    getSiteSettings(),
    getSitePage('/membership'),
  ]);

  const entryEezeUrl = settings.entryEezeUrl
    ?? 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189';
  const renewalParagraphs = pageCopy?.membershipRenewalParagraphs?.length
    ? pageCopy.membershipRenewalParagraphs
    : settings.membershipRenewalParagraphs?.length
    ? settings.membershipRenewalParagraphs
    : [
      'Membership renewals are processed through EntryEeze. The 2025–26 season begins July 1, 2025. Renew before June 30 to maintain uninterrupted testing and competition eligibility — and to vote in the annual club election.',
      'New to USFS? Introductory members cannot sign up for tests or competitions until July 1. If you’re already a member, your current membership covers you for testing and competing straight through June 30.',
    ];
  const renewalChecklist = pageCopy?.membershipRenewalChecklist?.length
    ? pageCopy.membershipRenewalChecklist
    : settings.membershipRenewalChecklist?.length
    ? settings.membershipRenewalChecklist
    : [
      'Name spelling matches exactly on both EntryEeze and USFS Members Only',
      'Phone numbers and email addresses are current',
      'Your USFS number is entered in your EntryEeze account',
      "Parent members: you cannot be a parent member if your child's home club is elsewhere",
    ];
  const infoSections = pageCopy?.membershipInfoSections?.length
    ? pageCopy.membershipInfoSections
    : settings.membershipInfoSections?.length
    ? settings.membershipInfoSections
    : [
      { _key: 'volunteer', title: 'Volunteer Commitment', text: 'SCSF is entirely volunteer-run. All members are expected to contribute time to club activities — test sessions, competitions, the Annual Gala, and more.', linkLabel: 'Full policy →', linkUrl: '/volunteer-commitment' },
      { _key: 'conduct', title: 'Code of Conduct', text: "All SCSF members must abide by the Club's Code of Conduct, upholding respectful behavior on and off the ice for skaters, coaches, parents, and officials.", linkLabel: 'View Code of Conduct →', linkUrl: '/code-of-conduct' },
      { _key: 'skatesafe', title: 'SkateSafe / SafeSport', text: "SCSF supports US Figure Skating's SkateSafe program to ensure all members have a safe skating environment, in compliance with the US Olympic Committee.", linkLabel: 'SkateSafe Statement →', linkUrl: '/skatesafe-statement' },
    ];

  return (
    <div className="min-h-screen bg-brand-off-white">
      <SitePageHeader route="/membership" fallbackTitle={settings.membershipPageTitle || 'Membership'} fallbackDescription={settings.membershipPageIntro || 'Join or renew your SCSF membership for the 2025–26 season (July 1, 2025 – June 30, 2026).'}>
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
      </SitePageHeader>

      <Container className="py-12 md:py-16 space-y-14">

        {/* Renewal notice */}
        <section id="join" className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">{pageCopy?.membershipRenewalTitle || settings.membershipRenewalTitle || 'Join or Renew for 2025–26'}</h2>
          <div className="text-gray-700 space-y-4">
            {renewalParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="bg-brand-golden-yellow/10 border border-brand-golden-yellow/40 rounded-lg p-4">
              <p className="font-semibold text-brand-charcoal mb-2">When renewing, please verify:</p>
              <ul className="text-sm space-y-1.5">
                {renewalChecklist.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex items-start gap-2">
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
          <h2 className="text-3xl font-bold text-brand-charcoal mb-2">{pageCopy?.membershipCategoriesTitle || settings.membershipCategoriesTitle || 'Membership Categories'}</h2>
          <p className="text-gray-600 mb-8">
            {pageCopy?.membershipCategoriesIntro || settings.membershipCategoriesIntro || 'All memberships run July 1 – June 30. Fees include US Figure Skating registration unless noted.'}
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
            {pageCopy?.membershipTransferNotice || settings.membershipTransferNotice || 'Midterm Transfer: $75 first member, $65 each subsequent. Subsequent Introductory: $55.'}
          </p>
        </section>

        {/* Volunteer + SkateSafe */}
        <section id="volunteer" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoSections.map((section, index) => (
            <div key={section._key} id={['volunteer', 'conduct', 'skatesafe'][index]} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-3">{section.title}</h2>
              {section.text && <p className="text-gray-700 text-sm leading-relaxed mb-4">{section.text}</p>}
              {section.linkLabel && section.linkUrl && (
                section.linkUrl.startsWith('http')
                  ? <a href={section.linkUrl} target="_blank" rel="noopener noreferrer" className="text-brand-bridge-orange hover:underline font-medium text-sm">{section.linkLabel}</a>
                  : <Link href={section.linkUrl} className="text-brand-bridge-orange hover:underline font-medium text-sm">{section.linkLabel}</Link>
              )}
            </div>
          ))}
        </section>

        <section className="bg-brand-royal-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">{pageCopy?.membershipQuestionHeading || settings.membershipQuestionHeading || 'Questions about membership?'}</h2>
          <p className="text-white/80 mb-6">{pageCopy?.membershipQuestionText || settings.membershipQuestionText || 'Contact our membership chair or use the form on our Contact page.'}</p>
          <Link href="/contact"
            className="inline-block bg-brand-golden-yellow text-brand-charcoal px-8 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
            Contact Us
          </Link>
        </section>

      </Container>
      <SitePageContent route="/membership" />
    </div>
  );
}
