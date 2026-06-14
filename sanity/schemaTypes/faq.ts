import { defineField, defineType } from "sanity";

const FAQ_CATEGORIES = [
  "Membership",
  "Testing",
  "Competitions",
  "Ice Time & Rink",
  "Teams & Programs",
  "General",
];

export default defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: FAQ_CATEGORIES.map((c) => ({ title: c, value: c })),
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "order",
      title: "Order within category",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      name: "categoryOrder",
      title: "Category + Order",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
