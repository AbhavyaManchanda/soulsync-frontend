import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSession = () => {
     
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm here to support you. How are you feeling today?" }
    ]);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // 1. Fetch History Helper
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/sessions/my-sessions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.data.sessions || []); 
        } catch (err) { 
            console.log("History error:", err); 
        }
    };

    // 2. Initial Load
    useEffect(() => {
        fetchHistory();
    }, []);

    // 3. Scroll Logic
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // 4. FIXED Send Message Logic
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
        const res = await axios.post('/api/v1/sessions/chat', 
            { 
                message: userText, 
                sessionId: currentSessionId // Yeh null hoga pehli baar
            }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // console.log("DEBUG: Server Response Data:", res.data);

        // FIX: Agar 'aiResponse' nahi mil raha toh 'message' check karein
        const aiReply = res.data?.aiResponse || res.data?.data?.aiResponse;

        if (aiReply) {
            const aiMsg = { 
                role: 'assistant', 
                content: aiReply // Ensure 'content' key is used
            };
            setMessages(prev => [...prev, aiMsg]);
        }

        if (res.data.sessionId) {
            setCurrentSessionId(res.data.sessionId);
            fetchHistory(); 
        }

    } catch (err) {
    console.error("Chat Error", err);
    
    // Agar Quota Exceed ho jaye
    if (err.response?.status === 429 || err.message?.includes('429')) {
        const quotaMsg = { 
            role: 'assistant', 
            content: "I'm processing a lot of thoughts right now. Please give me a minute (around 30-60 seconds) to recharge!" 
        };
        setMessages(prev => [...prev, quotaMsg]);
    } else {
        alert("Oops! Something went wrong on my end.");
    }
    } finally {
        setLoading(false);
    }
};

    // 5. Load Session
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
        } catch (err) {
            console.error("Session load error", err);
        }
    };

    const startNewChat = () => {
        setMessages([{ role: 'assistant', content: "I'm here for you. How can I help?" }]);
        setCurrentSessionId(null);
    };

 return (
  <div className="flex h-screen bg-slate-50 overflow-hidden"> 
    {/* 1. Sidebar: Hamesha screen ki poori height lega aur fixed rahega */}
    <aside className="w-72 bg-white border-r hidden md:flex flex-col flex-shrink-0">
      <div className="p-4 border-b">
        <button 
          onClick={startNewChat}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
        >
          + New Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Chat History
        </div>
        
        {history && history.length > 0 ? (
          history.map((session) => (
            <button 
              key={session._id} 
              onClick={() => loadSpecificSession(session._id)}
              className={`w-full p-4 text-left border-b transition-all group hover:bg-slate-50 ${
                currentSessionId === session._id ? 'bg-indigo-50 border-r-4 border-r-indigo-600' : ''
              }`}
            >
              <p className={`text-sm font-bold ${currentSessionId === session._id ? 'text-indigo-600' : 'text-slate-700'}`}>
                {new Date(session.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </p>
              <p className="text-xs text-slate-400 truncate italic">
                {session.messages?.[0]?.text || "New conversation..."}
              </p>
            </button>
          ))
        ) : (
          <p className="p-8 text-center text-xs text-slate-400 italic">No past sessions found.</p>
        )}
      </div>
    </aside>

    {/* 2. Main Chat Area: Iska flex-col important hai */}
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Fixed Header */}
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="font-bold text-lg text-slate-800">SoulSync AI Therapist</h2>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </header>

      {/* 3. SCROLLABLE MESSAGE AREA: Sirf ye hissa scroll hoga */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                <AnimatePresence>
                     {messages.map((msg, i) => {
                         // console.log(`Message ${i}:`, msg);
                        //  console.log("Current Messages State:", messages)
                    // Logic simple: User bubble right mein, AI/Model bubble left mein
                    const isAI = msg.role === 'assistant' || msg.role === 'model';
                    
                    return (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex mb-4 ${!isAI ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm flex gap-3 ${
                        !isAI 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                        {/* Bot Icon left side ke liye */}
                        {isAI && <Bot size={20} className="text-indigo-600 mt-1 flex-shrink-0" />}
                        
                        <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {/* Dono keys handle ki hain taaki response miss na ho */}
                            {msg.content || msg.text}
                        </p>
                        
                        {/* User Icon right side ke liye */}
                        {!isAI && <User size={20} className="text-indigo-200 mt-1 flex-shrink-0" />}
                        </div>
                    </motion.div>
                    );
                })}
                </AnimatePresence>
                        
        {loading && (
          <div className="flex gap-2 p-4">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 4. FIXED INPUT AREA: Hamesha screen ke bottom par rahega */}
      <footer className="p-4 bg-white border-t flex-shrink-0">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text" 
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Share what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50">
            <Send size={24} />
          </button>
        </form>
      </footer>
    </div>
  </div>
);
};

export default ChatSession;