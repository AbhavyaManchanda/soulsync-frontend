import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BreathingModal = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000); // 4 seconds ka rhythm
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-xl flex items-center justify-center z-[100]">
      <div className="bg-white/80 p-12 rounded-[3rem] shadow-2xl text-center relative max-w-sm w-full border border-white">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>
        
        <h2 className="text-2xl font-bold text-indigo-900 mb-8">{phase}...</h2>
        
        {/* Breathing Circle Animation */}
        <div className="relative flex justify-center items-center h-64">
          <div className={`absolute rounded-full bg-indigo-400/20 transition-all duration-[4000ms] ease-in-out ${
            phase === 'Inhale' ? 'w-64 h-64 opacity-100' : 'w-20 h-20 opacity-30'
          }`} />
          <div className={`rounded-full bg-indigo-500 shadow-lg shadow-indigo-200 transition-all duration-[4000ms] ease-in-out ${
            phase === 'Inhale' ? 'w-48 h-48' : 'w-16 h-16'
          }`} />
        </div>
        
        <p className="mt-12 text-indigo-600 font-medium tracking-wide">Focus on your breath.</p>
      </div>
    </div>
  );
};

export default BreathingModal;