import Container from '@/components/Container';

export const metadata = {
  title: 'The Inside Edge Quarterly Newsletter | Skating Club of San Francisco',
  description: 'Subscribe to The Inside Edge and browse archived editions of the SCSF quarterly newsletter.',
};

export default function NewsletterArchivePage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Inside Edge</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            The quarterly newsletter of the Skating Club of San Francisco.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Zeffy signup */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-bold text-brand-charcoal mb-3">Subscribe</h2>
              <iframe
                title="Signup form powered by Zeffy"
                src="https://www.zeffy.com/en-US/embed/newsletter-form/sign-up-for-updates-from-the-inside-edge"
                style={{ width: '100%', height: '340px', border: 0 }}
                // @ts-expect-error — allowTransparency valid attr not in React types
                allowTransparency="true"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-brand-charcoal mb-3">Archive</h2>
              <p className="text-sm text-gray-600 mb-4">
                Browse all past editions of The Inside Edge on Mailchimp.
              </p>
              <a
                href="https://us5.campaign-archive.com/home/?u=fc9518edb46da79820c912377&id=7aded53f93"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-royal-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-sky-blue transition-colors"
              >
                The Inside Edge Editions →
              </a>
            </div>
          </div>

          {/* Right: Current issue */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-brand-charcoal mb-3">Current Issue — Spring 2026</h2>
              <iframe
                src="https://gvxwlqyeqlq01lkb.public.blob.vercel-storage.com/uploads/inside-edge-spring-2026.html"
                title="Inside Edge Spring 2026"
                style={{ width: '100%', height: '700px', border: 0 }}
              />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
