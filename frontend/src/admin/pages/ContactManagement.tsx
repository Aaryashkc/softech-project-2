import React, { useState, useEffect } from 'react';
import { useContactPageStore, type ContactData } from '../../stores/useContactPageStore';
import { availableIcons, getIcon } from '../../config/icon.config';
import { 
  Plus, X, Save, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactManagement: React.FC = () => {
  const { contactData, fetchContact, updateContact, isLoading } = useContactPageStore();
  const [formData, setFormData] = useState<Partial<ContactData>>({
    hero: {
      title: '',
      subtitle: ''
    },
    contactInfo: {
      sectionTitle: '',
      items: []
    },
    additionalInfo: {
      publicEngagement: {
        title: '',
        description: '',
        items: [],
        icon: 'Users'
      },
      responseTime: {
        title: '',
        description: '',
        icon: 'MessageSquare',
        times: []
      },
      scheduleMeeting: {
        title: '',
        description: '',
        note: '',
        icon: 'Calendar'
      }
    }
  });

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  useEffect(() => {
    if (contactData) {
      setFormData(contactData);
    }
  }, [contactData]);

  const handleHeroChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero!,
        [field]: value
      }
    }));
  };

  const handleContactInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        [field]: value
      }
    }));
  };

  const handleContactInfoItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        items: prev.contactInfo!.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addContactInfoItem = () => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        items: [...prev.contactInfo!.items, {
          title: '',
          description: '',
          icon: 'MapPin'
        }]
      }
    }));
  };

  const removeContactInfoItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        items: prev.contactInfo!.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handlePublicEngagementChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        publicEngagement: {
          ...prev.additionalInfo!.publicEngagement,
          [field]: value
        }
      }
    }));
  };

  const addPublicEngagementItem = () => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        publicEngagement: {
          ...prev.additionalInfo!.publicEngagement,
          items: [...prev.additionalInfo!.publicEngagement.items, '']
        }
      }
    }));
  };

  const removePublicEngagementItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        publicEngagement: {
          ...prev.additionalInfo!.publicEngagement,
          items: prev.additionalInfo!.publicEngagement.items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handlePublicEngagementItemChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        publicEngagement: {
          ...prev.additionalInfo!.publicEngagement,
          items: prev.additionalInfo!.publicEngagement.items.map((item, i) => 
            i === index ? value : item
          )
        }
      }
    }));
  };

  const handleResponseTimeChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        responseTime: {
          ...prev.additionalInfo!.responseTime,
          [field]: value
        }
      }
    }));
  };

  const addResponseTimeItem = () => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        responseTime: {
          ...prev.additionalInfo!.responseTime,
          times: [...prev.additionalInfo!.responseTime.times, {
            label: '',
            duration: ''
          }]
        }
      }
    }));
  };

  const removeResponseTimeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        responseTime: {
          ...prev.additionalInfo!.responseTime,
          times: prev.additionalInfo!.responseTime.times.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleResponseTimeItemChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        responseTime: {
          ...prev.additionalInfo!.responseTime,
          times: prev.additionalInfo!.responseTime.times.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    }));
  };

  const handleScheduleMeetingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        scheduleMeeting: {
          ...prev.additionalInfo!.scheduleMeeting,
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact(formData as ContactData);
      toast.success('Contact page updated successfully!');
    } catch (error) {
      toast.error('Failed to update contact page');
    }
  };

  if (isLoading && !contactData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Page Management</h1>

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

        {/* Contact Info Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Contact Information Cards</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title (Optional)</label>
              <input
                type="text"
                value={formData.contactInfo?.sectionTitle || ''}
                onChange={(e) => handleContactInfoChange('sectionTitle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Contact Info Items</label>
                <button
                  type="button"
                  onClick={addContactInfoItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              {formData.contactInfo?.items.map((item, index) => {
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
                        onClick={() => removeContactInfoItem(index)}
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
                          onChange={(e) => handleContactInfoItemChange(index, 'icon', e.target.value)}
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
                          onChange={(e) => handleContactInfoItemChange(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleContactInfoItemChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          rows={4}
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

        {/* Public Engagement */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Public Engagement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <select
                value={formData.additionalInfo?.publicEngagement?.icon || 'Users'}
                onChange={(e) => handlePublicEngagementChange('icon', e.target.value)}
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
                value={formData.additionalInfo?.publicEngagement?.title || ''}
                onChange={(e) => handlePublicEngagementChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.additionalInfo?.publicEngagement?.description || ''}
                onChange={(e) => handlePublicEngagementChange('description', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Items</label>
                <button
                  type="button"
                  onClick={addPublicEngagementItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              {formData.additionalInfo?.publicEngagement?.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handlePublicEngagementItemChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePublicEngagementItem(index)}
                    className="text-red-700 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Response Time</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <select
                value={formData.additionalInfo?.responseTime?.icon || 'MessageSquare'}
                onChange={(e) => handleResponseTimeChange('icon', e.target.value)}
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
                value={formData.additionalInfo?.responseTime?.title || ''}
                onChange={(e) => handleResponseTimeChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.additionalInfo?.responseTime?.description || ''}
                onChange={(e) => handleResponseTimeChange('description', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Response Times</label>
                <button
                  type="button"
                  onClick={addResponseTimeItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Time
                </button>
              </div>
              {formData.additionalInfo?.responseTime?.times.map((time, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-medium">Time {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeResponseTimeItem(index)}
                      className="text-red-700 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Label</label>
                      <input
                        type="text"
                        value={time.label}
                        onChange={(e) => handleResponseTimeItemChange(index, 'label', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={time.duration}
                        onChange={(e) => handleResponseTimeItemChange(index, 'duration', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Meeting */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Schedule a Meeting</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <select
                value={formData.additionalInfo?.scheduleMeeting?.icon || 'Calendar'}
                onChange={(e) => handleScheduleMeetingChange('icon', e.target.value)}
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
                value={formData.additionalInfo?.scheduleMeeting?.title || ''}
                onChange={(e) => handleScheduleMeetingChange('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.additionalInfo?.scheduleMeeting?.description || ''}
                onChange={(e) => handleScheduleMeetingChange('description', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <textarea
                value={formData.additionalInfo?.scheduleMeeting?.note || ''}
                onChange={(e) => handleScheduleMeetingChange('note', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
          </div>
        </section>

        
      </form>
    </div>
  );
};

export default ContactManagement;

