import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import PortableText from '@/components/PortableText';
import { getPageBySlug, getAllPages } from '@/lib/sanity.queries';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: 'Page Not Found | SCSF' };
  return {
    title: `${page.title} | Skating Club of San Francisco`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-12">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        <div className="max-w-3xl">
          {page.content && page.content.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none
                            prose-headings:text-brand-charcoal prose-headings:font-bold
                            prose-a:text-brand-bridge-orange prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-brand-charcoal">
              <PortableText value={page.content} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-gray-500 text-center">
              Content coming soon.
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/"
              className="text-brand-bridge-orange hover:underline text-sm inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
