import { Calendar, ArrowRight, Newspaper, Mic, Play, Share2 } from 'lucide-react';
import { useState } from 'react';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featured: boolean;
  image: string;
  source: string;
  link: string;
}

interface Interview {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  platform: string;
  featured: boolean;
  image: string;
  link: string;
}

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Demo data - this will be replaced with backend data later
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Ranjit Tamang Calls for Educational Reform in National Assembly",
      excerpt: "In a passionate speech at the National Assembly, Ranjit Tamang outlined comprehensive plans for making quality education accessible to all Nepali citizens.",
      date: "2025-06-18",
      category: "news",
      featured: true,
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop",
      source: "The Kathmandu Post",
      link: "https://kathmandupost.com/politics/2025/06/18/educational-reform-assembly"
    }
  ];

  const interviews: Interview[] = [
    {
      id: 1,
      title: "In Conversation: Ranjit Tamang on Nepal's Democratic Future",
      excerpt: "An in-depth discussion about progressive politics, social justice, and the role of youth in Nepal's transformation.",
      date: "2025-06-20",
      category: "interview",
      platform: "Nepal Television",
      featured: false,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      link: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];

  const allContent = [...newsArticles, ...interviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getFilteredContent = (): (NewsArticle | Interview)[] => {
    switch(activeTab) {
      case 'news':
        return newsArticles;
      case 'interviews':
        return interviews;
      default:
        return allContent;
    }
  };

  const filteredContent = getFilteredContent();
  const featuredContent = filteredContent.filter(item => item.featured);
  const regularContent = filteredContent.filter(item => !item.featured);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleNavigation = (link: string) => {
    // Open external links in a new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        {article.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-red-600 font-medium">{article.source}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(article.date)}
          </div>
          
          <button 
            onClick={() => handleNavigation(article.link)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  const InterviewCard = ({ interview }: { interview: Interview }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={interview.image} 
          alt={interview.title}
          className="w-full h-48 object-cover"
        />
        {interview.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-600 bg-opacity-80 hover:bg-opacity-90 rounded-full p-4 transition-all duration-200">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-red-600 font-medium">{interview.platform}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{interview.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{interview.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(interview.date)}
          </div>
          
          <button 
            onClick={() => handleNavigation(interview.link)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            Watch
            <Play className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              News & Interviews
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              Stay informed about our political activities, policy positions, and community engagement initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              All Content
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                activeTab === 'news'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              News Articles
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                activeTab === 'interviews'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Mic className="h-4 w-4 mr-2" />
              Interviews
            </button>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {featuredContent.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Content
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Highlighting our most important political discussions and policy announcements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredContent.map((item) => (
                'source' in item ? 
                  <NewsCard key={`news-${item.id}`} article={item} /> : 
                  <InterviewCard key={`interview-${item.id}`} interview={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {activeTab === 'news' ? 'Latest News' : activeTab === 'interviews' ? 'Recent Interviews' : 'Recent Updates'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeTab === 'news' 
                ? 'Stay updated with our latest political activities and policy positions'
                : activeTab === 'interviews'
                ? 'In-depth conversations about Nepal\'s future and our political vision'
                : 'Complete coverage of our political activities and media appearances'
              }
            </p>
          </div>

          {regularContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularContent.map((item) => (
                'source' in item ? 
                  <NewsCard key={`news-${item.id}`} article={item} /> : 
                  <InterviewCard key={`interview-${item.id}`} interview={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No content available in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Stay Informed
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Subscribe to our newsletter for the latest updates on political activities, 
            policy positions, and community engagement initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe to Newsletter
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition-colors duration-200 flex items-center justify-center">
              <Share2 className="h-4 w-4 mr-2" />
              Follow on Social Media
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;