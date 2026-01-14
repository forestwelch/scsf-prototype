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
          { title: "Moves in the Field", value: "moves" },
          { title: "Free Skate", value: "freeskate" },
          { title: "Dance", value: "dance" },
          { title: "Pairs", value: "pairs" },
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
      title: "Date Passed",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "skaterName",
      test: "testType",
      level: "testLevel",
    },
    prepare(selection) {
      const { name, test, level } = selection;
      return {
        title: name,
        subtitle: `${test} - ${level}`,
      };
    },
  },
});
