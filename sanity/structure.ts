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
      S.listItem()
        .title('Tests Passed')
        .id('testPassed')
        .child(
          S.list()
            .title('Tests Passed')
            .items([
              S.listItem()
                .title('All (recently uploaded first)')
                .child(
                  S.documentTypeList('testPassed')
                    .title('All Tests Passed')
                    .defaultOrdering([{field: 'uploadedAt', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('Skating Skills')
                .child(
                  S.documentTypeList('testPassed')
                    .title('Skating Skills')
                    .filter('_type == "testPassed" && testType == "moves"')
                ),
              S.listItem()
                .title('Singles')
                .child(
                  S.documentTypeList('testPassed')
                    .title('Singles')
                    .filter('_type == "testPassed" && testType == "freeskate"')
                ),
              S.listItem()
                .title('Dance')
                .child(
                  S.documentTypeList('testPassed')
                    .title('Dance')
                    .filter('_type == "testPassed" && testType == "dance"')
                ),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (item) => !['navigation', 'siteSettings', 'testPassed'].includes(item.getId() ?? '')
      ),
    ])
