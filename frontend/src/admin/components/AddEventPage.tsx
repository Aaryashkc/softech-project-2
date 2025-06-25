import React, { useState } from 'react';
import { useEventStore } from '../../stores/useEventStore';
import type { EventInput } from '../../stores/useEventStore';
import { Calendar, Clock, MapPin, FileText, Image, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  icon: Icon, 
  placeholder, 
  required = false,
  value,
  onChange,
  error
}: {
  label: string;
  name: keyof EventInput;
  type?: string;
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

const AddEventPage: React.FC = () => {
  const { createEvent, isLoading } = useEventStore();
  
  const [formData, setFormData] = useState<EventInput>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: ''
  });

  const [errors, setErrors] = useState<Partial<EventInput>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof EventInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventInput> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Validate image URL format
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      await createEvent(formData);
      // Reset form on success
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: ''
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <InputField
              label="Event Title"
              name="title"
              icon={FileText}
              placeholder="Enter event title"
              required
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Date"
                name="date"
                type="date"
                icon={Calendar}
                placeholder=""
                required
                value={formData.date}
                onChange={handleInputChange}
                error={errors.date}
              />
              <InputField
                label="Time"
                name="time"
                type="time"
                icon={Clock}
                placeholder=""
                required
                value={formData.time}
                onChange={handleInputChange}
                error={errors.time}
              />
            </div>

            <InputField
              label="Location"
              name="location"
              icon={MapPin}
              placeholder="Enter event location"
              required
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
            />

            <InputField
              label="Image URL"
              name="image"
              type="url"
              icon={Image}
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
              error={errors.image}
            />

            {/* Image Preview */}
            {formData.image && isValidUrl(formData.image) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Image Preview</label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
              </div>
            )}

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
                placeholder="Describe your event..."
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

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    date: '',
                    time: '',
                    location: '',
                    description: '',
                    image: ''
                  });
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
                    <Plus className="w-4 h-4" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Image URL Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use direct image URLs</li>
            <li>• Make sure the image URL is publicly accessible</li>
            <li>• Right-click on any image and select "Copy image address"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;