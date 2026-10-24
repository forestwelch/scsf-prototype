import type {StructureResolver} from 'sanity/structure'
import {apiVersion} from './env'

const builtInPages = [
  {title: 'Home', route: '/', id: 'site-page-home'},
  {title: 'About', route: '/about', id: 'site-page-about'},
  {title: 'Membership', route: '/membership', id: 'site-page-membership'},
  {title: 'Programs', route: '/programs', id: 'site-page-programs'},
  {title: 'Events', route: '/events', id: 'site-page-events'},
  {title: 'Resources', route: '/resources', id: 'site-page-resources'},
  {title: 'Tests Passed', route: '/tests-passed', id: 'site-page-tests-passed'},
  {title: 'Announcements', route: '/announcements', id: 'site-page-announcements'},
  {title: 'FAQs', route: '/faqs', id: 'site-page-faqs'},
  {title: 'Donate', route: '/donate', id: 'site-page-donate'},
  {title: 'Contact', route: '/contact', id: 'site-page-contact'},
  {title: 'SCSF Coaches', route: '/scsf-coaches', id: 'site-page-scsf-coaches'},
  {title: 'Newsletter Archive', route: '/the-inside-edge-newsletter-archive', id: 'site-page-newsletter-archive'},
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(S.list().title('Pages').items([
          S.listItem().title('Website pages').id('website-pages').child(
            S.list().title('Website pages').items(builtInPages.map((page) =>
              S.listItem().title(page.title).id(page.id).child(
                S.document()
                  .schemaType('sitePage')
                  .documentId(page.id)
                  .initialValueTemplate('sitePage', {route: page.route, title: page.title})
                  .title(page.title)
              )
            ))
          ),
          S.listItem().title('Other pages').id('other-pages').child(
            S.documentTypeList('page').title('Other pages').apiVersion(apiVersion)
          ),
        ])),
      S.listItem()
        .title('Events')
        .id('events')
        .child(S.documentTypeList('event').title('Events').apiVersion(apiVersion)),
      S.listItem()
        .title('Announcements')
        .id('announcements')
        .child(S.documentTypeList('announcement').title('Announcements').apiVersion(apiVersion)),
      S.listItem()
        .title('FAQs')
        .id('faqs')
        .child(S.documentTypeList('faq').title('FAQs').apiVersion(apiVersion)),
      S.listItem()
        .title('Membership Categories')
        .id('membershipCategories')
        .child(S.documentTypeList('membershipCategory').title('Membership Categories').apiVersion(apiVersion)),
      S.listItem()
        .title('Board Members')
        .id('boardMembers')
        .child(S.documentTypeList('boardMember').title('Board Members').apiVersion(apiVersion)),
      S.listItem()
        .title('Coaches')
        .id('coaches')
        .child(S.documentTypeList('coach').title('Coaches').apiVersion(apiVersion)),
      S.listItem()
        .title('Home page slides')
        .id('heroSlides')
        .child(S.documentTypeList('heroSlide').title('Home page slides').apiVersion(apiVersion)),
      S.listItem()
        .title('Tests Passed')
        .id('testPassed')
        .child(S.list().title('Tests Passed').items([
          S.listItem().title('All (recently uploaded first)').child(
            S.documentTypeList('testPassed').title('All Tests Passed').defaultOrdering([{field: 'uploadedAt', direction: 'desc'}])
          ),
          S.divider(),
          ...[
            {title: 'Skating Skills', value: 'moves'},
            {title: 'Singles', value: 'freeskate'},
            {title: 'Dance', value: 'dance'},
          ].map(({title, value}) => S.listItem().title(title).child(
            S.documentTypeList('testPassed').title(title).filter(`_type == "testPassed" && testType == "${value}"`).apiVersion(apiVersion)
          )),
        ])),
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('navigation').title('Navigation')),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
    ])
