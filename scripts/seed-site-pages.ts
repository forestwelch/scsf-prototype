import {createClient} from '@sanity/client'
import {eventsPageDefaults, membershipPageDefaults} from '../lib/membership-page-defaults'

const pages = [
  {title: 'Home', route: '/', id: 'site-page-home'},
  {title: 'About', route: '/about', id: 'site-page-about'},
  {title: 'Membership', route: '/membership', id: 'site-page-membership', defaults: membershipPageDefaults},
  {title: 'Programs', route: '/programs', id: 'site-page-programs'},
  {title: 'Events', route: '/events', id: 'site-page-events', defaults: eventsPageDefaults},
  {title: 'Resources', route: '/resources', id: 'site-page-resources'},
  {title: 'Tests Passed', route: '/tests-passed', id: 'site-page-tests-passed'},
  {title: 'Announcements', route: '/announcements', id: 'site-page-announcements'},
  {title: 'FAQs', route: '/faqs', id: 'site-page-faqs'},
  {title: 'Donate', route: '/donate', id: 'site-page-donate'},
  {title: 'Contact', route: '/contact', id: 'site-page-contact'},
  {title: 'SCSF Coaches', route: '/scsf-coaches', id: 'site-page-scsf-coaches'},
  {title: 'Newsletter Archive', route: '/the-inside-edge-newsletter-archive', id: 'site-page-newsletter-archive'},
]

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2026-01-14',
  useCdn: false,
})

async function main() {
  if (!client.config().token) throw new Error('SANITY_TOKEN is required.')
  const apply = process.argv.includes('--apply')

  let created = 0
  let alreadyPresent = 0

  for (const page of pages) {
    const {id} = page
    const documents = await client.fetch<Array<{_id: string}>>(
      '*[_id == $id || _id == $draftId || sanity::versionOf($id)]{_id}',
      {id, draftId: `drafts.${id}`},
      {perspective: 'raw'},
    )
    if (documents.some((document) => document._id === id)) {
      alreadyPresent++
      console.log(`Keep existing ${page.title} (${id})`)
      continue
    }

    if (documents.some((document) => document._id.startsWith('versions.'))) {
      alreadyPresent++
      console.log(`Skip ${page.title} (${id}): a release version exists without a published baseline`)
      continue
    }

    const document = {
      _id: id,
      _type: 'sitePage',
      title: page.title,
      route: page.route,
      ...page.defaults,
    }

    if (apply) {
      await client.createIfNotExists(document)
      console.log(`Created published baseline for ${page.title} (${id})`)
    } else {
      const draftExists = documents.some((existing) => existing._id === `drafts.${id}`)
      console.log(`Would create published baseline for ${page.title} (${id})${draftExists ? ', preserving its existing draft' : ''}`)
    }
    created++
  }

  console.log(`${apply ? 'Created published baselines' : 'Would create published baselines'}: ${created}; skipped: ${alreadyPresent}.`)
  if (!apply) console.log('Preview only. Re-run with --apply to create missing page baselines. Existing published pages are never overwritten.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
