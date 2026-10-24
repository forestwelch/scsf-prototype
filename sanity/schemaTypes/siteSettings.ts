import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type should exist
  // @ts-expect-error — __experimental_actions is valid Sanity API but not in current TS types
  __experimental_actions: ["update", "publish"],
  fieldsets: [
    {name: "organization", title: "Organization & Contact", options: {collapsible: true, collapsed: false}},
    {name: "social", title: "Social Media", options: {collapsible: true, collapsed: true}},
    {name: "membershipPage", title: "Legacy Membership Page Copy (use Pages → Membership)", options: {collapsible: true, collapsed: true}},
    {name: "eventsPage", title: "Legacy Events Page Copy (use Pages → Events)", options: {collapsible: true, collapsed: true}},
    {name: "announcementsPage", title: "Legacy Announcements Page Copy (use Pages → Announcements)", options: {collapsible: true, collapsed: true}},
    {name: "testsPassedPage", title: "Legacy Tests Passed Photos (use Pages → Tests Passed)", options: {collapsible: true, collapsed: true}},
    {name: "analytics", title: "Analytics", options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // --- Org identity ---
    defineField({ name: "orgName", title: "Organization Name", type: "string", fieldset: "organization" }),

    // --- Mailing address ---
    defineField({ name: "poBox", title: "PO Box Line", type: "string", fieldset: "organization", description: 'e.g. "P.O. BOX 320457"' }),
    defineField({ name: "mailingCityStateZip", title: "Mailing City, State ZIP", type: "string", fieldset: "organization", description: 'e.g. "San Francisco, CA 94132"' }),

    // --- Home rink ---
    defineField({ name: "venueName", title: "Venue Name", type: "string", fieldset: "organization" }),
    defineField({ name: "venueStreet", title: "Venue Street Address", type: "string", fieldset: "organization" }),
    defineField({ name: "venueCityStateZip", title: "Venue City, State ZIP", type: "string", fieldset: "organization" }),
    defineField({ name: "venuePhone", title: "Venue Phone", type: "string", fieldset: "organization" }),
    defineField({
      name: "webmasterEmail",
      title: "Website Contact Email",
      type: "string",
      fieldset: "organization",
      description: "Shown in the site footer. Example: webmaster@scsf.org.",
    }),

    // --- Social ---
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url", fieldset: "social" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", fieldset: "social" }),

    // --- Page copy that should be editable by board members ---
    defineField({
      name: "membershipPageTitle",
      title: "Page Heading",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipPageIntro",
      title: "Intro below Membership heading",
      type: "text",
      rows: 3,
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipRenewalTitle",
      title: "Renewal Section Heading",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipRenewalParagraphs",
      title: "Renewal Section Paragraphs",
      type: "array",
      fieldset: "membershipPage",
      of: [{type: "text", rows: 3}],
      description: "One paragraph per item. Leave empty to use the current site copy.",
    }),
    defineField({
      name: "membershipRenewalChecklist",
      title: "Renewal Checklist",
      type: "array",
      fieldset: "membershipPage",
      of: [{type: "string"}],
      description: "One checklist item per line. Leave empty to use the current site copy.",
    }),
    defineField({
      name: "membershipCategoriesIntro",
      title: "Membership Categories Intro",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipCategoriesTitle",
      title: "Membership Categories Heading",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipTransferNotice",
      title: "Transfer Fee Notice",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipQuestionHeading",
      title: "Questions Section Heading",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipQuestionText",
      title: "Questions Section Text",
      type: "string",
      fieldset: "membershipPage",
      description: "Leave blank to use the current site copy.",
    }),
    defineField({
      name: "membershipInfoSections",
      title: "Volunteer, Conduct & Safety Sections",
      type: "array",
      fieldset: "membershipPage",
      of: [{
        type: "object",
        fields: [
          defineField({name: "title", title: "Section Heading", type: "string", validation: (Rule) => Rule.required()}),
          defineField({name: "text", title: "Section Text", type: "text", rows: 3}),
          defineField({name: "linkLabel", title: "Link Label", type: "string"}),
          defineField({name: "linkUrl", title: "Link URL", type: "string", description: 'Internal path such as "/volunteer-commitment" or a full URL.'}),
        ],
        preview: {select: {title: "title", subtitle: "linkLabel"}},
      }],
      description: "One item per card. Leave empty to use the current three cards.",
    }),

    defineField({name: "eventsPageTitle", title: "Page Heading", type: "string", fieldset: "eventsPage", description: "Leave blank to use the current site copy."}),
    defineField({name: "eventsPageIntro", title: "Intro Text", type: "text", rows: 3, fieldset: "eventsPage", description: "Leave blank to use the current site copy."}),

    defineField({name: "announcementsPageTitle", title: "Page Heading", type: "string", fieldset: "announcementsPage", description: "Leave blank to use the current site copy."}),
    defineField({name: "announcementsPageIntro", title: "Intro Text", type: "text", rows: 3, fieldset: "announcementsPage", description: "Leave blank to use the current site copy."}),
    defineField({
      name: "announcementsShowNewsletterSignup",
      title: "Show Newsletter Signup",
      type: "boolean",
      fieldset: "announcementsPage",
      initialValue: false,
      description: "Show the Zeffy newsletter signup form on the Announcements page. Set its URL under Zeffy Newsletter Signup Embed URL below.",
    }),
    defineField({
      name: "announcementsShowInstagram",
      title: "Show Instagram Link",
      type: "boolean",
      fieldset: "announcementsPage",
      initialValue: false,
      description: "Show the Instagram URL above. Use the club's official profile URL in Social Media; the old setting points to a hashtag page.",
    }),

    defineField({
      name: "testsPassedPhotos",
      title: "Photos above the test records",
      type: "array",
      fieldset: "testsPassedPage",
      of: [{
        type: "image",
        options: {hotspot: true},
        fields: [
          defineField({name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required()}),
          defineField({name: "caption", title: "Caption", type: "string"}),
        ],
      }],
      description: "Upload or remove the photos shown between the page intro and the test filters.",
    }),

    defineField({
      name: "googleAnalyticsId",
      title: "Google Analytics 4 Measurement ID",
      type: "string",
      fieldset: "analytics",
      description: "Optional. Format: G-XXXXXXXXXX. Leave blank until the club provides its GA4 ID.",
      validation: (Rule) => Rule.regex(/^G-[A-Z0-9]+$/).warning("Expected a Google Analytics 4 ID in the format G-XXXXXXXXXX."),
    }),

    // These fields already contain the live Zeffy URLs in the production
    // singleton. Keep them in the schema so editors can update them in Studio.
    defineField({
      name: "zeffyDonateUrl",
      title: "Zeffy Donate Form Embed URL",
      type: "url",
      description: "The iframe src URL used by the Donate page.",
    }),
    defineField({
      name: "zeffyNewsletterUrl",
      title: "Zeffy Newsletter Signup Embed URL",
      type: "url",
      description: "The iframe src URL used by the newsletter archive page.",
    }),

    // --- Embeds / external tools ---
    defineField({
      name: "embeds",
      title: "Embeds",
      type: "array",
      description:
        'Optional named embeds for code-defined site slots. The dedicated Zeffy fields above are the usual controls for the Donate and newsletter forms; only add a slot override if a developer asks. For a form inside regular page content, use an "Embed" block in that page instead.',
      of: [{ type: "embed" }],
    }),
    defineField({
      name: "mailchimpArchiveUrl",
      title: "Mailchimp Archive URL",
      type: "url",
      description: "Link to the full Mailchimp newsletter archive page",
    }),
    defineField({
      name: "currentNewsletterUrl",
      title: "Current Newsletter HTML URL",
      type: "url",
      description: "Vercel Blob URL for the current issue HTML file",
    }),
    defineField({
      name: "currentNewsletterLabel",
      title: "Current Newsletter Issue Label",
      type: "string",
      description: 'e.g. "Spring 2026"',
    }),
    defineField({ name: "entryEezeUrl", title: "EntryEeze URL", type: "url" }),
    defineField({ name: "emsUrl", title: "EMS Registration URL", type: "url" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
