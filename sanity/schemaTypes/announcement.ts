import { defineField, defineType } from "sanity";

export default defineType({
  name: "announcement",
  title: "Announcements",
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: 'Click "+" below the text to add a paragraph, heading, or inline image.',
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Webmaster",
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description: "Archived posts are hidden from the public announcements page.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
    },
    prepare(selection) {
      const { title, date } = selection;
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : "No date",
      };
    },
  },
});
