import React, { useState } from 'react';
import { useEventStore } from '../../stores/useEventStore';
import type { EventInput } from '../../stores/useEventStore';
import { Calendar, Clock, MapPin, FileText, Image, Plus, Loader2, Upload, X } from 'lucide-react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear any existing errors
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
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Image is required (you can make this optional if needed)
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

      // If there's a new image file, convert it to base64
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
      
      // Reset form on success
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: ''
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
      date: '',
      time: '',
      location: '',
      description: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Image className="w-4 h-4" />
                Event Image
                <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
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
                onClick={clearForm}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading || uploadingImage}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading || uploadingImage}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading || uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingImage ? 'Processing Image...' : 'Creating Event...'}
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
      </div>
    </div>
  );
};

export default AddEventPage;