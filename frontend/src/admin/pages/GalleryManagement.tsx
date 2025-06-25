import React, { useState } from 'react';
import { Edit, Trash2, Images, Calendar, FileText } from 'lucide-react';

// PhotoCollection interface
interface PhotoCollection {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  photos: string[];
}

// Sample gallery data
const sampleCollections: PhotoCollection[] = [
  {
    id: 1,
    title: "Tech Conference 2025 Highlights",
    description: "Key moments and networking sessions from our annual tech conference including keynote speeches and workshop activities.",
    createdAt: "2025-06-20",
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=300&h=200&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Amazing performances and crowd moments from the summer music festival featuring local and international artists.",
    createdAt: "2025-06-15",
    photos: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=200&fit=crop"
    ]
  }
];

const GalleryManagement: React.FC = () => {
  const [collections, setCollections] = useState<PhotoCollection[]>(sampleCollections);
  const [selectedCollection, setSelectedCollection] = useState<PhotoCollection | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle edit collection
  const handleEditCollection = (collection: PhotoCollection) => {
    setSelectedCollection(collection);
    setShowEditModal(true);
  };

  // Handle delete collection
  const handleDeleteCollection = (collectionId: number) => {
    if (window.confirm('Are you sure you want to delete this photo collection? This action cannot be undone.')) {
      setCollections(collections.filter(collection => collection.id !== collectionId));
    }
  };

  // Handle save edit
  const handleSaveEdit = (updatedCollection: PhotoCollection) => {
    setCollections(collections.map(collection => 
      collection.id === updatedCollection.id ? updatedCollection : collection
    ));
    setShowEditModal(false);
    setSelectedCollection(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage photo collections and albums</p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Photo Preview Grid */}
            <div className="h-48 bg-gray-200 overflow-hidden relative">
              {collection.photos.length > 0 ? (
                <div className="grid grid-cols-2 h-full gap-1">
                  {/* Main photo takes left half */}
                  <div className="relative">
                    <img
                      src={collection.photos[0]}
                      alt="Main preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Right side shows up to 3 more photos in a grid */}
                  <div className="grid grid-rows-2 gap-1">
                    {collection.photos.slice(1, 3).map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Preview ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    
                    {/* Show count overlay if more than 4 photos */}
                    {collection.photos.length > 4 && (
                      <div className="relative">
                        <img
                          src={collection.photos[3]}
                          alt="Preview 4"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            +{collection.photos.length - 4}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Images size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Photo count badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Images size={14} />
                {collection.photos.length}
              </div>
            </div>

            {/* Collection Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {collection.title}
              </h3>
              
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <Calendar size={16} className="mr-2" />
                {formatDate(collection.createdAt)}
              </div>

              <div className="flex items-start text-gray-600 text-sm mb-4">
                <FileText size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-3">{collection.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
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

      {/* Edit Modal */}
      {showEditModal && selectedCollection && (
        <EditCollectionModal
          collection={selectedCollection}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCollection(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Collection Modal Component
interface EditCollectionModalProps {
  collection: PhotoCollection;
  onSave: (collection: PhotoCollection) => void;
  onCancel: () => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({ collection, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PhotoCollection>({ ...collection });
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setFormData({
        ...formData,
        photos: [...formData.photos, newPhotoUrl.trim()]
      });
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Photo Collection</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Title
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Creation Date
              </label>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
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
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Photo Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos ({formData.photos.length})
              </label>
              
              {/* Add new photo */}
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Enter photo URL..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Photo
                </button>
              </div>

              {/* Photos grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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

export default GalleryManagement;