import React, { useState } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';
import type { GalleryInput } from '../../stores/useGalleryStore';
import { FileText, Image, Plus, Loader2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const InputField = ({ 
  label, 
  name, 
  icon: Icon, 
  placeholder, 
  required = false,
  value,
  onChange,
  error
}: {
  label: string;
  name: keyof Omit<GalleryInput, 'images'>;
  icon: React.ElementType;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
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

const AddGalleryPage: React.FC = () => {
  const { createGallery, isLoading } = useGalleryStore();
  
  const [formData, setFormData] = useState<GalleryInput>({
    title: '',
    description: '',
    images: []
  });

  interface FormErrors {
    title?: string;
    description?: string;
    imageUrl?: string;
    images?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof GalleryInput]) {
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

  const addImageUrl = () => {
    if (!currentImageUrl.trim()) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please enter an image URL' }));
      return;
    }

    if (!isValidUrl(currentImageUrl)) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please enter a valid image URL' }));
      return;
    }

    if (formData.images.includes(currentImageUrl)) {
      setErrors(prev => ({ ...prev, imageUrl: 'This image URL is already added' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, currentImageUrl]
    }));
    setCurrentImageUrl('');
    setErrors(prev => ({ ...prev, imageUrl: '' }));
  };

  const removeImageUrl = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return
    }

    try {
      console.log('Submitting gallery data:', formData);
      await createGallery(formData);
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        images: []
      });
      setCurrentImageUrl('');
      setErrors({});
    } catch (error) {
    }
  };

  const handleImageUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Image className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Gallery</h1>
          <p className="text-gray-600">Create a beautiful gallery with multiple images</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <InputField
              label="Gallery Title"
              name="title"
              icon={FileText}
              placeholder="Enter gallery title"
              required
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Description
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your gallery..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image URL Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4" />
                Add Images
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={currentImageUrl}
                  onChange={(e) => {
                    setCurrentImageUrl(e.target.value);
                    if (errors.imageUrl) {
                      setErrors(prev => ({ ...prev, imageUrl: '' }));
                    }
                  }}
                  onKeyPress={handleImageUrlKeyPress}
                  placeholder="https://example.com/image.jpg"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.imageUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {errors.imageUrl && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.imageUrl}
                </p>
              )}
              {errors.images && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gallery Preview ({formData.images.length} image{formData.images.length !== 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    images: []
                  });
                  setCurrentImageUrl('');
                  setErrors({});
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    Create Gallery
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">🎨 Gallery Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use high-quality image URLs for the best gallery experience</li>
            <li>• Make sure all image URLs are publicly accessible</li>
            <li>• You can add multiple images - press Enter or click Add after each URL</li>
            <li>• Images will be displayed in the order you add them</li>
            <li>• Click the X button on any image preview to remove it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddGalleryPage;