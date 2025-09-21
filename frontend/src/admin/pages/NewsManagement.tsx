// NewsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, Tag, Newspaper, Star, ExternalLink, X, Upload } from 'lucide-react';
import { useNewsStore } from '../../stores/useNewsStore';
import type { NewsArticle as StoreNewsArticle } from '../../stores/useNewsStore';
import toast from 'react-hot-toast';

// Local NewsArticle type that extends the one from the store
type NewsArticle = Omit<StoreNewsArticle, '_id'> & {
  id: string; // Using _id as id for compatibility with the component
};

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  base64?: string;
}

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
        toast.error('Failed to delete article');
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedArticle: NewsArticle, newImageBase64?: string) => {
    try {
      const updateData = {
        title: updatedArticle.title,
        excerpt: updatedArticle.excerpt,
        date: updatedArticle.date,
        category: updatedArticle.category,
        featured: updatedArticle.featured,
        image: newImageBase64 || updatedArticle.image, // Use new image or keep existing
        source: updatedArticle.source,
        link: updatedArticle.link
      };

      await updateNews(updatedArticle.id, updateData);
      setShowEditModal(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
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
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                }}
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
  onSave: (article: NewsArticle, newImageBase64?: string) => void;
  onCancel: () => void;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewsArticle>({ ...article });
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsProcessing(true);

    try {
      const preview = URL.createObjectURL(file);
      const base64 = await convertToBase64(file);

      const newImageFile: ImageFile = {
        file,
        preview,
        name: file.name,
        size: formatFileSize(file.size),
        base64
      };

      setImageFile(newImageFile);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.preview);
      setImageFile(null);
    }
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    // Pass the new image base64 if a new image was uploaded
    onSave(formData, imageFile?.base64);
    
    // Clean up object URL
    if (imageFile) {
      URL.revokeObjectURL(imageFile.preview);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article URL *</label>
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

              {/* Right Column - Image Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Image
                  </label>

                  {/* Current Image Display */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <img
                      src={formData.image}
                      alt="Current article"
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>

                  {/* New Image Upload */}
                  {!imageFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isProcessing}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {isProcessing ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-gray-600">Processing image...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Click to upload new image</p>
                            <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 font-medium">New Image Preview:</p>
                      <div className="relative">
                        <img
                          src={imageFile.preview}
                          alt="New article preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                        <p><strong>File:</strong> {imageFile.name}</p>
                        <p><strong>Size:</strong> {imageFile.size}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;