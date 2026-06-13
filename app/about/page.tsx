import Container from '@/components/Container';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Skating Club of San Francisco',
  description: 'The Skating Club of San Francisco is dedicated to the promotion of the sport of figure skating. Founded in 1932, we support skaters of all levels.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SCSF</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            The Skating Club of San Francisco, Inc. — dedicated to the promotion of the sport of figure skating since 1932.
          </p>
          <nav className="flex flex-wrap gap-4 mt-6 text-sm">
            {['Mission', 'Members', 'Programs', 'Club History', 'Board & Contacts'].map((s, i) => (
              <a
                key={s}
                href={`#${['mission','members','programs','history','board'][i]}`}
                className="text-white/70 hover:text-brand-golden-yellow transition-colors"
              >
                {s}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="py-12 md:py-16 space-y-16">

        {/* Mission */}
        <section id="mission">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Our Mission</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-xl font-semibold text-brand-royal-blue mb-4">
              The Skating Club of San Francisco, Inc. is dedicated to the promotion of the sport of figure skating.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              SCSF is a tax-exempt, non-profit public charity per section 501(c)(3) — donations are tax-deductible under section 170 of the IRS Code.
              Originally incorporated as a non-profit corporation in 1937 as the Skate &amp; Ski Club of San Francisco,
              its name was changed in the early 1950s to The Skating Club of San Francisco, Inc.
            </p>
            <p className="text-gray-700 leading-relaxed">
              It is one of the oldest member clubs of the United States Figure Skating Association (US Figure Skating),
              which is recognized by the International Skating Union (ISU) and the US &amp; International Olympic Committees
              as the National Governing Body (NGB) for the sport of figure skating.
            </p>
          </div>
        </section>

        {/* Members */}
        <section id="members">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Our Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">A Diverse Community</h3>
              <p className="text-gray-700 leading-relaxed">
                The Club is composed of skaters, coaches, US Figure Skating officials, family members, and anyone
                passionate about the sport of figure skating. Our members reflect the rich, diverse cultural backgrounds
                of the SF Bay Area, united through their passion for figure skating.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Volunteer-Run</h3>
              <p className="text-gray-700 leading-relaxed">
                SCSF has always been run entirely by volunteers — many of whom are US Figure Skating officials,
                along with active skating and family members. All event profits from registration fees, membership dues,
                and donations go directly to supporting skaters and skating teams.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">For Every Level</h3>
              <p className="text-gray-700 leading-relaxed">
                Whether you participate for recreation or are a member of our synchronized skating or ice theater teams,
                or are a contender for a National, International, or Olympic title — SCSF fosters an environment for each
                individual to excel.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Olympic Legacy</h3>
              <p className="text-gray-700 leading-relaxed">
                The Club supports individual skaters competing in singles, pairs, and dance events, several of whom have
                won National titles along with International and World medals. Our past members include a 2018 and 2022
                Olympian and Olympic team medalist.
              </p>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section id="programs">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Programs</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              The Club offers multiple programs for skaters of all ages — from pre-school children through adults —
              to develop their skating and leadership skills. Our home facility is the
              <strong> Yerba Buena Ice Skating &amp; Bowling Centre</strong> in downtown San Francisco.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Test Sessions', desc: 'US Figure Skating proficiency tests at all levels', href: '/resources#testing' },
                { name: 'Competitions', desc: 'Skate SF, regional & sectional qualifying competitions', href: '/programs#competitions' },
                { name: 'San Francisco Ice Theatre', desc: 'Four competitive theater on ice teams', href: '/programs#teams' },
                { name: 'Tremors', desc: 'Five competitive synchronized skating teams', href: '/programs#teams' },
              ].map(p => (
                <Link
                  key={p.name}
                  href={p.href}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-brand-royal-blue hover:shadow-sm transition-all group"
                >
                  <h4 className="font-semibold text-brand-charcoal group-hover:text-brand-royal-blue mb-1">{p.name}</h4>
                  <p className="text-sm text-gray-600">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Club History */}
        <section id="history">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Club History</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">The Origin (1932)</h3>
              <p className="text-gray-700 leading-relaxed">
                In the fall of 1932, a group of winter sports enthusiasts assembled by Alex Young, Jr. organized the
                Skate and Ski Club of San Francisco, for the "purpose of promoting and fostering an interest in the art
                of skating and winter sports." The first season saw a membership of 106, skating at New Iceland on Sutter
                and Pierce Streets in San Francisco.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                The club promptly applied for membership in — and holds the distinction of being — the first Pacific Coast
                club admitted to the USFSA.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Incorporation (1938)</h3>
              <p className="text-gray-700 leading-relaxed">
                After years of nomadic skating across San Francisco's various rinks, the club secured sessions at Sutro Baths
                starting October 5, 1938. With legal help from Lemuel H. Matthews, the incorporation of the club as a non-profit
                corporation became effective November 22, 1938. The club's first USFSA sanctioned carnival took place at
                Sutro Baths on December 19, 1938.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">Yerba Buena (1998–Present)</h3>
              <p className="text-gray-700 leading-relaxed">
                The Grand Opening of the Yerba Buena Ice Center on October 17, 1998 was sponsored by SCSF and sanctioned
                by USFSA. Today, Yerba Buena Ice Skating &amp; Bowling Centre at 750 Folsom St. remains our home facility,
                where we host test sessions, the annual Skate San Francisco competition, and community events.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-500 italic">
                History sourced from "The Inside Edge" newsletter archives, including a 1972 article by John Rogers
                with contributions from Rebecca Hurst and George Stiles.
              </p>
            </div>
          </div>
        </section>

        {/* Board & Contacts placeholder */}
        <section id="board">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">Board of Directors &amp; Contacts</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-700 mb-6">
              For a complete list of board members and club contacts, please visit the official SCSF contacts page.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-2">Mailing Address</h3>
                <address className="not-italic text-gray-700 text-sm">
                  The Skating Club of San Francisco, Inc.<br />
                  P.O. Box 320457<br />
                  San Francisco, CA 94132
                </address>
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-2">Home Rink</h3>
                <address className="not-italic text-gray-700 text-sm">
                  Yerba Buena Ice Skating &amp; Bowling Center<br />
                  750 Folsom St.<br />
                  San Francisco, CA 94107<br />
                  (415) 820-3521
                </address>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-block bg-brand-royal-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-sky-blue transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </Container>
    </div>
  );
}
