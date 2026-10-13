import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function AuthPage({ initialTab = 'login', onLoginSuccess, onNavigate, currentUser }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'register' || initialTab === 'signup' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ fullName: '', email: '', password: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'register' || initialTab === 'signup' ? 'register' : 'login');
    }
  }, [initialTab]);

  // If already logged in, redirect to account dashboard
  useEffect(() => {
    if (currentUser && onNavigate) {
      onNavigate('account');
    }
  }, [currentUser, onNavigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid email or password.');

      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('missnous_current_user', JSON.stringify(userWithToken));

      if (onLoginSuccess) onLoginSuccess(userWithToken);
      if (onNavigate) onNavigate('account');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
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
      setError('Password must be at least 6 characters long.');
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
      if (!res.ok) throw new Error(data.message || 'Registration failed.');

      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('missnous_current_user', JSON.stringify(userWithToken));

      if (onLoginSuccess) onLoginSuccess(userWithToken);
      if (onNavigate) onNavigate('account');
    } catch (err) {
      setError(err.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF2F5] text-[#2B2225] font-sans flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      
      {/* Top Back Navigation */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E3F5C] hover:text-[#7C2F47] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Luxury Editorial Artwork */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#2B2225] text-white">
          <img
            src="/gpt-16.jpeg"
            alt="Miss Nous Botanical Luxury"
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225] via-[#2B2225]/75 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#9E3F5C]/30 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFF9F5]">Member Privileges</span>
            </div>
            <h3 className="font-sans text-2xl font-medium tracking-tight text-[#FFF9F5]">
              Experience Intimate Wellness Rituals
            </h3>
          </div>

          <div className="relative z-10 space-y-4 pt-12 border-t border-white/15">
            <p className="text-xs text-[#F7D6DF] leading-relaxed font-light">
              Create your personal account to securely save your discreet delivery addresses, track orders in real time, and enjoy VIP access to new botanical collections.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#E8D3A5]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Encrypted & Discreet Guarantee</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-14 flex flex-col justify-center">
          
          {/* Header Title */}
          <div className="text-center sm:text-left space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-xs font-bold border border-[#F7D6DF] sm:hidden mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Miss Nous Account</span>
            </div>
            <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A4B50] font-light">
              {activeTab === 'login' 
                ? 'Sign in to access your orders, saved rituals, and profile.' 
                : 'Join Miss Nous for complimentary delivery tracking and exclusive perks.'}
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex p-1 bg-[#FDF2F5] rounded-full border border-[#F7D6DF] mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#9E3F5C] shadow-sm'
                  : 'text-[#5A4B50] hover:text-[#2B2225]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#9E3F5C] shadow-sm'
                  : 'text-[#5A4B50] hover:text-[#2B2225]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm leading-relaxed animate-fade-in">
              {error}
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-11 py-3 text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In to Account</span>
                  )}
                </button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-[#5A4B50]">
                  Don’t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setError(''); }}
                    className="text-[#9E3F5C] font-bold hover:underline cursor-pointer"
                  >
                    Create Account Now
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="jane.doe@example.com"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1.5">
                  Password (Min. 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="Create a secure password"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-11 py-3 text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Your Account</span>
                  )}
                </button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-[#5A4B50]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className="text-[#9E3F5C] font-bold hover:underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </p>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
