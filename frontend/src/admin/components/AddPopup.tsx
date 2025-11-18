import React, { useState } from 'react';
import { usePopupStore, type PopupInput } from '../../stores/usePopupStore';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddPopupPage: React.FC = () => {
  const { createPopup, isLoading } = usePopupStore();

  const [formData, setFormData] = useState<PopupInput>({
    title: '',
    message: '',
    image: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<PopupInput>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof PopupInput]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid image type');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
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
    const newErrors: Partial<PopupInput> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!imageFile && !formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

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

    try {
      await createPopup({ ...formData, image: imageData });
      toast.success('Popup created successfully!');
      setFormData({ title: '', message: '', image: '', isActive: true });
      setImageFile(null);
      setImagePreview('');
      setErrors({});
    } catch (error) {
      toast.error('Failed to create popup');
    }
  };

  const clearForm = () => {
    setFormData({ title: '', message: '', image: '', isActive: true });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Popup</h1>
          <p className="text-gray-600">Fill in the details to create your popup</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  id="popup-active"
                  className="w-4 h-4 text-blue-700 border-gray-300 rounded"
                />
                <label htmlFor="popup-active" className="text-gray-700 text-sm">Active</label>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image <span className="text-red-500">*</span>
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
                    alt="Popup preview"
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
              {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
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
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Create Popup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPopupPage;
