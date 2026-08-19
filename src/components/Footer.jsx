import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="relative bg-[#9E3F5C] text-[#FFF9F5] py-12 px-4 sm:px-8 lg:px-16 border-t border-[#D4AF6A]/30">
      
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center space-y-6 reveal-up">
        
        {/* Brand Name Logo */}
        <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="inline-block group">
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FFF9F5] group-hover:text-[#E8D3A5] transition-colors">
              Miss Nous
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]"></span>
          </div>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#E8D3A5] font-sans font-medium mt-1">
            Intimate Wellness & Beauty • Paris
          </span>
        </a>

        {/* Clean Simple Navigation Links Row (Home, About Us, Shop, Contact Us) */}
        <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-sans text-sm text-[#F7D6DF] font-medium pt-2">
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#FFF9F5] transition-colors">Home</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#FFF9F5] transition-colors">About Us</a>
          <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')} className="hover:text-[#FFF9F5] transition-colors">Shop</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-[#FFF9F5] transition-colors">Contact Us</a>
        </nav>

        {/* Divider Line */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/50 to-transparent my-2"></div>

        {/* Copyright with @ HAT Tech Media */}
        <div className="text-xs font-sans text-[#F7D6DF]/80">
          <p>All rights reserved • @ HAT Tech Media</p>
        </div>

      </div>

      {/* Static Scroll To Top Button (Positioned inside Footer Bottom Right Corner) */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-6 right-6 sm:right-8 p-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] border border-[#F7D6DF]/40 shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

    </footer>
  );
}
