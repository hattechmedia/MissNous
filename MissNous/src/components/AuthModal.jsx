import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ fullName: '', email: '', password: '' });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoginData({ email: '', password: '' });
      setSignUpData({ fullName: '', email: '', password: '' });
      setError('');
      setLoading(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    document.body.style.overflow = '';
    setLoginData({ email: '', password: '' });
    setSignUpData({ fullName: '', email: '', password: '' });
    setError('');
    setLoading(false);
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email.trim(), password: loginData.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Store token with user object
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('missnous_current_user', JSON.stringify(userWithToken));
      setLoginData({ email: '', password: '' });
      onLoginSuccess(userWithToken);
      handleClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signUpData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.fullName.trim(),
          email: signUpData.email.trim(),
          password: signUpData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('missnous_current_user', JSON.stringify(userWithToken));
      try {
        localStorage.setItem('missnous_new_user_event', JSON.stringify({ time: Date.now(), user: userWithToken }));
      } catch (e) {}
      setSignUpData({ fullName: '', email: '', password: '' });
      onLoginSuccess(userWithToken);
      handleClose();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-[#F7D6DF] rounded-[3.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="font-sans text-xs text-[#5A4B50]">
            {activeTab === 'login'
              ? 'Log in to manage your orders & personal beauty ritual.'
              : 'Join Miss Nous to track orders & enjoy personalized care.'}
          </p>
        </div>

        <div className="flex p-1 bg-[#FDF2F5] border border-[#F7D6DF]/60 rounded-full">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'login' ? 'bg-white text-[#9E3F5C] shadow-sm' : 'text-[#5A4B50] hover:text-[#9E3F5C]'}`}
          >Log In</button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'signup' ? 'bg-white text-[#9E3F5C] shadow-sm' : 'text-[#5A4B50] hover:text-[#9E3F5C]'}`}
          >Sign Up</button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225] pl-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] font-sans text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225] pl-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3.5 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] font-sans text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#9E3F5C] cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs font-bold uppercase tracking-widest shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer mt-3"
            >
              <span>{loading ? 'Logging in...' : 'Log In to Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-2">
              Don't have an account?{' '}
              <button type="button" onClick={() => { setActiveTab('signup'); setError(''); }} className="text-[#9E3F5C] font-semibold hover:underline cursor-pointer">
                Sign Up Now
              </button>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225] pl-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Sophia Rose"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] font-sans text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225] pl-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] font-sans text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225] pl-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#EEF4FF] border border-[#F7D6DF] font-sans text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs font-bold uppercase tracking-widest shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer mt-3"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-1">
              Already have an account?{' '}
              <button type="button" onClick={() => { setActiveTab('login'); setError(''); }} className="text-[#9E3F5C] font-semibold hover:underline cursor-pointer">
                Log In
              </button>
            </p>
          </form>
        )}
      </div>

    </div>
  );
}
