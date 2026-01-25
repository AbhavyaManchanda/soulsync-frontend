import React from 'react';
import { MessageCircle, BookOpen, BarChart3, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Heart fill="currentColor" /> SoulSync
        </div>
        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your AI-Powered <br /> Mental Health Sanctuary
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Experience empathetic support with context-aware AI therapy, intelligent journaling, and proactive mood tracking.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-indigo-200 transition">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: AI Chat */}
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 transition shadow-sm hover:shadow-xl">
            <MessageCircle className="text-indigo-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">AI Therapy Agent</h3>
            <p className="text-slate-600">Context-aware sessions with Gemini that remember your history and provide the 'Crux' summary.</p>
          </div>

          {/* Card 2: Journal */}
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 transition shadow-sm hover:shadow-xl">
            <BookOpen className="text-indigo-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Intelligent Journal</h3>
            <p className="text-slate-600">Write freely in your private diary. Our AI analyzes your sentiments over time without interruptions.</p>
          </div>

          {/* Card 3: Dashboard */}
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 transition shadow-sm hover:shadow-xl">
            <BarChart3 className="text-indigo-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Proactive Tracking</h3>
            <p className="text-slate-600">Daily mood check-ins that visualize your emotional trends and suggest sessions when you're low.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;