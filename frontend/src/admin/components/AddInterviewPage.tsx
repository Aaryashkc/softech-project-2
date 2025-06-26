import React, { useState } from 'react';
import { useInterviewStore } from '../../stores/useInterviewStore';
import type { InterviewInput } from '../../stores/useInterviewStore';
import { 
  FileText, 
  Image, 
  Calendar, 
  Tag, 
  Star, 
  Loader2, 
  Mic,
  ExternalLink,
  Users 
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
  name: keyof InterviewInput;
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
  name: keyof InterviewInput;
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
      <option value="">Select {label.toLowerCase()}</option>
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

const AddInterviewPage: React.FC = () => {
  const { createInterview, isLoading } = useInterviewStore();
  
  const [formData, setFormData] = useState<InterviewInput>({
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    platform: '',
    featured: false,
    image: '',
    link: ''
  });

  interface FormErrors {
    title?: string;
    excerpt?: string;
    date?: string;
    category?: string;
    platform?: string;
    image?: string;
    link?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});

  // Interview categories
  const categoryOptions = [
    { value: 'business', label: 'Business & Finance' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'politics', label: 'Politics & Government' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'sports', label: 'Sports & Athletics' },
    { value: 'science', label: 'Science & Research' },
    { value: 'health', label: 'Health & Medicine' },
    { value: 'education', label: 'Education & Academia' },
    { value: 'lifestyle', label: 'Lifestyle & Culture' },
    { value: 'startup', label: 'Startup & Entrepreneurship' },
    { value: 'opinion', label: 'Opinion & Commentary' },
    { value: 'other', label: 'Other' }
  ];

  // Interview platforms
  const platformOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'tv', label: 'Television' },
    { value: 'radio', label: 'Radio' },
    { value: 'online', label: 'Online Platform' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'live-stream', label: 'Live Stream' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'conference', label: 'Conference' },
    { value: 'print', label: 'Print Media' },
    { value: 'other', label: 'Other' }
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
    } else if (formData.excerpt.trim().length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Interview date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.platform) {
      newErrors.platform = 'Platform is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Interview link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid interview URL';
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
      console.log('Submitting interview:', formData);
      await createInterview(formData);
      // Reset form on success
      setFormData({
        title: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        platform: '',
        featured: false,
        image: '',
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
      platform: '',
      featured: false,
      image: '',
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
            <Mic className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add Interview</h1>
          <p className="text-gray-600">Share an interview or conversation</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8">
          <div className="space-y-6">
            
            {/* Title */}
            <InputField
              label="Interview Title"
              name="title"
              icon={FileText}
              placeholder="Enter interview title (minimum 10 characters)"
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
                placeholder="Brief description of the interview content (20-300 characters)..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.excerpt ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
                maxLength={300}
              />
              <div className="flex justify-between items-center">
                {errors.excerpt && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {errors.excerpt}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.excerpt.length}/300 characters
                </p>
              </div>
            </div>

            {/* Date */}
            <InputField
              label="Interview Date"
              name="date"
              icon={Calendar}
              placeholder=""
              required
              value={formData.date}
              onChange={handleInputChange}
              error={errors.date}
              type="date"
            />

            {/* Category and Platform Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <SelectField
                label="Platform"
                name="platform"
                icon={Users}
                value={formData.platform}
                onChange={handleInputChange}
                options={platformOptions}
                error={errors.platform}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <InputField
                label="Thumbnail Image URL"
                name="image"
                icon={Image}
                placeholder="https://example.com/interview-thumbnail.jpg"
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
                    alt="Interview thumbnail preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Interview Link */}
            <InputField
              label="Interview Link"
              name="link"
              icon={ExternalLink}
              placeholder="https://youtube.com/watch?v=... or podcast link"
              required
              value={formData.link}
              onChange={handleInputChange}
              error={errors.link}
              type="url"
            />

            {/* Featured Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="w-4 h-4" />
                Featured Interview
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
                  Mark this interview as featured (will appear prominently on the homepage)
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
                    Adding...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Add Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-blue-900 mb-2">🎤 Interview Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use descriptive titles that highlight the main topic or guest</li>
            <li>• Keep excerpts concise but engaging to attract viewers</li>
            <li>• Choose clear, high-quality thumbnail images</li>
            <li>• Verify that all interview links are working and accessible</li>
            <li>• Select the most appropriate platform and category</li>
            <li>• Use featured status for high-profile or exclusive interviews</li>
            <li>• Include interview date to show recency and relevance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddInterviewPage;