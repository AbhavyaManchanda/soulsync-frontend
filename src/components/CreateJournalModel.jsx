import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../axios.config.js';

const CreateJournalModal = ({ isOpen, onClose, onRefresh }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      // Backend controller 'createJournal' ko hit karenge
      await api.post('/api/v1/journals', { content });
      
      setContent('');
      onRefresh(); // List refresh karne ke liye
      onClose(); // Modal band karne ke liye
    } catch (err) {
      console.error("Journal save error", err);
      alert("Failed to save journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50/50">
          <h2 className="text-xl font-bold text-gray-800">New Diary Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
              </div>
              
              

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            className="w-full h-64 p-4 text-gray-700 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 resize-none text-lg placeholder:text-gray-300"
            placeholder="What's on your mind today? Write freely..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'AI Analyzing...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalModal;