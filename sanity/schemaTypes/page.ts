import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description:
        'Click the "+" below the text to add a paragraph, heading, image, or embed. To add an image: click "+", choose "Image", then drag a file in or click to upload — then drag the block up/down to position it. To embed something (a Zeffy form, Google Form, YouTube video, etc.): click "+", choose "Embed", paste the URL.',
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for screen readers/SEO — e.g. \"SCSF Ice Theatre team performing at the 2025 gala.\"",
            }),
            defineField({
              name: "caption",
              title: "Caption (optional)",
              type: "string",
              description: "Shown below the image on the page, if filled in.",
            }),
          ],
        },
        { type: "embed" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare(selection) {
      const { title, slug } = selection;
      return {
        title,
        subtitle: `/${slug}`,
      };
    },
  },
});
