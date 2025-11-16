import React, { useState, useEffect } from 'react';
import { useJourneyStore, type JourneyData } from '../../stores/useJourneyStore';
import { availableIcons, getIcon } from '../../config/icon.config';
import { 
  MapPin, Plus, X, Save, Loader2, Target, Award, Calendar, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const JourneyManagement: React.FC = () => {
  const { journeyData, fetchJourney, updateJourney, isLoading } = useJourneyStore();
  const [formData, setFormData] = useState<Partial<JourneyData>>({
    hero: {
      title: '',
      subtitle: ''
    },
    milestones: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    leadershipPhases: {
      sectionTitle: '',
      sectionSubtitle: '',
      phases: []
    },
    interviewInsights: {
      sectionTitle: '',
      sectionSubtitle: '',
      items: []
    },
    currentFocus: {
      title: '',
      description: '',
      tags: []
    }
  });

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  useEffect(() => {
    if (journeyData) {
      setFormData(journeyData);
    }
  }, [journeyData]);

  const handleHeroChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        [field]: value
      }
    }));
  };

  const handleMilestonesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: {
        ...prev.milestones!,
        [field]: value
      }
    }));
  };

  const handleMilestoneItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: {
        ...prev.milestones!,
        items: prev.milestones!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addMilestoneItem = () => {
    setFormData(prev => ({
      ...prev,
      milestones: {
        ...prev.milestones!,
        items: [...prev.milestones!.items, {
          year: '',
          title: '',
          description: '',
          icon: 'Users',
          color: 'bg-blue-500'
        }]
      }
    }));
  };

  const removeMilestoneItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: {
        ...prev.milestones!,
        items: prev.milestones!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleLeadershipPhasesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        [field]: value
      }
    }));
  };

  const handlePhaseChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: prev.leadershipPhases!.phases.map((phase, i) => 
          i === index ? { ...phase, [field]: value } : phase
        )
      }
    }));
  };

  const handlePhaseItemChange = (phaseIndex: number, itemIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: prev.leadershipPhases!.phases.map((phase, i) => 
          i === phaseIndex ? {
            ...phase,
            items: phase.items.map((item, ii) => 
              ii === itemIndex ? value : item
            )
          } : phase
        )
      }
    }));
  };

  const addPhaseItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: prev.leadershipPhases!.phases.map((phase, i) => 
          i === index ? {
            ...phase,
            items: [...phase.items, '']
          } : phase
        )
      }
    }));
  };

  const removePhaseItem = (phaseIndex: number, itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: prev.leadershipPhases!.phases.map((phase, i) => 
          i === phaseIndex ? {
            ...phase,
            items: phase.items.filter((_, ii) => ii !== itemIndex)
          } : phase
        )
      }
    }));
  };

  const addLeadershipPhase = () => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: [...prev.leadershipPhases!.phases, {
          title: '',
          period: '',
          periodColor: 'text-blue-600',
          icon: 'Users',
          iconColor: 'bg-blue-100',
          dotColor: 'bg-blue-500',
          items: []
        }]
      }
    }));
  };

  const removeLeadershipPhase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      leadershipPhases: {
        ...prev.leadershipPhases!,
        phases: prev.leadershipPhases!.phases.filter((_, i) => i !== index)
      }
    }));
  };

  const handleInterviewInsightsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      interviewInsights: {
        ...prev.interviewInsights!,
        [field]: value
      }
    }));
  };

  const handleInsightItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      interviewInsights: {
        ...prev.interviewInsights!,
        items: prev.interviewInsights!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addInsightItem = () => {
    setFormData(prev => ({
      ...prev,
      interviewInsights: {
        ...prev.interviewInsights!,
        items: [...prev.interviewInsights!.items, {
          source: '',
          quote: '',
          description: '',
          icon: 'Calendar',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50'
        }]
      }
    }));
  };

  const removeInsightItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interviewInsights: {
        ...prev.interviewInsights!,
        items: prev.interviewInsights!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleCurrentFocusChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      currentFocus: {
        ...prev.currentFocus!,
        [field]: value
      }
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      currentFocus: {
        ...prev.currentFocus!,
        tags: prev.currentFocus!.tags.map((tag, i) => 
          i === index ? value : tag
        )
      }
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      currentFocus: {
        ...prev.currentFocus!,
        tags: [...prev.currentFocus!.tags, '']
      }
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      currentFocus: {
        ...prev.currentFocus!,
        tags: prev.currentFocus!.tags.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateJourney(formData);
    } catch (error) {
      console.error('Error updating journey:', error);
    }
  };

  if (isLoading && !journeyData) {
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
          <MapPin className="w-8 h-8 text-red-700" />
          Journey Page Management
        </h1>
        <p className="text-gray-600 mt-2">Manage all sections of the journey page</p>
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

        {/* Milestones Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-red-700" />
            Milestones Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.milestones?.sectionTitle || ''}
                onChange={(e) => handleMilestonesChange('sectionTitle', e.target.value)}
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
                value={formData.milestones?.sectionSubtitle || ''}
                onChange={(e) => handleMilestonesChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestone Items
              </label>
              {formData.milestones?.items.map((milestone, index) => {
                const IconComponent = getIcon(milestone.icon);
                return (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <select
                          value={milestone.icon}
                          onChange={(e) => handleMilestoneItemChange(index, 'icon', e.target.value)}
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
                        onClick={() => removeMilestoneItem(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Year"
                        value={milestone.year}
                        onChange={(e) => handleMilestoneItemChange(index, 'year', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Color (e.g., bg-blue-500)"
                        value={milestone.color}
                        onChange={(e) => handleMilestoneItemChange(index, 'color', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneItemChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        placeholder="Description"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneItemChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addMilestoneItem}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Milestone Item
              </button>
            </div>
          </div>
        </div>

        {/* Leadership Phases Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-red-700" />
            Leadership Phases Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.leadershipPhases?.sectionTitle || ''}
                onChange={(e) => handleLeadershipPhasesChange('sectionTitle', e.target.value)}
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
                value={formData.leadershipPhases?.sectionSubtitle || ''}
                onChange={(e) => handleLeadershipPhasesChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leadership Phases
              </label>
              {formData.leadershipPhases?.phases.map((phase, phaseIndex) => {
                const PhaseIcon = getIcon(phase.icon);
                return (
                  <div key={phaseIndex} className="border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 ${phase.iconColor} rounded-full flex items-center justify-center`}>
                          <PhaseIcon className="w-6 h-6 text-white" />
                        </div>
                        <input
                          type="text"
                          placeholder="Phase Title"
                          value={phase.title}
                          onChange={(e) => handlePhaseChange(phaseIndex, 'title', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <select
                          value={phase.icon}
                          onChange={(e) => handlePhaseChange(phaseIndex, 'icon', e.target.value)}
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
                        onClick={() => removeLeadershipPhase(phaseIndex)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Period (e.g., 2017 - 2021)"
                        value={phase.period}
                        onChange={(e) => handlePhaseChange(phaseIndex, 'period', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Period Color (e.g., text-blue-600)"
                        value={phase.periodColor}
                        onChange={(e) => handlePhaseChange(phaseIndex, 'periodColor', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Icon Color (e.g., bg-blue-100)"
                        value={phase.iconColor}
                        onChange={(e) => handlePhaseChange(phaseIndex, 'iconColor', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Dot Color (e.g., bg-blue-500)"
                        value={phase.dotColor}
                        onChange={(e) => handlePhaseChange(phaseIndex, 'dotColor', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phase Items</label>
                      {phase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handlePhaseItemChange(phaseIndex, itemIndex, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Phase item text"
                          />
                          <button
                            type="button"
                            onClick={() => removePhaseItem(phaseIndex, itemIndex)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addPhaseItem(phaseIndex)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Phase Item
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addLeadershipPhase}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Leadership Phase
              </button>
            </div>
          </div>
        </div>

        {/* Interview Insights Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-red-700" />
            Interview Insights Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.interviewInsights?.sectionTitle || ''}
                onChange={(e) => handleInterviewInsightsChange('sectionTitle', e.target.value)}
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
                value={formData.interviewInsights?.sectionSubtitle || ''}
                onChange={(e) => handleInterviewInsightsChange('sectionSubtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insight Items
              </label>
              {formData.interviewInsights?.items.map((insight, index) => {
                const InsightIcon = getIcon(insight.icon);
                return (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <InsightIcon className={`w-6 h-6 ${insight.iconColor}`} />
                        <select
                          value={insight.icon}
                          onChange={(e) => handleInsightItemChange(index, 'icon', e.target.value)}
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
                        onClick={() => removeInsightItem(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Source"
                        value={insight.source}
                        onChange={(e) => handleInsightItemChange(index, 'source', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        placeholder="Quote"
                        value={insight.quote}
                        onChange={(e) => handleInsightItemChange(index, 'quote', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        placeholder="Description"
                        value={insight.description}
                        onChange={(e) => handleInsightItemChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Icon Color (e.g., text-red-600)"
                          value={insight.iconColor}
                          onChange={(e) => handleInsightItemChange(index, 'iconColor', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Background Color (e.g., bg-red-50)"
                          value={insight.bgColor}
                          onChange={(e) => handleInsightItemChange(index, 'bgColor', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addInsightItem}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Insight Item
              </button>
            </div>
          </div>
        </div>

        {/* Current Focus Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-700" />
            Current Focus Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentFocus?.title || ''}
                onChange={(e) => handleCurrentFocusChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.currentFocus?.description || ''}
                onChange={(e) => handleCurrentFocusChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {formData.currentFocus?.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tag text (e.g., #YouthLeadership)"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Tag
              </button>
            </div>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default JourneyManagement;

