import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Book, Calendar, X, Trash2, Sun, Moon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CreateJournalModal from '../components/CreateJournalModel';
import vite_api_url from '../../vite.config.js';
import api from '../axios.config.js';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const navigate = useNavigate();

  // ✅ Theme State
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://soulsync-backend-e70c.onrender.com/api/v1/journals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJournals(res.data.data.journals);
    } catch (err) {
      console.error("Journal fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJournals(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://soulsync-backend-e70c.onrender.com/api/v1/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedJournal(null);
      fetchJournals();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-500 font-sans ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      
      {/* Header with Theme Toggle */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <button onClick={() => navigate('/dashboard')} className={`flex items-center gap-2 text-sm font-bold mb-4 transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>My Digital Diary</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} font-medium`}>Reflect on your thoughts and track your growth.</p>
        </div>
        <button onClick={() => setIsDark(!isDark)} className={`p-3 rounded-2xl transition-all border ${isDark ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-white text-slate-500 border-gray-200 shadow-sm'}`}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Journal Grid */}
      <div className="max-w-7xl mx-auto">
        {journals.length === 0 && !loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <Book size={80} className={`mb-4 opacity-20 ${isDark ? 'text-slate-500' : 'text-indigo-300'}`} />
            <p className="text-xl font-medium italic">No journal entries yet. Start writing!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {journals.map((entry) => (
                <motion.div 
                  key={entry._id}
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedJournal(entry)}
                  className={`p-8 rounded-[2.5rem] cursor-pointer transition-all border relative overflow-hidden group ${
                    isDark 
                    ? 'bg-slate-900/40 border-slate-800 backdrop-blur-xl hover:border-indigo-500/50' 
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-2xl hover:border-indigo-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">{entry.moodEmoji}</span>
                    <div className={`flex items-center text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className={`font-black text-xl mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>{entry.title}</h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{entry.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Selected Journal Modal */}
      <AnimatePresence>
        {selectedJournal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }}
              className={`w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 max-h-[85vh] overflow-y-auto relative border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <span className="text-6xl">{selectedJournal.moodEmoji}</span>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1">{selectedJournal.title}</h2>
                    <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {new Date(selectedJournal.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(selectedJournal._id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={22} />
                  </button>
                  <button onClick={() => setSelectedJournal(null)} className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    <X size={22} />
                  </button>
                </div>
              </div>
              <div className={`prose prose-lg max-w-none leading-relaxed whitespace-pre-wrap font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {selectedJournal.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-10 right-10 bg-indigo-600 text-white p-5 rounded-3xl shadow-2xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all flex items-center gap-3 group z-50"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={28} />
        <span className="font-black text-lg pr-2">New Entry</span>
      </motion.button>

      <CreateJournalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchJournals} 
      />
    </div>
  );
};

export default Journal;