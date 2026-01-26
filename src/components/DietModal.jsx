import React from 'react';
import { X, Utensils } from 'lucide-react';

const DietModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-orange-900/40 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-bold">
            <Utensils size={14} /> {data.category}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400" /></button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>

        <div className="space-y-4 mb-8">
          {data.items?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-gray-600 text-xs">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-100 p-4 rounded-2xl mb-6">
          <p className="text-stone-600 text-xs italic text-center">💡 {data.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default DietModal;