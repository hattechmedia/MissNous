import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Mail, Sparkles, X } from 'lucide-react';
import image17 from '../assets/Image-17.png';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-[#FDF2F5] py-12 sm:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#F7D6DF]/60">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Banner Card with Image-17 background */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[260px] sm:min-h-[300px] lg:min-h-[330px] flex items-center p-6 sm:p-10 lg:p-14 group shadow-lg border border-[#E8D3A5]/30 bg-[#9E3F5C]">
          
          {/* Background Image */}
          <img 
            src={image17} 
            alt="Miss Nous Inner Circle" 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 group-hover:scale-100"
          />
          
          {/* Subtle Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B2225]/85 via-[#2B2225]/60 to-[#2B2225]/30 sm:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/60 via-transparent to-[#2B2225]/30"></div>

          {/* Banner Content Grid */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Side Text Content */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-left reveal-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-[#E8D3A5]/40 text-[#E8D3A5]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF6A]" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFF9F5]">
                  VIP Access
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E8D3A5] leading-tight tracking-tight drop-shadow-md">
                Join the Miss Nous Inner Circle
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#FFF9F5]/90 font-normal leading-relaxed max-w-lg drop-shadow-sm">
                Receive exclusive access to new luxury ritual releases, secret seasonal promotions, and expert intimate wellness guides.
              </p>
            </div>

            {/* Right Side Glassmorphic Form Card */}
            <div className="lg:col-span-5 relative z-10 reveal-right">
              <div className="bg-white/15 backdrop-blur-md p-2 sm:p-2.5 rounded-full border border-[#E8D3A5]/40 shadow-2xl">
                
                {subscribed ? (
                  <div className="p-3.5 sm:p-4 bg-white/95 border border-[#E8D3A5] rounded-full flex items-center justify-center gap-3 text-[#9E3F5C] animate-fade-up px-6">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#9E3F5C]" />
                    <span className="font-sans text-xs sm:text-sm font-semibold text-center">
                      Thank you! You are now subscribed to Miss Nous.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full">
                    {/* Unified Single Input Container with Embedded Arrow Button */}
                    <div className="bg-[#FFF9F5] rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 flex items-center gap-2 border border-[#E8D3A5] shadow-inner focus-within:border-[#9E3F5C] focus-within:ring-2 focus-within:ring-[#9E3F5C]/20 transition-all">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#9E3F5C] flex-shrink-0" />
                      <input 
                        type="email" 
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-xs sm:text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none font-medium"
                      />
                      {email && (
                        <button 
                          type="button" 
                          onClick={() => setEmail('')}
                          className="text-[#9E3F5C]/50 hover:text-[#9E3F5C] flex-shrink-0 px-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        type="submit"
                        aria-label="Subscribe"
                        className="bg-[#9E3F5C] hover:bg-[#7C2F47] active:scale-95 text-[#FFF9F5] rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shadow-md transition-all duration-300 flex-shrink-0 cursor-pointer"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}





