import {UsersIcon, DocumentIcon, CalendarIcon, CogIcon, UploadIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import ImportTestsPassedTool from './tools/importTestsPassed/ImportTestsPassedTool'
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
    .title('Edit website content')
    .items([
      S.listItem()
        .title('Pages')
        .id('pages')
        .icon(DocumentIcon)
        // All fixed site pages are immediately visible here; custom pages are
        // grouped in the same pane rather than hidden behind a second Pages menu.
        .child(S.list().title('Pages').id('website-pages').items([
          ...builtInPages.map((page) =>
            S.listItem().title(page.title).id(page.id).child(
              S.document()
                .schemaType('sitePage')
                .documentId(page.id)
                .initialValueTemplate('sitePageWithRoute', {route: page.route, title: page.title})
                .title(page.title)
            )
          ),
          S.divider(),
          S.listItem().title('Custom pages').id('other-pages').child(
            S.documentTypeList('page').title('Custom pages').apiVersion(apiVersion)
          ),
        ])),
      S.listItem()
        .title('Events')
        .id('events')
        .icon(CalendarIcon)
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
        .title('Membership categories & fees')
        .id('membershipCategories')
        .child(S.documentTypeList('membershipCategory').title('Membership categories & fees').apiVersion(apiVersion)),
      S.listItem()
        .title('People')
        .id('people')
        .icon(UsersIcon)
        .child(S.list().title('People').items([
          S.listItem().title('Board members').id('boardMembers').child(
            S.documentTypeList('boardMember').title('Board members').apiVersion(apiVersion)
          ),
          S.listItem().title('Coaches').id('coaches').child(
            S.documentTypeList('coach').title('Coaches').apiVersion(apiVersion)
          ),
        ])),
      S.listItem()
        .title('Tests Passed')
        .id('testPassed')
        .child(S.list().title('Tests Passed').items([
          S.listItem().title('All test records').id('all-records').child(
            S.documentTypeList('testPassed')
              .title('All test records')
              .defaultOrdering([{field: 'uploadedAt', direction: 'desc'}])
          ),
          ...[
            {title: 'Skating Skills', value: 'moves'},
            {title: 'Singles', value: 'freeskate'},
            {title: 'Dance', value: 'dance'},
          ].map(({title, value}) => S.listItem().title(title).child(
            S.documentTypeList('testPassed')
              .title(title)
              .filter(`_type == "testPassed" && testType == "${value}"`)
              .apiVersion(apiVersion)
              .defaultOrdering([{field: 'uploadedAt', direction: 'desc'}])
          )),
          S.divider(),
          S.listItem()
            .title('Upload a spreadsheet')
            .id('upload-spreadsheet')
            .icon(UploadIcon)
            .child(S.component(ImportTestsPassedTool).title('Upload test results')),
        ])),
      S.listItem()
        .title('Home page slides')
        .id('heroSlides')
        .child(S.documentTypeList('heroSlide').title('Home page slides').apiVersion(apiVersion)),
      S.listItem()
        .title('Website settings')
        .id('websiteSettings')
        .icon(CogIcon)
        .child(S.list().title('Website settings').items([
          S.listItem().title('Navigation menu').id('navigation').child(
            S.document().schemaType('navigation').documentId('navigation').title('Navigation menu')
          ),
          S.listItem().title('Contact, social links & analytics').id('siteSettings').child(
            S.document().schemaType('siteSettings').documentId('siteSettings').title('Contact, social links & analytics')
          ),
        ])),
    ])
