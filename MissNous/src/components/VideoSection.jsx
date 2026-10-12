import React from 'react';
import { Sparkles, Droplets } from 'lucide-react';
import video1 from '../assets/video-1.mp4';

export default function VideoSection() {
  return (
    <section className="relative bg-[#FDF2F5] py-16 lg:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#F7D6DF]/60">
      
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F7D6DF]/50 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#E8D3A5]/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10 reveal-up">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs mb-4 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
            Exclusive Wellness Ritual
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight mb-4 max-w-3xl mx-auto">
          See Our Water-Based, pH-Balanced Formula in Motion
        </h2>

        {/* Section Caption Paragraph */}
        <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
          Watch how naturally this water-based formula moves. Made with organic botanicals and set to a gentle pH of 4.5, it was designed to feel like an extension of your body rather than a product you think twice about. Built on a water and glycerin base, it is not classified as a hazardous chemical under the GHS system, and it is not flammable.
        </p>

        {/* Animated Visual Stage */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-luxury border-2 border-[#F7D6DF] bg-white group max-w-5xl mx-auto aspect-video sm:aspect-[16/9] flex items-center justify-center">
          
          {/* Seamless Looping Animated Video Asset */}
          <video
            src={video1}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.01] hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Badge Overlay */}
          <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white/90 sm:bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#F7D6DF] shadow-md flex items-center gap-1.5 sm:gap-2.5 pointer-events-none z-10 max-w-[95%] sm:max-w-[90%]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4AF6A] animate-ping flex-shrink-0"></span>
            <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9E3F5C] flex-shrink-0" />
            <span className="text-[10px] sm:text-sm font-semibold text-[#2B2225] font-sans tracking-wide text-center sm:text-left leading-tight">
              Organic Botanicals • Silky Texture • pH 4.5 Formula
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}
