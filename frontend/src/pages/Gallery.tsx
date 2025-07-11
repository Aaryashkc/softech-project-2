import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useGalleryStore, type GalleryType } from '../stores/useGalleryStore';

const Gallery: React.FC = () => {
  const [currentView, setCurrentView] = useState<'gallery' | 'collection'>('gallery');
  const [selectedCollection, setSelectedCollection] = useState<GalleryType | null>(null);
  
  const { galleries, fetchGalleries, isLoading } = useGalleryStore();

  // Fetch galleries on component mount
  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

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

  const openCollection = (collection: GalleryType): void => {
    setSelectedCollection(collection);
    setCurrentView('collection');
  };

  const backToGallery = (): void => {
    setCurrentView('gallery');
    setSelectedCollection(null);
  };

  // Gallery View Component
  const GalleryView: React.FC = () => (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl text-red-100">
              Capturing moments from our political journey
            </p>
          </div>
        </div>
      </section>

      {/* Photo Collections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
          ) : galleries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
              <div 
                key={gallery._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
                onClick={() => openCollection(gallery)}
              >
                {/* Thumbnail */}
                <div className="relative flex-1">
                  <img 
                    src={gallery.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={gallery.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                      {gallery.images.length} {gallery.images.length === 1 ? 'photo' : 'photos'}
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
              ))}
            </div>
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
              <div className="flex items-center justify-center text-red-100">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(selectedCollection.createdAt)}
              </div>
            </div>
          </div>
        </section>

        {/* All Photos */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCollection.images.map((image, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={`${selectedCollection.title} - Photo ${index + 1}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Render based on current view
  return (
    <div className="min-h-screen bg-white">
      {currentView === 'gallery' ? <GalleryView /> : <CollectionView />}
    </div>
  );
};

export default Gallery;