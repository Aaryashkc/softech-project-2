import React, { useState } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';
import type { GalleryInput } from '../../stores/useGalleryStore';
import { FileText, Image, Loader2, X, Upload } from 'lucide-react';
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

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  base64?: string;
}

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
    images?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 50 * 1024 * 1024; //

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 50MB`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };

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

  const processFiles = async (files: File[]): Promise<ImageFile[]> => {
    const processedFiles: ImageFile[] = [];

    for (const file of files) {
      try {
        const preview = URL.createObjectURL(file);
        const base64 = await convertToBase64(file);
        
        processedFiles.push({
          file,
          preview,
          name: file.name,
          size: formatFileSize(file.size),
          base64
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast.error(`Failed to process ${file.name}`);
      }
    }

    return processedFiles;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      const processedFiles = await processFiles(validFiles);
      
      setImageFiles(prev => [...prev, ...processedFiles]);
      
      // Clear error if images were added
      if (errors.images && processedFiles.length > 0) {
        setErrors(prev => ({ ...prev, images: '' }));
      }

      toast.success(`${processedFiles.length} image(s) added successfully`);
    } catch (error) {
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => {
      const newFiles = prev.filter((_, index) => index !== indexToRemove);
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return newFiles;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(e.dataTransfer.files);
    
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      const processedFiles = await processFiles(validFiles);
      setImageFiles(prev => [...prev, ...processedFiles]);
      
      if (errors.images && processedFiles.length > 0) {
        setErrors(prev => ({ ...prev, images: '' }));
      }

      toast.success(`${processedFiles.length} image(s) added successfully`);
    } catch (error) {
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (imageFiles.length === 0) newErrors.images = 'At least one image is required';

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
      // Prepare images array with base64 data
      const imagesData = imageFiles.map(imageFile => imageFile.base64!);
      
      const submitData = {
        ...formData,
        images: imagesData
      };

      console.log('Submitting gallery data:', submitData);
      await createGallery(submitData);
      
      // Clean up object URLs
      imageFiles.forEach(imageFile => {
        URL.revokeObjectURL(imageFile.preview);
      });
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        images: []
      });
      setImageFiles([]);
      setErrors({});
    } catch (error) {
      console.error('Error creating gallery:', error);
      toast.error('Failed to create gallery');
    }
  };

  const clearForm = () => {
    // Clean up object URLs
    imageFiles.forEach(imageFile => {
      URL.revokeObjectURL(imageFile.preview);
    });
    
    setFormData({
      title: '',
      description: '',
      images: []
    });
    setImageFiles([]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Image className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Gallery</h1>
          <p className="text-gray-600">Create a beautiful gallery with multiple images</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8">
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

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4" />
                Upload Images
                <span className="text-red-500">*</span>
              </label>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="images-upload"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <label htmlFor="images-upload" className="cursor-pointer">
                  {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600 mb-2">Processing images...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WebP up to 50MB each</p>
                      <p className="text-sm text-gray-500">You can select multiple images at once</p>
                    </>
                  )}
                </label>
              </div>

              {errors.images && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-4 h-4">⚠️</span>
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Preview Grid */}
            {imageFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Gallery Preview ({imageFiles.length} image{imageFiles.length !== 1 ? 's' : ''})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      imageFiles.forEach(imageFile => {
                        URL.revokeObjectURL(imageFile.preview);
                      });
                      setImageFiles([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Remove All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {imageFiles.map((imageFile, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageFile.preview}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-1 rounded">
                        {imageFile.size}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* File Details */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  <div className="space-y-1">
                    {imageFiles.map((imageFile, index) => (
                      <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                        <span className="truncate flex-1">{imageFile.name}</span>
                        <span className="ml-2 text-gray-400">{imageFile.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={clearForm}
                className="w-full sm:flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading || isProcessing}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading || isProcessing || imageFiles.length === 0}
                className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default AddGalleryPage;