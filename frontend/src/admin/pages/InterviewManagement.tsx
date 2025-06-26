import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, Tag, Monitor, Star, ExternalLink } from 'lucide-react';
import { useInterviewStore } from '../../stores/useInterviewStore';
import type { Interview as StoreInterview } from '../../stores/useInterviewStore';

// Component-specific Interview type that includes both id and _id
type Interview = Omit<StoreInterview, '_id'> & { id: string; _id?: string };

// Convert store interview to component interview
const toComponentInterview = (interview: StoreInterview): Interview => ({
  ...interview,
  id: interview._id,
  _id: interview._id,
});

// Convert component interview back to store interview input
const toStoreInterview = (interview: Interview): Omit<StoreInterview, '_id'> & { _id: string } => ({
  ...interview,
  _id: interview._id || interview.id,
});

const InterviewManagement: React.FC = () => {
  const { 
    interviews: storeInterviews, 
    isLoading, 
    fetchInterviews, 
    deleteInterview,
    updateInterview 
  } = useInterviewStore();
  
  // Convert store interviews to component interviews
  const interviews = storeInterviews.map(toComponentInterview);
  
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch interviews on component mount
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Handle view interview
  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowViewModal(true);
  };

  // Handle edit interview
  const handleEditInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowEditModal(true);
  };

  // Handle delete interview
  const handleDeleteInterview = async (interview: Interview) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await deleteInterview(interview._id || interview.id);
      } catch (error) {
        console.error('Error deleting interview:', error);
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedInterview: Interview) => {
    if (!updatedInterview.id) return;
    
    try {
      const storeInterview = toStoreInterview(updatedInterview);
      await updateInterview(storeInterview._id, storeInterview);
      setShowEditModal(false);
      setSelectedInterview(null);
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Interview Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your interviews</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Interview Image */}
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                <img
                  src={interview.image}
                  alt={interview.title}
                  className="w-full h-full object-cover"
                />
                {interview.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Star size={12} />
                    Featured
                  </div>
                )}
              </div>

              {/* Interview Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {interview.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(interview.date)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Tag size={16} className="mr-2" />
                    {interview.category}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Monitor size={16} className="mr-2" />
                    {interview.platform}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {interview.excerpt}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewInterview(interview)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditInterview(interview)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInterview(interview)}
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
      )}

      {/* View Modal */}
      {showViewModal && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Interview Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4 relative">
                <img
                  src={selectedInterview.image}
                  alt={selectedInterview.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {selectedInterview.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1">
                    <Star size={16} />
                    Featured
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{selectedInterview.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{formatDate(selectedInterview.date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Tag size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p>{selectedInterview.category}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 md:col-span-2">
                  <Monitor size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Platform</p>
                    <p>{selectedInterview.platform}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-600">{selectedInterview.excerpt}</p>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Interview Link</p>
                <a
                  href={selectedInterview.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink size={16} />
                  {selectedInterview.link}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedInterview && (
        <EditInterviewModal
          interview={selectedInterview}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Interview Modal Component
interface EditInterviewModalProps {
  interview: Interview | null;
  onSave: (interview: Interview) => void;
  onCancel: () => void;
}

const EditInterviewModal: React.FC<EditInterviewModalProps> = ({ interview, onSave, onCancel }) => {
  if (!interview) return null;
  const [formData, setFormData] = useState<Interview>({
    ...interview,
    id: interview.id || interview._id || '',
  });

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: formData.id || formData._id || '',
      _id: formData._id || formData.id || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Interview</h2>
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
                Interview Title
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
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
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
                Interview Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Featured Interview
              </label>
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

export default InterviewManagement;