import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import image9 from '../assets/image-9.png';

export default function ParallaxBanner({ onNavigate }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 flex items-center justify-center text-center px-4 sm:px-8 border-y border-[#F7D6DF]/60">
      
      {/* Background Image with Smooth Parallax effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed filter brightness-90"
        style={{ backgroundImage: "url('/gpt-15.png')" }}
      >
        {/* Dark Luxury Overlay for high text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/85 via-[#2B2225]/65 to-[#2B2225]/75 backdrop-blur-[1px]"></div>
      </div>

      {/* Parallax Overlay Content */}
      <div className="max-w-4xl mx-auto relative z-10 space-y-6 reveal-up">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
            Honest Ingredients
          </span>
        </div>

        {/* H2 Headline */}
        <h2 className="font-sans text-3xl sm:text-4xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md max-w-3xl mx-auto">
          What Goes Into Every Bottle, and Why It Matters
        </h2>

        {/* 2 Separate Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pt-2">
          
          {/* Card 1: Our Pure Promise */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/12 backdrop-blur-md border border-white/20 text-left space-y-3 shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-[#E8D3A5] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#E8D3A5]" />
              <span>Our Pure Promise</span>
            </div>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-[#FFF9F5]/95 font-normal leading-relaxed">
              Every Miss Nous lubricant starts with the same promise: a water-based formula, organic botanicals, and nothing on the label you cannot make sense of. We leave out the heavy, sticky fillers found in many mainstream products and build each formula around ingredients meant to feel gentle on sensitive skin. The result is a pH-balanced formula that feels as clean as it is comfortable.
            </p>
          </div>

          {/* Card 2: Formula at a Glance */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/12 backdrop-blur-md border border-white/20 text-left space-y-3 shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-[#E8D3A5] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#E8D3A5]" />
              <span>Formula at a Glance</span>
            </div>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-[#FFF9F5]/95 font-normal leading-relaxed">
              A water and glycerin base, thickened for a silky glide, with a light preservative system to keep it fresh, and no parabens. The complete ingredient breakdown is listed on every product page. It is not classified as a hazardous chemical under the GHS system, and it is not flammable.
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <div className="pt-4">
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
