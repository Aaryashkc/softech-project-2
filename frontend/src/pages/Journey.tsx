import React from 'react';
import { Calendar, Users, Award, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const Journey: React.FC = () => {
  const milestones: Milestone[] = [
    {
      year: "2017",
      title: "ANNISU (R) Chairman",
      description: "Elected as the first democratically chosen Chairman of ANNISU (R), the student wing of CPN (Maoist Centre), at the 21st national conference in Kathmandu.",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      year: "2021",
      title: "Central Committee Member",
      description: "Promoted to the Central Committee of CPN (Maoist Centre) as part of the youth inclusion initiative, representing the under-40 demographic in party leadership.",
      icon: Award,
      color: "bg-green-500"
    },
    {
      year: "2025",
      title: "Tarai-Madhes Campaign Leader",
      description: "Appointed as Jhapa in-charge for the comprehensive 'Tarai-Madhes Awareness Campaign', coordinating grassroots mobilization efforts across the region.",
      icon: MapPin,
      color: "bg-red-600"
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Political Journey
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              From student activism to national leadership - a chronicle of dedication to Nepal's progress
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Career Milestones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key moments that shaped a journey of public service and political leadership
            </p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${milestone.color} rounded-full flex items-center justify-center`}>
                      <milestone.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="ml-8 bg-gray-50 rounded-xl p-8 flex-grow shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-red-700 mr-4">{milestone.year}</span>
                      <h3 className="text-2xl font-semibold text-gray-900">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
                {index < milestones.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-12 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Phases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Leadership Evolution
            </h2>
            <p className="text-xl text-gray-600">
              Three distinct phases of growth and increasing responsibility
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Student Leader</h3>
                <p className="text-blue-600 font-medium">2017 - 2021</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>First democratically elected ANNISU (R) Chairman</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Advocate for free education and healthcare</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Vocal opponent of education privatization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Promoted merit-based university leadership</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Party Leadership</h3>
                <p className="text-green-600 font-medium">2021 - Present</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Central Committee member, CPN (Maoist Centre)</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Part of historic youth inclusion initiative</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Representative of under-40 demographic</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Influence in national policy decisions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Grassroots Organizer</h3>
                <p className="text-red-600 font-medium">2025 - Ongoing</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Jhapa in-charge for regional campaigns</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Strategic grassroots mobilization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Community engagement and outreach</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Democratic participation advocacy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Interview Insights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Political Philosophy in Action
            </h2>
            <p className="text-xl text-gray-600">
              Insights from key interviews and public statements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-red-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-red-600 mr-3" />
                <span className="text-red-700 font-semibold">2021 Interview - The Annapurna Express</span>
              </div>
              <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-4">
                "Student wings must serve as watchdogs over government actions, especially during political crises like the dissolution of Parliament."
              </blockquote>
              <p className="text-gray-600">
                This interview highlighted his belief in the crucial role of student organizations 
                in maintaining democratic accountability and oversight.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-blue-700 font-semibold">2021 - Central Committee Appointment</span>
              </div>
              <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-4">
                "The 20% under-40 quota represents a historic commitment to youth inclusion in Nepal's political future."
              </blockquote>
              <p className="text-gray-600">
                His appointment to the Central Committee alongside 11 other young leaders marked 
                a significant shift toward youth representation in national politics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Current Focus & Future Goals
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Continuing the mission of grassroots engagement while maintaining influence in national 
            policy-making. The focus remains on strengthening democratic institutions, promoting 
            youth participation, and ensuring that the voice of ordinary citizens is heard in 
            the corridors of power.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-red-200">
            <span className="px-4 py-2 bg-red-600 rounded-full">#YouthLeadership</span>
            <span className="px-4 py-2 bg-red-600 rounded-full">#GrassrootsEngagement</span>
            <span className="px-4 py-2 bg-red-600 rounded-full">#SocialJustice</span>
            <span className="px-4 py-2 bg-red-600 rounded-full">#DemocraticReform</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journey;