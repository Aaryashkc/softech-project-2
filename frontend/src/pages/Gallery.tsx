import React, { useState } from 'react';
import { Calendar, MapPin, Users, Eye, Download, X, ChevronLeft, ChevronRight, Camera, Play, ImageIcon } from 'lucide-react';

// TypeScript interfaces
interface MediaItem {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'event' | 'meeting' | 'rally' | 'community' | 'official' | 'interview';
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  attendees?: number;
  photographer?: string;
  tags: string[];
  featured: boolean;
  views: number;
}

interface GalleryCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Demo data - this will be replaced with backend data later
  const mediaItems: MediaItem[] = [
    {
      id: 1,
      title: "Community Healthcare Forum - Kathmandu",
      description: "Engaging with citizens about universal healthcare access and medical infrastructure development in rural areas.",
      date: "2025-06-15",
      location: "Kathmandu Community Center",
      category: "community",
      type: "image",
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      attendees: 150,
      photographer: "Rajesh Hamal",
      tags: ["Healthcare", "Community", "Public Forum"],
      featured: true,
      views: 2840
    },
    {
      id: 2,
      title: "Youth Leadership Summit - Tribhuvan University",
      description: "Inspiring the next generation of leaders through education, mentorship, and political engagement opportunities.",
      date: "2025-06-10",
      location: "Tribhuvan University, Kirtipur",
      category: "event",
      type: "image",
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      attendees: 300,
      photographer: "Sita Gurung",
      tags: ["Youth", "Education", "Leadership", "University"],
      featured: true,
      views: 4200
    },
    {
      id: 3,
      title: "Education Reform Rally - Ratna Park",
      description: "Standing together with educators and students for free, quality education accessible to every Nepali citizen.",
      date: "2025-06-08",
      location: "Ratna Park, Kathmandu",
      category: "rally",
      type: "image",
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
      attendees: 500,
      photographer: "Binod Sharma",
      tags: ["Education", "Rally", "Reform", "Public Gathering"],
      featured: false,
      views: 3650
    },
    {
      id: 4,
      title: "CPN Maoist Centre Central Committee Meeting",
      description: "Strategic planning session with party leadership discussing upcoming policy initiatives and organizational development.",
      date: "2025-06-05",
      location: "CPN Maoist Centre Office",
      category: "meeting",
      type: "image",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      attendees: 45,
      photographer: "Krishna Thapa",
      tags: ["Party Meeting", "Strategy", "Leadership", "Politics"],
      featured: false,
      views: 1890
    },
    {
      id: 5,
      title: "Grassroots Dialogue - Bhaktapur",
      description: "Direct conversation with local citizens about community development, infrastructure needs, and local governance issues.",
      date: "2025-06-02",
      location: "Bhaktapur Durbar Square",
      category: "community",
      type: "image",
      url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop",
      attendees: 80,
      photographer: "Maya Tamang",
      tags: ["Grassroots", "Community", "Dialogue", "Local Issues"],
      featured: false,
      views: 2100
    },
    {
      id: 6,
      title: "Nepal Television Interview - Studio Session",
      description: "In-depth discussion about progressive politics, social justice, and the future of Nepal's democratic institutions.",
      date: "2025-05-28",
      location: "Nepal Television Studio",
      category: "interview",
      type: "video",
      url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
      photographer: "NTV Media Team",
      tags: ["Interview", "Television", "Politics", "Media"],
      featured: true,
      views: 8500
    },
    {
      id: 7,
      title: "Social Justice Workshop - Nepal Academy",
      description: "Building awareness and developing strategies for creating a more equitable society through policy reform.",
      date: "2025-05-25",
      location: "Nepal Academy Hall",
      category: "event",
      type: "image",
      url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
      attendees: 120,
      photographer: "Deepak Rai",
      tags: ["Social Justice", "Workshop", "Policy", "Reform"],
      featured: false,
      views: 1750
    },
    {
      id: 8,
      title: "Official Portrait Session",
      description: "Professional photographs for official party documentation and media distribution.",
      date: "2025-05-20",
      location: "Photography Studio, Kathmandu",
      category: "official",
      type: "image",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      photographer: "Professional Studio",
      tags: ["Portrait", "Official", "Photography", "Professional"],
      featured: false,
      views: 3200
    }
  ];

  const categories: GalleryCategory[] = [
    { 
      key: 'all', 
      label: 'All Media', 
      icon: <ImageIcon className="h-4 w-4" />,
    },
    { 
      key: 'event', 
      label: 'Events', 
      icon: <Calendar className="h-4 w-4" />,
    },
    { 
      key: 'community', 
      label: 'Community', 
      icon: <Users className="h-4 w-4" />,
    },
    { 
      key: 'meeting', 
      label: 'Meetings', 
      icon: <Users className="h-4 w-4" />,
    },
    { 
      key: 'rally', 
      label: 'Rallies', 
      icon: <Users className="h-4 w-4" />,
    },
    { 
      key: 'interview', 
      label: 'Interviews', 
      icon: <Camera className="h-4 w-4" />,
    },
    { 
      key: 'official', 
      label: 'Official', 
      icon: <Camera className="h-4 w-4" />,
    }
  ];

  const getFilteredMedia = (): MediaItem[] => {
    return activeCategory === 'all' 
      ? mediaItems 
      : mediaItems.filter(item => item.category === activeCategory);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const openLightbox = (media: MediaItem): void => {
    setSelectedMedia(media);
    const filteredMedia = getFilteredMedia();
    setLightboxIndex(filteredMedia.findIndex(item => item.id === media.id));
  };

  const closeLightbox = (): void => {
    setSelectedMedia(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next'): void => {
    const filteredMedia = getFilteredMedia();
    let newIndex = lightboxIndex;
    
    if (direction === 'prev') {
      newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : filteredMedia.length - 1;
    } else {
      newIndex = lightboxIndex < filteredMedia.length - 1 ? lightboxIndex + 1 : 0;
    }
    
    setLightboxIndex(newIndex);
    setSelectedMedia(filteredMedia[newIndex]);
  };

  const MediaCard: React.FC<{ media: MediaItem }> = ({ media }) => (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => openLightbox(media)}
    >
      <div className="relative">
        <img 
          src={media.thumbnail} 
          alt={media.title}
          className="w-full h-64 object-cover"
        />
        {media.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        {media.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 bg-opacity-80 rounded-full p-3">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            <Eye className="h-3 w-3 mr-1" />
            {media.views}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{media.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{media.description}</p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-3 w-3 mr-2" />
            {formatDate(media.date)}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-3 w-3 mr-2" />
            {media.location}
          </div>
          {media.attendees && (
            <div className="flex items-center text-gray-500 text-sm">
              <Users className="h-3 w-3 mr-2" />
              {media.attendees} attendees
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {media.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const Lightbox: React.FC = () => {
    if (!selectedMedia) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-6xl max-h-full">
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          {/* Navigation buttons */}
          <button 
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button 
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          {/* Media content */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img 
              src={selectedMedia.url} 
              alt={selectedMedia.title}
              className="w-full max-h-96 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedia.title}</h2>
              <p className="text-gray-600 mb-4">{selectedMedia.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(selectedMedia.date)}
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedMedia.location}
                </div>
                {selectedMedia.attendees && (
                  <div className="flex items-center text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {selectedMedia.attendees} attendees
                  </div>
                )}
                {selectedMedia.photographer && (
                  <div className="flex items-center text-gray-500">
                    <Camera className="h-4 w-4 mr-2" />
                    {selectedMedia.photographer}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMedia.tags.map((tag, index) => (
                  <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Photo & Video Gallery
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              Capturing moments from our political journey, community engagements, and democratic initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                  activeCategory === category.key
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Media */}
      {getFilteredMedia().filter(item => item.featured).length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Highlighting our most significant political moments and community engagements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredMedia().filter(item => item.featured).map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Media */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {activeCategory === 'all' ? 'Complete Gallery' : `${categories.find(c => c.key === activeCategory)?.label} Gallery`}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeCategory === 'all' 
                ? 'A comprehensive visual record of our political activities and community engagement'
                : `Visual documentation of our ${categories.find(c => c.key === activeCategory)?.label.toLowerCase()} activities`
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredMedia().filter(item => !item.featured).map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Capture History with Us
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Join our events and be part of Nepal's democratic transformation. 
            Every gathering is a step towards a more equitable and prosperous nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Attend Next Event
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition-colors duration-200">
              Subscribe for Updates
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox />
    </div>
  );
};

export default Gallery;