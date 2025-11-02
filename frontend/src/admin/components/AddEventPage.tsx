import React, { useState } from 'react';
import { useEventStore } from '../../stores/useEventStore';
import type { EventInput } from '../../stores/useEventStore';
import { Calendar, Clock, MapPin, FileText, Image, Plus, Loader2, Upload, X} from 'lucide-react';
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
  error,
  disabled = false
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
  disabled?: boolean;
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
      disabled={disabled}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
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
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    isComingSoon: false
  });

  const [errors, setErrors] = useState<Partial<EventInput>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof EventInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleComingSoonToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      isComingSoon: isChecked,
      ...(isChecked && {
        date: '',
        time: '',
        location: ''
      })
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventInput> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    
    if (!imageFile && !formData.image) {
      newErrors.image = 'Image is required';
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
      let imageData = formData.image;

      if (imageFile) {
        setUploadingImage(true);
        try {
          imageData = await convertToBase64(imageFile);
        } catch (error) {
          toast.error('Failed to process image');
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const eventData = {
        ...formData,
        image: imageData
      };

      console.log('Submitting form data:', eventData);
      await createEvent(eventData);
      
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        isComingSoon: false
      });
      setImageFile(null);
      setImagePreview('');
      setErrors({});
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: '',
      isComingSoon: false
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
            <Plus className="w-7 h-7 text-blue-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Coming Soon Toggle */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-700 rounded-lg p-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isComingSoon}
                onChange={handleComingSoonToggle}
                className="w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">Mark as Coming Soon</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {errors.description}
                  </p>
                )}
              </div>

              <InputField
                label="Date"
                name="date"
                type="date"
                icon={Calendar}
                placeholder=""
                value={formData.date || ''}
                onChange={handleInputChange}
                error={errors.date}
                disabled={formData.isComingSoon}
              />

              <InputField
                label="Time"
                name="time"
                type="time"
                icon={Clock}
                placeholder=""
                value={formData.time || ''}
                onChange={handleInputChange}
                error={errors.time}
                disabled={formData.isComingSoon}
              />

              <InputField
                label="Location"
                name="location"
                icon={MapPin}
                placeholder="Enter event location"
                value={formData.location || ''}
                onChange={handleInputChange}
                error={errors.location}
                disabled={formData.isComingSoon}
              />
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Image className="w-4 h-4" />
                Event Image
                <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-700 transition-colors h-full min-h-[400px] flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2 text-lg font-medium">Click to upload an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative h-full min-h-[400px]">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
                    {imageFile?.name}
                  </div>
                </div>
              )}
              
              {errors.image && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={clearForm}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading || uploadingImage}
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading || uploadingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadingImage ? 'Processing Image...' : 'Creating Event...'}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;