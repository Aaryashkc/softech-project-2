import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Loader2, X, ChevronLeft, ChevronRight, Play, Images } from 'lucide-react';
import { useGalleryStore, type GalleryType } from '../stores/useGalleryStore';
import { getYouTubeEmbedUrl } from '../utils/youtube';

const Gallery: React.FC = () => {
  const [currentView, setCurrentView] = useState<'gallery' | 'collection'>('gallery');
  const [selectedCollection, setSelectedCollection] = useState<GalleryType | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  
  const { galleries, fetchGalleries, isLoading } = useGalleryStore();

  // Fetch galleries on component mount
  useEffect(() => {
    fetchGalleries();
  }, []); // Remove fetchGalleries dependency to prevent multiple calls

  // Keyboard navigation for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null || !selectedCollection || selectedCollection.youtubeUrl) return;
      const media = selectedCollection.images[fullscreenIndex];
      if (!media) return;
      
      switch (e.key) {
        case 'Escape':
          setFullscreenIndex(null);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateMedia(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateMedia(1);
          break;
        case ' ':
          e.preventDefault();
          if (isVideo(getImageUrl(media))) {
            // No custom play/pause logic here, rely on native controls
          }
          break;
      }
    };

    if (fullscreenIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [fullscreenIndex, selectedCollection]);

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'Date not specified';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not specified';
    }
  };

  // Helper function to check if a URL is a video
  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  // Helper function to get image URL from image object
  const getImageUrl = (image: { url: string; public_id: string } | string) => {
    return typeof image === 'string' ? image : image.url;
  };

  const openCollection = (collection: GalleryType): void => {
    setSelectedCollection(collection);
    setCurrentView('collection');
    setFullscreenIndex(null);
  };

  const backToGallery = (): void => {
    setCurrentView('gallery');
    setSelectedCollection(null);
    setFullscreenIndex(null);
  };

  const openFullscreen = (index: number): void => {
    if (selectedCollection?.youtubeUrl) return;
    setFullscreenIndex(index);
  };

  const closeFullscreen = (): void => {
    setFullscreenIndex(null);
  };

  const navigateMedia = (direction: number): void => {
    if (!selectedCollection || fullscreenIndex === null || selectedCollection.youtubeUrl) return;
    
    const newIndex = fullscreenIndex + direction;
    const total = selectedCollection.images ? selectedCollection.images.length : 0;
    if (newIndex >= 0 && newIndex < total) {
      setFullscreenIndex(newIndex);
    }
  };

  // Remove isVideoPlaying, isVideoMuted, toggleVideoPlayback, toggleVideoMute, and related state/logic

  // Fullscreen Modal Component
  const FullscreenModal: React.FC = () => {
    if (fullscreenIndex === null || !selectedCollection || selectedCollection.youtubeUrl) return null;

    const currentMedia = getImageUrl(selectedCollection.images[fullscreenIndex]);
    const isMediaVideo = isVideo(currentMedia);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={closeFullscreen}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Navigation Buttons */}
        {fullscreenIndex > 0 && (
          <button
            onClick={() => navigateMedia(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
        )}

        {fullscreenIndex < selectedCollection.images.length - 1 && (
          <button
            onClick={() => navigateMedia(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="h-12 w-12" />
          </button>
        )}

        {/* Media Content */}
        <div className="max-w-full max-h-full flex items-center justify-center relative">
          {isMediaVideo ? (
            <video
              src={currentMedia}
              className="max-w-full max-h-screen object-contain"
              controls
              autoPlay
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <img
              src={currentMedia}
              alt={`${selectedCollection.title} - Photo ${fullscreenIndex + 1}`}
              className="max-w-full max-h-screen object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
              }}
            />
          )}
        </div>

        {/* Media Info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
          <p className="text-sm">
            {fullscreenIndex + 1} of {selectedCollection.images.length}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {isMediaVideo ? 'Video' : 'Image'} 
          </p>
        </div>
      </div>
    );
  };

  // Gallery View Component
  const GalleryView: React.FC = () => (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Media Gallery</h1>
            <p className="text-xl text-red-100">
              Capturing moments from our political journey
            </p>
          </div>
        </div>
      </section>

      {/* Photo Collections with tabs (All, Gallery) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
          ) : galleries.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries
                  .map((gallery) => {
                    const embedUrl = gallery.youtubeUrl ? getYouTubeEmbedUrl(gallery.youtubeUrl) : null;
                    const imageCount = gallery.images ? gallery.images.length : 0;
                    const hasImages = imageCount > 0;
                    const firstMedia = hasImages ? getImageUrl(gallery.images[0]) : null;
                    return (
                      <div 
                        key={gallery._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
                        onClick={() => openCollection(gallery)}
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-1">
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={gallery.title}
                              className="w-full h-64 object-cover"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : hasImages && firstMedia ? (
                            isVideo(firstMedia) ? (
                              <div className="relative">
                                <video
                                  src={firstMedia}
                                  className="w-full h-64 object-cover"
                                  muted
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="h-12 w-12 text-white opacity-80" />
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={firstMedia}
                                alt={gallery.title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                }}
                              />
                            )
                          ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                              <Images className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute bottom-4 right-4">
                            <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                              {embedUrl ? (
                                <>
                                  <Play className="h-4 w-4" />
                                  Vlog
                                </>
                              ) : (
                                <>
                                  <Images className="h-4 w-4" />
                                  {imageCount} {imageCount === 1 ? 'item' : 'items'}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {gallery.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {gallery.description}
                          </p>
                          <div className="flex items-center text-gray-500 text-sm mt-auto">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(gallery.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Galleries Found</h3>
              <p className="text-gray-500">Check back later for photo galleries.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  // Collection View Component
  const CollectionView: React.FC = () => {
    if (!selectedCollection) return null;
    const embedUrl = selectedCollection.youtubeUrl ? getYouTubeEmbedUrl(selectedCollection.youtubeUrl) : null;
    const mediaItems = selectedCollection.images || [];

    return (
      <div>
        {/* Header with Back Button */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <button 
              onClick={backToGallery}
              className="flex items-center text-red-100 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Gallery
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{selectedCollection.title}</h1>
              <h2 className="text-md mb-4">{selectedCollection.description}</h2>
              <div className="flex items-center justify-center text-red-100">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(selectedCollection.createdAt)}
              </div>
            </div>
          </div>
        </section>

        {/* All Media */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {embedUrl ? (
              <div className="space-y-6">
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={embedUrl}
                    title={selectedCollection.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-center text-gray-600 text-sm">
                  Watch on YouTube:
                  <a href={selectedCollection.youtubeUrl || '#'} target="_blank" rel="noreferrer" className="text-red-600 hover:underline ml-1">
                    {selectedCollection.youtubeUrl}
                  </a>
                </p>
              </div>
            ) : mediaItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((media, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openFullscreen(index)}
                  >
                    {isVideo(getImageUrl(media)) ? (
                      <div className="relative">
                        <video
                          src={getImageUrl(media)}
                          className="w-full h-64 object-cover"
                          muted
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white opacity-80" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                            VIDEO
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={getImageUrl(media) || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={`${selectedCollection.title} - Photo ${index + 1}`}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : selectedCollection.youtubeUrl ? (
              <div className="text-center py-16 text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                Unable to load this vlog. Please verify the YouTube link.
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Images className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                No media available for this gallery.
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  // Render based on current view
  return (
    <div className="min-h-screen bg-white">
      {currentView === 'gallery' ? <GalleryView /> : <CollectionView />}
      <FullscreenModal />
    </div>
  );
};

export default Gallery;