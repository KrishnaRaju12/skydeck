
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from './components/Globe';
import StatsHeader from './components/StatsHeader';
import FlightList from './components/FlightList';
import FlightForm from './components/FlightForm';
import SettingsModal from './components/SettingsModal';
import { Flight, AppStats, UserSettings } from './types';

// Total sovereign countries approximately
const TOTAL_COUNTRIES = 195;

// Initial dummy data for visual storytelling
const INITIAL_FLIGHTS: Flight[] = [
  {
    id: '1',
    flightNumber: 'LH454',
    airline: 'Lufthansa',
    airlineIata: 'LH',
    origin: { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0333, lng: 8.5705 },
    destination: { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.3790 },
    date: '2024-05-12T10:00:00Z',
    durationMinutes: 660,
    distanceKm: 9150
  },
  {
    id: '2',
    flightNumber: 'NH2',
    airline: 'ANA',
    airlineIata: 'NH',
    origin: { code: 'NRT', name: 'Narita Intl', city: 'Tokyo', country: 'Japan', lat: 35.7720, lng: 140.3929 },
    destination: { code: 'IAD', name: 'Dulles Intl', city: 'Washington D.C.', country: 'USA', lat: 38.9445, lng: -77.4558 },
    date: '2024-08-20T14:30:00Z',
    durationMinutes: 800,
    distanceKm: 10860
  }
];

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(() => {
    const saved = localStorage.getItem('skyLog_flights');
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });
  
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('skyLog_settings');
    try {
      return saved ? JSON.parse(saved) : { theme: 'dark' };
    } catch (e) {
      return { theme: 'dark' };
    }
  });

  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [isSettingsBtnVisible, setIsSettingsBtnVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('skyLog_flights', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('skyLog_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Handle settings button visibility based on interaction
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const showBtn = () => {
      setIsSettingsBtnVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsSettingsBtnVisible(false), 5000);
    };

    window.addEventListener('touchstart', showBtn);
    window.addEventListener('mousemove', showBtn);
    return () => {
      window.removeEventListener('touchstart', showBtn);
      window.removeEventListener('mousemove', showBtn);
      clearTimeout(timeout);
    };
  }, []);

  const stats: AppStats = useMemo(() => {
    const totalFlights = flights.length;
    const totalMinutes = flights.reduce((acc, f) => acc + f.durationMinutes, 0);
    const totalHours = totalMinutes / 60;
    const totalDistance = flights.reduce((acc, f) => acc + f.distanceKm, 0);
    
    const uniqueCountries = new Set();
    const uniqueAirports = new Set();
    flights.forEach(f => {
      uniqueCountries.add(f.origin.country);
      uniqueCountries.add(f.destination.country);
      uniqueAirports.add(f.origin.code);
      uniqueAirports.add(f.destination.code);
    });

    const percentWorldVisited = (uniqueCountries.size / TOTAL_COUNTRIES) * 100;
    
    let percentLifeFlown = 0;
    if (userSettings.birthday) {
      const birthDate = new Date(userSettings.birthday);
      const birthTime = birthDate.getTime();
      const now = new Date().getTime();
      const lifeMinutes = (now - birthTime) / (1000 * 60);
      
      if (lifeMinutes > 0 && totalMinutes > 0) {
        percentLifeFlown = (totalMinutes / lifeMinutes) * 100;
      }
    }

    return {
      totalFlights,
      totalHours,
      totalDistance,
      countriesVisited: uniqueCountries.size,
      airportsVisited: uniqueAirports.size,
      percentWorldVisited,
      percentLifeFlown
    };
  }, [flights, userSettings]);

  const handleSaveFlight = (savedFlight: Flight) => {
    setFlights(prev => {
      const exists = prev.find(f => f.id === savedFlight.id);
      if (exists) {
        return prev.map(f => f.id === savedFlight.id ? savedFlight : f);
      }
      return [...prev, savedFlight];
    });
    setEditingFlight(null);
  };

  const handleDeleteFlight = (id: string) => {
    setFlights(prev => prev.filter(f => f.id !== id));
    setEditingFlight(null);
  };

  const handleEditRequest = (flight: Flight) => {
    setEditingFlight(flight);
    setIsFormOpen(true);
  };

  const handleNewFlight = () => {
    setEditingFlight(null);
    setIsFormOpen(true);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  const isDark = userSettings.theme === 'dark';

  return (
    <div className={`relative min-h-screen flex flex-col max-w-2xl mx-auto border-x ${isDark ? 'border-white/5 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-slate-900'} transition-colors duration-500 selection:bg-sky-500/30 overflow-hidden`}>
      {/* Settings Button - Absolute within the relative app container */}
      <AnimatePresence>
        {isSettingsBtnVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsSettingsOpen(true)}
            className={`absolute top-8 left-8 z-[60] w-12 h-12 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all shadow-2xl ${
              isDark ? 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:text-white' : 'bg-white/80 border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Brand & Status */}
      <div className="absolute top-8 right-8 z-50 flex flex-col items-end pointer-events-none">
        <h1 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>SKYLOG</h1>
        <div className={`px-3 py-1 rounded-full backdrop-blur-md mt-2 border ${isDark ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-500/5 border-sky-500/10'}`}>
          <span className="text-[10px] text-sky-500 font-bold tracking-widest uppercase">Aviation Deck</span>
        </div>
      </div>

      {/* Top Section: Globe + Stats (Pinned) */}
      <div className="flex-shrink-0">
        <section className="relative h-[500px] overflow-hidden">
          <Globe flights={flights} theme={userSettings.theme} />
        </section>

        <StatsHeader 
          stats={stats} 
          isExpanded={isStatsExpanded} 
          onToggle={() => setIsStatsExpanded(!isStatsExpanded)} 
          theme={userSettings.theme}
        />
      </div>

      {/* Activity List: Scrolling */}
      <main className="flex-1 overflow-y-auto pt-2 scroll-smooth">
        <FlightList flights={flights} onEdit={handleEditRequest} theme={userSettings.theme} />
      </main>

      {/* Persistent Add Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={handleNewFlight}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all group border-4 shadow-2xl ${
            isDark ? 'bg-white text-black border-neutral-900 shadow-white/10' : 'bg-slate-900 text-white border-white shadow-slate-900/20'
          } hover:scale-110 active:scale-95`}
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <FlightForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingFlight(null); }} 
        onSave={handleSaveFlight}
        onDelete={handleDeleteFlight}
        editingFlight={editingFlight}
        theme={userSettings.theme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onUpdate={handleUpdateSettings}
      />

      {/* Visual Accents */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] pointer-events-none rounded-full ${isDark ? 'bg-sky-500/5' : 'bg-sky-500/10'}`}></div>
      <div className={`fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${isDark ? 'from-neutral-950' : 'from-white'} to-transparent pointer-events-none z-30`}></div>
    </div>
  );
};

export default App;
