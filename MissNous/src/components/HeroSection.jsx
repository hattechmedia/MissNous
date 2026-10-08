import React from 'react';
import { Sparkles } from 'lucide-react';

import { PRODUCTS } from '../data/products';

export default function HeroSection({ onNavigate }) {
  return (
    <section className="relative overflow-hidden w-full max-w-full bg-[#2B2225] min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] pt-24 sm:pt-32 pb-14 sm:pb-20 flex items-center justify-center px-3 sm:px-8 lg:px-16 border-b border-[#F7D6DF]/60">

      {/* Background Video Animation Extending Behind Navbar with Seamless Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#2B2225]">
        <video
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-[1.05]"
        />
        {/* Higher Opacity Dark Overlay for maximum text readability & cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/55 to-black/65 backdrop-blur-[1px]"></div>
      </div>

      {/* Floating Ambient Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[34rem] sm:h-[34rem] bg-[#D4AF6A]/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-5"></div>

      {/* Text Content Overlay on top of Background Video */}
      <div className="max-w-4xl mx-auto w-full text-center relative z-10 space-y-5 sm:space-y-6 reveal-up px-1 sm:px-4">

        {/* Subtitle Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md max-w-[95%]">
          <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse flex-shrink-0" />
          <span className="font-sans text-[11px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-[0.25em] text-[#9E3F5C] truncate">
            100% Organic Intimate Wellness
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sans text-2xl sm:text-4xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.2] sm:leading-[1.12] drop-shadow-md break-words">
          Organic, Flavored Water-Based Intimate Lubricant
        </h1>

        {/* Description Paragraph */}
        <p className="font-sans text-xs sm:text-base lg:text-lg text-[#FFF9F5] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm px-1 sm:px-0">
          Miss Nous is a gentle, organic, water-based intimate lubricant that glides on smooth and stays silky without ever turning tacky, so comfort feels natural instead of forced. Available in pineapple and strawberry.
        </p>

        {/* Shop Now CTA Button -> Links to Shop Page */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={() => onNavigate && onNavigate('shop')}
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            Shop Now
          </button>
        </div>

      </div>

    </section>
  );
}
