import Container from '@/components/Container';
import { getAllTestsPassed } from '@/lib/sanity.queries';
import TestsPassedClient from './TestsPassedClient';

export const metadata = {
  title: 'Tests Passed | Skating Club of San Francisco',
  description: 'Records of skating tests passed by SCSF members, organized by year and discipline.',
};

export default async function TestsPassedPage() {
  const tests = await getAllTestsPassed();

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Page Header */}
      <div className="bg-brand-royal-blue text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tests Passed</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Congratulations to all SCSF members who have passed their US Figure Skating tests.
          </p>
        </Container>
      </div>

      {tests.length === 0 ? (
        <Container className="py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            Tests passed records are being updated. Check back soon.
          </div>
        </Container>
      ) : (
        <TestsPassedClient tests={tests} />
      )}
    </div>
  );
}
