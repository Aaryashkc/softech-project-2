import { Calendar, ArrowRight, Newspaper, Mic, Play, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNewsStore, type NewsArticle } from '../stores/useNewsStore';
import { useInterviewStore, type Interview } from '../stores/useInterviewStore';

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'interviews'>('all');
  const { news, fetchNews, isLoading: newsLoading } = useNewsStore();
  const { interviews, fetchInterviews, isLoading: interviewsLoading } = useInterviewStore();

  useEffect(() => {
    fetchNews();
    fetchInterviews();
    // eslint-disable-next-line
  }, []);

  // Merge and sort all content by date (desc)
  const allContent = useMemo(() => {
    const mappedNews = news.map((n) => ({ ...n, type: 'news' as const }));
    const mappedInterviews = interviews.map((i) => ({ ...i, type: 'interview' as const }));
    return [...mappedNews, ...mappedInterviews].sort((a, b) => {
      const aDate = a.type === 'news' ? new Date(a.date).getTime() : new Date(a.createdAt || 0).getTime();
      const bDate = b.type === 'news' ? new Date(b.date).getTime() : new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, [news, interviews]);

  const getFilteredContent = () => {
    if (activeTab === 'news') return news.map((n) => ({ ...n, type: 'news' as const }));
    if (activeTab === 'interviews') return interviews.map((i) => ({ ...i, type: 'interview' as const }));
    return allContent;
  };

  const filteredContent = getFilteredContent();
  const featuredContent = filteredContent.filter((item) => item.featured);
  const regularContent = filteredContent.filter((item) => !item.featured);

  // Fallback: latest two items across all content (news + interviews)
  const fallbackContent = useMemo(() => allContent.slice(0, 2), [allContent]);

  const isLoading = newsLoading || interviewsLoading;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNavigation = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-64 object-cover"
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
          className="w-full h-64 object-cover"
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
          <div />
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        </div>
      )}

      {/* Featured Content */}
      {!isLoading && featuredContent.length > 0 && (
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
              {featuredContent.map((item) =>
                item.type === 'news' ? (
                  <NewsCard key={`news-${item._id}`} article={item} />
                ) : (
                  <InterviewCard key={`interview-${item._id}`} interview={item} />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Content */}
      {!isLoading && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {activeTab === 'news'
                  ? 'Latest News'
                  : activeTab === 'interviews'
                  ? 'Recent Interviews'
                  : 'Recent Updates'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {activeTab === 'news'
                  ? 'Stay updated with our latest political activities and policy positions'
                  : activeTab === 'interviews'
                  ? "In-depth conversations about Nepal's future and our political vision"
                  : 'Complete coverage of our political activities and media appearances'}
              </p>
            </div>
            {regularContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularContent.map((item) =>
                  item.type === 'news' ? (
                    <NewsCard key={`news-${item._id}`} article={item} />
                  ) : (
                    <InterviewCard key={`interview-${item._id}`} interview={item} />
                  )
                )}
              </div>
            ) : (
              <div>
                <div className="text-center py-6">
                  <p className="text-gray-500">No items in this category. Showing latest updates instead.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {fallbackContent.map((item) =>
                    item.type === 'news' ? (
                      <NewsCard key={`news-fallback-${item._id}`} article={item} />
                    ) : (
                      <InterviewCard key={`interview-fallback-${item._id}`} interview={item} />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

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