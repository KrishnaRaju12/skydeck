
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Clock, Map, Globe as GlobeIcon, Landmark, ChevronDown, ChevronUp, Activity, PieChart } from 'lucide-react';
import { AppStats } from '../types';

interface StatsHeaderProps {
  stats: AppStats;
  isExpanded: boolean;
  onToggle: () => void;
  theme?: 'dark' | 'light';
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ stats, isExpanded, onToggle, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="relative z-10 -mt-12 px-6 pb-8">
      <motion.div 
        className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl transition-colors duration-500 ${
          isDark ? 'bg-neutral-900/60 border-white/5' : 'bg-white/70 border-slate-200'
        }`}
        layout
      >
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5`}>
              <Plane size={12} /> Flights
            </span>
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalFlights}</span>
          </div>
          <div className={`flex flex-col items-center border-l ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
            <span className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5`}>
              <Clock size={12} /> Air Time
            </span>
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.round(stats.totalHours)}h</span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`h-px my-4 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
              
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="flex flex-col items-center">
                  <Map size={18} className="text-sky-500 mb-2" />
                  <span className={`text-[10px] uppercase font-semibold tracking-tighter ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Distance</span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.totalDistance.toLocaleString()} km</span>
                </div>
                <div className="flex flex-col items-center">
                  <GlobeIcon size={18} className="text-sky-500 mb-2" />
                  <span className={`text-[10px] uppercase font-semibold tracking-tighter ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Countries</span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.countriesVisited}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Landmark size={18} className="text-sky-500 mb-2" />
                  <span className={`text-[10px] uppercase font-semibold tracking-tighter ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Airports</span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.airportsVisited}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pb-2">
                <div className={`rounded-2xl p-4 flex flex-col items-center border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                   <Activity size={16} className="text-sky-500 mb-2" />
                   <span className={`text-[9px] uppercase tracking-tighter mb-1 font-bold ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>World Explored</span>
                   <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.percentWorldVisited.toFixed(1)}%</span>
                </div>
                <div className={`rounded-2xl p-4 flex flex-col items-center border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                   <PieChart size={16} className="text-sky-500 mb-2" />
                   <span className={`text-[9px] uppercase tracking-tighter mb-1 font-bold ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Life in the Air</span>
                   <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.percentLifeFlown.toFixed(3)}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={onToggle}
          className={`w-full flex justify-center mt-2 transition-colors ${isDark ? 'text-neutral-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </motion.div>
    </div>
  );
};

export default StatsHeader;
