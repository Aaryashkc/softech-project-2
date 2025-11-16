import React, { useState, useEffect } from 'react';
import { useAboutPageStore, type AboutData } from '../../stores/useAboutPageStore';
import { availableIcons, getIcon } from '../../config/icon.config';
import { 
  Plus, X, Save, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AboutManagement: React.FC = () => {
  const { aboutData, fetchAbout, updateAbout, isLoading } = useAboutPageStore();
  const [formData, setFormData] = useState<Partial<AboutData>>({
    hero: {
      title: '',
      subtitle: ''
    },
    biography: {
      title: '',
      image: '',
      paragraphs: []
    },
    coreValues: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    vision: {
      title: '',
      quote: '',
      author: ''
    },
    philosophy: {
      title: '',
      paragraphs: [],
      priorities: {
        title: '',
        items: []
      }
    }
  });

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  useEffect(() => {
    if (aboutData) {
      setFormData(aboutData);
    }
  }, [aboutData]);

  const handleHeroChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        [field]: value
      }
    }));
  };

  const handleBiographyChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      biography: {
        ...prev.biography!,
        [field]: value
      }
    }));
  };

  const addBiographyParagraph = () => {
    setFormData(prev => ({
      ...prev,
      biography: {
        ...prev.biography!,
        paragraphs: [...prev.biography!.paragraphs, '']
      }
    }));
  };

  const removeBiographyParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      biography: {
        ...prev.biography!,
        paragraphs: prev.biography!.paragraphs.filter((_, i) => i !== index)
      }
    }));
  };

  const handleBiographyParagraphChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      biography: {
        ...prev.biography!,
        paragraphs: prev.biography!.paragraphs.map((p, i) => 
          i === index ? value : p
        )
      }
    }));
  };

  const handleCoreValuesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues!,
        [field]: value
      }
    }));
  };

  const handleCoreValueItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues!,
        items: prev.coreValues!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addCoreValueItem = () => {
    setFormData(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues!,
        items: [...prev.coreValues!.items, {
          title: '',
          description: '',
          icon: 'Users'
        }]
      }
    }));
  };

  const removeCoreValueItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues!,
        items: prev.coreValues!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleVisionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vision: {
        ...prev.vision!,
        [field]: value
      }
    }));
  };

  const handlePhilosophyChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        [field]: value
      }
    }));
  };

  const addPhilosophyParagraph = () => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        paragraphs: [...prev.philosophy!.paragraphs, '']
      }
    }));
  };

  const removePhilosophyParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        paragraphs: prev.philosophy!.paragraphs.filter((_, i) => i !== index)
      }
    }));
  };

  const handlePhilosophyParagraphChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        paragraphs: prev.philosophy!.paragraphs.map((p, i) => 
          i === index ? value : p
        )
      }
    }));
  };

  const handlePrioritiesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        priorities: {
          ...prev.philosophy!.priorities,
          [field]: value
        }
      }
    }));
  };

  const addPriorityItem = () => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        priorities: {
          ...prev.philosophy!.priorities,
          items: [...prev.philosophy!.priorities.items, '']
        }
      }
    }));
  };

  const removePriorityItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        priorities: {
          ...prev.philosophy!.priorities,
          items: prev.philosophy!.priorities.items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handlePriorityItemChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy!,
        priorities: {
          ...prev.philosophy!.priorities,
          items: prev.philosophy!.priorities.items.map((item, i) => 
            i === index ? value : item
          )
        }
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const base64Image = e.target?.result as string;
      handleBiographyChange('image', base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout(formData as AboutData);
      toast.success('About page updated successfully!');
    } catch (error) {
      toast.error('Failed to update about page');
    }
  };

  if (isLoading && !aboutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Page Management</h1>

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
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Biography Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.biography?.title || ''}
                onChange={(e) => handleBiographyChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Biography Image</label>
              {formData.biography?.image && (
                <div className="mb-4">
                  <img 
                    src={formData.biography.image} 
                    alt="Current" 
                    className="w-64 h-64 object-cover rounded-lg mb-2 border" 
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Paragraphs</label>
                <button
                  type="button"
                  onClick={addBiographyParagraph}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Paragraph
                </button>
              </div>
              {formData.biography?.paragraphs.map((paragraph, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Paragraph {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeBiographyParagraph(index)}
                      className="text-red-700 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea
                    value={paragraph}
                    onChange={(e) => handleBiographyParagraphChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Core Values Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <input
                type="text"
                value={formData.coreValues?.sectionTitle || ''}
                onChange={(e) => handleCoreValuesChange('sectionTitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Section Subtitle</label>
              <textarea
                value={formData.coreValues?.sectionSubtitle || ''}
                onChange={(e) => handleCoreValuesChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Core Values Items</label>
                <button
                  type="button"
                  onClick={addCoreValueItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              {formData.coreValues?.items.map((item, index) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <div key={index} className="border p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-red-700" />
                        <span className="font-medium">Item {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCoreValueItem(index)}
                        className="text-red-700 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <select
                          value={item.icon}
                          onChange={(e) => handleCoreValueItemChange(index, 'icon', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon.value} value={icon.value}>{icon.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleCoreValueItemChange(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleCoreValueItemChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Vision Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.vision?.title || ''}
                onChange={(e) => handleVisionChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quote</label>
              <textarea
                value={formData.vision?.quote || ''}
                onChange={(e) => handleVisionChange('quote', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={formData.vision?.author || ''}
                onChange={(e) => handleVisionChange('author', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Philosophy Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.philosophy?.title || ''}
                onChange={(e) => handlePhilosophyChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Paragraphs</label>
                <button
                  type="button"
                  onClick={addPhilosophyParagraph}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Paragraph
                </button>
              </div>
              {formData.philosophy?.paragraphs.map((paragraph, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Paragraph {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePhilosophyParagraph(index)}
                      className="text-red-700 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea
                    value={paragraph}
                    onChange={(e) => handlePhilosophyParagraphChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priorities Title</label>
              <input
                type="text"
                value={formData.philosophy?.priorities?.title || ''}
                onChange={(e) => handlePrioritiesChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Priority Items</label>
                <button
                  type="button"
                  onClick={addPriorityItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              {formData.philosophy?.priorities?.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handlePriorityItemChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePriorityItem(index)}
                    className="text-red-700 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        
      </form>
    </div>
  );
};

export default AboutManagement;

