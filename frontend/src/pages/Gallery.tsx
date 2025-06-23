import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

// TypeScript interfaces
interface PhotoCollection {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  photos: string[];
}

const Gallery: React.FC = () => {
  const [currentView, setCurrentView] = useState<'gallery' | 'collection'>('gallery');
  const [selectedCollection, setSelectedCollection] = useState<PhotoCollection | null>(null);

  // Demo data - one collection with 5 photos
  const photoCollections: PhotoCollection[] = [
    {
      id: 1,
      title: "Community Healthcare Forum - Kathmandu",
      description: "Photos from the community healthcare forum held in Kathmandu, showcasing our commitment to public health and community engagement.",
      createdAt: "2025-06-15T10:30:00Z",
      photos: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      title: "Community Healthcare Forum - Kathmandu",
      description: "Photos from the community healthcare forum held in Kathmandu, showcasing our commitment to public health and community engagement.",
      createdAt: "2025-06-22T10:30:00Z",
      photos: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop"
      ]
    }
  ];

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
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
  };

  const openCollection = (collection: PhotoCollection): void => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photoCollections.map((collection) => (
              <div 
                key={collection.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => openCollection(collection)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={collection.photos[0]} 
                    alt={collection.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                      {collection.photos.length} photos
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {collection.title}
                  </h3>
                  <h4 className="text-md text-gray-900 mb-2">
                    {collection.description}
                  </h4>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(collection.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              {selectedCollection.photos.map((photo, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`${selectedCollection.title} - Photo ${index + 1}`}
                    className="w-full h-64 object-cover"
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