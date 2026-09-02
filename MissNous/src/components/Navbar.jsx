import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  LogOut,
  Package,
  Settings,
  Sparkles,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  onNavigate, 
  currentPage, 
  cartCount = 0, 
  onOpenSearch, 
  onOpenCart,
  currentUser = null,
  onOpenAuthModal,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Track scroll position for header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('login');
    } else {
      setUserDropdownOpen(!userDropdownOpen);
    }
  };

  // Determine if navbar should display dark text / solid background (e.g., when scrolled or on Checkout/Account pages)
  const isDarkTheme = isScrolled || currentPage === 'checkout' || currentPage === 'account';

  return (
    <>
      {/* Main Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isDarkTheme ? 'bg-[#FDF2F5]/90 backdrop-blur-md shadow-luxury py-3' : 'bg-transparent py-4 border-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Mobile Menu Icon */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 transition-colors ${isDarkTheme ? 'text-[#2B2225] hover:text-[#9E3F5C]' : 'text-[#FFF9F5] hover:text-[#F7D6DF]'}`}
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Left: Brand Name Logo */}
            <div className="cursor-pointer">
              <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-1 group">
                <span className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                  isDarkTheme ? 'text-[#9E3F5C] group-hover:text-[#7C2F47]' : 'text-[#FFF9F5] drop-shadow'
                }`}>
                  Miss Nous
                </span>
              </a>
            </div>

            {/* Center Navigation Links (White BG & Pink Text for Selected Nav Item) */}
            <nav className={`hidden md:flex items-center gap-2 sm:gap-3 p-1.5 rounded-full transition-all duration-300 ${
              isDarkTheme ? 'bg-white/60 border border-[#F7D6DF]/60 shadow-xs' : 'bg-black/15 backdrop-blur-xs border border-white/20'
            }`}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'shop', label: 'Shop' },
                { id: 'contact', label: 'Contact Us' }
              ].map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    onClick={(e) => handleNavClick(e, item.id)} 
                    className={`px-4 py-1.5 rounded-full text-sm sm:text-base font-sans font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-[#9E3F5C] shadow-md scale-105 font-bold border border-[#F7D6DF]/40' 
                        : isDarkTheme 
                          ? 'text-[#2B2225] hover:text-[#9E3F5C] hover:bg-white/60' 
                          : 'text-[#FFF9F5] hover:text-[#FFF9F5] hover:bg-white/20 drop-shadow'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Icons (Search, Bag, Profile/User) */}
            <div className="flex items-center gap-4 sm:gap-5 relative" ref={dropdownRef}>
              {/* Search Toggle */}
              <button 
                onClick={onOpenSearch}
                className={`p-1.5 transition-colors ${isDarkTheme ? 'text-[#2B2225] hover:text-[#9E3F5C]' : 'text-[#FFF9F5] hover:text-[#F7D6DF] drop-shadow'}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Shopping Bag Icon with Badge */}
              <button 
                onClick={onOpenCart}
                className={`p-1.5 transition-colors relative flex items-center ${isDarkTheme ? 'text-[#2B2225] hover:text-[#9E3F5C]' : 'text-[#FFF9F5] hover:text-[#F7D6DF] drop-shadow'}`}
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D96B8A] text-[#FFF9F5] text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile Button (Guest -> Opens Modal | Logged-in -> Avatar + Dropdown) */}
              {currentUser ? (
                <button 
                  onClick={handleProfileClick}
                  className="p-0.5 rounded-full hover:scale-105 transition-all cursor-pointer focus:outline-none"
                  title={currentUser.name || "My Account"}
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#9E3F5C] shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center text-xs font-bold shadow-xs border-2 border-white">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleProfileClick}
                  className={`p-1.5 transition-colors relative flex items-center hover:scale-110 ${
                    isDarkTheme ? 'text-[#2B2225] hover:text-[#9E3F5C]' : 'text-[#FFF9F5] hover:text-[#F7D6DF] drop-shadow'
                  }`}
                  aria-label="User Profile / Login"
                  title="Log In / Sign Up"
                >
                  <User className="w-5 h-5 stroke-[1.8]" />
                </button>
              )}

              {/* Logged-In User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 top-12 w-60 bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl shadow-luxury p-3 space-y-1 animate-fade-in z-50">
                  <div className="px-3 py-2 border-b border-[#F7D6DF]/60 space-y-0.5">
                    <p className="font-sans text-xs font-bold text-[#2B2225] truncate">{currentUser.name}</p>
                    <p className="font-sans text-[11px] text-[#5A4B50] truncate">
                      {currentUser.email} {currentUser.role === 'admin' ? '(Admin)' : ''}
                    </p>
                  </div>

                  {currentUser.role === 'admin' && (
                    <a
                      href="http://localhost:5174"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2.5 rounded-2xl text-left font-sans text-xs font-bold bg-[#FDF2F5] text-[#9E3F5C] flex items-center gap-2.5 transition-colors border border-[#F7D6DF] mb-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#9E3F5C]" />
                      <span>Admin Portal (Port 5174)</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl text-left font-sans text-xs font-semibold text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C] flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#9E3F5C]" />
                    <span>My Account</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('account', 'orders');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl text-left font-sans text-xs font-semibold text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C] flex items-center gap-2.5 transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#9E3F5C]" />
                    <span>My Orders</span>
                  </button>

                  <div className="pt-1 border-t border-[#F7D6DF]/60">
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2.5 rounded-2xl text-left font-sans text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm h-full bg-[#FFF9F5] shadow-luxury p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#F7D6DF] pb-4 mb-6">
                <span className="font-serif text-2xl font-bold text-[#9E3F5C]">Miss Nous</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#2B2225]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-3 font-sans text-base font-medium text-[#2B2225]">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About Us' },
                  { id: 'shop', label: 'Shop' },
                  { id: 'contact', label: 'Contact Us' }
                ].map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <a 
                      key={item.id}
                      href={`#${item.id}`} 
                      onClick={(e) => handleNavClick(e, item.id)} 
                      className={`px-4 py-2.5 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-white text-[#9E3F5C] font-bold shadow-xs border border-[#F7D6DF]' 
                          : 'hover:text-[#9E3F5C]'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}

                <div className="pt-4 border-t border-[#F7D6DF]">
                  {currentUser ? (
                    <button
                      onClick={(e) => handleNavClick(e, 'account')}
                      className="w-full px-4 py-3 rounded-2xl bg-[#9E3F5C] text-white text-sm font-semibold flex items-center justify-between"
                    >
                      <span>My Account ({currentUser.name})</span>
                      <User className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenAuthModal) onOpenAuthModal('login');
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-[#9E3F5C] text-white text-sm font-semibold flex items-center justify-between"
                    >
                      <span>Log In / Sign Up</span>
                      <User className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </nav>
            </div>

            <div className="border-t border-[#F7D6DF] pt-4 text-xs text-[#A09095] text-center">
              <p>Miss Nous • Paris Intimate Wellness</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
