'use client';

import { useState } from 'react';
import Container from '@/components/Container';

const faqs = [
  {
    category: 'Membership',
    items: [
      {
        q: 'How do I join the Skating Club of San Francisco?',
        a: 'You can join online through our membership page. Annual membership is open to skaters of all ages and levels. Once you submit your application and dues, you\'ll receive confirmation and access to member benefits.',
      },
      {
        q: 'What are the membership fees?',
        a: 'Membership fees vary by category (adult, junior, family). Please visit the Membership page or contact the club for the current fee schedule. Financial assistance is available for qualifying members.',
      },
      {
        q: 'When does the membership year run?',
        a: 'The SCSF membership year runs from September 1 through August 31, aligned with the US Figure Skating season.',
      },
      {
        q: 'Do I need to be a USFS member to join SCSF?',
        a: 'Yes. A valid US Figure Skating membership is required for SCSF membership. You can register with USFS at usfigureskating.org before or alongside your SCSF application.',
      },
    ],
  },
  {
    category: 'Testing',
    items: [
      {
        q: 'How do I register for a test session?',
        a: 'Test session registration is typically done through EntryEeze. Watch for announcements about upcoming test sessions on this website. Your coach will also help you determine when you\'re ready to test and assist with registration.',
      },
      {
        q: 'What tests does SCSF host?',
        a: 'SCSF hosts test sessions for all US Figure Skating disciplines: Moves in the Field, Free Skate, Ice Dance, and Pairs. All test levels are welcome.',
      },
      {
        q: 'Do I have to be an SCSF member to test at an SCSF test session?',
        a: 'No — test sessions hosted by SCSF are open to all USFS members. However, SCSF members receive priority registration.',
      },
      {
        q: 'Where can I see who has passed their tests?',
        a: 'We maintain a Tests Passed record on this website. It\'s updated after each test session.',
      },
    ],
  },
  {
    category: 'Competitions',
    items: [
      {
        q: 'What is Skate SF?',
        a: 'Skate SF is SCSF\'s annual US Figure Skating sanctioned competition. It\'s open to skaters from clubs throughout the region and features multiple disciplines and levels.',
      },
      {
        q: 'How do I register for Skate SF or other competitions?',
        a: 'Competition registration is handled through EntryEeze for SCSF events, and through the USFS EMS system for regional and national events. Your coach will guide you through the process.',
      },
      {
        q: 'Are SCSF members required to compete?',
        a: 'No. Competition is entirely optional. Many members join purely for the community, coaching resources, and test opportunities.',
      },
    ],
  },
  {
    category: 'Ice Time & Rink',
    items: [
      {
        q: 'Where does SCSF skate?',
        a: 'Our primary rink is Yerba Buena Ice Skating & Bowling Center at 750 Folsom St., San Francisco, CA 94107. Phone: (415) 820-3521.',
      },
      {
        q: 'What freestyle sessions are available to members?',
        a: 'Freestyle session availability varies by season and rink scheduling. Contact the rink directly or ask your coach for the current freestyle schedule.',
      },
    ],
  },
  {
    category: 'Teams & Programs',
    items: [
      {
        q: 'What is Ice Theatre?',
        a: 'Ice Theatre is SCSF\'s performance team that creates choreographed skating shows performed at the annual gala and other club events. It\'s open to members with solid skating fundamentals.',
      },
      {
        q: 'What is Tremors?',
        a: 'Tremors is the junior performance team for younger skaters. Tremors members skate alongside Ice Theatre in the annual gala.',
      },
      {
        q: 'How do I join Ice Theatre or Tremors?',
        a: 'Reach out to a board member or ask your coach. Auditions and rehearsal schedules vary by season.',
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        q: 'How do I contact the club?',
        a: 'You can reach SCSF by mail at P.O. Box 320457, San Francisco, CA 94132. For general inquiries, contact any board member — their information is listed on the About page.',
      },
      {
        q: 'Is SCSF a nonprofit?',
        a: 'Yes. The Skating Club of San Francisco, Inc. is a nonprofit organization dedicated to supporting figure skating in the Bay Area.',
      },
      {
        q: 'How can I support the club?',
        a: 'Beyond membership, you can support SCSF by volunteering at events, donating to the club fund, or sponsoring a program. Contact a board member to learn more.',
      },
    ],
  },
];

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
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-gray-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Quick answers to common questions about SCSF membership, testing, competitions, and more.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16 max-w-4xl">
        <div className="space-y-10">
          {faqs.map((section) => (
            <section key={section.category}>
              <h2 className="text-2xl font-bold text-brand-charcoal mb-4 flex items-center gap-3">
                <span className="w-1 h-7 bg-brand-golden-yellow rounded-full inline-block" />
                {section.category}
              </h2>
              <div className="bg-white rounded-lg shadow-sm px-6">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-brand-royal-blue text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-white/80 mb-6">
            Reach out to the club — we&apos;re happy to help.
          </p>
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
