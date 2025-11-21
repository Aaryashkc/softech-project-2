import React, { useEffect } from 'react';
import { Calendar, Loader2, Play } from 'lucide-react';
import { useGalleryStore } from '../stores/useGalleryStore';
import { getYouTubeEmbedUrl } from '../utils/youtube';

const Vlog: React.FC = () => {
  const { vlogGalleries, fetchVlogGalleries, isLoading } = useGalleryStore();

  useEffect(() => {
    fetchVlogGalleries();
  }, []); // Remove fetchVlogGalleries dependency to prevent multiple calls

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Campaign Vlogs</h1>
          <p className="text-lg text-red-100">
            Dive into our latest video updates, speeches, and behind-the-scenes moments.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
          ) : vlogGalleries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vlogGalleries.map((vlog) => {
                const embedUrl = vlog.youtubeUrl ? getYouTubeEmbedUrl(vlog.youtubeUrl) : null;
                return (
                  <div key={vlog._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="relative pb-[56.25%] bg-black">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={vlog.title}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                          <Play className="h-12 w-12 mb-2" />
                          <p className="text-sm text-center px-4">Invalid or missing YouTube URL</p>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Vlog
                      </span>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-gray-900">{vlog.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{vlog.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{vlog.createdAt ? new Date(vlog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date not specified'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No vlogs yet</h3>
              <p className="text-gray-500">Check back soon for new video updates.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Vlog;

