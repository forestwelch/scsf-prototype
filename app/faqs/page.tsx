import Container from '@/components/Container';
import { getAllFaqs } from '@/lib/sanity.queries';
import FAQList from './FAQList';

export const metadata = {
  title: 'Frequently Asked Questions | Skating Club of San Francisco',
  description: 'Quick answers to common questions about SCSF membership, testing, competitions, and more.',
};

export default async function FAQsPage() {
  const faqs = await getAllFaqs();

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Quick answers to common questions about SCSF membership, testing, competitions, and more.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16 max-w-4xl">
        {faqs.length === 0 ? (
          <p className="text-gray-500 text-center py-12">FAQs coming soon.</p>
        ) : (
          <FAQList faqs={faqs} />
        )}

        <div className="mt-12 bg-brand-royal-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-white/80 mb-6">Reach out to the club — we&apos;re happy to help.</p>
          <a
            href="mailto:info@scsf.org"
            className="inline-block bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
          >
            Contact the Club
          </a>
        </div>
      </Container>
    </div>
  );
}
