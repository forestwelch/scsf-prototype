/**
 * seed-coaches.mjs
 * Seeds SCSF coach records from the live coaches table (as of June 2026).
 * Safe to re-run — uses createOrReplace with stable _ids.
 *
 * Usage:
 *   bun --env-file=.env.local scripts/seed-coaches.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xi18pbe1',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production',
  token:     process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const coaches = [
  { lastName: 'Aydin',           firstName: 'Zeynep',    disciplines: ['FS','M','C','S','O'],         rink: 'San Francisco', ratings: [],                      email: 'zey_aydin@hotmail.com' },
  { lastName: 'Cederquist',      firstName: 'Kristen',   disciplines: ['FS','M','F'],                 rink: 'San Jose',      ratings: [],                      email: 'kristencederquist@gmail.com' },
  { lastName: 'Chow',            firstName: 'Taylor',    disciplines: ['FS'],                         rink: 'San Mateo',     ratings: [],                      email: 'taylorrchow@gmail.com' },
  { lastName: 'Corbiell',        firstName: 'Don',       disciplines: ['FS','M','D','C','O'],         rink: 'San Francisco', ratings: ['MFS','MM'],            email: 'don.corbiell@gmail.com' },
  { lastName: 'Dakdduk',         firstName: 'Susan',     disciplines: ['FS','D'],                     rink: 'San Francisco', ratings: [],                      email: 'susandakdduk@gmail.com' },
  { lastName: 'Davis',           firstName: 'Deborah',   disciplines: ['FS','M','C'],                 rink: 'San Francisco', ratings: ['RFS','RM'],            email: 'ddskater@gmail.com' },
  { lastName: 'De Groot',        firstName: 'Alexandra', disciplines: ['FS','M','D','C'],             rink: 'Dublin',        ratings: [],                      email: 'bdegroot@mac.com' },
  { lastName: 'Dubrovskiy',      firstName: 'Stepan',    disciplines: ['FS','D'],                     rink: 'Fremont',       ratings: [],                      email: 'icedance.dk@gmail.com' },
  { lastName: 'Guevarra',        firstName: 'Glen',      disciplines: ['FS'],                         rink: 'San Francisco', ratings: [],                      email: 'glnguevarra@sbcglobal.net' },
  { lastName: 'Hersey',          firstName: 'Chantal',   disciplines: ['S'],                          rink: 'San Francisco', ratings: [],                      email: 'tremorscoachchantal@gmail.com' },
  { lastName: 'Jackson',         firstName: 'Suzy',      disciplines: ['FS','M','D','C','P','F'],     rink: 'San Francisco', ratings: [],                      email: 'suzykjackson@gmail.com' },
  { lastName: 'Lewis',           firstName: 'Alyssa',    disciplines: ['M','D','FS','S','O'],         rink: 'San Jose',      ratings: ['SM','CD','CG','RFS'],  email: 'Noelani418@gmail.com' },
  { lastName: 'Maier',           firstName: 'Jodie',     disciplines: ['FS','M'],                     rink: 'San Francisco', ratings: ['RFS','RM'],            email: 'jodielmaier@gmail.com' },
  { lastName: 'Massarelli',      firstName: 'Andrea',    disciplines: ['FS'],                         rink: 'Dublin',        ratings: [],                      email: 'andrea.massarelli@comcast.net' },
  { lastName: 'Park',            firstName: 'Victoria',  disciplines: ['FS'],                         rink: 'San Mateo',     ratings: [],                      email: 'tpark1215@gmail.com' },
  { lastName: 'Pisoni',          firstName: 'Amy',       disciplines: ['FS','M','C','O'],             rink: 'San Francisco', ratings: [],                      email: 'apisoni686@gmail.com' },
  { lastName: 'Popovich',        firstName: 'Nicole',    disciplines: ['FS','M','C','O'],             rink: 'San Francisco', ratings: [],                      email: 'npskater90@gmail.com' },
  { lastName: 'Scali',           firstName: 'Massimo',   disciplines: ['M','D','C'],                  rink: 'San Francisco', ratings: [],                      email: 'Massyscali@gmail.com' },
  { lastName: 'Scott',           firstName: 'Paige',     disciplines: ['FS','C','TOI'],               rink: 'San Francisco', ratings: [],                      email: 'ybisbc@gmail.com' },
  { lastName: 'Snider',          firstName: 'Stephanie', disciplines: ['FS','M','D','C','O'],         rink: 'San Jose',      ratings: [],                      email: 'stephanie@sniderworld.com' },
  { lastName: 'Wheatley',        firstName: 'Ashante',   disciplines: ['FS'],                         rink: 'San Francisco', ratings: [],                      email: 'ashantemarie@aol.com' },
  { lastName: 'Wolkin',          firstName: 'Lindsey',   disciplines: ['FS','D','M','C','S'],         rink: 'San Francisco', ratings: ['MM','CS'],             email: 'tremorscoachlindsey@gmail.com' },
  { lastName: 'Yamada-Killilea', firstName: 'Marie',     disciplines: ['FS'],                         rink: 'Oakland',       ratings: [],                      email: 'yamadakillilea@gmail.com' },
  { lastName: 'Yeghyayan',       firstName: 'Olga',      disciplines: ['FS','C','O'],                 rink: 'San Jose',      ratings: ['RFS'],                 email: 'OLGAV68@yahoo.com' },
];

function makeBio(c) {
  const text = [
    c.rink ? `Primary rink: ${c.rink}` : null,
    c.ratings.length ? `PSA ratings: ${c.ratings.join(', ')}` : null,
  ].filter(Boolean).join(' · ');
  if (!text) return undefined;
  return [{
    _type: 'block',
    _key: 'b1',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text, marks: [] }],
  }];
}

const docs = coaches.map((c) => ({
  _id: `coach-${c.lastName.toLowerCase().replace(/[^a-z]/g, '-')}-${c.firstName.toLowerCase()}`,
  _type: 'coach',
  name: `${c.firstName} ${c.lastName}`,
  email: c.email,
  specialties: c.disciplines,
  bio: makeBio(c),
}));

console.log(`seeding ${docs.length} coaches…`);
const tx = client.transaction();
docs.forEach(doc => tx.createOrReplace(doc));
await tx.commit();
console.log('done.');
