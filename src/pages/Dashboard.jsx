import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, PenTool, Heart, Sun, Moon, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import BreathingModal from '../components/BreathingModal';
import ZenGardenModal from '../components/ZenGardenModal';
import YogaModal from '../components/YogaModal';
import DietModal from '../components/DietModal';
import api from '../axios.config.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [suggestSession, setSuggestSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const audioRef = useRef(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [yogaData, setYogaData] = useState(null);
  const [loadingYoga, setLoadingYoga] = useState(false);
  const [latestMoodScore, setLatestMoodScore] = useState(0);
  const [dietData, setDietData] = useState(null);
  const [articles, setArticles] = useState([]);
  
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

  // Existing useEffects (Articles, Sentiment, Stats)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/api/v1/blogs'); 
        setArticles(res.data.data);
      } catch (err) { console.error("Blogs fetch failed", err); }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/v1/stats');
        const { moods } = res.data.data || {};
        if (moods && moods.length > 0) {
          const formattedData = moods.slice(0, 7).reverse().map((item) => ({
            day: new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
            score: item.sentimentScore ?? 0
          }));
          setGraphData(formattedData);
          setLatestMoodScore(moods[0]?.sentimentScore ?? 0);
        }
      } catch (err) {
        console.error('Error fetching stats:', err.response?.status, err);
      }
    };
    fetchStats();
  }, []);

 const handleMoodSubmit = async (e) => {
  e.preventDefault();
  if (!mood.trim()) return alert("Please write something first!");
  
  setLoading(true);
  try {
    const res = await api.post('/api/v1/moods', { content: mood });
    
    // Safety check for response data
    const logData = res.data?.data?.log;
    if (!logData) throw new Error("Invalid response format");

    setLastResponse(logData.aiResponse);
    setSuggestSession(!!res.data?.data?.suggestSession);

    // Chart point + latest score for yoga/diet
    const newPoint = {
      day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      score: logData.sentimentScore ?? 0
    };
    setGraphData((prev) => {
      const updated = [...prev, newPoint];
      return updated.length > 7 ? updated.slice(1) : updated;
    });
    setLatestMoodScore(logData.sentimentScore ?? 0);

    setMood(''); 
  } catch (err) {
    console.error("Mood Submission Error:", err);
    alert(err.response?.data?.message || "Check-in failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleSound = (soundType) => {
    if (playingSound === soundType) {
      audioRef.current.pause();
      setPlayingSound(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const newAudio = new Audio(`/sounds/${soundType.toLowerCase()}.mp3`);
    newAudio.loop = true;
    newAudio.play();
    audioRef.current = newAudio;
    setPlayingSound(soundType);
  };

  const handleYogaClick = async () => {
    setLoadingYoga(true);
    try {
      const res = await api.post('/api/v1/yoga/suggest', { moodScore: latestMoodScore });
      setYogaData(res.data);
      setActiveActivity('Yoga');
    } catch (err) {
      alert(err.response?.data?.message || 'Yoga suggestion failed. Please try again.');
    } finally {
      setLoadingYoga(false);
    }
  };

  const handleDietClick = async () => {
    try {
      const res = await api.post('/api/v1/diet/suggest', { moodScore: latestMoodScore });
      setDietData(res.data);
      setActiveActivity('Diet');
    } catch (err) {
      alert(err.response?.data?.message || 'Diet suggestion failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Navbar with Toggle */}
        <nav className={`flex justify-between items-center p-4 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/50 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-indigo-600'}`}>
            <Heart fill={isDark ? "#6366f1" : "currentColor"} size={24} /> SoulSync
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl border transition-all ${isDark ? 'text-slate-400 border-slate-800 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500'}`}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>

        <header className="py-2">
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>How are you today?</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Column 1: Mood Check-in */}
          <section className={`p-8 rounded-[2.5rem] border transition-all min-h-[400px] flex flex-col justify-center ${isDark ? 'bg-slate-900/40 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            {!lastResponse ? (
              <>
                <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Daily Check-in</h3>
                <form onSubmit={handleMoodSubmit} className="space-y-4">
                  <textarea 
                    className={`w-full p-5 rounded-3xl outline-none transition-all min-h-[160px] border ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
                    placeholder="Describe your current thoughts..."
                    value={mood} onChange={(e) => setMood(e.target.value)}
                  />
                  <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
                    {loading ? 'Analyzing...' : 'Submit Check-in'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className={`p-8 rounded-3xl border relative ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">AI Summary</span>
                  <p className="text-xl italic font-medium">"{lastResponse}"</p>
                </div>
                {suggestSession ? (
                  <button onClick={() => navigate('/chat')} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-500 transition-all">Start Therapy</button>
                ) : (
                  <button onClick={() => setLastResponse(null)} className="text-indigo-400 font-bold hover:underline">Write another entry</button>
                )}
              </div>
            )}
          </section>

          {/* Column 2: Graph */}
          <section className={`p-8 rounded-[2.5rem] border transition-all h-full min-h-[400px] ${isDark ? 'bg-slate-900/40 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mood Analytics</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData.length > 0 ? graphData : [{day: 'No Data', score: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12}} />
                  <YAxis hide domain={[-1, 1]} />
                  <Tooltip contentStyle={{ borderRadius: '16px', backgroundColor: isDark ? '#1e293b' : '#fff', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke={isDark ? "#818cf8" : "#4f46e5"} strokeWidth={5} dot={{ r: 6, fill: isDark ? '#818cf8' : '#4f46e5', strokeWidth: 3, stroke: isDark ? '#0f172a' : '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: MessageSquare, title: "AI Therapy", desc: "Empathetic conversation with Gemini.", path: "/chat" },
            { icon: PenTool, title: "Journaling", desc: "AI-powered long-form reflection.", path: "/journals" }
          ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.path)} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex flex-col items-start ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}>
              <item.icon className={`mb-4 transition-transform group-hover:scale-110 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} size={32} />
              <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.title}</h3>
              <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Zen Zone & Sounds */}
        <div className="grid grid-cols-12 gap-6">
          <div className={`col-span-12 lg:col-span-6 p-6 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Relaxing Sounds</h3>
            <div className="grid grid-cols-2 gap-3 h-48">
              {['Birds', 'Forest', 'Waves', 'Winds'].map((sound) => (
                <button key={sound} onClick={() => toggleSound(sound)} className={`rounded-2xl transition-all flex flex-col items-center justify-center gap-1 border-2 ${playingSound === sound ? 'bg-indigo-500/20 border-indigo-500' : (isDark ? 'bg-slate-800/50 border-transparent hover:border-slate-700' : 'bg-indigo-50 border-transparent hover:bg-indigo-100')}`}>
                  <span className={`text-2xl ${playingSound === sound ? 'animate-pulse' : ''}`}>{sound === 'Birds' ? '🐦' : sound === 'Forest' ? '🌲' : sound === 'Waves' ? '🌊' : '🌬️'}</span>
                  <span className={`text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>{playingSound === sound ? 'Playing...' : sound}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`col-span-12 lg:col-span-6 p-6 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Zen Zone</h3>
            <div className="grid grid-cols-2 gap-3 h-48">
              {['Zen Garden', 'Breathing', 'Yoga Poses', 'Healthy Diet'].map((activity) => (
                <button key={activity} onClick={() => {
                  if (activity === 'Breathing') setActiveActivity('Breathing');
                  else if (activity === 'Zen Garden') setActiveActivity('Zen Garden');
                  else if (activity === 'Yoga Poses') handleYogaClick();
                  else if (activity === 'Healthy Diet') handleDietClick(); 
                }} className={`rounded-2xl transition-all flex flex-col items-center justify-center gap-1 border-2 ${isDark ? 'bg-purple-500/10 border-transparent hover:border-purple-500/50' : 'bg-purple-50 border-transparent hover:bg-purple-100'}`}>
                  <span className="text-2xl">✨</span>
                  <span className={`text-xs font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{activity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blogs */}
          <div className={`col-span-12 p-6 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Mindful Reads</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {articles.map((article, index) => (
                <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className={`min-w-[280px] max-w-[280px] p-4 rounded-2xl transition-all group border ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50' : 'bg-slate-50 border-transparent hover:bg-white hover:shadow-md'}`}>
                  <img src={article.image} className="w-full h-32 object-cover rounded-xl mb-3" alt="blog" />
                  <h4 className={`font-bold text-sm line-clamp-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{article.title}</h4>
                  <span className="text-[11px] text-indigo-400 mt-3 block font-bold">Read More →</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        <BreathingModal isOpen={activeActivity === 'Breathing'} onClose={() => setActiveActivity(null)} />
        <ZenGardenModal isOpen={activeActivity === 'Zen Garden'} onClose={() => setActiveActivity(null)} />
        <YogaModal isOpen={activeActivity === 'Yoga'} onClose={() => setActiveActivity(null)} data={yogaData} />
        <DietModal isOpen={activeActivity === 'Diet'} onClose={() => setActiveActivity(null)} data={dietData} />
      </div>
    </div>
  );
};

export default Dashboard;