import Container from '@/components/Container';
import Link from 'next/link';
import { getAllMembershipCategories, getSiteSettings, getSitePage } from '@/lib/sanity.queries';
import SitePageHeader from '@/components/SitePageHeader';
import SitePageContent from '@/components/SitePageContent';
import {membershipPageDefaults} from '@/lib/membership-page-defaults';

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

  const entryEezeUrl = pageCopy?.membershipEntryEezeUrl || settings.entryEezeUrl || membershipPageDefaults.membershipEntryEezeUrl;
  const renewalParagraphs = pageCopy?.membershipRenewalParagraphs?.length
    ? pageCopy.membershipRenewalParagraphs
    : settings.membershipRenewalParagraphs?.length
    ? settings.membershipRenewalParagraphs
    : membershipPageDefaults.membershipRenewalParagraphs;
  const renewalChecklist = pageCopy?.membershipRenewalChecklist?.length
    ? pageCopy.membershipRenewalChecklist
    : settings.membershipRenewalChecklist?.length
    ? settings.membershipRenewalChecklist
    : membershipPageDefaults.membershipRenewalChecklist;
  const infoSections = pageCopy?.membershipInfoSections?.length
    ? pageCopy.membershipInfoSections
    : settings.membershipInfoSections?.length
    ? settings.membershipInfoSections
    : membershipPageDefaults.membershipInfoSections;
  const newsletterArchiveUrl = pageCopy?.membershipNewsletterArchiveUrl || '/the-inside-edge-newsletter-archive';
  const questionButtonUrl = pageCopy?.membershipQuestionButtonUrl || '/contact';

  return (
    <div className="min-h-screen bg-brand-off-white">
      <SitePageHeader route="/membership" fallbackTitle={settings.membershipPageTitle || 'Membership'} fallbackDescription={settings.membershipPageIntro || 'Join or renew your SCSF membership for the 2025–26 season (July 1, 2025 – June 30, 2026).'}>
          <div className="flex flex-wrap gap-4 mt-6">
            <a href={entryEezeUrl} target="_blank" rel="noopener noreferrer"
              className="bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
              {pageCopy?.membershipJoinButtonLabel || membershipPageDefaults.membershipJoinButtonLabel}
            </a>
            <a href="#categories"
              className="border-2 border-white/60 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors">
              {pageCopy?.membershipCategoriesButtonLabel || membershipPageDefaults.membershipCategoriesButtonLabel}
            </a>
          </div>
      </SitePageHeader>

      <Container className="py-12 md:py-16 space-y-14">

        {/* Renewal notice */}
        <section id="join" className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">{pageCopy?.membershipRenewalTitle || settings.membershipRenewalTitle || membershipPageDefaults.membershipRenewalTitle}</h2>
          <div className="text-gray-700 space-y-4">
            {renewalParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="bg-brand-golden-yellow/10 border border-brand-golden-yellow/40 rounded-lg p-4">
              <p className="font-semibold text-brand-charcoal mb-2">{pageCopy?.membershipRenewalChecklistHeading || membershipPageDefaults.membershipRenewalChecklistHeading}</p>
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
              {pageCopy?.membershipRenewalButtonLabel || membershipPageDefaults.membershipRenewalButtonLabel}
            </a>
            <Link href={newsletterArchiveUrl}
              className="inline-block border-2 border-brand-royal-blue text-brand-royal-blue px-6 py-3 rounded-md font-semibold hover:bg-brand-royal-blue hover:text-white transition-colors">
              {pageCopy?.membershipNewsletterButtonLabel || membershipPageDefaults.membershipNewsletterButtonLabel}
            </Link>
          </div>
        </section>

        {/* Membership categories */}
        <section id="categories">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-2">{pageCopy?.membershipCategoriesTitle || settings.membershipCategoriesTitle || membershipPageDefaults.membershipCategoriesTitle}</h2>
          <p className="text-gray-600 mb-8">
            {pageCopy?.membershipCategoriesIntro || settings.membershipCategoriesIntro || membershipPageDefaults.membershipCategoriesIntro}
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
            {pageCopy?.membershipTransferNotice || settings.membershipTransferNotice || membershipPageDefaults.membershipTransferNotice}
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
          <h2 className="text-2xl font-bold mb-3">{pageCopy?.membershipQuestionHeading || settings.membershipQuestionHeading || membershipPageDefaults.membershipQuestionHeading}</h2>
          <p className="text-white/80 mb-6">{pageCopy?.membershipQuestionText || settings.membershipQuestionText || membershipPageDefaults.membershipQuestionText}</p>
          <Link href={questionButtonUrl}
            className="inline-block bg-brand-golden-yellow text-brand-charcoal px-8 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
            {pageCopy?.membershipQuestionButtonLabel || membershipPageDefaults.membershipQuestionButtonLabel}
          </Link>
        </section>

      </Container>
      <SitePageContent route="/membership" />
    </div>
  );
}
