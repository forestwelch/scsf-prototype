/** Current Membership page copy. Used to prefill its Sanity page document. */
export const membershipPageDefaults = {
  title: 'Membership',
  description: 'Join or renew your SCSF membership for the 2025–26 season (July 1, 2025 – June 30, 2026).',
  membershipJoinButtonLabel: 'Join / Renew on EntryEeze →',
  membershipEntryEezeUrl: 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189',
  membershipCategoriesButtonLabel: 'View Membership Categories',
  membershipRenewalTitle: 'Join or Renew for 2025–26',
  membershipRenewalParagraphs: [
    'Membership renewals are processed through EntryEeze. The 2025–26 season begins July 1, 2025. Renew before June 30 to maintain uninterrupted testing and competition eligibility — and to vote in the annual club election.',
    'New to USFS? Introductory members cannot sign up for tests or competitions until July 1. If you’re already a member, your current membership covers you for testing and competing straight through June 30.',
  ],
  membershipRenewalChecklistHeading: 'When renewing, please verify:',
  membershipRenewalChecklist: [
    'Name spelling matches exactly on both EntryEeze and USFS Members Only',
    'Phone numbers and email addresses are current',
    'Your USFS number is entered in your EntryEeze account',
    "Parent members: you cannot be a parent member if your child's home club is elsewhere",
  ],
  membershipRenewalButtonLabel: 'Renew on EntryEeze',
  membershipNewsletterButtonLabel: 'Newsletter Archive',
  membershipNewsletterArchiveUrl: '/the-inside-edge-newsletter-archive',
  membershipCategoriesTitle: 'Membership Categories',
  membershipCategoriesIntro: 'All memberships run July 1 – June 30. Fees include US Figure Skating registration unless noted.',
  membershipTransferNotice: 'Midterm Transfer: $75 first member, $65 each subsequent. Subsequent Introductory: $55.',
  membershipInfoSections: [
    {
      _key: 'volunteer',
      title: 'Volunteer Commitment',
      text: 'SCSF is entirely volunteer-run. All members are expected to contribute time to club activities — test sessions, competitions, the Annual Gala, and more.',
      linkLabel: 'Full policy →',
      linkUrl: '/volunteer-commitment',
    },
    {
      _key: 'conduct',
      title: 'Code of Conduct',
      text: "All SCSF members must abide by the Club's Code of Conduct, upholding respectful behavior on and off the ice for skaters, coaches, parents, and officials.",
      linkLabel: 'View Code of Conduct →',
      linkUrl: '/code-of-conduct',
    },
    {
      _key: 'skatesafe',
      title: 'SkateSafe / SafeSport',
      text: "SCSF supports US Figure Skating's SkateSafe program to ensure all members have a safe skating environment, in compliance with the US Olympic Committee.",
      linkLabel: 'SkateSafe Statement →',
      linkUrl: '/skatesafe-statement',
    },
  ],
  membershipQuestionHeading: 'Questions about membership?',
  membershipQuestionText: 'Contact our membership chair or use the form on our Contact page.',
  membershipQuestionButtonLabel: 'Contact Us',
  membershipQuestionButtonUrl: '/contact',
}

export const eventsPageDefaults = {
  title: 'Events',
  description: 'Galas, competitions, test sessions, and club events. Mark your calendars and join us on the ice.',
}
