import React, { useState, useEffect } from 'react';
import { useHomeStore, type HomeData } from '../../stores/useHomeStore';
import { availableIcons, getIcon } from '../../config/icon.config';
import { 
  User, Plus, X, Save, Loader2,
  Home as HomeIcon, Target, Heart, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const HomeManagement: React.FC = () => {
  const { homeData, fetchHome, updateHome, isLoading } = useHomeStore();
  const [formData, setFormData] = useState<Partial<HomeData>>({
    hero: {
      value: '',
      name: '',
      title: '',
      description: '',
      profileImage: '',
      buttons: []
    },
    highlights: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    initiatives: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    cta: {
      title: '',
      description: '',
      buttonText: '',
      buttonLink: ''
    }
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  useEffect(() => {
    if (homeData) {
      setFormData(homeData);
      setProfileImagePreview(homeData.hero.profileImage);
    }
  }, [homeData]);

  const handleHeroChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        [field]: value
      }
    }));
  };

  const handleButtonChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        buttons: prev.hero!.buttons.map((btn, i) => 
          i === index ? { ...btn, [field]: value } : btn
        )
      }
    }));
  };

  const addButton = () => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        buttons: [...prev.hero!.buttons, { text: '', link: '', type: 'primary' as const }]
      }
    }));
  };

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        buttons: prev.hero!.buttons.filter((_, i) => i !== index)
      }
    }));
  };

  const handleHighlightsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        [field]: value
      }
    }));
  };

  const handleHighlightItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        items: prev.highlights!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addHighlightItem = () => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        items: [...prev.highlights!.items, { icon: 'Users', title: '', description: '' }]
      }
    }));
  };

  const removeHighlightItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        items: prev.highlights!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleInitiativesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      initiatives: {
        ...prev.initiatives!,
        [field]: value
      }
    }));
  };

  const handleInitiativeItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      initiatives: {
        ...prev.initiatives!,
        items: prev.initiatives!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addInitiativeItem = () => {
    setFormData(prev => ({
      ...prev,
      initiatives: {
        ...prev.initiatives!,
        items: [...prev.initiatives!.items, { title: '', description: '', image: '', date: '', imageAlt: '' }]
      }
    }));
  };

  const removeInitiativeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      initiatives: {
        ...prev.initiatives!,
        items: prev.initiatives!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleInitiativeImageChange = (index: number, file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      handleInitiativeItemChange(index, 'image', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setProfileImagePreview(preview);
      handleHeroChange('profileImage', preview);
    };
    reader.readAsDataURL(file);
  };

  const handleCTAChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      cta: {
        ...prev.cta!,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHome(formData);
    } catch (error) {
      console.error('Error updating home:', error);
    }
  };

  if (isLoading && !homeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <HomeIcon className="w-8 h-8 text-red-700" />
          Home Page Management
        </h1>
        <p className="text-gray-600 mt-2">Manage all sections of the home page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="sticky top-0 z-10 p-4 rounded-lg mb-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-red-700" />
            Hero Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                value <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hero?.value || ''}
                onChange={(e) => handleHeroChange('value', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hero?.name || ''}
                onChange={(e) => handleHeroChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.hero?.description || ''}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image <span className="text-red-500">*</span>
              </label>
              {profileImagePreview && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-red-700"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buttons
              </label>
              {formData.hero?.buttons.map((button, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Link"
                    value={button.link}
                    onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={button.type}
                    onChange={(e) => handleButtonChange(index, 'type', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeButton(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addButton}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Button
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-700" />
            Highlights Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.highlights?.sectionTitle || ''}
                onChange={(e) => handleHighlightsChange('sectionTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.highlights?.sectionSubtitle || ''}
                onChange={(e) => handleHighlightsChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Items
              </label>
              {formData.highlights?.items.map((item, index) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-red-700" />
                      </div>
                      <select
                        value={item.icon}
                        onChange={(e) => handleHighlightItemChange(index, 'icon', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeHighlightItem(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => handleHighlightItemChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleHighlightItemChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addHighlightItem}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Highlight Item
              </button>
            </div>
          </div>
        </div>

        {/* Initiatives Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-red-700" />
            Initiatives Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.initiatives?.sectionTitle || ''}
                onChange={(e) => handleInitiativesChange('sectionTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.initiatives?.sectionSubtitle || ''}
                onChange={(e) => handleInitiativesChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initiative Items
              </label>
              {formData.initiatives?.items.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => handleInitiativeItemChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleInitiativeItemChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Date"
                        value={item.date}
                        onChange={(e) => handleInitiativeItemChange(index, 'date', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Image Alt Text"
                        value={item.imageAlt || ''}
                        onChange={(e) => handleInitiativeItemChange(index, 'imageAlt', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    {item.image && (
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.imageAlt || 'Initiative'}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleInitiativeImageChange(index, file);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeInitiativeItem(index)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addInitiativeItem}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Initiative Item
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-700" />
            Call to Action Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cta?.title || ''}
                onChange={(e) => handleCTAChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.cta?.description || ''}
                onChange={(e) => handleCTAChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cta?.buttonText || ''}
                  onChange={(e) => handleCTAChange('buttonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cta?.buttonLink || ''}
                  onChange={(e) => handleCTAChange('buttonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default HomeManagement;

