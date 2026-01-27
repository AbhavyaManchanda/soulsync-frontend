import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X,Send, User, Bot, ChevronLeft, Sun, Moon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSession = () => {
    // ✅ 1. Purely Functional States (Unchanged)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm here to support you. How are you feeling today?" }
    ]);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // ✅ 2. Theme Toggle Logic
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

    // ✅ 3. Functionalities (Same as before)
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/sessions/my-sessions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.data.sessions || []); 
        } catch (err) { console.log("History error:", err); }
    };

    useEffect(() => { fetchHistory(); }, []);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  
  
  
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        const userMsg = { role: 'user', content: userText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/v1/sessions/chat', 
                { message: userText, sessionId: currentSessionId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiReply = res.data?.aiResponse || res.data?.data?.aiResponse;
            if (aiReply) {
                const aiMsg = { role: 'assistant', content: aiReply };
                setMessages(prev => [...prev, aiMsg]);
            }
            if (res.data.sessionId && res.data.sessionId !== currentSessionId) {
                setCurrentSessionId(res.data.sessionId);
                fetchHistory();
            }
        } catch (err) {
            console.error("Chat Error", err);
            if (err.response?.status === 429) {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm processing a lot of thoughts. Give me a minute!" }]);
            } else { alert("Oops! Error on my end."); }
        } finally { setLoading(false); }
    };




    const loadSpecificSession = async (sessionId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/v1/sessions/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const oldMessages = res.data.data.session.messages.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.text 
            }));
            setCurrentSessionId(sessionId);
            setMessages(oldMessages);
        } catch (err) { console.error("Session load error", err); }
    };

    const startNewChat = () => {
        setMessages([{ role: 'assistant', content: "I'm here for you. How can I help?" }]);
        setCurrentSessionId(null);
  };
  
 const endCurrentSession = async () => {
    // Check karein ki kya sessionId state mein available hai
    if (!currentSessionId) {
        console.log("No active Session ID found in state!");
        return alert("Error: Session ID missing.");
    }

    try {
        const token = localStorage.getItem('token');
        // Console log lagayein debug ke liye
        console.log("Ending session with ID:", currentSessionId);
        
        await axios.post(`/api/v1/sessions/end`, 
            { sessionId: currentSessionId }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Session ended and saved successfully!");
        startNewChat();
    } catch (err) {
        console.error("Backend Error Response:", err.response?.data);
        alert(err.response?.data?.message || "Could not end session.");
    }
  };
  
    return (
        <div className={`flex h-screen transition-colors duration-500 overflow-hidden font-sans ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
            
            {/* 1. Sidebar */}
                
            <aside className={`w-72 hidden md:flex flex-col flex-shrink-0 border-r transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="p-6 border-b border-inherit">
                    <button 
                        onClick={startNewChat}
                        className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-95"
                    >
                        <Plus size={18} /> New Session
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className={`p-6 text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Chat History
                    </div>
                    {history.map((session) => (
                        <button 
                            key={session._id} 
                            onClick={() => loadSpecificSession(session._id)}
                            className={`w-full p-5 text-left transition-all border-b border-inherit ${
                                currentSessionId === session._id 
                                ? (isDark ? 'bg-indigo-500/10 border-r-4 border-r-indigo-500' : 'bg-indigo-50 border-r-4 border-r-indigo-600') 
                                : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            {/* 1. Yahan Date ki jagah Title aayega */}
                            <p className={`text-[13px] font-bold mb-1 capitalize ${currentSessionId === session._id ? 'text-indigo-400' : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>
                                {session.title || "New Reflection"} 
                            </p>

                            {/* 2. Date ko neeche sub-text bana do */}
                            <div className="flex items-center gap-2">
                                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {new Date(session.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </p>
                                {/* Optional: Agar summary exist karti hai toh chota indicator */}
                                {!session.isActive && <span className="text-[10px] text-green-500">● Done</span>}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                
                {/* Header */}
                <header className={`p-4 shadow-sm flex items-center justify-between transition-all border-b ${isDark ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Therapy Agent</h2>
                            <p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    {/* ✅ Theme Toggle inside Header */}
                    <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </header>

                {/* 3. Message Area */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50/50'}`}>
                    <AnimatePresence>
                        {messages.map((msg, i) => {
                            const isAI = msg.role === 'assistant' || msg.role === 'model';
                            return (
                                <motion.div 
                                    key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${!isAI ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm flex gap-4 transition-all ${
                                        !isAI 
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20' 
                                            : (isDark ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm')
                                    }`}>
                                        {isAI && <Bot size={22} className={`mt-1 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />}
                                        <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base font-medium">
                                            {msg.content || msg.text}
                                        </p>
                                        {!isAI && <User size={22} className="text-indigo-200 mt-1 flex-shrink-0" />}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {loading && (
                        <div className="flex gap-2.5 p-4 animate-pulse">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></span>
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* 4. Footer Input */}
                <footer className={`p-6 transition-all border-t ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-4">
                        <input 
                            type="text" value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={`flex-1 p-4.5 rounded-[1.5rem] outline-none transition-all border-2 text-sm md:text-base ${
                                isDark 
                                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                                : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-500 focus:bg-white'
                            }`}
                            placeholder="Share what's on your mind..."
                        />
                        <button type="submit" disabled={loading} className={`p-4.5 rounded-[1.5rem] transition-all flex items-center justify-center ${loading ? 'opacity-50' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 active:scale-95'}`}>
                            <Send size={24} />
                        </button>
                    </form>
          </footer>
          <button onClick={endCurrentSession} className={`absolute bottom-6 right-6 p-3 rounded-full transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
            <X size={22} />
          </button>
            </div>
        </div>
    );
};

export default ChatSession;