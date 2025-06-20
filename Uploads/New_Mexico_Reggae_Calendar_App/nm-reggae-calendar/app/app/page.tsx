
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  date: string;
  original_date?: string;
  day_of_week: string;
  venue: string;
  event_name: string;
  type: string;
  tickets_url: string | null;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
}

interface CityData {
  city_name: string;
  events: Event[];
}

interface MonthData {
  month_name: string;
  cities: Record<string, CityData>;
  total_events: number;
}

const cityColors = {
  'Albuquerque': 'albuquerque',
  'Santa Fe': 'santa-fe',
  'Las Vegas': 'las-vegas',
  'Rio Rancho': 'rio-rancho',
  'Taos': 'taos'
};

// Generate rolling 6-month period
const generateRollingMonths = () => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({
      name: monthDate.toLocaleDateString('en-US', { month: 'long' }),
      year: monthDate.getFullYear(),
      value: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`,
      date: monthDate,
    });
  }
  
  return months;
};

// Transform events from API into month/city structure
const organizeEventsByMonth = (events: Event[]) => {
  const eventsByMonth: Record<string, MonthData> = {};
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const monthKey = eventDate.toLocaleDateString('en-US', { month: 'long' });
    
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = {
        month_name: monthKey,
        cities: {},
        total_events: 0,
      };
    }
    
    if (!eventsByMonth[monthKey].cities[event.city]) {
      eventsByMonth[monthKey].cities[event.city] = {
        city_name: event.city,
        events: [],
      };
    }
    
    eventsByMonth[monthKey].cities[event.city].events.push({
      ...event,
      date: event.date,
    });
    eventsByMonth[monthKey].total_events++;
  });
  
  return eventsByMonth;
};

export default function Home() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rollingMonths = generateRollingMonths();
  const currentMonth = rollingMonths[currentMonthIndex];
  const eventsByMonth = organizeEventsByMonth(events);
  const monthData = eventsByMonth[currentMonth?.name] || null;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);

        const response = await fetch(
          `/api/events?startDate=${today.toISOString()}&endDate=${sixMonthsFromNow.toISOString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    // Handle both ISO date strings and simple date strings
    // Extract just the date part if it's an ISO string
    const dateOnly = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    
    // Parse the date string manually to ensure consistent behavior
    // Format: "2025-07-15" -> [2025, 07, 15]
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    // Validate the parsed values
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error('Invalid date string:', dateString);
      return 'Invalid Date';
    }
    
    // Create date object with explicit UTC to avoid timezone issues
    const date = new Date(year, month - 1, day);
    
    // Use consistent formatting that works the same on server and client
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const weekday = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    
    return `${weekday}, ${monthName} ${dayNum}`;
  };

  const getCityColorClass = (cityName: string) => {
    const normalizedCity = cityName.toLowerCase().replace(' ', '-');
    return `city-${normalizedCity}`;
  };

  const getCityLabelClass = (cityName: string) => {
    const normalizedCity = cityName.toLowerCase().replace(' ', '-');
    return `city-label-${normalizedCity}`;
  };

  const nextMonth = () => {
    if (currentMonthIndex < rollingMonths.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 text-xl">Loading events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <motion.header 
        className="text-center py-12 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Brand Logo and Name */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image
                src="/lion-of-judah-logo.png"
                alt="Blazin' Reggae Vibes - Lion of Judah Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-yellow-400 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Blazin' Reggae Vibes
            </motion.h1>
          </motion.div>

          {/* Calendar Title */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Music className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 tracking-tight">
              New Mexico Reggae Calendar
            </h2>
            <Music className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-yellow-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Bringing Irie Vibes to the High Desert
          </motion.p>
        </div>
      </motion.header>

      {/* Month Navigation */}
      <motion.div 
        className="max-w-6xl mx-auto px-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
          <button
            onClick={prevMonth}
            disabled={currentMonthIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">
              {currentMonth?.name} {currentMonth?.year}
            </h2>
            <p className="text-yellow-200">
              {monthData?.total_events || 0} events this month
            </p>
          </div>
          
          <button
            onClick={nextMonth}
            disabled={currentMonthIndex === rollingMonths.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Events Display */}
      <motion.main 
        className="max-w-6xl mx-auto px-4 pb-12"
        key={currentMonth?.name}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {monthData && Object.entries(monthData.cities).map(([cityName, cityData], cityIndex) => (
          <motion.div
            key={cityName}
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: cityIndex * 0.1 }}
          >
            <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${getCityLabelClass(cityName)} flex items-center gap-2`}>
              <MapPin className="w-6 h-6" />
              {cityName}
            </h3>
            
            <div className="grid gap-4 md:gap-6">
              {cityData.events.map((event, eventIndex) => (
                <motion.div
                  key={`${event.date}-${event.venue}-${eventIndex}`}
                  className={`${getCityColorClass(cityName)} rounded-xl p-6 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                  onClick={() => setSelectedEvent(event)}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: (cityIndex * 0.1) + (eventIndex * 0.05) }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {event.event_name}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300 mt-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm bg-slate-700/50 px-2 py-1 rounded">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    
                    {event.tickets_url && (
                      <div className="flex-shrink-0">
                        <a
                          href={event.tickets_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Get Tickets
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        
        {!monthData && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-400">No events scheduled for {currentMonth?.name} {currentMonth?.year}</p>
          </motion.div>
        )}
      </motion.main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="bg-slate-800 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-400">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {selectedEvent.event_name}
                </h4>
              </div>
              
              <div className="flex items-center gap-2 text-yellow-400">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>{selectedEvent.venue}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span className="bg-slate-700/50 px-2 py-1 rounded">
                  {selectedEvent.type}
                </span>
              </div>
              
              {selectedEvent.tickets_url && (
                <div className="pt-4">
                  <a
                    href={selectedEvent.tickets_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors w-full justify-center"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Get Tickets
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400">
            © 2025 Blazin' Reggae Vibes • New Mexico Reggae Calendar • Bringing Irie Vibes to the High Desert
          </p>
        </div>
      </footer>
    </div>
  );
}
