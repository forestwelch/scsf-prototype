import {redirect} from 'next/navigation'
import {client} from '@/sanity/lib/client'

const builtInPages: Record<string, string> = {
  '/': 'site-page-home',
  '/home': 'site-page-home',
  '/about': 'site-page-about',
  '/membership': 'site-page-membership',
  '/programs': 'site-page-programs',
  '/events': 'site-page-events',
  '/resources': 'site-page-resources',
  '/tests-passed': 'site-page-tests-passed',
  '/announcements': 'site-page-announcements',
  '/faqs': 'site-page-faqs',
  '/donate': 'site-page-donate',
  '/contact': 'site-page-contact',
  '/scsf-coaches': 'site-page-scsf-coaches',
  '/the-inside-edge-newsletter-archive': 'site-page-newsletter-archive',
}

export default async function EditPageShortcut({searchParams}: {searchParams: Promise<{path?: string}>}) {
  const {path: rawPath = '/'} = await searchParams
  const path = `/${rawPath.split('/').filter(Boolean).join('/')}`
  const route = path === '/' ? '/' : path.replace(/\/$/, '')

  if (route.length > 180 || route.includes('..')) redirect('/studio/manage-pages')

  const builtInId = builtInPages[route]
  if (builtInId) {
    const exists = await client.fetch<boolean>(`defined(*[_type == "sitePage" && _id == $id][0]._id)`, {id: builtInId})
    if (!exists) redirect(`/studio/structure/pages;website-pages;${builtInId}`)
    redirect(`/studio/intent/edit/id=${builtInId};type=sitePage`)
  }

  const slug = route.split('/').filter(Boolean).at(-1)
  if (slug && route.startsWith('/events/')) {
    const event = await client.fetch<{_id: string} | null>(`*[_type == "event" && slug.current == $slug][0]{_id}`, {slug})
    if (event?._id) redirect(`/studio/intent/edit/id=${event._id};type=event`)
  }
  if (slug && route.startsWith('/announcements/')) {
    const announcement = await client.fetch<{_id: string} | null>(`*[_type == "announcement" && slug.current == $slug][0]{_id}`, {slug})
    if (announcement?._id) redirect(`/studio/intent/edit/id=${announcement._id};type=announcement`)
  }
  if (slug) {
    const page = await client.fetch<{_id: string} | null>(
      `*[_type == "page" && slug.current == $slug][0]{_id}`,
      {slug},
    )
    if (page?._id) redirect(`/studio/intent/edit/id=${page._id};type=page`)
  }

  redirect('/studio/manage-pages')
}
