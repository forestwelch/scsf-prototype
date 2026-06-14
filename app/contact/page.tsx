import Container from '@/components/Container';
import { getSiteSettings } from '@/lib/sanity.queries';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us | Skating Club of San Francisco',
  description: 'Have a question? Reach out to the SCSF board or find us at Yerba Buena.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const poBox    = settings.poBox            ?? 'P.O. Box 320457';
  const mailCity = settings.mailingCityStateZip ?? 'San Francisco, CA 94132';
  const venue    = settings.venueName        ?? 'Yerba Buena Ice Skating & Bowling Center';
  const vStreet  = settings.venueStreet      ?? '750 Folsom St.';
  const vCity    = settings.venueCityStateZip ?? 'San Francisco, CA 94107';
  const vPhone   = settings.venuePhone       ?? '(415) 820-3521';
  const fbUrl    = settings.facebookUrl      ?? 'https://www.facebook.com/scsf.org/';
  const igUrl    = settings.instagramUrl     ?? 'https://www.instagram.com/explore/tags/skatingclubofsanfrancisco/';

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Have a question? Reach out to the SCSF board or find us at Yerba Buena.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact form (client component for form state) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Mailing Address</h3>
              <address className="not-italic text-gray-700 text-sm space-y-1">
                <p className="font-semibold">The Skating Club of San Francisco, Inc.</p>
                <p>{poBox}</p>
                <p>{mailCity}</p>
              </address>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Home Rink</h3>
              <address className="not-italic text-gray-700 text-sm space-y-1">
                <p className="font-semibold">{venue}</p>
                <p>{vStreet}</p>
                <p>{vCity}</p>
                <p className="mt-2">
                  <a href={`tel:${vPhone.replace(/\D/g, '')}`} className="text-brand-bridge-orange hover:underline">
                    {vPhone}
                  </a>
                </p>
              </address>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Connect</h3>
              <div className="flex gap-4">
                <a href={fbUrl} target="_blank" rel="noopener noreferrer"
                  className="text-brand-royal-blue hover:text-brand-sky-blue transition-colors" aria-label="Facebook">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href={igUrl} target="_blank" rel="noopener noreferrer"
                  className="text-brand-royal-blue hover:text-brand-sky-blue transition-colors" aria-label="Instagram">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
