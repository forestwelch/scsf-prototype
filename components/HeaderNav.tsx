'use client';

import Link from 'next/link';
import { useState } from 'react';
import { resolveNavHref, type NavItem, type NavLink } from '@/lib/sanity.queries';

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

export default function HeaderNav({ items }: { items: NavItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const renderChildLink = (child: NavLink, onClick?: () => void) => {
    const href = resolveNavHref(child);
    const external = child.openInNewTab ?? isExternal(href);
    return (
      <Link
        key={child.label}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-brand-off-white hover:text-brand-royal-blue transition-colors"
      >
        {child.label}
        {external && (
          <svg className="w-3 h-3 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-0.5">
        {items.map((item) => {
          const href = resolveNavHref(item);
          const hasChildren = !!item.children?.length;

          if (item.highlightButton) {
            return (
              <Link
                key={item.label}
                href={href}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                className="ml-1 px-4 py-2 bg-brand-golden-yellow text-brand-charcoal rounded-md font-semibold text-sm hover:bg-yellow-400 transition-colors"
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label} className="relative group">
              {hasChildren ? (
                <>
                  <Link
                    href={href}
                    className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    {item.label}
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  <div className="absolute left-0 top-full mt-0.5 w-56 bg-white text-brand-charcoal rounded-md shadow-lg
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="py-1.5">
                      {item.children!.map((child) => renderChildLink(child))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mobile: Hamburger */}
      <div className="lg:hidden flex items-center gap-2">
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 py-3">
          <nav className="flex flex-col">
            {items.map((item) => {
              const href = resolveNavHref(item);
              const hasChildren = !!item.children?.length;

              if (item.highlightButton) {
                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 mt-2 px-4 py-2.5 bg-brand-golden-yellow text-brand-charcoal rounded-md font-semibold text-sm text-center hover:bg-yellow-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-left text-sm font-medium"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-4 pb-1">
                          {item.children!.map((child) => renderChildLink(child, () => setMobileMenuOpen(false)))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={href}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
