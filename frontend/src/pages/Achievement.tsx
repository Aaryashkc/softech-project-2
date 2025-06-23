import { Trophy, Users, BookOpen, Heart, Vote, Target } from 'lucide-react';

const Achievement = () => {
  const achievements = [
    {
      category: "Student Leadership",
      icon: BookOpen,
      color: "bg-blue-600",
      items: [
        {
          title: "First Democratic ANNISU (R) Chairman",
          description: "Historic election as the first democratically chosen Chairman of ANNISU (R) at the 21st national conference in Kathmandu, 2017",
          impact: "Set precedent for democratic processes in student organization leadership"
        },
        {
          title: "Education Reform Advocacy",
          description: "Led campaigns for free education and against privatization of educational institutions",
          impact: "Influenced policy discussions on accessible education for all economic backgrounds"
        },
        {
          title: "Merit-Based Leadership Promotion",
          description: "Advocated for transparent, merit-based selection in university leadership positions",
          impact: "Contributed to reforms in academic institutional governance"
        }
      ]
    },
    {
      category: "Political Leadership",
      icon: Vote,
      color: "bg-green-600",
      items: [
        {
          title: "Central Committee Membership",
          description: "Appointed to Central Committee of CPN (Maoist Centre) in December 2021 under youth inclusion initiative",
          impact: "Represents voice of under-40 demographic in national political decision-making"
        },
        {
          title: "Youth Inclusion Pioneer",
          description: "Part of historic 20% under-40 quota implementation, joining 11 other young leaders",
          impact: "Helped establish framework for sustained youth participation in party leadership"
        },
        {
          title: "Policy Influence",
          description: "Active participant in Central Committee decisions affecting national policy direction",
          impact: "Ensured youth perspectives are integrated into major political strategies"
        }
      ]
    },
    {
      category: "Grassroots Engagement",
      icon: Users,
      color: "bg-red-600",
      items: [
        {
          title: "Tarai-Madhes Campaign Leadership",
          description: "Appointed as Jhapa in-charge for the comprehensive 'Tarai-Madhes Awareness Campaign' in February 2025",
          impact: "Coordinated grassroots mobilization across multiple districts, strengthening party-community connections"
        },
        {
          title: "Community Outreach Programs",
          description: "Supervised extensive grassroots mobilization efforts coordinated by party leadership",
          impact: "Enhanced democratic participation and political awareness in rural communities"
        },
        {
          title: "Strategic Regional Coordination",
          description: "Successfully managed campaign operations from Jhapa to Kanchanpur",
          impact: "Demonstrated effective large-scale organizational and leadership capabilities"
        }
      ]
    },
    {
      category: "Social Advocacy",
      icon: Heart,
      color: "bg-purple-600",
      items: [
        {
          title: "Healthcare Access Advocacy",
          description: "Consistent champion for free healthcare and universal access to medical services",
          impact: "Influenced party positions on healthcare reform and public health policy"
        },
        {
          title: "Social Justice Initiatives",
          description: "Promoted policies addressing systemic inequality and marginalization",
          impact: "Advanced discussions on inclusive governance and equal opportunity"
        },
        {
          title: "Government Accountability",
          description: "Emphasized role of student wings as watchdogs during political crises",
          impact: "Strengthened democratic oversight and institutional accountability mechanisms"
        }
      ]
    }
  ];

  const stats = [
    { number: "2017", label: "First Democratic Election Win", icon: Trophy },
    { number: "2021", label: "Central Committee Appointment", icon: Target },
    { number: "12", label: "Young Leaders in Initiative", icon: Users },
    { number: "2025", label: "Major Campaign Leadership", icon: Vote }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Achievements & Impact
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              A record of transformative leadership and meaningful contributions to Nepal's political landscape
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-red-700" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Achievement Record
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organized by key areas of leadership and impact
            </p>
          </div>

          <div className="space-y-16">
            {achievements.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mr-6`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Impact:</p>
                        <p className="text-sm text-gray-600 italic">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition & Media Coverage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Media Recognition
            </h2>
            <p className="text-xl text-gray-600">
              Coverage and recognition in national media outlets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  The Annapurna Express
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Student Leadership Interview
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Featured interview discussing the role of student organizations in democratic oversight 
                and government accountability during political crises.
              </p>
              <p className="text-xs text-gray-500">2021</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Kathmandu Post
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Central Committee Appointment
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Coverage of historic youth inclusion initiative and appointment to CPN (Maoist Centre) 
                Central Committee representing under-40 demographic.
              </p>
              <p className="text-xs text-gray-500">December 2021</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Radio Nepal Online
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Campaign Leadership
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Reports on successful coordination of Tarai-Madhes Awareness Campaign and 
                grassroots mobilization efforts across multiple districts.
              </p>
              <p className="text-xs text-gray-500">February 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ongoing Commitments
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Building on past achievements to create lasting change in Nepal's political and social landscape. 
            The focus continues on empowering youth, strengthening democratic institutions, and ensuring 
            that progressive values translate into meaningful policy outcomes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-red-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Immediate Priorities</h3>
              <ul className="text-red-100 space-y-2 text-sm">
                <li>• Expand grassroots engagement programs</li>
                <li>• Strengthen youth participation in governance</li>
                <li>• Advance education and healthcare reforms</li>
                <li>• Promote transparent, merit-based leadership</li>
              </ul>
            </div>
            <div className="bg-red-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Long-term Vision</h3>
              <ul className="text-red-100 space-y-2 text-sm">
                <li>• Establish comprehensive social justice framework</li>
                <li>• Create sustainable democratic institutions</li>
                <li>• Build inclusive political participation systems</li>
                <li>• Develop next generation of progressive leaders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievement;