
import React from 'react';
import { Flight } from '../types';
import { format } from 'date-fns';
import { PlaneTakeoff, Calendar, Clock } from 'lucide-react';

interface FlightListProps {
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  theme?: 'dark' | 'light';
}

const FlightList: React.FC<FlightListProps> = ({ flights, onEdit, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  if (flights.length === 0) {
    return (
      <div className={`px-6 py-12 text-center text-xs uppercase tracking-widest font-bold italic ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
        No flights logged yet. Tap the + to start your journey.
      </div>
    );
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getLogoUrl = (flight: Flight) => {
    const iata = flight.airlineIata || flight.flightNumber.replace(/[0-9]/g, '').slice(0, 2).toUpperCase();
    return `https://www.gstatic.com/flights/airline_logos/70px/${iata}.png`;
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>, airline: string) => {
    const target = e.target as HTMLImageElement;
    const cleanName = airline.toLowerCase().replace(/\s+/g, '');
    const fallbackUrl = `https://logo.clearbit.com/${cleanName}.com`;
    
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(airline)}&background=0ea5e9&color=fff&size=128&bold=true`;
    }
  };

  return (
    <div className="px-6 space-y-4 pb-32">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Recent Journeys</h3>
      {[...flights].reverse().map((flight) => (
        <button
          key={flight.id}
          onClick={() => onEdit(flight)}
          className={`w-full text-left rounded-3xl p-5 transition-all group active:scale-[0.98] border shadow-sm ${
            isDark 
              ? 'bg-neutral-900/40 border-white/5 hover:bg-neutral-900/60' 
              : 'bg-white border-slate-200 hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border shadow-sm transition-transform group-hover:-rotate-3 ${
                isDark ? 'bg-white border-white/10' : 'bg-white border-slate-100'
              }`}>
                <img 
                  src={getLogoUrl(flight)} 
                  alt={flight.airline}
                  className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
                  onError={(e) => handleLogoError(e, flight.airline)}
                />
              </div>
              <div>
                <div className={`text-sm font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {flight.flightNumber}
                  <span className="text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">
                    {flight.airline}
                  </span>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                  <Calendar size={10} />
                  {format(new Date(flight.date), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-black flex items-center justify-end gap-1.5 px-2 py-1 rounded-lg ${
                isDark ? 'bg-neutral-800/50 text-neutral-400' : 'bg-white text-slate-500 border border-slate-100'
              }`}>
                <Clock size={10} className="text-sky-500" />
                {formatDuration(flight.durationMinutes)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-2">
            <div className="text-left">
              <div className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{flight.origin.code}</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>{flight.origin.city}</div>
            </div>
            
            <div className="flex-1 px-6 flex flex-col items-center">
              <div className={`w-full h-[1px] relative ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 rounded-full border shadow-sm transition-transform group-hover:scale-110 ${
                  isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-slate-100'
                }`}>
                  <PlaneTakeoff size={14} className="text-sky-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <span className={`text-[9px] mt-2 font-black tracking-[0.2em] uppercase ${isDark ? 'text-neutral-600' : 'text-slate-300'}`}>{flight.distanceKm} KM</span>
            </div>

            <div className="text-right">
              <div className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{flight.destination.code}</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>{flight.destination.city}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FlightList;
