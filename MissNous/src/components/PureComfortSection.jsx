import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PureComfortSection({ onNavigate, showLocationBtn = false, onLocationClick }) {
  return (
    <section className="relative bg-[#FDF2F5] py-0 border-t border-[#F7D6DF]/60 overflow-hidden">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
        
        {/* LEFT SIDE: Text Content */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-5 text-left py-8 sm:py-10 lg:py-12 px-6 sm:px-10 lg:px-14 xl:px-16 order-2 lg:order-1 reveal-left">
          
          {/* Eyebrow / Subheading Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#F7D6DF] shadow-xs w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#9E3F5C]">
              Pure Comfort
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-[2.2rem] xl:text-[2.5rem] font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            Shop Touch of Love, Our Water-Based Organic Lubricant
          </h2>

          {/* Description Paragraph */}
          <p className="font-sans text-sm sm:text-[15px] lg:text-base text-[#5A4B50] font-normal leading-relaxed max-w-xl">
            Touch of Love was made for the moments when comfort matters most. This water-based lubricant feels silky on contact, glides easily, and is set to a gentle pH so it never feels harsh. Whether you reach for it daily or only now and then, it is made to support real intimacy, not get in the way of it. Available in 100ml, in pineapple and strawberry.
          </p>

          {/* Shop Now & Location CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('shop')}
              className="inline-flex items-center justify-center px-7 py-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Shop Now
            </button>
            {showLocationBtn && (
              <button 
                type="button"
                onClick={onLocationClick}
                className="inline-flex items-center justify-center px-7 py-3 bg-white hover:bg-[#FFF9F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-sm font-semibold rounded-full shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Find Your Location
              </button>
            )}
          </div>

        </div>

        {/* RIGHT SIDE: gpt-10.png banner */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 w-full h-[320px] sm:h-[380px] lg:h-[420px] xl:h-[450px] flex items-center justify-center overflow-hidden bg-[#240c15] reveal-right">
          {/* Ambient blurred backdrop to softly fill extra wide width */}
          <img 
            src="/gpt-10.png" 
            alt="" 
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-110 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[#240c15]/25 pointer-events-none" />

          {/* Full Sharp Image - 100% complete, nothing cropped, spray caps & tray fully visible */}
          <img 
            src="/gpt-10.png" 
            alt="Shop Touch of Love, Our Water-Based Organic Lubricant" 
            className="relative z-10 w-full h-full object-contain object-center"
          />
        </div>

      </div>

    </section>
  );
}
