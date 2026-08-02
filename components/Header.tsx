import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import HeaderNav from './HeaderNav';
import { getNavigation } from '@/lib/sanity.queries';

// Fallback used only if the "Navigation" document in Sanity is empty or
// unreachable, so the site never ships with a blank navbar.
const FALLBACK_NAV = [
  { label: 'News', linkType: 'custom' as const, customPath: '/announcements' },
  { label: 'Programs', linkType: 'custom' as const, customPath: '/programs' },
  { label: 'Membership', linkType: 'custom' as const, customPath: '/membership' },
  { label: 'Tests', linkType: 'custom' as const, customPath: '/tests-passed' },
  { label: 'About', linkType: 'custom' as const, customPath: '/about' },
  { label: 'Contact', linkType: 'custom' as const, customPath: '/contact' },
  { label: 'Donate', linkType: 'custom' as const, customPath: '/donate', highlightButton: true },
];

export default async function Header() {
  const items = await getNavigation();
  const navItems = items.length > 0 ? items : FALLBACK_NAV;

  return (
    <header className="sticky top-0 z-50 bg-brand-royal-blue text-white shadow-md">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="SCSF Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg hidden sm:block leading-tight">
              Skating Club of<br />
              <span className="text-brand-golden-yellow">San Francisco</span>
            </span>
          </Link>

          <HeaderNav items={navItems} />
        </div>
      </Container>
    </header>
  );
}
