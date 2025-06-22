import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Briefcase } from 'lucide-react';
import Profile from "../assets/profile.jpeg";

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Ranjit Tamang
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-red-100">
                Political Leader & Social Advocate
              </p>
              <p className="text-lg mb-8 text-red-50 max-w-2xl">
                Central Committee Member of CPN (Maoist Centre), dedicated to progressive 
                politics and social justice in Nepal. Fighting for free education, healthcare, 
                and equal opportunities for all Nepali citizens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-700 transition-colors duration-200"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <img 
                  src={Profile}
                  alt="Ranjit Tamang"
                  className="w-72 h-72 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Leadership & Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From student activism to national politics, a journey of dedication to Nepal's progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Leadership</h3>
              <p className="text-gray-600">
                First democratically elected Chairman of ANNISU (R) in 2017, 
                championing student rights and educational reforms.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Party Leadership</h3>
              <p className="text-gray-600">
                Central Committee Member of CPN (Maoist Centre) since 2021, 
                representing the voice of youth in national politics.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Advocacy</h3>
              <p className="text-gray-600">
                Passionate advocate for free education, healthcare, and social justice, 
                working tirelessly for grassroots communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recent Initiatives
            </h2>
            <p className="text-xl text-gray-600">
              Current projects and campaigns making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src="https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"
                alt="Tarai-Madhes Campaign"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tarai-Madhes Awareness Campaign
                </h3>
                <p className="text-gray-600 mb-4">
                  Leading the grassroots mobilization effort as Jhapa in-charge, 
                  connecting with communities across the region to strengthen democratic participation.
                </p>
                <span className="text-red-700 font-medium">February 2025</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src="https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"
                alt="Youth Inclusion Initiative"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Youth Inclusion in Politics
                </h3>
                <p className="text-gray-600 mb-4">
                  Part of the historic 20% under-40 quota implementation in the Central Committee, 
                  ensuring young voices shape Nepal's political future.
                </p>
                <span className="text-red-700 font-medium">December 2021</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Join the Movement for Change
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Together, we can build a more just and equitable Nepal. 
            Get involved in our initiatives for education, healthcare, and social progress.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
          >
            Connect With Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;