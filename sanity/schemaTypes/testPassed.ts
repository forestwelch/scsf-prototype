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
  preview: {
    select: {
      name: "skaterName",
      test: "testType",
      level: "testLevel",
      distinction: "distinction",
    },
    prepare(selection) {
      const { name, test, level, distinction } = selection;
      const mark = distinction === "distinction" ? " **" : distinction === "honors" ? " *" : "";
      return {
        title: `${name}${mark}`,
        subtitle: `${test} - ${level}`,
      };
    },
  },
});
