import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Clock, 
  HeartHandshake, 
  Check, 
  Star,
  ChevronRight,
  Phone
} from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function AuthPage({ initialTab = 'login', onLoginSuccess, onNavigate, currentUser }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'register' || initialTab === 'signup' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

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
      setError('Please enter both your email address and password.');
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
      setError(err.message || 'Login failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      setError('Please fill in all required fields (Full Name, Email, Password).');
      return;
    }

    if (signUpData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your confirm password.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Use and Privacy Policy to proceed.');
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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] via-[#FDF2F5] to-[#FFF9F5] text-[#2B2225] font-sans flex flex-col justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#F7D6DF]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#9E3F5C]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E3F5C] hover:text-[#7C2F47] transition-all bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#F7D6DF] shadow-xs cursor-pointer hover:shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Store</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A6B70]">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-[#A09095]" />
          <span className="text-[#9E3F5C] font-semibold">{activeTab === 'login' ? 'Sign In' : 'Register'}</span>
        </div>
      </div>

      {/* Main Luxury Auth Card */}
      <div className="max-w-6xl mx-auto w-full bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#F7D6DF] shadow-[0_25px_60px_-15px_rgba(158,63,92,0.15)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: Luxury Editorial Presentation & Membership Perks */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden bg-gradient-to-br from-[#2B2225] via-[#381B26] to-[#1F171A] text-white">
          <img
            src="/gpt-16.jpeg"
            alt="Miss Nous Botanical Luxury"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225] via-[#2B2225]/85 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#9E3F5C]/35 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Top Brand Badge */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FFF9F5]">Member Privileges</span>
            </div>
            
            <h3 className="font-sans text-2xl xl:text-3xl font-medium tracking-tight text-[#FFF9F5] leading-snug">
              Elevate Your Intimate Wellness Journey
            </h3>
            <p className="text-xs text-[#F7D6DF]/90 font-light leading-relaxed">
              Join the Miss Nous circle for discreet concierge care, seamless order tracking, and curated botanical formulation previews.
            </p>
          </div>

          {/* Membership Benefits List */}
          <div className="relative z-10 space-y-3.5 my-8 py-6 border-y border-white/10">
            {[
              { icon: Truck, title: 'Discreet 100% Plain Packaging', desc: 'Private doorstep delivery in unmarked luxury boxes' },
              { icon: ShieldCheck, title: 'Encrypted Security', desc: 'Zero data leakage with bank-grade SSL encryption' },
              { icon: Gift, title: 'Complimentary Welcome Gift', desc: 'Member-exclusive perks with every organic re-order' },
              { icon: Clock, title: 'Instant Real-Time Order Tracking', desc: 'Live dispatch updates directly on your dashboard' }
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-left">
                  <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#E8D3A5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide">{perk.title}</h4>
                    <p className="text-[11px] text-[#F7D6DF]/70 font-light leading-tight">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Social Proof / Testimonial */}
          <div className="relative z-10 space-y-2 pt-2">
            <div className="flex items-center gap-1 text-[#E8D3A5]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#E8D3A5]" />
              ))}
              <span className="text-xs text-white/90 font-medium ml-2">4.9 / 5 Rating</span>
            </div>
            <p className="text-[11px] text-white/70 italic leading-snug">
              "The most gentle, elegant, and skin-safe formula I have ever experienced."
            </p>
            <div className="flex items-center gap-2 pt-2 text-[10px] text-[#E8D3A5]/90 uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified Organic & Dermatologist Tested</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center bg-white">
          
          {/* Header Title with Brand Accent */}
          <div className="text-center sm:text-left space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E3F5C]" />
              <span>Official Miss Nous Account</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl xl:text-4xl font-medium text-[#2B2225] tracking-tight">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
              {activeTab === 'login' 
                ? 'Sign in to access your order history, manage saved addresses, and update rituals.' 
                : 'Join Miss Nous for complimentary delivery tracking, address storage, and exclusive perks.'}
            </p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-[#FFF9F5] rounded-2xl border border-[#F7D6DF] mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#9E3F5C] shadow-sm border border-[#F7D6DF]/60'
                  : 'text-[#7A6B70] hover:text-[#2B2225]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#9E3F5C] shadow-sm border border-[#F7D6DF]/60'
                  : 'text-[#7A6B70] hover:text-[#2B2225]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm leading-relaxed animate-fade-in flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Email Address <span className="text-[#9E3F5C]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="e.g. sophia.rose@gmail.com"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225]">
                    Password <span className="text-[#9E3F5C]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link will be sent to your registered email.')}
                    className="text-[11px] text-[#9E3F5C] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-11 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9E3F5C] accent-[#9E3F5C] border-[#F7D6DF] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#5A4B50] font-medium">Keep me signed in on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In to Account</span>
                  )}
                </button>
              </div>

              {/* Switch to Register link */}
              <div className="pt-4 text-center border-t border-[#F7D6DF]/60 mt-6">
                <p className="text-xs text-[#5A4B50]">
                  New to Miss Nous?{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setError(''); }}
                    className="text-[#9E3F5C] font-bold hover:underline cursor-pointer"
                  >
                    Create a Complimentary Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Full Name <span className="text-[#9E3F5C]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    placeholder="e.g. Sophia Rose"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Email Address (For Order Receipts) <span className="text-[#9E3F5C]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="e.g. sophia.rose@gmail.com"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Phone Number (For Delivery Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Create Password (Min. 6 Characters) <span className="text-[#9E3F5C]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-11 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpData.password && (
                  <p className="text-[11px] text-[#7A6B70] mt-1 pl-1">
                    {signUpData.password.length >= 8 ? (
                      <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Password length is good (8+ chars)
                      </span>
                    ) : (
                      <span className="text-amber-600">Must be at least 8 characters</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Confirm Password <span className="text-[#9E3F5C]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl pl-11 pr-11 py-3.5 text-xs sm:text-sm text-[#2B2225] placeholder:text-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:bg-white focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] transition-colors cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpData.confirmPassword && (
                  <p className="text-[11px] text-[#7A6B70] mt-1 pl-1">
                    {signUpData.password === signUpData.confirmPassword ? (
                      <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">Passwords do not match</span>
                    )}
                  </p>
                )}
              </div>

              {/* Agreement checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9E3F5C] accent-[#9E3F5C] border-[#F7D6DF] focus:ring-0 cursor-pointer mt-0.5"
                  />
                  <span className="text-xs text-[#5A4B50] font-normal leading-snug">
                    I agree to the{' '}
                    <a href="/terms-of-use" target="_blank" className="text-[#9E3F5C] font-semibold underline">
                      Terms of Use
                    </a>{' '}
                    and acknowledge the{' '}
                    <a href="/privacy-policy" target="_blank" className="text-[#9E3F5C] font-semibold underline">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
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

              {/* Switch to Login link */}
              <div className="pt-4 text-center border-t border-[#F7D6DF]/60 mt-6">
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

          {/* Trust badges footer */}
          <div className="mt-8 pt-6 border-t border-[#F7D6DF]/60 grid grid-cols-3 gap-2 text-center text-[10px] text-[#7A6B70]">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#9E3F5C]" />
              <span className="font-semibold text-[#2B2225]">SSL Encrypted</span>
              <span>100% Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-[#F7D6DF]">
              <Truck className="w-4 h-4 text-[#9E3F5C]" />
              <span className="font-semibold text-[#2B2225]">Plain Box</span>
              <span>Discreet Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#9E3F5C]" />
              <span className="font-semibold text-[#2B2225]">Pure Botanical</span>
              <span>Organic Formulas</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
