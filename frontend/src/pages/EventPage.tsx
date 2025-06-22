import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

type EventType = 'forum' | 'summit' | 'rally' | 'meeting' | 'community' | 'official' | 'workshop' | 'dialogue';

interface EventBase {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  description: string;
  attendees: number;
  image: string;
}

interface EventWithStatus extends EventBase {
  status: 'upcoming' | 'completed';
}

const EventsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');

  // Demo data - this will be replaced with backend data later
  const baseEvents: EventBase[] = [
    {
      id: 1,
      title: "Community Healthcare Forum",
      date: "2025-06-15",
      time: "10:00 AM",
      location: "Kathmandu Community Center",
      type: "forum",
      description: "Join us for an open discussion on improving healthcare access in rural communities across Nepal.",
      attendees: 150,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Youth Leadership Summit",
      date: "2025-07-22",
      time: "9:00 AM",
      location: "Tribhuvan University, Kirtipur",
      type: "summit",
      description: "Empowering the next generation of leaders through education, mentorship, and political engagement.",
      attendees: 300,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Education Reform Rally",
      date: "2025-08-05",
      time: "2:00 PM",
      location: "Ratna Park, Kathmandu",
      type: "rally",
      description: "Standing together for free, quality education accessible to every Nepali citizen.",
      attendees: 500,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Grassroots Dialogue Series",
      date: "2025-06-10",
      time: "4:00 PM",
      location: "Bhaktapur Durbar Square",
      type: "dialogue",
      description: "Direct conversation with citizens about local issues and community development initiatives.",
      attendees: 80,
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Social Justice Workshop",
      date: "2025-06-01",
      time: "11:00 AM",
      location: "Nepal Academy Hall",
      type: "workshop",
      description: "Building awareness and strategies for creating a more equitable society in Nepal.",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Party Central Committee Meeting",
      date: "2025-07-30",
      time: "1:00 PM",
      location: "CPN Maoist Centre Office",
      type: "meeting",
      description: "Strategic planning session for upcoming policy initiatives and organizational development.",
      attendees: 45,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    }
  ];

  // Process events with status and filter
  const { upcomingEvents, completedEvents } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsWithStatus = baseEvents
      .filter(event => activeFilter === 'all' || event.type === activeFilter)
      .map(event => {
        const eventDate = new Date(event.date);
        const status = eventDate >= today ? 'upcoming' : 'completed';
        return { ...event, status } as EventWithStatus;
      });

    return {
      upcomingEvents: eventsWithStatus.filter(event => event.status === 'upcoming'),
      completedEvents: eventsWithStatus.filter(event => event.status === 'completed')
    };
  }, [activeFilter]);

  const eventTypes = [
    { key: 'all', label: 'All Events' },
    { key: 'forum', label: 'Forums' },
    { key: 'summit', label: 'Summits' },
    { key: 'rally', label: 'Rallies' },
    { key: 'dialogue', label: 'Dialogues' },
    { key: 'workshop', label: 'Workshops' },
    { key: 'meeting', label: 'Meetings' }
  ];

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const EventCard = ({ event }: { event: EventWithStatus }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            event.status === 'upcoming' 
              ? 'bg-green-100 text-green-800 border-2 border-green-800' 
              : 'bg-gray-100 text-gray-800 border-2 border-gray-800'
          }`}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mb-2">
            {event.type}
          </span>
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
        
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-start text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
            <span className="text-sm">
              {event.status === 'upcoming' 
                ? `Expected: ${event.attendees}+ attendees` 
                : `Attended by ${event.attendees} people`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const totalAttendees = useMemo(() => 
    baseEvents.reduce((sum: number, event: EventBase) => sum + event.attendees, 0),
    [baseEvents]
  );

  return (
    <div className="py-12">
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

      {/* Event Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {eventTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setActiveFilter(type.key as EventType | 'all')}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  activeFilter === type.key
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className={`py-16 ${upcomingEvents.length > 0 ? 'bg-gray-50' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            {upcomingEvents.length === 0 && (
              <p className="mt-4 text-gray-500">No upcoming events at the moment. Check back soon!</p>
            )}
          </div>
          {upcomingEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className={`py-16 ${completedEvents.length > 0 ? 'bg-white' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Past Events</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            {completedEvents.length === 0 && (
              <p className="mt-4 text-gray-500">No past events to display.</p>
            )}
          </div>
          {completedEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

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

      {/* Event Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {baseEvents.length}
              </div>
              <div className="text-gray-600 font-medium">Total Events</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {totalAttendees.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">People Engaged</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {upcomingEvents.length}
              </div>
              <div className="text-gray-600 font-medium">Upcoming Events</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {new Set(baseEvents.map(event => event.location.split(',')[1] || event.location)).size}
              </div>
              <div className="text-gray-600 font-medium">Locations Visited</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;