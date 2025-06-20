import { GraduationCap, Users, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Ranjit Tamang
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              A dedicated leader committed to progressive politics and social transformation in Nepal
            </p>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Background & Early Life
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Ranjit Tamang emerged as a prominent figure in Nepal's political landscape 
                  through his dedication to student activism and progressive politics. His 
                  journey began within the ranks of the CPN (Maoist Centre), where he 
                  demonstrated exceptional leadership qualities from an early age.
                </p>
                <p>
                  As a student leader, he understood the critical role of youth in shaping 
                  Nepal's democratic future. His commitment to social justice, educational 
                  reform, and healthcare accessibility has been the driving force behind 
                  his political career.
                </p>
                <p>
                  Today, as a Central Committee member of the CPN (Maoist Centre), he continues 
                  to advocate for the marginalized and work towards building a more equitable 
                  society in Nepal.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Ranjit Tamang"
                className="rounded-lg shadow-lg w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Core Values & Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fundamental beliefs that guide every decision and action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Education for All</h3>
              <p className="text-gray-600">
                Fighting for free, quality education accessible to every Nepali citizen, 
                regardless of economic background.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Access</h3>
              <p className="text-gray-600">
                Advocating for universal healthcare that ensures medical treatment 
                is a right, not a privilege.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Justice</h3>
              <p className="text-gray-600">
                Committed to creating an equitable society where every citizen 
                has equal opportunities and rights.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Merit-Based Leadership</h3>
              <p className="text-gray-600">
                Promoting transparent, merit-based systems in governance and 
                institutional leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Vision for Nepal
          </h2>
          <blockquote className="text-xl lg:text-2xl text-red-100 italic leading-relaxed">
            "I envision a Nepal where every citizen has access to quality education and healthcare, 
            where merit determines leadership, and where social justice is not just an ideal but 
            a lived reality for all. Through grassroots engagement and progressive policies, 
            we can build a more prosperous and equitable nation."
          </blockquote>
          <footer className="mt-8 text-lg text-red-200">
            — Ranjit Tamang
          </footer>
        </div>
      </section>

      {/* Personal Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Political Philosophy
              </h2>
              <div className="space-y-6 text-gray-600 text-lg">
                <p>
                  My approach to politics is rooted in the belief that government must serve 
                  as a watchdog for the people, especially during times of political crisis. 
                  The student wings and grassroots organizations play a crucial role in 
                  holding leadership accountable and ensuring democratic principles are upheld.
                </p>
                <p>
                  I advocate for systemic reforms that address the root causes of inequality 
                  and injustice in our society. This includes resisting the privatization 
                  of essential services like education and healthcare, while promoting 
                  policies that create opportunities for all citizens.
                </p>
                <p>
                  True leadership comes from understanding the needs of the people at the 
                  grassroots level. This is why community engagement and direct dialogue 
                  with citizens remain central to my political work and decision-making process.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Priorities</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">Free and accessible education for all</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">Universal healthcare coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">Youth inclusion in governance</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">Merit-based institutional leadership</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">Grassroots community empowerment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;