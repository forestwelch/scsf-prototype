import Link from 'next/link';
import Container from '@/components/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-off-white flex items-center">
      <Container className="py-24 text-center">
        <div className="text-brand-royal-blue text-9xl font-bold opacity-10 select-none mb-0 leading-none">
          404
        </div>
        <div className="-mt-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
            Page not found
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            We couldn't find that page. It may have moved, or you may have followed an outdated link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-brand-royal-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/announcements"
              className="border-2 border-brand-royal-blue text-brand-royal-blue px-8 py-3 rounded-md font-semibold hover:bg-brand-royal-blue hover:text-white transition-colors"
            >
              News &amp; Announcements
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            {[
              ['Programs', '/programs'],
              ['Membership', '/membership'],
              ['Tests Passed', '/tests-passed'],
              ['Events', '/events'],
              ['FAQs', '/faqs'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-brand-bridge-orange hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
