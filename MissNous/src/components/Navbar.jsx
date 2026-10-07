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
import logoHorizontal from '../assets/logo-horizontal.png';

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

  // Determine if navbar should display dark text / solid background (e.g., when scrolled or on Light background pages)
  const isDarkTheme = isScrolled || currentPage === 'product-detail' || currentPage === 'checkout' || currentPage === 'account' || currentPage === 'contact';

  return (
    <>
      {/* Main Navigation Bar - Floating Rounded Capsule with White Background across entire website */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-luxury border border-[#F7D6DF]/80 py-2 sm:py-2.5 px-3.5 sm:px-6 flex items-center justify-between pointer-events-auto">

            {/* Mobile Menu Icon */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-full text-[#2B2225] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>

            {/* Left: Brand Name Logo */}
            <div className="cursor-pointer">
              <a 
                href="/" 
                onClick={(e) => handleNavClick(e, 'home')} 
                className="flex items-center group py-0.5"
                aria-label="Miss Nous Home"
              >
                <img 
                  src={logoHorizontal} 
                  alt="Miss Nous" 
                  className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </a>
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-[#FDF2F5]/80 border border-[#F7D6DF]/60">
              {[
                { id: 'home', label: 'Home', path: '/' },
                { id: 'about', label: 'About Us', path: '/about' },
                { id: 'shop', label: 'Shop', path: '/shop' },
                { id: 'contact', label: 'Contact Us', path: '/contact' }
              ].map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <a 
                    key={item.id}
                    href={item.path} 
                    onClick={(e) => handleNavClick(e, item.id)} 
                    className={`px-4 py-1.5 rounded-full text-sm sm:text-base font-sans transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-xs font-bold'
                        : 'text-[#2B2225] hover:text-[#9E3F5C] hover:bg-white/80 font-semibold'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Icons (Search, Bag, Profile/User) */}
            <div className="flex items-center gap-1 sm:gap-2 relative" ref={dropdownRef}>
              {/* Search Toggle */}
              <button 
                onClick={onOpenSearch}
                className="p-2 rounded-full text-[#2B2225] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Shopping Bag Icon with Badge */}
              <button 
                onClick={onOpenCart}
                className="p-2 rounded-full text-[#2B2225] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors relative flex items-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#9E3F5C] text-[#FFF9F5] text-[10px] font-bold flex items-center justify-center animate-pulse shadow-xs">
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
                  className="p-2 rounded-full text-[#2B2225] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors relative flex items-center hover:scale-105"
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
                <div className="flex items-center px-3 py-1 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
                  <img src={logoHorizontal} alt="Miss Nous" className="h-8 w-auto object-contain" />
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#2B2225]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-3 font-sans text-base font-medium text-[#2B2225]">
                {[
                  { id: 'home', label: 'Home', path: '/' },
                  { id: 'about', label: 'About Us', path: '/about' },
                  { id: 'shop', label: 'Shop', path: '/shop' },
                  { id: 'contact', label: 'Contact Us', path: '/contact' }
                ].map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <a 
                      key={item.id}
                      href={item.path} 
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
