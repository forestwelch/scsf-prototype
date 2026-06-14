import { defineField, defineType } from "sanity";

export default defineType({
  name: "membershipCategory",
  title: "Membership Categories",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: 'e.g. "$135"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "ageGroup",
      title: "Age / Eligibility",
      type: "string",
      description: 'e.g. "18 and over" or "Under 18"',
    }),
    defineField({
      name: "highlight",
      title: "Highlight (featured tier)",
      type: "boolean",
      initialValue: false,
      description: "Shown with a blue accent card",
    }),
    defineField({
      name: "features",
      title: "Features / Benefits",
      type: "array",
      of: [{ type: "string" }],
      description: "One benefit per line",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
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
    select: { title: "name", subtitle: "price" },
  },
});
