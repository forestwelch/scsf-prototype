'use client';

import { useState, Fragment } from 'react';
import type { TestPassed } from '@/lib/sanity.queries';

const TEST_TYPE_LABELS: Record<string, string> = {
  moves:     'Moves in the Field',
  freeskate: 'Free Skate',
  dance:     'Ice Dance',
  pairs:     'Pairs',
};

const TEST_TYPE_ORDER = ['moves', 'freeskate', 'dance', 'pairs'];

const TEST_TYPE_COLORS: Record<string, string> = {
  moves:     'bg-brand-royal-blue/10 text-brand-royal-blue border-brand-royal-blue/20',
  freeskate: 'bg-brand-bridge-orange/10 text-brand-bridge-orange border-brand-bridge-orange/20',
  dance:     'bg-brand-sky-blue/10 text-brand-sky-blue border-brand-sky-blue/30',
  pairs:     'bg-brand-golden-yellow/10 text-brand-charcoal border-brand-golden-yellow/30',
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(isoDate: string) {
  // "2025-03-15" → "Mar 2025"
  const [, mm, ] = isoDate.split('-');
  return MONTH_ABBR[parseInt(mm, 10) - 1] ?? mm;
}

interface Props {
  tests: TestPassed[];
}

export default function TestsPassedClient({ tests }: Props) {
  const years = Array.from(
    new Set(tests.map(t => t.passedDate.substring(0, 4)))
  ).sort((a, b) => Number(b) - Number(a));

  const [selectedYear, setSelectedYear] = useState(years[0] ?? '');

  const filtered = tests.filter(t => t.passedDate.startsWith(selectedYear));

  const byType: Record<string, TestPassed[]> = {};
  for (const t of filtered) {
    if (!byType[t.testType]) byType[t.testType] = [];
    byType[t.testType].push(t);
  }

  const presentTypes = TEST_TYPE_ORDER.filter(type => (byType[type]?.length ?? 0) > 0);

  return (
    <div>
      {/* Year Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2.5 rounded-md font-semibold text-sm whitespace-nowrap transition-colors ${
                  selectedYear === year
                    ? 'bg-brand-royal-blue text-white'
                    : 'text-gray-500 hover:text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary badges */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          {presentTypes.map(type => (
            <div
              key={type}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${TEST_TYPE_COLORS[type]}`}
            >
              {TEST_TYPE_LABELS[type]}
              <span className="font-bold">{byType[type].length}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500">No records for {selectedYear}.</p>
          )}
        </div>

        {/* Discipline sections — stacked full-width */}
        <div className="space-y-10">
          {presentTypes.map(type => {
            const entries = [...byType[type]].sort(
              (a, b) => new Date(b.passedDate).getTime() - new Date(a.passedDate).getTime()
            );

            // Group by month for visual separation
            const byMonth: Record<string, TestPassed[]> = {};
            for (const t of entries) {
              const monthKey = t.passedDate.substring(0, 7); // "2025-03"
              if (!byMonth[monthKey]) byMonth[monthKey] = [];
              byMonth[monthKey].push(t);
            }
            const monthKeys = Object.keys(byMonth).sort().reverse();

            return (
              <section key={type}>
                <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-t-lg border-t border-x ${TEST_TYPE_COLORS[type]}`}>
                  <h2 className="text-lg font-bold">{TEST_TYPE_LABELS[type]}</h2>
                  <span className="text-sm opacity-70">{entries.length} tests</span>
                </div>

                <div className="bg-white rounded-b-lg rounded-tr-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-5 py-3 text-left font-semibold text-brand-charcoal w-1/3">Skater</th>
                        <th className="px-5 py-3 text-left font-semibold text-brand-charcoal">Level</th>
                        <th className="px-5 py-3 text-right font-semibold text-brand-charcoal w-24">Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthKeys.map(monthKey => {
                        const monthEntries = byMonth[monthKey];
                        const [year, mm] = monthKey.split('-');
                        const monthLabel = `${MONTH_ABBR[parseInt(mm, 10) - 1]} ${year}`;
                        return (
                          <Fragment key={monthKey}>
                            {/* Month separator row */}
                            <tr className="bg-gray-50/60 border-y border-gray-100">
                              <td colSpan={3} className="px-5 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {monthLabel} — {monthEntries.length} test{monthEntries.length !== 1 ? 's' : ''}
                              </td>
                            </tr>
                            {monthEntries.map((t, i) => (
                              <tr
                                key={t._id}
                                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
                              >
                                <td className="px-5 py-2.5 font-medium text-brand-charcoal">{t.skaterName}</td>
                                <td className="px-5 py-2.5 text-gray-600">{t.testLevel}</td>
                                <td className="px-5 py-2.5 text-gray-400 text-right text-xs">{formatDate(t.passedDate)}</td>
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
