import React, { useState } from 'react';
import { Filter, X, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const [selectedProvince, setSelectedProvince] = useState('DKI Jakarta');
  const [selectedCity, setSelectedCity] = useState('Jakarta Pusat');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedSubDistricts, setSelectedSubDistricts] = useState<string[]>([]);

  const provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah'];
  const cities = ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Timur'];
  const districts = ['Menteng', 'Tanah Abang', 'Gambir', 'Sawah Besar', 'Kemayoran', 'Senen', 'Cempaka Putih', 'Johar Baru'];
  const subDistricts = ['Menteng', 'Pegangsaan', 'Cikini', 'Kebon Sirih', 'Gondangdia'];

  const toggleDistrict = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const toggleSubDistrict = (subDistrict: string) => {
    setSelectedSubDistricts(prev => 
      prev.includes(subDistrict) 
        ? prev.filter(d => d !== subDistrict)
        : [...prev, subDistrict]
    );
  };

  const clearAll = () => {
    setSelectedDistricts([]);
    setSelectedSubDistricts([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Territory Filters</h3>
                  <p className="text-xs text-slate-500">Multi-level administrative selection</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Province Selector */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Province
                </label>
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* City Selector */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  City / Regency
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* District Multi-Select */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Districts (Kecamatan)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 rounded-xl p-3 border border-slate-200">
                  {districts.map(district => (
                    <label
                      key={district}
                      className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDistricts.includes(district)}
                        onChange={() => toggleDistrict(district)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                        {district}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedDistricts.length > 0 && (
                  <div className="mt-2 text-xs text-slate-500">
                    {selectedDistricts.length} district{selectedDistricts.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {/* Sub-District Multi-Select */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Sub-Districts (Kelurahan)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 rounded-xl p-3 border border-slate-200">
                  {subDistricts.map(subDistrict => (
                    <label
                      key={subDistrict}
                      className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubDistricts.includes(subDistrict)}
                        onChange={() => toggleSubDistrict(subDistrict)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                        {subDistrict}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedSubDistricts.length > 0 && (
                  <div className="mt-2 text-xs text-slate-500">
                    {selectedSubDistricts.length} sub-district{selectedSubDistricts.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {/* Active Filters Summary */}
              {(selectedDistricts.length > 0 || selectedSubDistricts.length > 0) && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
                        Active Filters
                      </span>
                    </div>
                    <button
                      onClick={clearAll}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedDistricts.length > 0 && (
                      <div className="text-xs text-indigo-700">
                        <span className="font-bold">Districts:</span> {selectedDistricts.join(', ')}
                      </div>
                    )}
                    {selectedSubDistricts.length > 0 && (
                      <div className="text-xs text-indigo-700">
                        <span className="font-bold">Sub-Districts:</span> {selectedSubDistricts.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={clearAll}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
