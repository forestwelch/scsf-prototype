'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/sanity.queries';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-medium text-brand-charcoal">{q}</span>
        <svg
          className={`w-5 h-5 text-brand-bridge-orange flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-5 text-gray-600 leading-relaxed">{a}</div>}
    </div>
  );
}

export default function FAQList({ faqs }: { faqs: Faq[] }) {
  // Group by category, preserving order
  const grouped = faqs.reduce<Map<string, Faq[]>>((map, faq) => {
    if (!map.has(faq.category)) map.set(faq.category, []);
    map.get(faq.category)!.push(faq);
    return map;
  }, new Map());

  return (
    <div className="space-y-10">
      {Array.from(grouped.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4 flex items-center gap-3">
            <span className="w-1 h-7 bg-brand-golden-yellow rounded-full inline-block" />
            {category}
          </h2>
          <div className="bg-white rounded-lg shadow-sm px-6">
            {items.map((item) => (
              <FAQItem key={item._id} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
