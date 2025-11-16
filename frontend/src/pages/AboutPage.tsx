import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAboutPageModel } from '../hooks/useAboutPageModel';

const AboutPage = () => {
  const { aboutModel, isLoading } = useAboutPageModel();

  useEffect(() => {
    // Data is fetched automatically by useAboutPageModel hook
  }, []);

  if (isLoading || !aboutModel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {aboutModel.hero.title}
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              {aboutModel.hero.subtitle}
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
                {aboutModel.biography.title}
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                {aboutModel.biography.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            {aboutModel.biography.image && (
              <div className="flex justify-center">
                <img 
                  src={aboutModel.biography.image}
                  alt="Ranjit Tamang"
                  className="rounded-lg mt-5 shadow-lg w-full lg:h-150 object-cover sm:h-96"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {aboutModel.coreValues.sectionTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutModel.coreValues.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutModel.coreValues.items.map((item, index) => {
              const IconComponent = item.iconComponent;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-red-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {aboutModel.vision.title}
          </h2>
          <blockquote className="text-xl lg:text-2xl text-red-100 italic leading-relaxed">
            "{aboutModel.vision.quote}"
          </blockquote>
          <footer className="mt-8 text-lg text-red-200">
            — {aboutModel.vision.author}
          </footer>
        </div>
      </section>

      {/* Personal Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {aboutModel.philosophy.title}
              </h2>
              <div className="space-y-6 text-gray-600 text-lg">
                {aboutModel.philosophy.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{aboutModel.philosophy.priorities.title}</h3>
              <ul className="space-y-4">
                {aboutModel.philosophy.priorities.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;