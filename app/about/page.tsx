import Container from '@/components/Container';
import { getAllBoardMembers } from '@/lib/sanity.queries';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';

export const metadata = {
  title: 'About Us | Skating Club of San Francisco',
  description: 'Learn about the Skating Club of San Francisco, our mission, history, and board of directors.',
};

export default async function AboutPage() {
  const boardMembers = await getAllBoardMembers();

  return (
    <div className="min-h-screen bg-brand-off-white">
      <Container className="py-12 md:py-16">
        {/* Mission Statement */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-6">
            About the Skating Club of San Francisco
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-brand-charcoal mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The Skating Club of San Francisco is dedicated to supporting figure skaters of all levels
              in their pursuit of excellence. We provide a welcoming community, quality coaching, and
              opportunities for skaters to grow both on and off the ice.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Since 1938, we have been committed to fostering a love of figure skating while helping
              skaters achieve their personal best through testing, competition, and performance opportunities.
            </p>
          </div>
        </section>

        {/* What Makes SCSF Special */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            What Makes SCSF Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Rich History
              </h3>
              <p className="text-gray-700">
                With over 85 years of history, SCSF has been a cornerstone of the San Francisco
                skating community, supporting generations of skaters.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Expert Coaching
              </h3>
              <p className="text-gray-700">
                Our team of experienced coaches provides personalized instruction for skaters at
                every level, from beginners to competitive athletes.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Community Support
              </h3>
              <p className="text-gray-700">
                We foster a supportive community where skaters, families, and coaches work together
                to create a positive and encouraging environment.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-brand-charcoal mb-3">
                Comprehensive Programs
              </h3>
              <p className="text-gray-700">
                From test sessions and competitions to team programs and special events, we offer
                a wide range of opportunities for skaters to grow and excel.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Overview */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Our Programs
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-4">
              SCSF offers a variety of programs designed to support skaters at every stage of their journey:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Test Sessions:</strong> Regular opportunities for skaters to test and advance through USFS levels</li>
              <li><strong>Competitions:</strong> Hosting and participating in local and regional competitions</li>
              <li><strong>Team Programs:</strong> Including Ice Theatre and Tremors teams</li>
              <li><strong>Special Events:</strong> Annual Gala, Skate SF, and other community events</li>
              <li><strong>Coaching Resources:</strong> Access to our network of qualified coaches</li>
            </ul>
            <div className="mt-6">
              <a
                href="/programs"
                className="inline-block bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
              >
                Learn More About Our Programs
              </a>
            </div>
          </div>
        </section>

        {/* Board of Directors */}
        <section id="board" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Board of Directors
          </h2>
          {boardMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member) => {
                const imageUrl = member.photo
                  ? urlFor(member.photo).width(300).height(300).url()
                  : null;

                return (
                  <div key={member._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {imageUrl && (
                      <div className="relative w-full h-64">
                        <Image
                          src={imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-brand-charcoal mb-1">
                        {member.name}
                      </h3>
                      <p className="text-brand-bridge-orange font-medium mb-3">
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="text-gray-700 text-sm">
                          {/* Bio would be rendered here if using portable text */}
                          Board member information
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">
                Board member information coming soon.
              </p>
            </div>
          )}
        </section>

        {/* Club History */}
        <section id="history" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">
            Club History
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Founded in 1938, the Skating Club of San Francisco has been a pillar of the Bay Area
              figure skating community for over eight decades. Throughout our history, we have
              supported countless skaters in achieving their goals, from recreational skating to
              competitive excellence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our club has been proud to host numerous test sessions, competitions, and special events,
              including our annual Gala and Skate SF competition. We continue to honor our rich
              tradition while embracing innovation and growth in the sport of figure skating.
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}
