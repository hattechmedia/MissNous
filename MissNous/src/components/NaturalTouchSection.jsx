import React from 'react';
import { Sparkles } from 'lucide-react';

export default function NaturalTouchSection({ onNavigate }) {
  return (
    <section className="relative bg-[#FDF2F5] py-20 lg:py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT SIDE: Staggered 3-Image Gallery matching reference layout */}
        <div className="lg:col-span-6 relative reveal-left">
          
          {/* Subtle Decorative Dot Grid Graphic in background */}
          <div className="absolute -bottom-6 -right-4 w-40 h-40 opacity-30 pointer-events-none z-0">
            <svg width="160" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#D4AF6A" />
              </pattern>
              <rect width="160" height="160" fill="url(#dotPattern)" />
            </svg>
          </div>

          {/* Grid Layout of 3 Rounded Card Containers */}
          <div className="grid grid-cols-2 gap-5 items-center relative z-10">
            
            {/* Left Column (2 stacked cards: Top Left & Bottom Left) */}
            <div className="space-y-5">
              
              {/* Card 1: Top Left (gpt-5.png) */}
              <div className="bg-[#F7D6DF]/70 p-4 sm:p-6 rounded-3xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 group flex items-center justify-center overflow-hidden">
                <img 
                  src="/gpt-5.png" 
                  alt="Miss Nous Natural Care Product 1" 
                  className="h-44 sm:h-52 w-auto object-cover rounded-2xl sm:rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-xs"
                />
              </div>

              {/* Card 2: Bottom Left (gpt-2.png) */}
              <div className="bg-[#F7D6DF]/70 p-4 sm:p-6 rounded-3xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 group flex items-center justify-center overflow-hidden">
                <img 
                  src="/gpt-2.png" 
                  alt="Miss Nous Natural Care Product 3" 
                  className="h-44 sm:h-52 w-auto object-cover rounded-2xl sm:rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-xs"
                />
              </div>

            </div>

            {/* Right Column (Single offset card shifted vertically center: gpt-1.png) */}
            <div className="transform lg:translate-y-8">
              <div className="bg-[#F7D6DF]/70 p-4 sm:p-6 rounded-3xl border border-[#F7D6DF] shadow-sm hover:shadow-gold-glow transition-all duration-500 group flex items-center justify-center overflow-hidden">
                <img 
                  src="/gpt-1.png" 
                  alt="Miss Nous Natural Care Product 2" 
                  className="h-56 sm:h-64 lg:h-72 w-auto object-cover rounded-3xl sm:rounded-[28px] group-hover:scale-105 transition-transform duration-500 shadow-xs"
                />
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE: Content & Copy matching exact reference text layout */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left reveal-right">
          
          {/* Subheading / Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F7D6DF] shadow-xs w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Natural Touch
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            Silky, Water-Based Comfort From the First Touch
          </h2>

          {/* Paragraph */}
          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
            Our water-based lubricant was made to glide, not to sit heavy on the skin. It feels smooth on contact, stays comfortable through use, and rinses away cleanly with water. Because it is water-based rather than oil-based, it washes off easily and skips the thick, sticky residue many other products leave behind. This is intimate care built for real, everyday use, not just special occasions.
          </p>

          {/* CTA Button */}
          <div className="pt-3">
            <button 
              onClick={() => onNavigate && onNavigate('about')}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Learn More
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
