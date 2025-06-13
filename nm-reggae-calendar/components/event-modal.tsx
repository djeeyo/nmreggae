
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

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
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
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold text-white mb-2">
              {event.event_name}
            </h4>
          </div>
          
          <div className="flex items-center gap-2 text-yellow-400">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(event.date)} • {event.day_of_week}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-5 h-5" />
            <span className="bg-slate-700/50 px-2 py-1 rounded">
              {event.type}
            </span>
          </div>
          
          {event.tickets_url && (
            <div className="pt-4">
              <a
                href={event.tickets_url}
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
  );
}
