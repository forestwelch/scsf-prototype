// ADD THIS TO lib/sanity.queries.ts

// --- new interface ---
export interface TestPassed {
  _id: string;
  skaterName: string;
  testType: 'moves' | 'freeskate' | 'dance' | 'pairs';
  testLevel: string;
  passedDate: string; // ISO date string e.g. "2024-03-15"
}

// --- new query function ---
/**
 * Get all tests passed records, ordered by date descending
 */
export async function getAllTestsPassed(): Promise<TestPassed[]> {
  return client.fetch<TestPassed[]>(
    `*[_type == "testPassed"] | order(passedDate desc) {
      _id,
      skaterName,
      testType,
      testLevel,
      passedDate
    }`
  );
}
