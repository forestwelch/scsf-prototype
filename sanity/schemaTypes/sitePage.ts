import {defineField, defineType} from 'sanity'

/** Editable copy for a built-in route whose layout or data is implemented in the app. */
const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/membership': 'Membership',
  '/programs': 'Programs',
  '/events': 'Events',
  '/resources': 'Resources',
  '/tests-passed': 'Tests Passed',
  '/announcements': 'Announcements',
  '/faqs': 'FAQs',
  '/donate': 'Donate',
  '/contact': 'Contact',
  '/scsf-coaches': 'SCSF Coaches',
  '/the-inside-edge-newsletter-archive': 'Newsletter Archive',
}

export default defineType({
  name: 'sitePage',
  title: 'Built-in website page',
  description: 'Content settings for a fixed website route. For pages with their own URL, use Pages → Custom pages.',
  type: 'document',
  fields: [
    defineField({
      name: 'route', title: 'Website URL', type: 'string', readOnly: true,
      description: 'This is a built-in site route. It cannot be deleted or duplicated as a regular content page.',
    }),
    defineField({name: 'title', title: 'Page heading', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Short description', type: 'text', rows: 3, description: 'Shown below the page heading when the design has an intro area.'}),
    defineField({name: 'membershipRenewalTitle', title: 'Renewal section heading', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipJoinButtonLabel', title: 'Join button label', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipEntryEezeUrl', title: 'EntryEeze link', type: 'url', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipCategoriesButtonLabel', title: 'Categories button label', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipRenewalParagraphs', title: 'Renewal paragraphs', type: 'array', of: [{type: 'text', rows: 3}], hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipRenewalChecklistHeading', title: 'Renewal checklist heading', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipRenewalChecklist', title: 'Renewal checklist', type: 'array', of: [{type: 'string'}], hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipRenewalButtonLabel', title: 'Renew button label', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipNewsletterButtonLabel', title: 'Newsletter link label', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipNewsletterArchiveUrl', title: 'Newsletter link URL', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipCategoriesTitle', title: 'Membership categories heading', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipCategoriesIntro', title: 'Membership categories intro', type: 'text', rows: 2, hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipTransferNotice', title: 'Transfer fee notice', type: 'text', rows: 2, hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipQuestionHeading', title: 'Questions section heading', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipQuestionText', title: 'Questions section text', type: 'text', rows: 2, hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipQuestionButtonLabel', title: 'Contact button label', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'membershipQuestionButtonUrl', title: 'Contact button URL', type: 'string', hidden: ({document}) => document?.route !== '/membership'}),
    defineField({name: 'announcementsShowNewsletterSignup', title: 'Show newsletter signup', type: 'boolean', hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'announcementsNewsletterUrl', title: 'Newsletter signup embed URL', type: 'url', hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'announcementsShowInstagram', title: 'Show Instagram card', type: 'boolean', hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'announcementsInstagramUrl', title: 'Instagram profile URL', type: 'url', hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'announcementsInstagramHeading', title: 'Instagram card heading', type: 'string', hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'announcementsInstagramIntro', title: 'Instagram card text', type: 'text', rows: 2, hidden: ({document}) => document?.route !== '/announcements'}),
    defineField({name: 'donateFormUrl', title: 'Donation form embed URL', type: 'url', hidden: ({document}) => document?.route !== '/donate'}),
    defineField({
      name: 'membershipInfoSections', title: 'Volunteer, conduct & safety sections', type: 'array', hidden: ({document}) => document?.route !== '/membership',
      of: [{type: 'object', fields: [
        defineField({name: 'title', title: 'Heading', type: 'string'}),
        defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
        defineField({name: 'linkLabel', title: 'Link label', type: 'string'}),
        defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
      ]}],
    }),
    defineField({
      name: 'photos', title: 'Page photos', type: 'array', hidden: ({document}) => document?.route !== '/tests-passed',
      description: 'Photos shown above the Tests Passed records.',
      of: [{type: 'image', options: {hotspot: true}, fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ]}],
    }),
    defineField({
      name: 'content', title: 'Additional page content', type: 'array',
      description: 'Add text, headings, images, PDFs, or embeds. This content appears on the page while its built-in features (such as event lists and forms) remain in place.',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}, fields: [
          defineField({name: 'alt', title: 'Alt text', type: 'string'}),
          defineField({name: 'caption', title: 'Caption', type: 'string'}),
        ]},
        {type: 'file', options: {accept: 'application/pdf'}, fields: [
          defineField({name: 'caption', title: 'Caption', type: 'string'}),
        ]},
        {type: 'embed'},
      ],
    }),
  ],
  preview: {
    select: {title: 'title', route: 'route'},
    prepare: ({title, route}) => ({
      title: title || (route ? routeTitles[route] : undefined) || 'Built-in website page',
      subtitle: route,
    }),
  },
})
