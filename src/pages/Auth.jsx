import React, { useState, useEffect } from 'react';
import api from '../axios.config.js';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Heart, Mail, Lock, User, ArrowRight, Sun, Moon } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  // Pointer Glow Logic
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

    // document class switch for global theme support
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) return alert("Passwords do not match!");

    const endpoint = isLogin ? '/api/v1/users/login' : '/api/v1/users/signup';
    const payload = isLogin 
      ? { email, password } 
      : { name, email, password, passwordConfirm: confirmPassword }; 

    try {
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      const hint = err.response?.status === 401
        ? '\n\nUsing a new or empty database? Create an account first.'
        : '';
      alert(msg + hint);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center transition-colors duration-500 overflow-hidden p-4 font-sans ${isDark ? 'bg-[#0f172a]' : 'bg-[#fafafa]'}`}>
      
      {/* 🌌 Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isDark ? (
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(30,41,59,1)_0%,_rgba(15,23,42,1)_100%)]" />
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100/40 rounded-full blur-[120px]" />
          </>
        )}
        <motion.div 
          style={{ x: cursorX, y: cursorY, left: '-200px', top: '-200px' }}
          className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-700 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/10'}`}
        />
      </div>

      {/* ✅ Side Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full transition-all border hover:scale-110 active:scale-95 shadow-sm ${isDark ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-900/40 mb-4 transition-transform hover:rotate-12">
            <Heart fill="white" className="text-white" size={32} />
          </div>
          <h1 className={`text-2xl font-black tracking-tighter transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>SoulSync</h1>
        </div>

        {/* Glassmorphism Card */}
        <div className={`backdrop-blur-xl p-10 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-white shadow-indigo-100'}`}>
          <h2 className={`text-3xl font-bold text-center mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isLogin ? 'Welcome Back' : 'Join the Sanctuary'}
          </h2>
          <p className={`text-center text-sm mb-8 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {isLogin ? 'Your mental sanctuary awaits.' : 'Start your journey to mindful living.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-500" size={18} />
                <input 
                  type="text" placeholder="Full Name" 
                  className={`w-full p-4 pl-12 rounded-2xl outline-none transition-all border ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-400'}`}
                  onChange={(e) => setName(e.target.value)} required 
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
              <input 
                type="email" placeholder="Email Address" 
                className={`w-full p-4 pl-12 rounded-2xl outline-none transition-all border ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-400'}`}
                onChange={(e) => setEmail(e.target.value)} required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
              <input 
                type="password" placeholder="Password" 
                className={`w-full p-4 pl-12 rounded-2xl outline-none transition-all border ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-400'}`}
                onChange={(e) => setPassword(e.target.value)} required 
              />
            </div>
            
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
                <input 
                  type="password" placeholder="Confirm Password" 
                  className={`w-full p-4 pl-12 rounded-2xl outline-none transition-all border ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-400'}`}
                  onChange={(e) => setConfirmPassword(e.target.value)} required 
                />
              </div>
            )}

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group">
              {isLogin ? 'Sign In' : 'Get Started'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-slate-500 text-sm">
            {isLogin ? "New to SoulSync?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className={`ml-2 font-bold transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;