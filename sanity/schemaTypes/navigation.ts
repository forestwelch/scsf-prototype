import { defineField, defineType, defineArrayMember } from "sanity";

// Shared link fields used by both top-level items and dropdown children.
// linkType "page" auto-builds the href from a Sanity page's slug — pick this
// whenever the destination is a page created in Sanity.
// linkType "custom" lets you type any path or URL by hand — use this for
// hardcoded site sections that aren't Sanity pages (e.g. "/membership#join"),
// or for links to other websites (e.g. "https://www.usfsaonline.org/").
const linkFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "string",
    description: "The text shown in the menu.",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "linkType",
    title: "Link Type",
    type: "string",
    options: {
      list: [
        { title: "Sanity Page", value: "page" },
        { title: "Custom Path / External URL", value: "custom" },
      ],
      layout: "radio",
    },
    initialValue: "custom",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "page",
    title: "Page",
    type: "reference",
    to: [{ type: "page" }],
    hidden: ({ parent }) => parent?.linkType !== "page",
  }),
  defineField({
    name: "customPath",
    title: "Custom Path or URL",
    type: "string",
    description:
      'Internal path starting with "/" (e.g. "/membership#join") or a full external URL (e.g. "https://www.usfsaonline.org/").',
    hidden: ({ parent }) => parent?.linkType !== "custom",
  }),
  defineField({
    name: "openInNewTab",
    title: "Open in New Tab",
    type: "boolean",
    initialValue: false,
    description: "Turn this on for links to other websites.",
  }),
];

const navChild = defineType({
  name: "navChild",
  title: "Dropdown Link",
  type: "object",
  fields: linkFields,
  preview: {
    select: { title: "label", customPath: "customPath", pageTitle: "page.title" },
    prepare({ title, customPath, pageTitle }) {
      return { title, subtitle: pageTitle ? `→ ${pageTitle}` : customPath };
    },
  },
});

const navItem = defineType({
  name: "navItem",
  title: "Nav Item",
  type: "object",
  fields: [
    ...linkFields,
    defineField({
      name: "children",
      title: "Dropdown Items",
      description:
        "Optional. If you add items here, this becomes a dropdown menu on hover/tap. Leave empty for a plain link.",
      type: "array",
      of: [defineArrayMember({ type: "navChild" })],
    }),
    defineField({
      name: "highlightButton",
      title: "Show as Highlighted Button",
      type: "boolean",
      initialValue: false,
      description:
        'Turn this on to style this item as a solid button (used for "Donate") instead of a plain text link.',
    }),
  ],
  preview: {
    select: { title: "label", customPath: "customPath", pageTitle: "page.title", children: "children" },
    prepare({ title, customPath, pageTitle, children }) {
      const count = children?.length ?? 0;
      return {
        title,
        subtitle: `${pageTitle ? `→ ${pageTitle}` : customPath ?? ""}${count ? `  ·  ${count} dropdown item${count === 1 ? "" : "s"}` : ""}`,
      };
    },
  },
});

const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  // Singleton — only one document of this type should exist
  // @ts-expect-error — __experimental_actions is valid Sanity API but not in current TS types
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "items",
      title: "Menu Items",
      description:
        "This is the club's main navigation bar, top to bottom = left to right. Drag items by the handle on the left to reorder. Click '+ Add item' to create a new one, or the trash icon to remove one.",
      type: "array",
      of: [defineArrayMember({ type: "navItem" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});

export { navChild, navItem };
export default navigation;
