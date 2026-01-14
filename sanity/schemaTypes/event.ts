import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Events",
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
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Annual Gala", value: "gala" },
          { title: "Competition (Skate SF)", value: "competition" },
          { title: "Test Session", value: "testSession" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "ticketLink",
      title: "Ticket/Registration Link",
      type: "url",
    }),
    defineField({
      name: "isFeatured",
      title: "Feature on Homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      eventType: "eventType",
      date: "startDate",
    },
    prepare(selection) {
      const { title, eventType, date } = selection;
      return {
        title,
        subtitle: `${eventType} - ${date ? new Date(date).toLocaleDateString() : "No date"}`,
      };
    },
  },
});
