import { defineField, defineType } from "sanity";

export default defineType({
  name: "testPassed",
  title: "Tests Passed",
  type: "document",
  fields: [
    defineField({
      name: "skaterName",
      title: "Skater Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testType",
      title: "Test Type",
      type: "string",
      options: {
        list: [
          { title: "Skating Skills", value: "moves" },
          { title: "Singles", value: "freeskate" },
          { title: "Dance", value: "dance" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testLevel",
      title: "Test Level",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "passedDate",
      title: "Test Session (Month/Year)",
      type: "string",
      description: 'The month and year the test was passed — no day. Format: YYYY-MM, e.g. "2026-06".',
      validation: (Rule) =>
        Rule.required().regex(/^\d{4}-\d{2}$/, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "uploadedAt",
      title: "Uploaded",
      type: "datetime",
      description: "When this record was imported/created. Autofilled — separate from the Test Session date above, which is the date the test was actually passed.",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "distinction",
      title: "Distinction",
      type: "string",
      description:
        "Matches the club's test-passed table legend: * = With Honors, ** = With Distinction.",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "With Honors (*)", value: "honors" },
          { title: "With Distinction (**)", value: "distinction" },
        ],
        layout: "radio",
      },
      initialValue: "none",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Recently uploaded",
      name: "uploadedAtDesc",
      by: [{ field: "uploadedAt", direction: "desc" }],
    },
    {
      title: "Test session, newest first",
      name: "passedDateDesc",
      by: [{ field: "passedDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "skaterName",
      test: "testType",
      level: "testLevel",
      distinction: "distinction",
      passedDate: "passedDate",
      uploadedAt: "uploadedAt",
    },
    prepare(selection) {
      const { name, test, level, distinction, passedDate, uploadedAt } = selection;
      const mark = distinction === "distinction" ? " **" : distinction === "honors" ? " *" : "";
      const uploaded = uploadedAt
        ? new Date(uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "unknown";
      return {
        title: `${name}${mark}`,
        subtitle: `${test} - ${level} (${passedDate}) - uploaded ${uploaded}`,
      };
    },
  },
});
