import React, { useMemo, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2, Sparkles } from 'lucide-react';
import { useEventStore, type EventType } from '../stores/useEventStore';

interface EventWithStatus extends EventType {
  status: 'upcoming' | 'completed';
}

const EventsPage: React.FC = () => {
  const { events, fetchEvents, isLoading } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { upcomingEvents, completedEvents, comingSoonEvents } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Separate coming soon events
    const comingSoon = events.filter(event => event.isComingSoon);
    const regularEvents = events.filter(event => !event.isComingSoon);

    const eventsWithStatus = regularEvents.map(event => {
      const eventDate = new Date(event.date || '');
      const status = eventDate >= today ? 'upcoming' : 'completed';
      return { ...event, status } as EventWithStatus;
    });

    // Sort events by date (soonest first for upcoming, most recent first for completed)
    const sortedUpcoming = eventsWithStatus
      .filter(event => event.status === 'upcoming')
      .sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
      
    const sortedCompleted = eventsWithStatus
      .filter(event => event.status === 'completed')
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

    return {
      upcomingEvents: sortedUpcoming,
      completedEvents: sortedCompleted,
      comingSoonEvents: comingSoon.map(event => ({ ...event, status: 'upcoming' as const }))
    };
  }, [events]);

  // Format date for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Date TBA';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Date not specified';
      
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const EventCard = ({ event }: { event: EventWithStatus }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={event.image || 'https://via.placeholder.com/400x250?text=No+Image'} 
          alt={event.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Available';
          }}
        />
        <div className="absolute top-4 right-4">
          {event.isComingSoon ? (
            <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-800 flex items-center gap-1.5 shadow-lg">
              <Sparkles size={14} />
              Coming Soon
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'upcoming' 
                ? 'bg-green-100 text-green-800 border-2 border-green-800' 
                : 'bg-gray-100 text-gray-800 border-2 border-gray-800'
            }`}>
              {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 flex-grow">{event.description || 'Event details coming soon...'}</p>
        
        {event.isComingSoon ? (
          <div className="mt-auto py-3 px-4 bg-blue-50 border-2 border-blue-600 rounded-lg">
            <p className="text-blue-800 text-sm font-medium text-center">
              📅 Details will be announced soon!
            </p>
          </div>
        ) : (
          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
              <span className="text-sm">{event.time || 'Time TBA'}</span>
            </div>
            <div className="flex items-start text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{event.location || 'Location TBA'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Events & Engagements
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">
              Join us in building a stronger, more equitable Nepal through community engagement and political action
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        </div>
      )}

      {/* Coming Soon Events */}
      {!isLoading && comingSoonEvents.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="h-8 w-8 text-blue-700" />
                <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
                <Sparkles className="h-8 w-8 text-blue-700" />
              </div>
              <div className="w-20 h-1 bg-blue-700 mx-auto"></div>
              <p className="text-gray-600 mt-4">Exciting events in the pipeline - stay tuned!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoonEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {!isLoading && upcomingEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {!isLoading && completedEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Past Events</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Show message if no events */}
      {!isLoading && upcomingEvents.length === 0 && completedEvents.length === 0 && comingSoonEvents.length === 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Events Available</h2>
            <p className="text-gray-600">Check back soon for upcoming events and engagements.</p>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Be the first to know about upcoming events, community dialogues, and opportunities 
            to participate in Nepal's democratic transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe to Updates
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition-colors duration-200">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;