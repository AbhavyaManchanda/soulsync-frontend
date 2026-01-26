import React, { useState, useEffect } from 'react';
import { MessageCircle, BookOpen, BarChart3, Heart, Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const LandingPage = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDark]);

  const features = [
    { icon: "🎨", title: "Zen Sand Garden", desc: "Draw slow, mindful patterns in our interactive sand garden." },
    { icon: "🫁", title: "Breathing Exercises", desc: "Follow guided visual cues to regulate your nervous system." },
    { icon: "🎵", title: "Relaxing Sounds", desc: "Immerse yourself in high-quality ambient sounds." },
    { icon: "📖", title: "Mindful Reads", desc: "Stay informed with curated articles on wellness." },
    { icon: "🧘", title: "AI Yoga Poses", desc: "Personalized yoga from Gemini based on your mood." },
    { icon: "🍎", title: "Healthy Diet Tips", desc: "Mood-boosting snacks tailored to your emotional state." }
  ];

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-hidden font-sans ${isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-[#fafafa] text-slate-900'}`}>
      
      {/* 🌌 Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {!isDark && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100/40 rounded-full blur-[120px]" />
          </>
        )}
        <motion.div 
          style={{ x: cursorX, y: cursorY, width: '600px', height: '600px', left: '-300px', top: '-300px',
            background: isDark 
              ? `radial-gradient(circle, rgba(235, 227, 227, 0.08) 0%, rgba(133, 137, 204, 0.05) 50%, transparent 80%)`
              : `radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(244, 114, 182, 0.05) 50%, transparent 80%)`,
          }}
          className="absolute rounded-full pointer-events-none blur-[80px]"
        />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
          <div className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Heart fill={isDark ? "#6366f1" : "#4f46e5"} className={isDark ? "text-indigo-500" : "text-indigo-600"} /> 
            <span className="tracking-tighter">SoulSync</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-full transition-all border ${isDark ? 'bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 shadow-sm hover:bg-slate-50'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className={`px-6 py-2 rounded-full font-bold transition-all ${isDark ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-black shadow-lg'}`}>
              Login
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black mb-8 border uppercase tracking-[0.2em] ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
              <Sparkles size={12} /> Powered by Gemini 1.5
            </div>
            <h1 className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mindfulness, <br />
              <span className={isDark ? "text-indigo-500" : "text-indigo-600"}>Reimagined.</span>
            </h1>
            <p className={`text-lg mb-12 max-w-xl mx-auto leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Empathetic AI therapy and proactive mood tracking designed for your mental sanctuary.
            </p>
            <Link to="/login" className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-900/20 active:scale-95 group">
              Get Started <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        {/* Features Grid & Side Topics */}
        <section className={`max-w-7xl mx-auto px-6 py-24 border-t transition-colors ${isDark ? 'border-slate-800/50' : 'border-slate-200/60'}`}>
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Side: Text Content */}
            <div className="lg:w-1/3 sticky top-24">
              <h2 className={`text-4xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Everything you need to find <span className="text-indigo-500">Balance</span>
              </h2>
              <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                A holistic approach to mental well-being, combining AI intelligence with centuries-old mindfulness practices.
              </p>
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <p className={`text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  "The goal isn't to clear your mind, but to be at peace with what's already there."
                </p>
              </div>
            </div>

            {/* Right Side: Topics Grid */}
            <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
                    isDark 
                    ? 'bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/40 hover:border-indigo-500/30' 
                    : 'bg-white border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-indigo-200'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    {f.icon}
                  </div>
                  <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
                  <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{f.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;