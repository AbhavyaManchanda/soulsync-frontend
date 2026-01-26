import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const YogaModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl">{data.emoji || '🧘'}</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-emerald-900 mb-2">{data.poseName}</h2>
        <p className="text-emerald-600 text-sm font-medium mb-6 italic">"{data.benefits}"</p>

        <div className="space-y-4 mb-8">
          {data.steps?.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="mt-1 bg-emerald-100 rounded-full p-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          Namaste, I'm Done
        </button>
      </div>
    </div>
  );
};

export default YogaModal;