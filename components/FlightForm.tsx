
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Loader2, Save, Trash2 } from 'lucide-react';
import { parseFlightInput } from '../services/geminiService';
import { Flight } from '../types';

interface FlightFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flight: Flight) => void;
  onDelete?: (id: string) => void;
  editingFlight?: Flight | null;
  theme?: 'dark' | 'light';
}

const FlightForm: React.FC<FlightFormProps> = ({ isOpen, onClose, onSave, onDelete, editingFlight, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Flight>>({});

  useEffect(() => {
    if (editingFlight) {
      setFormData(editingFlight);
      setUserInput('');
    } else {
      setFormData({});
      setUserInput('');
    }
  }, [editingFlight, isOpen]);

  const handleMagicParse = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    const data = await parseFlightInput(userInput);
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
    setIsLoading(false);
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Flight] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) return;

    const flightToSave: Flight = {
      id: editingFlight?.id || Math.random().toString(36).substring(7),
      flightNumber: formData.flightNumber || 'FL123',
      airline: formData.airline || 'Unknown Airline',
      airlineIata: formData.airlineIata || '',
      origin: formData.origin as any,
      destination: formData.destination as any,
      date: formData.date || new Date().toISOString(),
      durationMinutes: Number(formData.durationMinutes) || 0,
      distanceKm: Number(formData.distanceKm) || 0,
    };

    onSave(flightToSave);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className={`relative w-full max-w-xl rounded-t-[40px] sm:rounded-[40px] p-6 sm:p-10 border shadow-2xl max-h-[90vh] overflow-y-auto transition-colors duration-500 ${
              isDark ? 'bg-neutral-950 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight">{editingFlight ? 'Edit Journey' : 'New Flight'}</h2>
              <div className="flex items-center gap-3">
                {editingFlight && onDelete && (
                  <button 
                    onClick={() => { if(confirm('Delete flight?')) onDelete(editingFlight.id); onClose(); }}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button onClick={onClose} className={`p-3 rounded-2xl transition-colors ${
                  isDark ? 'hover:bg-white/5 text-neutral-500' : 'hover:bg-slate-100 text-slate-400'
                }`}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {!editingFlight && (
                <div>
                  <label className={`block text-[10px] uppercase tracking-[0.2em] mb-3 font-black ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                    AI Magic Entry
                  </label>
                  <div className="relative group">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="e.g. 'United flight 240 from SFO to LAX on Friday'"
                      className={`w-full border rounded-3xl p-5 text-sm font-semibold focus:ring-4 focus:outline-none min-h-[100px] resize-none pr-14 transition-all ${
                        isDark 
                          ? 'bg-neutral-900 border-white/5 focus:ring-sky-500/10 text-white' 
                          : 'bg-white border-slate-100 focus:ring-sky-500/5 text-slate-900'
                      }`}
                    />
                    <button 
                      onClick={handleMagicParse}
                      disabled={isLoading || !userInput}
                      className={`absolute bottom-5 right-5 p-3 rounded-2xl shadow-xl transition-all disabled:opacity-50 ${
                        isDark ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-5">
                  <div className="col-span-1">
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>IATA</label>
                    <input 
                      type="text" 
                      maxLength={2}
                      placeholder="LH"
                      value={formData.airlineIata || ''} 
                      onChange={(e) => updateField('airlineIata', e.target.value.toUpperCase())}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-black text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>Airline</label>
                    <input 
                      type="text" 
                      value={formData.airline || ''} 
                      onChange={(e) => updateField('airline', e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>Flight #</label>
                    <input 
                      type="text" 
                      value={formData.flightNumber || ''} 
                      onChange={(e) => updateField('flightNumber', e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>Date</label>
                    <input 
                      type="date" 
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} 
                      onChange={(e) => updateField('date', e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>Origin (IATA)</label>
                    <input 
                      type="text" 
                      value={formData.origin?.code || ''} 
                      onChange={(e) => updateField('origin.code', e.target.value.toUpperCase())}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[9px] uppercase tracking-widest mb-2 font-black ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>Destination (IATA)</label>
                    <input 
                      type="text" 
                      value={formData.destination?.code || ''} 
                      onChange={(e) => updateField('destination.code', e.target.value.toUpperCase())}
                      className={`w-full border rounded-2xl px-5 py-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        isDark ? 'bg-neutral-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.origin?.code || !formData.destination?.code}
                className={`w-full py-5 font-black uppercase tracking-widest text-xs rounded-3xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 shadow-2xl active:scale-95 ${
                  isDark ? 'bg-white text-black shadow-white/5 hover:bg-neutral-200' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                }`}
              >
                <Save size={18} />
                {editingFlight ? 'Update Journey' : 'Log Journey'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FlightForm;
