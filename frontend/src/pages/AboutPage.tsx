import { GraduationCap, Users, Award, Heart } from 'lucide-react';
import ABOUT from '../assets/about.jpg'

const AboutPage = () => {
  return (
    <div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Background & Early Life
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                रन्जित तामाङको जन्म पूर्वी नेपालको झापा जिल्लाको साविक तोपगाछी–२ वासबारी (हालको कमल गाउँपालिका–१) मा २०३९ माघ १९ गते (February 2, 1983) मा भएको हो। उनका बुबा लोकबहादुर तामाङ र आमा लाखमाया तामाङ हुन्। सात सन्तानमध्ये रन्जित जेठो छोरा हुन्। उनका अभिभावक सामान्य कृषक हुन् र कृषि पेसाबाटै परिवारको जीवन निर्वाह गर्दै आएका छन्।
                </p>
                <p>
                रन्जित तामाङले आफ्नो प्रारम्भिक शिक्षा नजिकैको श्री बाँसबारी निम्न माध्यमिक विद्यालयबाट सुरु गरेका थिए। उनले एसएलसी भने तत्कालीन तोपगाछी–२ स्थित श्री महेन्द्र रत्व माध्यमिक विद्यालयबाट उत्तीर्ण गरेका हुन्। त्यसपछि उनले महेन्द्र मोरङ कलेज, विराटनगरबाट आईए (Intermediate of Arts) अध्ययन गरे। पछि काठमाडौँको प्रदर्शनी मार्गस्थित रत्नराज्य लक्ष्मी क्याम्पसबाट स्नातक (BA) र त्रिभुवन विश्वविद्यालयबाट राजनीति शास्त्रमा स्नातकोत्तर (MA) सम्मको अध्ययन पूरा गरेका छन्।
                </p>
                <p>
                विद्यालय जीवनदेखि नै राजनीतिमा सक्रिय रन्जित नेकपा (माओवादी केन्द्र) को विद्यार्थी संगठन अनेरास्ववियु (क्रान्तिकारी) मा आवद्ध भए। उनी क्रमशः क्षेत्रीय सदस्य, जिल्ला सदस्य, झापा जिल्ला अध्यक्ष, केन्द्रीय सदस्य हुँदै २०७४ सालमा अनेरास्ववियुको पहिलो निर्वाचित केन्द्रीय समिति अध्यक्ष बन्न सफल भए।
                </p>
                <p>
                उनी आफ्नो कार्यकालमा विद्यार्थी आन्दोलनलाई नयाँ दिशा दिन सफल भए र सडक संघर्षमा अग्रणी नेतृत्व गरेका थिए। नेकपा (माओवादी केन्द्र) र नेकपा (एमाले) बीच एकता भएपछि उनी अनेरास्ववियुका सह–संयोजकको भूमिका निर्वाह गरेका थिए। हाल उनी नेकपा (माओवादी केन्द्र)का केन्द्रीय सदस्य तथा झापा जिल्ला इञ्चार्जका रूपमा क्रियाशील छन्।
                </p>
                <p>
                राजनीति मात्र होइन, उनी लेखनमा पनि सक्रिय छन्। विभिन्न खोजमूलक लेख, कविता, र गीतसमेत लेखेका छन्। उनले दुर्गा भट्टराईसँग विवाह गरेका छन् र एक छोरी आकृति तामाङ छन्।
                </p>
                <p>
                २०५८ सालको संकटकालीन समयमा उनी पक्राउ परी करिब दुई वर्षसम्म जेल जीवन बिताएका थिए। वर्तमानमा उनी नेपाली राजनीतिक वृत्तमा युवाहरूले मन पराउने उदीयमान नेता मध्येका एक मानिन्छन्।
                </p>
                <p>
                राजनीतिक, आर्थिक, सामाजिक र सांस्कृतिक रूपान्तरणको वकालत गर्दै आएका उनी उत्पीडित समुदायको हक अधिकार र सामाजिक न्यायका लागि अडिग छन्। आत्मनिर्भर अर्थतन्त्रका लागि मौलिक उत्पादन प्रणालीको आधुनिकीकरण गरी शिक्षा, स्वास्थ्य, रोजगारी र समृद्धिको लक्ष्यमा युवा पुस्ताले हातेमालो गर्नुपर्ने उनको परिवर्तनकारी सोच रहेको छ।
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={ABOUT}
                alt="Ranjit Tamang"
                className="rounded-lg mt-5 shadow-lg w-full lg:h-150 object-cover sm:h-96"
                loading="lazy"
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