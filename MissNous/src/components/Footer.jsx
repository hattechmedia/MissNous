import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, MapPin, ArrowRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubscribed] = useState(false);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#9E3F5C] py-12 sm:py-16 px-4 sm:px-8 lg:px-16 text-[#FFF9F5] border-t border-[#D4AF6A]/30">
      {/* Full Width Footer Container */}
      <div className="w-full max-w-7xl mx-auto space-y-10">
        
        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start pt-2 reveal-up">
          
          {/* COLUMN 1: LOGO, ABOUT MISS NOUS & ADDRESS (5 Cols wide on MD) */}
          <div className="md:col-span-5 space-y-4 pr-0 md:pr-4">
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'home')} 
              className="inline-block group"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#E8D3A5] group-hover:text-white transition-colors">
                  Miss Nous
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF6A]"></span>
              </div>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#E8D3A5]/90 font-sans font-semibold mt-0.5">
                Intimate Wellness & Beauty • Paris
              </span>
            </a>

            <p className="font-sans text-xs sm:text-sm text-[#F7D6DF] leading-relaxed max-w-sm">
              <strong className="text-[#E8D3A5] font-semibold">Miss Nous</strong> is dedicated to luxury intimate wellness and premium body care, formulating 100% organic botanical rituals that empower self-love and natural confidence.
            </p>

            {/* Address Display */}
            <div className="flex items-start gap-2.5 text-xs text-[#E8D3A5] font-sans pt-1">
              <MapPin className="w-4 h-4 text-[#D4AF6A] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                18 Garibaldi Avenue, Newark, New Jersey 07114
              </span>
            </div>
          </div>


          {/* COLUMN 2: PAGES NAVIGATION (3 Cols wide on MD) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">
              PAGES
            </h4>
            <ul className="flex flex-col gap-2 font-sans text-sm text-[#F7D6DF]">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick(e, 'home')} 
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleNavClick(e, 'about')} 
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#shop" 
                  onClick={(e) => handleNavClick(e, 'shop')} 
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Shop
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleNavClick(e, 'contact')} 
                  className="hover:text-[#E8D3A5] transition-colors font-medium inline-block py-0.5"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: GMAIL / EMAIL INPUT FIELD (4 Cols wide on MD) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">
              SUBSCRIBE
            </h4>

            {submitted ? (
              <div className="p-3.5 bg-[#FFF9F5] border border-[#E8D3A5] rounded-xl flex items-center gap-2.5 text-[#9E3F5C] animate-fade-up">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#9E3F5C]" />
                <span className="font-sans text-xs font-semibold">
                  Thank you! You are now subscribed to Miss Nous.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Email Input Field Row */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E3F5C]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFF9F5] border border-[#E8D3A5] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all font-medium"
                  />
                </div>

                {/* Separate Row for Subscribe Button */}
                <button 
                  type="submit"
                  className="w-full py-2.5 px-5 bg-gradient-to-r from-[#D4AF6A] via-[#E8D3A5] to-[#B88A3B] hover:brightness-110 text-[#2B2225] font-sans text-xs font-bold rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright Divider Row */}
        <div className="border-t border-[#D4AF6A]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8D3A5]/80 font-normal gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>Copyright © 2026 Miss Nous Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-[#D4AF6A]">•</span>
            <span className="font-semibold text-[#E8D3A5]">Powered by Hat Tech Media</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#E8D3A5] transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-[#E8D3A5] transition-colors">
              Terms of Use
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}









