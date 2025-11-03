import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, MapPin, Clock, X, Sparkles } from 'lucide-react';
import { useEventStore, type EventType } from '../../stores/useEventStore';

interface Event extends Omit<EventType, '_id'> {
  _id: string;
}

const EventManagement: React.FC = () => {
  const { events, isLoading, fetchEvents, deleteEvent } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
      }
    };

    loadEvents();
  }, [fetchEvents]);

  // Handle view event
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedEvent: Event) => {
    try {
      await useEventStore.getState().updateEvent(updatedEvent._id, {
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        time: updatedEvent.time,
        location: updatedEvent.location,
        image: updatedEvent.image,
        isComingSoon: updatedEvent.isComingSoon
      });
      setShowEditModal(false);
      setSelectedEvent(null);
    } catch (error) {
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBA';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your events</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="h-64 bg-gray-200 overflow-hidden relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {/* Coming Soon Badge */}
              {event.isComingSoon && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={14} />
                  COMING SOON
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {event.title}
              </h3>
              
              {!event.isComingSoon && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={16} className="mr-2" />
                    {formatTime(event.time)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-2" />
                    {event.location || 'TBA'}
                  </div>
                </div>
              )}

              {event.isComingSoon && (
                <div className="mb-4 py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm font-medium text-center">
                    Details will be announced soon!
                  </p>
                </div>
              )}

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {event.description || 'No description available'}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewEvent(event)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleEditEvent(event)}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  disabled={isLoading}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4 relative">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-80 object-contain rounded-lg bg-black"
                />
                {selectedEvent.isComingSoon && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Sparkles size={16} />
                    COMING SOON
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{selectedEvent.title}</h3>
              
              {!selectedEvent.isComingSoon ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={20} className="mr-3 text-blue-700" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p>{formatDate(selectedEvent.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock size={20} className="mr-3 text-blue-700" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p>{formatTime(selectedEvent.time)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700 md:col-span-2">
                      <MapPin size={20} className="mr-3 text-blue-700" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p>{selectedEvent.location || 'TBA'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-4 py-4 px-6 bg-blue-50 border-2 border-blue-700 rounded-lg">
                  <p className="text-blue-800 text-center font-medium">
                    📅 Event details will be announced soon. Stay tuned!
                  </p>
                </div>
              )}
              
              <div>
                <p className="font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-600">{selectedEvent.description || 'No description available'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Event Modal Component
interface EditEventModalProps {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Event>({ ...event });
  const [imageFile, setImageFile] = useState<{ preview: string; base64: string; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = () => {
    // If a new image was uploaded, replace image URL with base64
    const payload: Event = {
      ...formData,
      image: imageFile?.base64 || formData.image,
    };
    onSave(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleComingSoonToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      isComingSoon: isChecked
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image (JPEG, PNG, WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsProcessing(true);
    try {
      const preview = URL.createObjectURL(file);
      const base64 = await convertToBase64(file);
      setImageFile({ preview, base64, name: file.name });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    if (imageFile?.preview) URL.revokeObjectURL(imageFile.preview);
    setImageFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Coming Soon Toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-700 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isComingSoon}
                  onChange={handleComingSoonToggle}
                  className="w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">Mark as Coming Soon</span>
                </div>
              </label>
              <p className="text-sm text-gray-600 mt-2 ml-8">
                Enable this to show "Coming Soon" badge. Date, time, and location will be optional.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  disabled={formData.isComingSoon}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time || ''}
                  onChange={handleChange}
                  disabled={formData.isComingSoon}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                disabled={formData.isComingSoon}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Image
              </label>
              <img
                src={imageFile?.preview || formData.image}
                alt="Event"
                className="w-full h-72 object-contain rounded-lg border mb-3 bg-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                }}
              />

              {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 mb-3"
              /> */}

              {!imageFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="event-image-upload"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <label htmlFor="event-image-upload" className="cursor-pointer">
                    {isProcessing ? (
                      <div className="text-gray-600">Processing image...</div>
                    ) : (
                      <div className="text-gray-600">Click to upload new image</div>
                    )}
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                    <p><strong>File:</strong> {imageFile.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    Remove uploaded image
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;