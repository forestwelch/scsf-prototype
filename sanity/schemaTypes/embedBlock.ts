import { defineField, defineType } from "sanity";

// A generic iframe embed block usable inside any portable-text content field
// (Pages, Announcements, Events). This is what makes new embeds — a new
// Zeffy form, a Google Form, a YouTube video, etc. — fully self-serve: no
// developer needs to add a new field to the schema for each one. Editors
// just drop an "Embed" block into the page content and paste a URL.
//
// Deliberately URL-only (not a raw HTML/script paste field): a URL can only
// ever load that one specific page inside an iframe. A raw-HTML field would
// let anyone who can edit content run arbitrary script on the live site,
// which is a much bigger risk for a field editors will use often.
export default defineType({
  name: "embed",
  title: "Embed",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label (for your reference only, not shown on the page)",
      type: "string",
      description: 'e.g. "Zeffy Gala Ticket Form" — helps you find this in the content list later. Not displayed publicly.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Embed URL",
      type: "url",
      description:
        "The iframe src URL from the embed code the other site (Zeffy, Google Forms, YouTube, etc.) gave you — not the whole <iframe> snippet, just the URL inside src=\"...\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "height",
      title: "Height (pixels)",
      type: "number",
      initialValue: 800,
      description: "How tall the embed should display. Adjust if content is cut off or there's extra empty space.",
    }),
    defineField({
      name: "key",
      title: "Site slot (advanced, usually leave blank)",
      type: "string",
      description:
        'Only fill this in if a developer told you to — it plugs this embed into one specific fixed spot on the site (e.g. "donate-form" fills the donation form on the Donate page). Embeds you drop into regular page content don\'t need this.',
    }),
  ],
  preview: {
    select: { title: "label", url: "url", key: "key" },
    prepare({ title, url, key }) {
      return { title: title || "Embed", subtitle: key ? `[${key}] ${url}` : url };
    },
  },
});
