import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Loader2, User, BookOpen, Feather, Music, Tag } from 'lucide-react';
import { useSahityaStore, type Sahitya } from '../stores/useSahityaStore';

const SahityaPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedItem, setSelectedItem] = useState<Sahitya | null>(null);

  const { items, fetchAll, isLoading } = useSahityaStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'Date not specified';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not specified';
    }
  };

  const openDetail = (item: Sahitya): void => {
    setSelectedItem(item);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const backToList = (): void => {
    setCurrentView('list');
    setSelectedItem(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kavita': return <Feather className="h-4 w-4" />;
      case 'geet': return <Music className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // List View Component
  const SahityaListView: React.FC = () => (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Sahitya & Sangit</h1>
            <p className="text-xl text-red-100">
              Exploring literature, poetry, and music
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-700" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full border border-stone-100"
                  onClick={() => openDetail(item)}
                >
                  {/* Cover Image or Placeholder */}
                  <div className="h-48 bg-stone-200 relative overflow-hidden group">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                        <BookOpen className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-serif">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{item.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Content Found</h3>
              <p className="text-gray-500">Check back later for new literary works.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  // Detail View Component
  const SahityaDetailView: React.FC = () => {
    if (!selectedItem) return null;

    return (
      <div className="bg-white min-h-screen">
        {/* Header / Hero */}
        <div className="relative bg-stone-900 text-white">
          {selectedItem.coverImage && (
            <div className="absolute inset-0">
              <img
                src={selectedItem.coverImage}
                alt={selectedItem.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
            </div>
          )}

          <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
            <button
              onClick={backToList}
              className="inline-flex items-center text-stone-300 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Collection
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedItem.category}
                </span>
                <span className="bg-stone-700 text-stone-200 px-3 py-1 rounded-full text-sm font-medium uppercase">
                  {selectedItem.type}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                {selectedItem.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-stone-300 pt-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-red-500" />
                  <span className="text-lg">{selectedItem.authorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  <span>{formatDate(selectedItem.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <article className="prose prose-lg prose-stone mx-auto">
            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-800">
              {selectedItem.content}
            </div>
          </article>

          {/* Tags */}
          {selectedItem.tags && selectedItem.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {selectedItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {currentView === 'list' ? <SahityaListView /> : <SahityaDetailView />}
    </div>
  );
};

export default SahityaPage;