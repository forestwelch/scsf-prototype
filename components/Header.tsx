'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'About',
      href: '/about',
      children: [
        { name: 'About the Club', href: '/about' },
        { name: 'Board of Directors', href: '/about#board' },
        { name: 'Announcements', href: '/announcements' },
        { name: 'Events', href: '/events' },
        { name: 'Club History', href: '/about#history' },
      ],
    },
    {
      name: 'Membership',
      href: '/membership',
      children: [
        { name: 'Why Join?', href: '/membership#why-join' },
        { name: 'Join the Club', href: '/membership#join' },
        { name: 'Membership Policies', href: '/membership#policies' },
        { name: 'Code of Conduct', href: '/membership#conduct' },
      ],
    },
    {
      name: 'Club Resources',
      href: '#',
      children: [
        { name: 'Support Programs', href: '/resources#support' },
        { name: 'Competition Resources', href: '/resources#competition' },
        { name: 'Testing', href: '/resources#testing' },
        { name: 'SCSF Coaches', href: '/resources#coaches' },
        { name: 'Ice Time', href: '/resources#ice-time' },
        { name: 'Order Club Jackets', href: '/resources#jackets' },
      ],
    },
    {
      name: 'Programs',
      href: '#',
      children: [
        { name: 'Teams', href: '/programs#teams' },
        { name: 'Tests', href: '/programs#tests' },
        { name: 'Competitions', href: '/programs#competitions' },
      ],
    },
    {
      name: 'FAQs',
      href: '/faqs',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-royal-blue text-white shadow-md">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="SCSF Logo"
                width={48}
                height={48}
                className="object-contain"
                onError={(e) => {
                  // Fallback if logo doesn't exist - hide image, show text
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-2xl font-bold">SCSF</span>';
                  }
                }}
              />
            </div>
            <span className="text-xl font-bold hidden sm:block">
              SCSF
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="px-4 py-2 rounded-md hover:bg-brand-bridge-orange transition-colors"
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="absolute left-0 mt-1 w-56 bg-white text-brand-charcoal rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 hover:bg-brand-off-white hover:text-brand-bridge-orange transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-brand-bridge-orange transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brand-sky-blue">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 rounded-md hover:bg-brand-bridge-orange transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 rounded-md hover:bg-brand-bridge-orange/50 transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
