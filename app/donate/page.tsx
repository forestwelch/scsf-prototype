import Container from '@/components/Container';
import { getSiteSettings } from '@/lib/sanity.queries';

export const metadata = {
  title: 'Donate | Skating Club of San Francisco',
  description: 'Support SCSF skaters with a donation. Every dollar helps our athletes compete, train, and grow.',
};

export default async function DonatePage() {
  const settings = await getSiteSettings();
  const donateUrl = settings.zeffyDonateUrl
    ?? 'https://www.zeffy.com/embed/donation-form/donate-to-support-our-club-athletes';

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Skaters</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your donation goes directly to supporting SCSF athletes through programs,
            competitions, and club initiatives.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 max-w-3xl">
          <strong>Note about Zeffy&apos;s tip option:</strong> Zeffy is a 100% free platform for nonprofits —
          we receive 100% of your donation with no transaction fees. At checkout Zeffy suggests a
          voluntary &ldquo;Help Keep Zeffy Free&rdquo; tip that goes to them, not to SCSF. You are free to
          adjust or remove it before completing your transaction.
        </div>

        <div className="rounded-lg overflow-hidden shadow-sm" style={{ height: '700px' }}>
          <iframe
            title="Donation form powered by Zeffy"
            src={donateUrl}
            style={{ position: 'relative', border: 0, width: '100%', height: '100%' }}
            allowPaymentRequest
            // @ts-expect-error — allowTransparency is a valid iframe attr not in React types
            allowTransparency="true"
          />
        </div>
      </Container>
    </div>
  );
}
