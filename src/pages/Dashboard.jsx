import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, PenTool, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // 1. All States inside the component
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [suggestSession, setSuggestSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // 2. Fetch Graph Data inside useEffect
    useEffect(() => {
            const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/stats', {
            headers: { Authorization: `Bearer ${token}` }
            });
            
            // Check if history exists
            if (res.data.data.moods && res.data.data.moods.length > 0) {
            const formattedData = res.data.data.moods.slice(0, 7).reverse().map(item => ({
                day: new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
                score: item.sentimentScore 
            }));
            setGraphData(formattedData);
            }
        } catch (err) {
            console.log("Error fetching stats:", err.response?.status); // 404 check karein
        }
        };
            fetchStats();
        }, []);
    
    

    const handleMoodSubmit = async (e) => {
        e.preventDefault();
        if (!mood) return alert("Please write something first!");

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/v1/moods', 
            { content: mood }, 
            { headers: { Authorization: `Bearer ${token}` } }
            );

            // 1. SET THE RESPONSE (Reload hata diya, toh state hold rahegi)
            setLastResponse(res.data.data.log.aiResponse);
            setSuggestSession(res.data.data.suggestSession);
            
            // 2. MANUALLY UPDATE THE GRAPH (Reload ki zaroorat nahi)
            const newPoint = {
            day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
            score: res.data.data.log.sentimentScore 
            };
            setGraphData(prev => [...prev.slice(-6), newPoint]); // Sirf last 7 points rakhega

            setMood(''); 
        } catch (err) {
            console.error("Error:", err);
            alert("Check-in failed.");
        } finally {
            setLoading(false);
        }
        };

    const handleLogout = () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
            {/* Navbar */}
            <nav className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <Heart fill="currentColor" size={24} /> SoulSync
                </div>
                <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 font-medium transition px-4 py-2 border rounded-xl hover:bg-red-50"
                >
                Logout
                </button>
            </nav>

            <header className="py-4">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">How are you today?</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Column 1: Mood Check-in Card */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px] flex flex-col justify-center">
                    {!lastResponse ? (
                        <>
                        <h3 className="text-xl font-bold mb-6 text-slate-700">Daily Check-in</h3>
                        <form onSubmit={handleMoodSubmit} className="space-y-4">
                            <textarea 
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[160px]"
                            placeholder="Describe your current thoughts..."
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            />
                            <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">
                            {loading ? 'Analyzing Mood...' : 'Submit Check-in'}
                            </button>
                        </form>
                        </>
                    ) : (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">SoulSync AI</span>
                            <p className="text-xl text-indigo-900 italic font-medium">"{lastResponse}"</p>
                        </div>
                        
                        {suggestSession ? (
                            <div className="space-y-4">
                            <p className="text-slate-600">It seems you're having a hard time. Let's talk it out?</p>
                            <button 
                                onClick={() => navigate('/chat')} // Hum chat page create karenge
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                            >
                                Start Therapy Session
                            </button>
                            </div>
                        ) : (
                            <button onClick={() => setLastResponse(null)} className="text-indigo-600 font-semibold hover:underline">
                            Write another entry
                            </button>
                        )}
                        </div>
                    )}
                </section>

        {/* Column 2: Mood Trend Graph Card */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full min-h-[400px]">
          <h3 className="text-xl font-bold mb-6 text-slate-700">Mood Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData.length > 0 ? graphData : [{day: 'No Data', score: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide domain={[-1, 1]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 10, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-slate-400 text-sm mt-4">Sentiment score tracking (-1 to +1)</p>
        </section>
      </div>

      {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-8 pb-12">
                
                <div onClick={() => navigate('/chat')}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-all cursor-pointer group">
          <MessageSquare className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-2xl font-bold mb-2">AI Therapy</h3>
          <p className="text-slate-500 leading-relaxed">Continue your conversation with SoulSync AI. Your history is saved securely.</p>
                </div>
                
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-all cursor-pointer group">
          <PenTool className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-2xl font-bold mb-2">Journaling</h3>
          <p className="text-slate-500 leading-relaxed">Write deep-dive entries. AI analyzes your long-form thoughts over time.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;