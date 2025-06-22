
'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

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

interface EventCardProps {
  event: Event;
  cityName: string;
  index: number;
  onClick: () => void;
}

export default function EventCard({ event, cityName, index, onClick }: EventCardProps) {
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

  return (
    <motion.div
      className={`${getCityColorClass(cityName)} rounded-xl p-6 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
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
  );
}
