import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Images, Calendar, FileText, Plus, Loader2, X, Eye, Play } from 'lucide-react';
import { useGalleryStore, type GalleryType } from '../../stores/useGalleryStore';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getYouTubeEmbedUrl } from '../../utils/youtube';

interface GalleryWithId extends Omit<GalleryType, '_id'> {
  _id: string;
}

// Helper function to check if a URL is a video
const isVideo = (url: string) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

// Helper function to get image URL from image object
const getImageUrl = (image: { url: string; public_id: string } | string) => {
  return typeof image === 'string' ? image : image.url;
};

const GalleryManagement: React.FC = () => {
  const { galleries, fetchGalleries, deleteGallery, isLoading, updateGallery } = useGalleryStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<GalleryWithId | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const selectedGalleryEmbedUrl = selectedGallery?.youtubeUrl ? getYouTubeEmbedUrl(selectedGallery.youtubeUrl) : null;
  const isSelectedGalleryVlog = selectedGallery ? ((selectedGallery.category && selectedGallery.category.trim()) === 'vlog') : false;

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        await fetchGalleries();
      } catch (error) {
        console.error('Error loading galleries:', error);
      }
    };

    loadGalleries();
  }, []); // Remove fetchGalleries dependency to prevent multiple calls

  // Handle view gallery
  const handleViewGallery = (gallery: GalleryWithId) => {
    setSelectedGallery(gallery);
    setShowViewModal(true);
  };

  // Handle edit gallery
  const handleEditGallery = (gallery: GalleryWithId) => {
    setSelectedGallery(gallery);
    setShowEditModal(true);
  };

  // Handle delete gallery
  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteGallery(id);
        toast.success('Gallery deleted successfully');
      } catch (error) {
        console.error('Error deleting gallery:', error);
        toast.error('Failed to delete gallery');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedGallery: GalleryWithId) => {
    try {
      setIsEditing(true);
      const normalizedCategory = (updatedGallery.category && updatedGallery.category.trim()) ? updatedGallery.category : 'normal';

      if (normalizedCategory === 'vlog') {
        const trimmedUrl = updatedGallery.youtubeUrl?.trim();
        if (!trimmedUrl || !getYouTubeEmbedUrl(trimmedUrl)) {
          toast.error('Please provide a valid YouTube URL for vlog entries.');
          return;
        }

        await updateGallery(updatedGallery._id, {
          title: updatedGallery.title,
          description: updatedGallery.description,
          category: 'vlog',
          youtubeUrl: trimmedUrl,
          images: []
        });
      } else {
        // Extract URLs from image objects for the update
        const imageUrls = updatedGallery.images
          .map(img => getImageUrl(img).trim())
          .filter(Boolean);

        if (imageUrls.length === 0) {
          toast.error('Please include at least one image for gallery entries.');
          return;
        }

        await updateGallery(updatedGallery._id, {
          title: updatedGallery.title,
          description: updatedGallery.description,
          images: imageUrls,
          category: normalizedCategory,
          youtubeUrl: undefined
        });
      }

      setShowEditModal(false);
      setSelectedGallery(null);
      toast.success('Gallery updated successfully');
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast.error('Failed to update gallery');
    } finally {
      setIsEditing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle adding a new image
  const handleAddImage = () => {
    if (currentImageUrl.trim() && selectedGallery && (selectedGallery.category || 'normal') !== 'vlog') {
      const newImage = {
        url: currentImageUrl.trim(),
        public_id: `temp_${Date.now()}` // Temporary ID for new images
      };
      const updatedGallery = {
        ...selectedGallery,
        images: [...selectedGallery.images, newImage]
      };
      setSelectedGallery(updatedGallery);
      setCurrentImageUrl('');
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    if (selectedGallery && (selectedGallery.category || 'normal') !== 'vlog') {
      const updatedGallery = {
        ...selectedGallery,
        images: selectedGallery.images.filter((_, i) => i !== index)
      };
      setSelectedGallery(updatedGallery);
    }
  };

  if (isLoading && galleries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage photo collections and albums</p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {galleries.map((gallery) => {
          const embedUrl = gallery.youtubeUrl ? getYouTubeEmbedUrl(gallery.youtubeUrl) : null;
          return (
            <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {/* Photo Preview Grid */}
              <div className="h-40 sm:h-48 bg-gray-200 overflow-hidden relative">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={gallery.title}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : gallery.images.length > 0 ? (
                  <div className="grid grid-cols-2 h-full gap-1">
                    {/* Main photo/video takes left half */}
                    <div className="relative">
                      {isVideo(getImageUrl(gallery.images[0])) ? (
                        <video
                          src={getImageUrl(gallery.images[0])}
                          controls
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/300x200?text=Video+Not+Found';
                          }}
                        />
                      ) : (
                        <img
                          src={getImageUrl(gallery.images[0])}
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      )}
                    </div>
                    {/* Right side shows up to 3 more photos/videos in a grid */}
                    <div className="grid grid-rows-2 gap-1">
                      {gallery.images.slice(1, 3).map((media, index) => (
                        <div key={index} className="relative">
                          {isVideo(getImageUrl(media)) ? (
                            <video
                              src={getImageUrl(media)}
                              controls
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/300x200?text=Video+Not+Found';
                              }}
                            />
                          ) : (
                            <img
                              src={getImageUrl(media)}
                              alt={`${gallery.title} ${index + 2}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                              }}
                            />
                          )}
                        </div>
                      ))}
                      {/* Show count overlay if more than 4 photos/videos */}
                      {gallery.images.length > 4 && (
                        <div className="relative">
                          {isVideo(getImageUrl(gallery.images[3])) ? (
                            <video
                              src={getImageUrl(gallery.images[3])}
                              controls
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/300x200?text=Video+Not+Found';
                              }}
                            />
                          ) : (
                            <img
                              src={getImageUrl(gallery.images[3])}
                              alt={`${gallery.title} 4`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              +{gallery.images.length - 4}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Images size={48} className="text-gray-300" />
                  </div>
                )}
                {/* Photo count badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  {embedUrl ? (
                    <>
                      <Play size={14} />
                      Vlog
                    </>
                  ) : (
                    <>
                      <Images size={14} />
                      {gallery.images.length}
                    </>
                  )}
                </div>
              </div>
              {isSelectedGalleryVlog && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={selectedGallery.youtubeUrl || ''}
                    onChange={(e) =>
                      setSelectedGallery({
                        ...selectedGallery,
                        youtubeUrl: e.target.value
                      })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            {/* Collection Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {gallery.title}
              </h3>
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {(gallery.category && gallery.category.trim()) ? gallery.category : 'normal'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                <Calendar size={16} className="mr-2" />
                {formatDate(gallery.createdAt)}
              </div>
              <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                <FileText size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-3">{gallery.description}</p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  onClick={() => handleViewGallery(gallery)}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleEditGallery(gallery)}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  disabled={isDeleting}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGallery(gallery._id)}
                  disabled={isDeleting}
                  className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
            </div>
          );
        })}
      </div>

      {galleries.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Images size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No galleries yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating a new gallery.</p>
          <Link
            to="/admin/gallery/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            Create Gallery
          </Link>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedGallery.title}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700 self-end"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Gallery Media
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    {selectedGalleryEmbedUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-black">
                          <iframe
                            src={selectedGalleryEmbedUrl}
                            title={selectedGallery.title}
                            className="absolute inset-0 w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <p className="text-xs text-gray-500 break-all">{selectedGallery.youtubeUrl}</p>
                      </div>
                    ) : selectedGallery.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {selectedGallery.images.map((media, index) => (
                          <div key={index} className="relative group">
                            {isVideo(getImageUrl(media)) ? (
                              <video
                                src={getImageUrl(media)}
                                controls
                                className="w-full h-32 sm:h-36 object-cover rounded-md border-2 border-gray-300"
                                onError={(e) => {
                                  (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/200?text=Video+Not+Found';
                                }}
                              />
                            ) : (
                              <img
                                src={getImageUrl(media)}
                                alt={`${selectedGallery.title} ${index + 1}`}
                                className="w-full h-32 sm:h-36 object-cover rounded-md border-2 border-gray-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                                }}
                              />
                            )}
                            <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Images size={48} className="mx-auto mb-2 text-gray-300" />
                        <p>No media in this gallery</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center text-gray-700 mb-4">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p>{formatDate(selectedGallery.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 mb-4">
                  <div>
                    <p className="font-medium">Category</p>
                    <p>{(selectedGallery.category && selectedGallery.category.trim()) ? selectedGallery.category : 'normal'}</p>
                  </div>
                </div>
                {selectedGalleryEmbedUrl && (
                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-1">YouTube Link</p>
                    <a
                      href={selectedGallery.youtubeUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline break-all text-sm"
                    >
                      {selectedGallery.youtubeUrl}
                    </a>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-600">
                    {selectedGallery.description || 'No description provided.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditGallery(selectedGallery);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Gallery</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 self-end"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={selectedGallery.title}
                    onChange={(e) =>
                      setSelectedGallery({
                        ...selectedGallery,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={(selectedGallery.category && selectedGallery.category.trim()) ? selectedGallery.category : 'normal'}
                  onChange={(e) => {
                    const nextCategory = e.target.value;
                    setSelectedGallery({
                      ...selectedGallery,
                      category: nextCategory,
                      images: nextCategory === 'vlog' ? [] : selectedGallery.images
                    });
                    if (nextCategory === 'vlog') {
                      setCurrentImageUrl('');
                    }
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal Gallery</option>
                  <option value="vlog">Vlog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedGallery.description}
                    onChange={(e) =>
                      setSelectedGallery({
                        ...selectedGallery,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images ({selectedGallery.images.length})
                  </label>
                  {isSelectedGalleryVlog ? (
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm">
                      Image management is disabled for vlog entries. Update the YouTube URL instead.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input
                          type="url"
                          value={currentImageUrl}
                          onChange={(e) => setCurrentImageUrl(e.target.value)}
                          placeholder="Enter image URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 whitespace-nowrap"
                        >
                          <Plus size={16} />
                          Add Image
                        </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {selectedGallery.images.map((media, index) => (
                            <div key={index} className="relative group">
                              {isVideo(getImageUrl(media)) ? (
                                <video
                                  src={getImageUrl(media)}
                                  controls
                                  className="w-full h-32 sm:h-36 object-cover rounded-md border-2 border-gray-300"
                                  onError={(e) => {
                                    (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/200?text=Video+Not+Found';
                                  }}
                                />
                              ) : (
                                <img
                                  src={getImageUrl(media)}
                                  alt={`Gallery image ${index + 1}`}
                                  className="w-full h-32 sm:h-36 object-cover rounded-md border-2 border-gray-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                                  }}
                                />
                              )}
                              <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                                #{index + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                aria-label="Remove image"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        {selectedGallery.images.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Images size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>No images in this gallery</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(selectedGallery)}
                    disabled={isEditing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isEditing ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;