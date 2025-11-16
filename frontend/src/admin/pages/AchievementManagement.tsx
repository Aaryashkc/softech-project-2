import React, { useState, useEffect } from 'react';
import { useAchievementStore, type AchievementData } from '../../stores/useAchievementStore';
import { availableIcons, getIcon } from '../../config/icon.config';
import { 
  Trophy, Plus, X, Save, Loader2, Award, Target, Heart
} from 'lucide-react';

const AchievementManagement: React.FC = () => {
  const { achievementData, fetchAchievement, updateAchievement, isLoading } = useAchievementStore();
  const [formData, setFormData] = useState<Partial<AchievementData>>({
    hero: {
      title: '',
      subtitle: ''
    },
    stats: [],
    achievements: [],
    mediaRecognition: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    futureGoals: {
      title: '',
      description: '',
      immediate: {
        title: '',
        items: []
      },
      longTerm: {
        title: '',
        items: []
      }
    }
  });

  useEffect(() => {
    fetchAchievement();
  }, [fetchAchievement]);

  useEffect(() => {
    if (achievementData) {
      setFormData(achievementData);
    }
  }, [achievementData]);

  const handleHeroChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        [field]: value
      }
    }));
  };

  const handleStatsChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const handleStatDetailsChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.map((stat, i) => 
        i === index ? { ...stat, details: { ...stat.details, [field]: value } } : stat
      )
    }));
  };

  const handleStatHighlightsChange = (statIndex: number, highlightIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.map((stat, i) => 
        i === statIndex ? {
          ...stat,
          details: {
            ...stat.details,
            highlights: stat.details.highlights.map((h, hi) => hi === highlightIndex ? value : h)
          }
        } : stat
      )
    }));
  };

  const addStatHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.map((stat, i) => 
        i === index ? {
          ...stat,
          details: {
            ...stat.details,
            highlights: [...stat.details.highlights, '']
          }
        } : stat
      )
    }));
  };

  const removeStatHighlight = (statIndex: number, highlightIndex: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.map((stat, i) => 
        i === statIndex ? {
          ...stat,
          details: {
            ...stat.details,
            highlights: stat.details.highlights.filter((_, hi) => hi !== highlightIndex)
          }
        } : stat
      )
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats!, {
        number: '',
        label: '',
        icon: 'Trophy',
        details: {
          title: '',
          description: '',
          highlights: []
        }
      }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats!.filter((_, i) => i !== index)
    }));
  };

  const handleAchievementCategoryChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements!.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const handleAchievementItemChange = (catIndex: number, itemIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements!.map((cat, i) => 
        i === catIndex ? {
          ...cat,
          items: cat.items.map((item, ii) => 
            ii === itemIndex ? { ...item, [field]: value } : item
          )
        } : cat
      )
    }));
  };

  const addAchievementItem = (catIndex: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements!.map((cat, i) => 
        i === catIndex ? {
          ...cat,
          items: [...cat.items, { title: '', description: '', impact: '' }]
        } : cat
      )
    }));
  };

  const removeAchievementItem = (catIndex: number, itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements!.map((cat, i) => 
        i === catIndex ? {
          ...cat,
          items: cat.items.filter((_, ii) => ii !== itemIndex)
        } : cat
      )
    }));
  };

  const addAchievementCategory = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements!, {
        category: '',
        icon: 'Trophy',
        color: 'bg-red-600',
        items: []
      }]
    }));
  };

  const removeAchievementCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements!.filter((_, i) => i !== index)
    }));
  };

  const handleMediaRecognitionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      mediaRecognition: {
        ...prev.mediaRecognition!,
        [field]: value
      }
    }));
  };

  const handleMediaItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      mediaRecognition: {
        ...prev.mediaRecognition!,
        items: prev.mediaRecognition!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addMediaItem = () => {
    setFormData(prev => ({
      ...prev,
      mediaRecognition: {
        ...prev.mediaRecognition!,
        items: [...prev.mediaRecognition!.items, {
          outlet: '',
          outletColor: '',
          title: '',
          description: '',
          year: '',
          link: ''
        }]
      }
    }));
  };

  const removeMediaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaRecognition: {
        ...prev.mediaRecognition!,
        items: prev.mediaRecognition!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleFutureGoalsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        [field]: value
      }
    }));
  };

  const handleImmediateItemsChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        immediate: {
          ...prev.futureGoals!.immediate,
          items: prev.futureGoals!.immediate.items.map((item, i) => 
            i === index ? value : item
          )
        }
      }
    }));
  };

  const addImmediateItem = () => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        immediate: {
          ...prev.futureGoals!.immediate,
          items: [...prev.futureGoals!.immediate.items, '']
        }
      }
    }));
  };

  const removeImmediateItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        immediate: {
          ...prev.futureGoals!.immediate,
          items: prev.futureGoals!.immediate.items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleLongTermItemsChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        longTerm: {
          ...prev.futureGoals!.longTerm,
          items: prev.futureGoals!.longTerm.items.map((item, i) => 
            i === index ? value : item
          )
        }
      }
    }));
  };

  const addLongTermItem = () => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        longTerm: {
          ...prev.futureGoals!.longTerm,
          items: [...prev.futureGoals!.longTerm.items, '']
        }
      }
    }));
  };

  const removeLongTermItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      futureGoals: {
        ...prev.futureGoals!,
        longTerm: {
          ...prev.futureGoals!.longTerm,
          items: prev.futureGoals!.longTerm.items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAchievement(formData);
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  if (isLoading && !achievementData) {
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
          <Award className="w-8 h-8 text-red-700" />
          Achievement Page Management
        </h1>
        <p className="text-gray-600 mt-2">Manage all sections of the achievement page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="sticky top-0 z-10 p-4 rounded-lg  mb-4 flex justify-end">
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
            <Target className="w-6 h-6 text-red-700" />
            Hero Section
          </h2>
          <div className="space-y-4">
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
                Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-red-700" />
            Statistics Section
          </h2>
          <div className="space-y-4">
            {formData.stats?.map((stat, index) => {
              const IconComponent = getIcon(stat.icon);
              return (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-red-700" />
                      </div>
                      <select
                        value={stat.icon}
                        onChange={(e) => handleStatsChange(index, 'icon', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Number"
                      value={stat.number}
                      onChange={(e) => handleStatsChange(index, 'number', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => handleStatsChange(index, 'label', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2 mb-4">
                    <input
                      type="text"
                      placeholder="Details Title"
                      value={stat.details.title}
                      onChange={(e) => handleStatDetailsChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Details Description"
                      value={stat.details.description}
                      onChange={(e) => handleStatDetailsChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Highlights</label>
                    {stat.details.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleStatHighlightsChange(index, highlightIndex, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Highlight text"
                        />
                        <button
                          type="button"
                          onClick={() => removeStatHighlight(index, highlightIndex)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addStatHighlight(index)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Highlight
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addStat}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Stat
            </button>
          </div>
        </div>

        {/* Achievements Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-red-700" />
            Achievement Categories
          </h2>
          <div className="space-y-4">
            {formData.achievements?.map((category, catIndex) => {
              const CategoryIcon = getIcon(category.icon);
              return (
                <div key={catIndex} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${category.color || 'bg-red-600'} rounded-full flex items-center justify-center`}>
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <input
                        type="text"
                        placeholder="Category Name"
                        value={category.category}
                        onChange={(e) => handleAchievementCategoryChange(catIndex, 'category', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={category.icon}
                        onChange={(e) => handleAchievementCategoryChange(catIndex, 'icon', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Color (e.g., bg-blue-600)"
                        value={category.color || ''}
                        onChange={(e) => handleAchievementCategoryChange(catIndex, 'color', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAchievementCategory(catIndex)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Item Title"
                            value={item.title}
                            onChange={(e) => handleAchievementItemChange(catIndex, itemIndex, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleAchievementItemChange(catIndex, itemIndex, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Impact"
                            value={item.impact}
                            onChange={(e) => handleAchievementItemChange(catIndex, itemIndex, 'impact', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeAchievementItem(catIndex, itemIndex)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <X className="w-5 h-5" />
                            Remove Item
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAchievementItem(catIndex)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Achievement Item
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addAchievementCategory}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </div>

        {/* Media Recognition Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-700" />
            Media Recognition
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mediaRecognition?.sectionTitle || ''}
                onChange={(e) => handleMediaRecognitionChange('sectionTitle', e.target.value)}
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
                value={formData.mediaRecognition?.sectionSubtitle || ''}
                onChange={(e) => handleMediaRecognitionChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Items</label>
              {formData.mediaRecognition?.items.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Outlet Name"
                      value={item.outlet}
                      onChange={(e) => handleMediaItemChange(index, 'outlet', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Outlet Color (e.g., text-red-700 bg-red-100)"
                      value={item.outletColor || ''}
                      onChange={(e) => handleMediaItemChange(index, 'outletColor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => handleMediaItemChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleMediaItemChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Year"
                        value={item.year}
                        onChange={(e) => handleMediaItemChange(index, 'year', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Link (optional)"
                        value={item.link || ''}
                        onChange={(e) => handleMediaItemChange(index, 'link', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMediaItem}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Media Item
              </button>
            </div>
          </div>
        </div>

        {/* Future Goals Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-700" />
            Future Goals
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.futureGoals?.title || ''}
                onChange={(e) => handleFutureGoalsChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.futureGoals?.description || ''}
                onChange={(e) => handleFutureGoalsChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immediate Goals Title
                </label>
                <input
                  type="text"
                  value={formData.futureGoals?.immediate.title || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    futureGoals: {
                      ...prev.futureGoals!,
                      immediate: { ...prev.futureGoals!.immediate, title: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                  Immediate Items
                </label>
                {formData.futureGoals?.immediate.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleImmediateItemsChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImmediateItem(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImmediateItem}
                  className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long-term Goals Title
                </label>
                <input
                  type="text"
                  value={formData.futureGoals?.longTerm.title || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    futureGoals: {
                      ...prev.futureGoals!,
                      longTerm: { ...prev.futureGoals!.longTerm, title: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                  Long-term Items
                </label>
                {formData.futureGoals?.longTerm.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleLongTermItemsChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeLongTermItem(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLongTermItem}
                  className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default AchievementManagement;

