import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExistingImage {
  url: string;
  type: 'existing';
}

interface NewImageFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  base64?: string;
  type: 'new';
}

type ImageItem = ExistingImage | NewImageFile;

const EditGalleryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchGalleryById, updateGallery } = useGalleryStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[]
  });

  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadGallery = async () => {
      if (!id) return;
      try {
        const gallery = await fetchGalleryById(id);
        if (gallery) {
          setFormData({
            title: gallery.title,
            description: gallery.description,
            images: gallery.images.map(img => img.url) // Extract URLs from image objects
          });

          // Convert existing image objects to ImageItem format
          const existingImages: ExistingImage[] = gallery.images.map(img => ({
            url: img.url,
            type: 'existing'
          }));
          setImageItems(existingImages);
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
        toast.error('Failed to load gallery');
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, [id]); // Remove fetchGalleryById dependency to prevent multiple calls

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

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  const processFiles = async (files: File[]): Promise<NewImageFile[]> => {
    const processedFiles: NewImageFile[] = [];

    for (const file of files) {
      try {
        const preview = URL.createObjectURL(file);
        const base64 = await convertToBase64(file);
        
        processedFiles.push({
          file,
          preview,
          name: file.name,
          size: formatFileSize(file.size),
          base64,
          type: 'new'
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
      setImageItems(prev => [...prev, ...processedFiles]);
      
      if (errors.images && processedFiles.length > 0) {
        setErrors(prev => ({ ...prev, images: '' }));
      }

      toast.success(`${processedFiles.length} image(s) added successfully`);
    } catch (error) {
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const validFiles = validateFiles(e.dataTransfer.files);
    
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      const processedFiles = await processFiles(validFiles);
      setImageItems(prev => [...prev, ...processedFiles]);
      
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

  const removeImage = (indexToRemove: number) => {
    setImageItems(prev => {
      const newItems = prev.filter((_, index) => index !== indexToRemove);
      
      // Revoke object URL for new files to prevent memory leaks
      const removedItem = prev[indexToRemove];
      if (removedItem.type === 'new') {
        URL.revokeObjectURL(removedItem.preview);
      }
      
      return newItems;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (imageItems.length === 0) {
      newErrors.images = 'At least one image is required';
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

    if (!id) return;

    setIsUpdating(true);

    try {
      // Prepare images array - mix of existing URLs and new base64 data
      const imagesData: string[] = [];
      
      for (const item of imageItems) {
        if (item.type === 'existing') {
          imagesData.push(item.url);
        } else {
          imagesData.push(item.base64!);
        }
      }

      const submitData = {
        title: formData.title,
        description: formData.description,
        images: imagesData
      };

      await updateGallery(id, submitData);
      
      // Clean up object URLs
      imageItems.forEach(item => {
        if (item.type === 'new') {
          URL.revokeObjectURL(item.preview);
        }
      });
      
      toast.success('Gallery updated successfully!');
      navigate('/admin/gallery');
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast.error('Failed to update gallery');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Gallery</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter gallery title"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Enter gallery description"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Images *
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
                      <p className="text-gray-600 mb-2">Click to add more images or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB each</p>
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
            {imageItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Gallery Images ({imageItems.length} image{imageItems.length !== 1 ? 's' : ''})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      // Clean up object URLs for new files
                      imageItems.forEach(item => {
                        if (item.type === 'new') {
                          URL.revokeObjectURL(item.preview);
                        }
                      });
                      setImageItems([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Remove All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {imageItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={item.type === 'existing' ? item.url : item.preview}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      
                      {/* Image type badge */}
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        {item.type === 'new' && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      {item.type === 'new' && (
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-1 rounded">
                          {item.size}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* File Details for New Images */}
                {imageItems.some(item => item.type === 'new') && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">New Files Added:</p>
                    <div className="space-y-1">
                      {imageItems
                        .filter(item => item.type === 'new')
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-green-50 px-3 py-2 rounded">
                            <span className="truncate flex-1">{item.name}</span>
                            <span className="ml-2 text-gray-400">{item.size}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/gallery')}
                className="w-full sm:flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isUpdating || isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || isProcessing || imageItems.length === 0}
                className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  'Update Gallery'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGalleryPage;