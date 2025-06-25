import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Event interface
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

// Sample events data
const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Annual Tech Conference 2025",
    date: "2025-07-15",
    time: "09:00",
    location: "Convention Center, Downtown",
    description: "Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Summer Music Festival",
    date: "2025-08-20",
    time: "18:00",
    location: "Central Park Amphitheater",
    description: "Experience an evening of live music with local and international artists performing across multiple stages.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop"
  }
];

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  // Handle save edit
  const handleSaveEdit = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
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
        <Link to="/admin/add-event" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add New Event
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {event.title}
              </h3>
              
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
                  {event.location}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {event.description}
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
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
              
              <div className="mb-4">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{selectedEvent.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{formatTime(selectedEvent.time)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 md:col-span-2">
                  <MapPin size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-600">{selectedEvent.description}</p>
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

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
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