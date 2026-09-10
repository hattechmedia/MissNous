import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function AdminLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@missnous.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.user.role !== 'admin') {
        setErrorMessage('Access Denied: This account does not have admin privileges.');
        return;
      }

      // Store token with user object
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('missnous_current_user', JSON.stringify(userWithToken));
      onLoginSuccess(userWithToken);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF2F5] text-[#2B2225] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Soft Background Radial Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F7D6DF] rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-[#F7D6DF] rounded-[3.5rem] p-8 sm:p-10 shadow-2xl relative z-10 space-y-6 animate-fade-in">
        
        {/* Brand Icon Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center mx-auto shadow-pink-glow border-4 border-[#F7D6DF]">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9F5] border border-[#F7D6DF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E3F5C]">Admin Portal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2225]">Miss Nous Admin</h1>
          <p className="text-xs text-[#5A4B50]">Log in with your administrator credentials</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-full text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225] pl-2">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@missnous.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225] pl-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-white font-sans text-xs font-bold uppercase tracking-widest shadow-pink-glow transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 transform hover:scale-[1.01]"
          >
            <span>{loading ? 'Logging in...' : 'Log In to Admin Dashboard'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

      </div>

    </div>
  );
}
