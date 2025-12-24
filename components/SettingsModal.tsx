
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, User, Save } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const isDark = localSettings.theme === 'dark';

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    if (localSettings.birthday) {
      const birth = new Date(localSettings.birthday);
      if (birth > new Date()) {
        alert("Birthday cannot be in the future.");
        return;
      }
    }
    
    onUpdate(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`relative w-full max-w-sm border rounded-[32px] p-8 shadow-2xl transition-colors duration-500 ${
              isDark ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-500/10 text-sky-600'}`}>
                  <User size={20} />
                </div>
                Settings
              </h2>
              <button onClick={onClose} className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/5 text-neutral-500' : 'hover:bg-slate-100 text-slate-400'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <label className={`block text-[10px] uppercase tracking-widest mb-3 font-black ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                  Your Birthday
                </label>
                <input
                  type="date"
                  value={localSettings.birthday || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, birthday: e.target.value })}
                  className={`w-full border rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    isDark ? 'bg-neutral-950 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                  }`}
                />
                <p className={`text-[10px] mt-2 px-1 font-bold italic ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>
                  Used to calculate your sky-time relative to age.
                </p>
              </section>

              <section>
                <label className={`block text-[10px] uppercase tracking-widest mb-3 font-black ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                  Appearance
                </label>
                <div className={`flex gap-2 p-1.5 rounded-2xl ${isDark ? 'bg-neutral-950 border border-white/5' : 'bg-white border border-slate-100'}`}>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs ${
                      isDark 
                        ? 'bg-neutral-800 text-white shadow-lg shadow-black/20' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs ${
                      !isDark 
                        ? 'bg-white text-slate-900 shadow-md border border-slate-100' 
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                </div>
              </section>
              
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className={`w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 ${
                    isDark ? 'bg-sky-500 text-white shadow-sky-500/20 hover:bg-sky-400' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                  }`}
                >
                  <Save size={18} />
                  SAVE PREFERENCES
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
