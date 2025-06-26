import React, { useState } from 'react';
import { useNewsStore } from '../../stores/useNewsStore';
import type { NewsInput } from '../../stores/useNewsStore';
import { 
  FileText, 
  Image, 
  Calendar, 
  Tag, 
  Star, 
  Loader2, 
  Newspaper,
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const InputField = ({ 
  label, 
  name, 
  icon: Icon, 
  placeholder, 
  required = false,
  value,
  onChange,
  error,
  type = "text"
}: {
  label: string;
  name: keyof NewsInput;
  icon: React.ElementType;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
      required={required}
    />
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <span className="w-4 h-4">⚠️</span>
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  options,
  error,
  required = false
}: {
  label: string;
  name: keyof NewsInput;
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
      required={required}
    >
      <option value="">Select a category</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <span className="w-4 h-4">⚠️</span>
        {error}
      </p>
    )}
  </div>
);

const AddNewsPage: React.FC = () => {
  const { createNews, isLoading } = useNewsStore();
  
  const [formData, setFormData] = useState<NewsInput>({
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    category: '',
    featured: false,
    image: '',
    source: '',
    link: ''
  });

  interface FormErrors {
    title?: string;
    excerpt?: string;
    date?: string;
    category?: string;
    image?: string;
    source?: string;
    link?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});

  // News categories
  const categoryOptions = [
    { value: 'breaking', label: 'Breaking News' },
    { value: 'politics', label: 'Politics' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' },
    { value: 'world', label: 'World News' },
    { value: 'local', label: 'Local News' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Article link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid article URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      console.log('Submitting news article:', formData);
      await createNews(formData);
      // Reset form on success
      setFormData({
        title: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        featured: false,
        image: '',
        source: '',
        link: ''
      });
      setErrors({});
    } catch (error) {
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      featured: false,
      image: '',
      source: '',
      link: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Newspaper className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add News Article</h1>
          <p className="text-gray-600">Create and publish a new news article</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8">
          <div className="space-y-6">
            
            {/* Title */}
            <InputField
              label="Article Title"
              name="title"
              icon={FileText}
              placeholder="Enter article title (minimum 10 characters)"
              required
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
            />

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Excerpt
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the article (minimum 20 characters)..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.excerpt ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.excerpt}
                </p>
              )}
            </div>

            {/* Date and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Publication Date"
                name="date"
                icon={Calendar}
                placeholder=""
                required
                value={formData.date}
                onChange={handleInputChange}
                error={errors.date}
                type="date"
              />

              <SelectField
                label="Category"
                name="category"
                icon={Tag}
                value={formData.category}
                onChange={handleInputChange}
                options={categoryOptions}
                error={errors.category}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <InputField
                label="Featured Image URL"
                name="image"
                icon={Image}
                placeholder="https://example.com/image.jpg"
                required
                value={formData.image}
                onChange={handleInputChange}
                error={errors.image}
                type="url"
              />
              
              {/* Image Preview */}
              {formData.image && isValidUrl(formData.image) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img
                    src={formData.image}
                    alt="Article preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Source and Link Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="News Source"
                name="source"
                icon={Newspaper}
                placeholder="e.g., BBC News, CNN, Reuters"
                required
                value={formData.source}
                onChange={handleInputChange}
                error={errors.source}
              />

              <InputField
                label="Article Link"
                name="link"
                icon={ExternalLink}
                placeholder="https://example.com/full-article"
                required
                value={formData.link}
                onChange={handleInputChange}
                error={errors.link}
                type="url"
              />
            </div>

            {/* Featured Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="w-4 h-4" />
                Featured Article
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="featured" className="text-sm text-gray-600">
                  Mark this article as featured (will appear prominently on the homepage)
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={clearForm}
                className="w-full sm:flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Newspaper className="w-4 h-4" />
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-blue-900 mb-2">📰 Publishing Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Write clear, engaging titles that accurately represent the content</li>
            <li>• Keep excerpts concise but informative to give readers a preview</li>
            <li>• Choose high-quality, relevant images that enhance the story</li>
            <li>• Always verify and link to the original source article</li>
            <li>• Use featured articles sparingly for the most important news</li>
            <li>• Double-check all URLs to ensure they're working and accessible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddNewsPage;