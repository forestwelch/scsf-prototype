import Container from '@/components/Container'
import PortableText from '@/components/PortableText'
import {getSitePage} from '@/lib/sanity.queries'

/** Optional editor-added content appended to a built-in page's functional sections. */
export default async function SitePageContent({route}: {route: string}) {
  const page = await getSitePage(route)
  if (!page?.content?.length) return null
  return (
    <Container className="py-10 md:py-14">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <PortableText value={page.content} />
      </div>
    </Container>
  )
}
