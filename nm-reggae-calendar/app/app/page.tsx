
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import reggaeEventsData from '../data/reggae-events.json';

interface Event {
  date: string;
  original_date: string;
  day_of_week: string;
  venue: string;
  event_name: string;
  type: string;
  tickets_url: string | null;
  state: string;
  country: string;
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
  'Rio Rancho': 'rio-rancho'
};

const monthNames = ['July', 'August', 'September', 'October'];

export default function Home() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const currentMonth = monthNames[currentMonthIndex];
  const monthData = reggaeEventsData.events_by_month[currentMonth as keyof typeof reggaeEventsData.events_by_month] as MonthData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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
    if (currentMonthIndex < monthNames.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

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
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Music className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 tracking-tight">
              New Mexico Reggae Calendar
            </h1>
            <Music className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl text-yellow-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your guide to the hottest reggae vibes across the Land of Enchantment
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
              {currentMonth} 2025
            </h2>
            <p className="text-yellow-200">
              {monthData?.total_events || 0} events this month
            </p>
          </div>
          
          <button
            onClick={nextMonth}
            disabled={currentMonthIndex === monthNames.length - 1}
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
        key={currentMonth}
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
                          {formatDate(event.date)} • {event.day_of_week}
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
            <p className="text-xl text-gray-400">No events scheduled for {currentMonth} 2025</p>
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
                <span>{formatDate(selectedEvent.date)} • {selectedEvent.day_of_week}</span>
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
            © 2025 New Mexico Reggae Calendar • Bringing you the best reggae vibes in the Land of Enchantment
          </p>
        </div>
      </footer>
    </div>
  );
}
