import React from 'react';
import { Sparkles } from 'lucide-react';
import image9 from '../assets/image-9.png';

export default function ParallaxBanner({ onNavigate }) {
  return (
    <section className="relative overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center justify-center text-center px-4 sm:px-8 border-y border-[#F7D6DF]/60">
      
      {/* Background Image with Smooth Parallax effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed filter brightness-90"
        style={{ backgroundImage: `url(${image9})` }}
      >
        {/* Soft Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/75 via-[#2B2225]/45 to-[#2B2225]/60"></div>
      </div>

      {/* Parallax Overlay Content */}
      <div className="max-w-3xl mx-auto relative z-10 space-y-6 reveal-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
            Pure Organic Luxury
          </span>
        </div>

        <h2 className="font-sans text-3xl sm:text-4xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
          Elevate Your Daily Skincare Ritual
        </h2>

        <p className="font-sans text-sm sm:text-base lg:text-lg text-[#FFF9F5]/90 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-sm">
          Discover the gentle touch of botanical science formulated for natural radiance and long-lasting skin health.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate && onNavigate('shop')}
            className="inline-flex items-center justify-center px-9 py-3.5 bg-[#FFF9F5] hover:bg-white text-[#9E3F5C] font-sans text-sm font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      </div>

    </section>
  );
}
