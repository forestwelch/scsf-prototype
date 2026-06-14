import Container from '@/components/Container';
import { getAllCoaches } from '@/lib/sanity.queries';

export const metadata = {
  title: 'SCSF Coaches | Skating Club of San Francisco',
  description: 'Coaches who are current members of the Skating Club of San Francisco, including disciplines, PSA ratings, and contact information.',
};

export default async function ScsfCoachesPage() {
  const coaches = await getAllCoaches();

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SCSF Coaches</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Current coach members of the Skating Club of San Francisco.
          </p>
        </Container>
      </div>

      <Container className="py-12 md:py-16 space-y-12">

        {/* Policy intro */}
        <section className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <p>
            Over the last few years, US Figure Skating has developed and implemented mandatory coaching
            requirements including background screenings and national coaching standards, to ensure all
            member athletes are safe and protected while participating in any USFS sanctioned event —
            including test sessions, competitions, club ice, and shows. For more information visit{' '}
            <a href="https://www.usfigureskating.org" target="_blank" rel="noopener noreferrer"
              className="text-brand-bridge-orange hover:underline">www.usfigureskating.org</a>.
          </p>
          <p>
            SCSF requires and expects each of its coaches to be fully compliant with USFS requirements.
            While SCSF does not employ or hire coaches, we offer a Coach membership to individual
            instructors who teach private lessons, and monitor coach compliance as a condition of membership.
          </p>
          <div className="bg-brand-off-white rounded-lg p-5 mt-4 not-prose">
            <p className="font-semibold text-brand-charcoal mb-3 text-sm">Compliance requirements:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {[
                'Current USFS member in good standing',
                'Yearly background check',
                'Yearly SkateSafe training',
                'Yearly Continuing Education Requirements (4 courses)',
                'Proof of Liability Insurance',
                'PSA membership (required for qualifying competitions only)',
              ].map(r => (
                <li key={r} className="flex items-start gap-2">
                  <span className="text-brand-golden-yellow font-bold shrink-0 mt-0.5">·</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Discipline key */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-charcoal mb-3">Discipline Key</h2>
          <p className="text-sm text-gray-600">
            <strong>Disciplines:</strong> FS = Free Skating · M = Moves in the Field · D = Dance ·
            C = Choreography · TOI = Theatre on Ice · S = Synchronized Skating · P = Pairs ·
            F = Figures · O = Off Ice Training
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>PSA Ratings:</strong> M = Master · S = Senior · C = Certified · R = Registered —
            followed by discipline (e.g. MFS = Master Free Skating, SM = Senior Moves)
          </p>
        </section>

        {/* Coach table */}
        {coaches.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-6">
              Current Coach Members ({coaches.length})
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-royal-blue text-white text-left">
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Disciplines</th>
                      <th className="px-4 py-3 font-semibold hidden md:table-cell">Primary Rink</th>
                      <th className="px-4 py-3 font-semibold hidden lg:table-cell">PSA Ratings</th>
                      <th className="px-4 py-3 font-semibold">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coaches.map((coach, i) => {
                      // Extract rink and ratings from bio text (stored as "Primary rink: X · PSA ratings: Y")
                      const bioText = coach.bio
                        ? coach.bio.flatMap((b: {children?: {text?: string}[]}) => b.children?.map((c) => c.text) ?? []).join('')
                        : '';
                      const rinkMatch = bioText.match(/Primary rink: ([^·]+)/);
                      const ratingsMatch = bioText.match(/PSA ratings: (.+)/);
                      const rink = rinkMatch?.[1]?.trim() ?? '—';
                      const ratings = ratingsMatch?.[1]?.trim() ?? '—';

                      return (
                        <tr key={coach._id}
                          className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="px-4 py-3 font-medium text-brand-charcoal">{coach.name}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <div className="flex flex-wrap gap-1">
                              {(coach.specialties ?? []).map((s: string) => (
                                <span key={s}
                                  className="inline-block bg-brand-sky-blue/10 text-brand-royal-blue text-xs px-1.5 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{rink}</td>
                          <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{ratings}</td>
                          <td className="px-4 py-3">
                            {coach.email ? (
                              <a href={`mailto:${coach.email}`}
                                className="text-brand-bridge-orange hover:underline break-all">
                                {coach.email}
                              </a>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">
            Coach directory is being updated.
          </div>
        )}

      </Container>
    </div>
  );
}
