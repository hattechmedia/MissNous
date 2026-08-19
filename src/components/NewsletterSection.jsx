import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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
    <section className="relative bg-[#FDF2F5] py-16 lg:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#F7D6DF]/60">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Main Rounded Banner Box with Enhanced Organic Pink & Golden Shades */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#FFF9F5] via-[#FFF4F7] to-[#FFF9F5] border border-[#E8D3A5]/80 shadow-luxury overflow-hidden p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Organic Curved Background Shape 1 (Top Left Arch - Soft Light Blush Pink) */}
          <div className="absolute -top-16 -left-16 w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] bg-[#F7D6DF]/70 rounded-full -z-0"></div>
          
          {/* Organic Curved Background Shape 2 (Bottom Left Corner - Soft Champagne Gold) */}
          <div className="absolute -bottom-24 -left-12 w-72 h-72 bg-[#E8D3A5]/50 rounded-full -z-0"></div>

          {/* LEFT SIDE CONTENT */}
          <div className="lg:col-span-6 relative z-10 space-y-4 reveal-left">
            
            {/* VIP Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                VIP Access
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.18] tracking-tight">
              Join the Miss Nous Inner Circle
            </h2>

            {/* Supporting Subtext */}
            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-md">
              Receive exclusive access to new luxury ritual releases, secret seasonal promotions, and expert intimate wellness guides.
            </p>

          </div>

          {/* RIGHT SIDE SUBSCRIBE FORM */}
          <div className="lg:col-span-6 relative z-10 space-y-4 lg:pl-6 reveal-right">
            
            {/* Form Title */}
            <h3 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
              Subscribe Now
            </h3>

            {subscribed ? (
              <div className="p-4 bg-[#F7D6DF]/60 border border-[#D96B8A]/40 rounded-2xl flex items-center gap-3 text-[#9E3F5C] animate-fade-up">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#9E3F5C]" />
                <span className="font-sans text-sm font-semibold">
                  Thank you! You are now subscribed to Miss Nous Inner Circle.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-[#E8D3A5] rounded-2xl sm:rounded-full px-5 py-3.5 text-sm text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#D4AF6A] focus:ring-2 focus:ring-[#D4AF6A]/40 transition-all"
                />
                <button 
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#9E3F5C] via-[#D96B8A] to-[#9E3F5C] hover:brightness-110 text-[#FFF9F5] font-sans text-sm font-semibold rounded-2xl sm:rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Submit
                </button>
              </form>
            )}

            {/* Subtext below input */}
            <p className="font-sans text-xs text-[#A09095] pt-1">
              You will receive every news and exclusive pro tips.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
