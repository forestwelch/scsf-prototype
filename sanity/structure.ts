import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
//
// Navigation and Site Settings are singletons (only one document each) that
// control site-wide things editors need often, so they're pinned to the top
// of the sidebar instead of being buried in the generic document-type list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(
          S.document()
            .schemaType('navigation')
            .documentId('navigation')
            .title('Navigation')
        ),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['navigation', 'siteSettings'].includes(item.getId() ?? '')
      ),
    ])
