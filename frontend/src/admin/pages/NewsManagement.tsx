// NewsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, Tag, Newspaper, Star, ExternalLink, X } from 'lucide-react';
import { useNewsStore } from '../../stores/useNewsStore';
import type { NewsArticle as StoreNewsArticle } from '../../stores/useNewsStore';

// Local NewsArticle type that extends the one from the store
type NewsArticle = Omit<StoreNewsArticle, '_id'> & {
  id: string; // Using _id as id for compatibility with the component
};

const NewsManagement: React.FC = () => {
  const { news, isLoading, fetchNews, deleteNews, updateNews } = useNewsStore();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Transform news data to match the component's expected format
  const newsArticles = news.map(article => ({
    ...article,
    id: article._id // Map _id to id for compatibility
  }));

  // Handle view article
  const handleViewArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowViewModal(true);
  };

  // Handle edit article
  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowEditModal(true);
  };

  // Handle delete article
  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteNews(articleId);
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedArticle: NewsArticle) => {
    try {
      await updateNews(updatedArticle.id, {
        title: updatedArticle.title,
        excerpt: updatedArticle.excerpt,
        date: updatedArticle.date,
        category: updatedArticle.category,
        featured: updatedArticle.featured,
        image: updatedArticle.image,
        source: updatedArticle.source,
        link: updatedArticle.link
      });
      setShowEditModal(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">News Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your news articles</p>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Article Image */}
            <div className="h-48 bg-gray-200 overflow-hidden relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {article.featured && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star size={12} />
                  Breaking
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {article.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(article.date)}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Tag size={16} className="mr-2" />
                  {article.category}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Newspaper size={16} className="mr-2" />
                  {article.source}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewArticle(article)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleEditArticle(article)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Article Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="mb-4 relative">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {selectedArticle.featured && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1">
                    <Star size={16} />
                    Breaking News
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{selectedArticle.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{formatDate(selectedArticle.date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Tag size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p>{selectedArticle.category}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 md:col-span-2">
                  <Newspaper size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Source</p>
                    <p>{selectedArticle.source}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Excerpt</p>
                <p className="text-gray-600">{selectedArticle.excerpt}</p>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Article Link</p>
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 break-all"
                >
                  <ExternalLink size={16} />
                  {selectedArticle.link}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedArticle && (
        <EditArticleModal
          article={selectedArticle}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedArticle(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Article Modal Component
interface EditArticleModalProps {
  article: NewsArticle;
  onSave: (article: NewsArticle) => void;
  onCancel: () => void;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewsArticle>({ ...article });

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Article</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
                <X size={16} />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article URL</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Article
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;