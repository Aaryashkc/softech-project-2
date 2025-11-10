import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { achievementModel } from '../models/AchievementModel';

const Achievement: React.FC = () => {
  const [expandedStat, setExpandedStat] = useState<number | null>(null);

  const toggleStat = (id: number) => {
    setExpandedStat(expandedStat === id ? null : id);
  };

  return (
    <div>
      {/* Hero Section - Using achievementModel */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {achievementModel.hero.title}
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              {achievementModel.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics with Expandable Details - Using achievementModel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievementModel.stats.map((stat) => (
              <div 
                key={stat.id} 
                className={`text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  expandedStat === stat.id ? 'md:col-span-2 lg:col-span-4' : ''
                }`}
                onClick={() => toggleStat(stat.id)}
              >
                {/* Compact View */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-red-700" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium mb-2">{stat.label}</div>
                
                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center mt-2">
                  {expandedStat === stat.id ? (
                    <ChevronUp className="h-5 w-5 text-red-700" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Expanded Details */}
                {expandedStat === stat.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 text-left animate-fadeIn">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {stat.details.title}
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {stat.details.description}
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Highlights:</h4>
                      <ul className="space-y-3">
                        {stat.details.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Achievements - Using achievementModel */}
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
            {achievementModel.achievements.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mr-6`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {category.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
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

      {/* Media Recognition - Using achievementModel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {achievementModel.mediaRecognition.sectionTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {achievementModel.mediaRecognition.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievementModel.mediaRecognition.items.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  <span className={`text-sm font-medium ${item.outletColor} px-3 py-1 rounded-full`}>
                    {item.outlet}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500">{item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals - Using achievementModel */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {achievementModel.futureGoals.title}
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            {achievementModel.futureGoals.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-red-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {achievementModel.futureGoals.immediate.title}
              </h3>
              <ul className="text-red-100 space-y-2 text-sm">
                {achievementModel.futureGoals.immediate.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {achievementModel.futureGoals.longTerm.title}
              </h3>
              <ul className="text-red-100 space-y-2 text-sm">
                {achievementModel.futureGoals.longTerm.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Achievement;