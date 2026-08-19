import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Sparkles, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Lock background page scroll when modal is open and clear inputs on close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoginData({ email: '', password: '' });
      setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
      setError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    document.body.style.overflow = '';
    setLoginData({ email: '', password: '' });
    setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailKey = loginData.email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem('missnous_users') || '[]');
    const existingUser = storedUsers.find(u => u.email && u.email.trim().toLowerCase() === emailKey);

    let userData;
    let userOrders = [];

    if (existingUser) {
      userData = { ...existingUser };
      userOrders = JSON.parse(localStorage.getItem(`missnous_orders_${emailKey}`) || '[]');
    } else {
      const formattedName = loginData.email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      userData = {
        name: formattedName || 'Valued Customer',
        email: loginData.email.trim(),
        phone: '',
        address: '',
        city: '',
        country: '',
        avatar: null
      };

      storedUsers.push(userData);
      localStorage.setItem('missnous_users', JSON.stringify(storedUsers));
      localStorage.setItem(`missnous_orders_${emailKey}`, JSON.stringify([]));
    }

    // Clear input fields on login success
    setLoginData({ email: '', password: '' });
    setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });

    onLoginSuccess(userData, userOrders);
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!signUpData.fullName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    const emailKey = signUpData.email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem('missnous_users') || '[]');
    const existingUser = storedUsers.find(u => u.email.toLowerCase() === emailKey);

    if (existingUser) {
      setError('An account with this email already exists. Please Log In instead.');
      return;
    }

    const newUser = {
      name: signUpData.fullName.trim(),
      email: signUpData.email.trim(),
      phone: '',
      address: '',
      city: '',
      country: '',
      avatar: null
    };

    storedUsers.push(newUser);
    localStorage.setItem('missnous_users', JSON.stringify(storedUsers));
    localStorage.setItem(`missnous_orders_${emailKey}`, JSON.stringify([]));

    // Clear input fields on signup success
    setLoginData({ email: '', password: '' });
    setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });

    onLoginSuccess(newUser, []);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
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

        {/* Auth Tabs Switcher */}
        <div className="flex p-1 bg-[#FDF2F5] border border-[#F7D6DF]/60 rounded-full">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'login' 
                ? 'bg-white text-[#9E3F5C] shadow-sm' 
                : 'text-[#5A4B50] hover:text-[#9E3F5C]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'signup' 
                ? 'bg-white text-[#9E3F5C] shadow-sm' 
                : 'text-[#5A4B50] hover:text-[#9E3F5C]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#9E3F5C]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#5A4B50]">
                <input type="checkbox" className="rounded text-[#9E3F5C] focus:ring-0" defaultChecked />
                Remember me
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#9E3F5C] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer mt-2"
            >
              <span>Log In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-2">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => { setActiveTab('signup'); setError(''); }} 
                className="text-[#9E3F5C] font-semibold hover:underline"
              >
                Sign Up Now
              </button>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  placeholder="Sophia Rose"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-1 focus:ring-[#9E3F5C]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer mt-3"
            >
              <span>Create Account</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <p className="text-center font-sans text-xs text-[#5A4B50] pt-1">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); }} 
                className="text-[#9E3F5C] font-semibold hover:underline"
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
