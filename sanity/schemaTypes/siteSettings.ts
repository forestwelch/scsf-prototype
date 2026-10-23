import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type should exist
  // @ts-expect-error — __experimental_actions is valid Sanity API but not in current TS types
  __experimental_actions: ["update", "publish"],
  fields: [
    // --- Org identity ---
    defineField({ name: "orgName", title: "Organization Name", type: "string" }),

    // --- Mailing address ---
    defineField({ name: "poBox", title: "PO Box Line", type: "string", description: 'e.g. "P.O. BOX 320457"' }),
    defineField({ name: "mailingCityStateZip", title: "Mailing City, State ZIP", type: "string", description: 'e.g. "San Francisco, CA 94132"' }),

    // --- Home rink ---
    defineField({ name: "venueName", title: "Venue Name", type: "string" }),
    defineField({ name: "venueStreet", title: "Venue Street Address", type: "string" }),
    defineField({ name: "venueCityStateZip", title: "Venue City, State ZIP", type: "string" }),
    defineField({ name: "venuePhone", title: "Venue Phone", type: "string" }),

    // --- Social ---
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),

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
