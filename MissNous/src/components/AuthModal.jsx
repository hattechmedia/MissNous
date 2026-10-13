import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    fullName: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoginData({ email: '', password: '' });
      setSignUpData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
      setError('');
      setLoading(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    document.body.style.overflow = '';
    setLoginData({ email: '', password: '' });
    setSignUpData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
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
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match. Please re-enter confirm password.');
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
          phone: signUpData.phone ? signUpData.phone.trim() : '',
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
      setSignUpData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2225]/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[440px] bg-white border border-[#F7D6DF] rounded-3xl shadow-[0_20px_50px_rgba(158,63,92,0.18)] p-7 sm:p-9 overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-[#F7D6DF]/60 to-[#FDF2F5]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#FDF2F5] rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] flex items-center justify-center transition-all cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E3F5C]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
              Miss Nous Paris
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-[1.75rem] font-medium text-[#2B2225] tracking-tight">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="font-sans text-xs text-[#5A4B50] max-w-xs mx-auto leading-relaxed">
            {activeTab === 'login'
              ? 'Log in to track orders, manage addresses & enjoy personal care.'
              : 'Join Miss Nous to track orders & enjoy complimentary perks.'}
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl relative z-10">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'login' 
                ? 'bg-white text-[#9E3F5C] shadow-sm border border-[#F7D6DF]/60' 
                : 'text-[#7A6B70] hover:text-[#2B2225]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'signup' 
                ? 'bg-white text-[#9E3F5C] shadow-sm border border-[#F7D6DF]/60' 
                : 'text-[#7A6B70] hover:text-[#2B2225]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50/90 border border-red-200 text-red-700 text-xs font-medium rounded-xl text-center animate-fade-in relative z-10">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left relative z-10">
            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#9E3F5C] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs font-bold uppercase tracking-widest shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-4"
            >
              <span>{loading ? 'Logging in...' : 'Log In to Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-2">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setActiveTab('signup'); setError(''); }} 
                className="text-[#9E3F5C] font-bold hover:underline cursor-pointer"
              >
                Sign Up Now
              </button>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-left relative z-10">
            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Sophia Rose"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Password (Min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#9E3F5C] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] font-sans text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#9E3F5C] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {signUpData.confirmPassword && (
                <p className="text-[10px] pl-1 font-semibold">
                  {signUpData.password === signUpData.confirmPassword ? (
                    <span className="text-emerald-600">✓ Passwords match</span>
                  ) : (
                    <span className="text-red-500">Passwords do not match</span>
                  )}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs font-bold uppercase tracking-widest shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-4"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-2">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setActiveTab('login'); setError(''); }} 
                className="text-[#9E3F5C] font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </form>
        )}
      </div>

    </div>
  );
}
