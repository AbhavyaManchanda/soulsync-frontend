import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Naya state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLogin && password !== confirmPassword) {
    return alert("Passwords do not match!");
  }

  const endpoint = isLogin ? '/api/v1/users/login' : '/api/v1/users/signup';
  
  // FIX: Change 'confirmPassword' to 'passwordConfirm' in the payload
  const payload = isLogin 
    ? { email, password } 
    : { name, email, password, passwordConfirm: confirmPassword }; 

  try {
    const res = await axios.post(endpoint, payload);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  } catch (err) {
    alert(err.response?.data?.message || "Authentication Failed");
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          {/* Confirm Password Field (Sirf Signup ke liye) */}
          {!isLogin && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          )}

          <button className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all active:scale-95">
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-slate-500">
          {isLogin ? "New to SoulSync?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? 'Create Account' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;