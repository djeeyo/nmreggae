
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigationProps {
  currentMonthIndex: number;
  monthNames: string[];
  currentMonth: string;
  totalEvents: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthNavigation({
  currentMonthIndex,
  monthNames,
  currentMonth,
  totalEvents,
  onPrevMonth,
  onNextMonth
}: MonthNavigationProps) {
  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
        <button
          onClick={onPrevMonth}
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
            {totalEvents} events this month
          </p>
        </div>
        
        <button
          onClick={onNextMonth}
          disabled={currentMonthIndex === monthNames.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
