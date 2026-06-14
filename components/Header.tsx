'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';

type NavItem = {
  name: string;
  href: string;
  external?: boolean;
  children?: { name: string; href: string; external?: boolean }[];
};

const navigation: NavItem[] = [
  {
    name: 'News',
    href: '/announcements',
  },
  {
    name: 'Programs',
    href: '/programs',
    children: [
      { name: 'BSP Policy', href: '/bsp-policy' },
      { name: 'Coaches Support Policy', href: '/scsf-coaches-support-policy' },
      { name: 'Officials Support Program', href: '/officials-support-program' },
      { name: 'Grant Policy & Application', href: '/grant-policy' },
      { name: 'USFS Scholarships & Grants', href: '/usfs-scholarships-grants-and-awards' },
      { name: 'Graduating Seniors Program', href: '/graduating-seniors-program' },
    ],
  },
  {
    name: 'Membership',
    href: '/membership',
    children: [
      { name: 'Join or Renew', href: '/membership#join' },
      { name: 'Membership Categories', href: '/membership#categories' },
      { name: 'Volunteer Commitment', href: '/membership#volunteer' },
      { name: 'Code of Conduct', href: '/membership#conduct' },
      { name: 'SkateSafe', href: '/membership#skatesafe' },
      { name: 'Club Jackets', href: '/club-jackets' },
      { name: 'SkateSafe Compliance', href: '/skatesafe-compliance' },
      { name: 'Newsletter Archive', href: '/the-inside-edge-newsletter-archive' },
    ],
  },
  {
    name: 'Competition',
    href: '/programs#competitions',
    children: [
      { name: 'Skate San Francisco', href: '/programs#competitions' },
      { name: 'EMS Registration', href: 'https://www.usfsaonline.org/', external: true },
      { name: 'EntryEeze Portal', href: 'http://comp.entryeeze.com/Membership/Welcome.aspx?cid=189', external: true },
      { name: 'CCIA Calendar', href: '/ccia-calendar' },
    ],
  },
  {
    name: 'Tests',
    href: '/tests-passed',
    children: [
      { name: 'Tests Passed', href: '/tests-passed' },
      { name: 'Test Registration & Schedule', href: '/resources#testing' },
      { name: 'Testing Policy & Fees', href: '/testing-policy' },
    ],
  },
  {
    name: 'Teams',
    href: '/programs#teams',
    children: [
      { name: 'San Francisco Ice Theatre', href: '/programs#teams' },
      { name: 'Tremors Synchronized Skating', href: 'http://tremorssf.org/', external: true },
    ],
  },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'About the Club', href: '/about' },
      { name: 'Mission', href: '/about#mission' },
      { name: 'Club History', href: '/about#history' },
      { name: 'Board & Contacts', href: '/about#board' },
      { name: 'SCSF Coaches', href: '/resources#coaches' },
      { name: 'Annual Gala', href: '/annual-gala' },
      { name: 'Junior Council', href: '/junior-council' },
      { name: 'Club Bylaws', href: '/club-bylaws' },
      { name: 'Community Partners', href: '/individual-community-partners' },
      { name: 'Events', href: '/events' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

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
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.style.display = 'none';
                  const p = t.parentElement;
                  if (p) p.innerHTML = '<span class="text-xl font-bold">SCSF</span>';
                }}
              />
            </div>
            <span className="font-bold text-lg hidden sm:block leading-tight">
              Skating Club of<br />
              <span className="text-brand-golden-yellow">San Francisco</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      {item.name}
                      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    <div className="absolute left-0 top-full mt-0.5 w-56 bg-white text-brand-charcoal rounded-md shadow-lg
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <div className="py-1.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            target={child.external ? '_blank' : undefined}
                            rel={child.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-brand-off-white hover:text-brand-royal-blue transition-colors"
                          >
                            {child.name}
                            {child.external && (
                              <svg className="w-3 h-3 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Contact
            </Link>
            <Link
              href="/donate"
              className="ml-1 px-4 py-2 bg-brand-golden-yellow text-brand-charcoal rounded-md font-semibold text-sm hover:bg-yellow-400 transition-colors"
            >
              Donate
            </Link>
          </nav>

          {/* Mobile: Donate + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/donate"
              className="px-3 py-1.5 bg-brand-golden-yellow text-brand-charcoal rounded-md font-semibold text-sm hover:bg-yellow-400 transition-colors"
            >
              Donate
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>{/* end flex h-16 */}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-3">
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-left text-sm font-medium"
                      >
                        {item.name}
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-4 pb-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              target={child.external ? '_blank' : undefined}
                              rel={child.external ? 'noopener noreferrer' : undefined}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Contact Us
              </Link>
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 px-4 py-2.5 bg-brand-golden-yellow text-brand-charcoal rounded-md font-semibold text-sm text-center hover:bg-yellow-400 transition-colors"
              >
                Donate
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
