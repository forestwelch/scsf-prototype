import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Hero Slides",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category Tag",
      type: "string",
      description: "Small label shown above the headline (e.g. 'Competition', 'Annual Gala')",
    }),
    defineField({
      name: "imageUrl",
      title: "Background Image URL",
      type: "url",
      description: "Vercel Blob or external URL. Use the blob CDN URL for images already uploaded.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Image Alt Text",
      type: "string",
    }),
    defineField({
      name: "ctaLabel",
      title: "Primary CTA Label",
      type: "string",
      description: 'e.g. "Learn More"',
    }),
    defineField({
      name: "ctaHref",
      title: "Primary CTA Link",
      type: "string",
      description: 'Internal path (e.g. "/programs") or external URL',
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 99,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Uncheck to hide this slide without deleting it",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      name: "orderAsc",
      title: "Display Order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "headline", subtitle: "category" },
  },
});
