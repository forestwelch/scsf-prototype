import Container from '@/components/Container'
import {getSitePage} from '@/lib/sanity.queries'

export default async function SitePageHeader({
  route,
  fallbackTitle,
  fallbackDescription,
  children,
}: {
  route: string
  fallbackTitle: string
  fallbackDescription?: string
  children?: React.ReactNode
}) {
  const page = await getSitePage(route)
  return (
    <div className="bg-brand-royal-blue text-white py-16">
      <Container>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{page?.title || fallbackTitle}</h1>
        {(page?.description || fallbackDescription) && (
          <p className="text-xl text-white/80 max-w-2xl">{page?.description || fallbackDescription}</p>
        )}
        {children}
      </Container>
    </div>
  )
}
