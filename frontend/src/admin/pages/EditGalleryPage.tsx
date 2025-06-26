import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';

const EditGalleryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchGalleryById, updateGallery } = useGalleryStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[]
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
            images: [...gallery.images]
          });
        }
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, [id, fetchGalleryById]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddImage = () => {
    if (currentImageUrl.trim() && !formData.images.includes(currentImageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, currentImageUrl.trim()]
      }));
      setCurrentImageUrl('');
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!id) return;

    try {
      await updateGallery(id, formData);
      navigate('/admin/gallery');
    } catch (error) {
      console.error('Error updating gallery:', error);
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
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Gallery</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter gallery title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Enter gallery description"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images *
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={currentImageUrl}
              onChange={(e) => setCurrentImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          
          {errors.images && <p className="mt-1 text-sm text-red-600 mb-2">{errors.images}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Updating...
              </>
            ) : (
              'Update Gallery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGalleryPage;
