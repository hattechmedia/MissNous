import React from 'react';
import { Award, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import image10 from '../assets/Imagr-10.png';

export default function SkinRitualSection({ onNavigate }) {
  return (
    <section className="py-0 bg-white font-sans overflow-hidden">
      <div className="w-full max-w-[1380px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 relative items-stretch">
          
          {/* UNIFIED BACKGROUND LAYER: Flawless equal split across entire section */}
          <div className="absolute inset-0 flex flex-col pointer-events-none z-0">
            {/* Top White portion matching heading block height */}
            <div className="h-[200px] sm:h-[210px] lg:h-[220px] bg-white w-full" />
            {/* Bottom Soft Pink portion spanning full width */}
            <div className="flex-1 bg-[#FDF2F5] border-t border-[#F7D6DF]/60 w-full" />
          </div>

          {/* LEFT COLUMN: Image Top Aligned Equal with Heading */}
          <div className="lg:col-span-5 relative z-10 flex flex-col min-h-[480px] lg:min-h-full reveal-left">
            {/* Foreground Image: Top aligned equal with heading */}
            <div className="p-6 sm:p-8 lg:p-10 lg:pl-12 pt-12 sm:pt-14 lg:pt-16 flex items-start justify-center h-full">
              <div className="w-full max-w-[430px] h-[420px] sm:h-[460px] lg:h-[490px] overflow-hidden shadow-sm rounded-none border border-[#F7D6DF]/40">
                <img 
                  src={image10} 
                  alt="Our products are crafted to suit all skin types & textures" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Heading Top (White) + Feature Points Bottom (Soft Pink) */}
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-between reveal-right">
            
            {/* Top Heading Area: Exactly matching top white height (220px), shifted down */}
            <div className="h-[200px] sm:h-[210px] lg:h-[220px] px-6 sm:px-10 lg:px-12 pt-12 sm:pt-14 lg:pt-16 pb-4 flex items-start">
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[2.55rem] font-bold text-[#2B2225] leading-[1.25] tracking-tight max-w-2xl">
                Our products are crafted to suit all skin types & textures.
              </h2>
            </div>

            {/* Bottom Features Box: Soft Pink bg-[#FDF2F5], Brand Points & SHOP NOW Button */}
            <div className="p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-end space-y-6">
              
              {/* 3 Feature Rows */}
              <div className="divide-y divide-[#F7D6DF] mt-auto pt-6 sm:pt-10">
                
                {/* Row 1: Unmatched Quality */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5 first:pt-0">
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full border border-[#F7D6DF] bg-white flex items-center justify-center flex-shrink-0 text-[#9E3F5C]">
                      <Award className="w-4.5 h-4.5 stroke-[1.75]" />
                    </div>
                    <span className="font-sans text-sm sm:text-base font-bold text-[#2B2225]">
                      Unmatched Quality
                    </span>
                  </div>
                  <div className="sm:col-span-7">
                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                      Our products are crafted with finest ingredients to deliver long-lasting perfection.
                    </p>
                  </div>
                </div>

                {/* Row 2: Beauty Solutions */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5">
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full border border-[#F7D6DF] bg-white flex items-center justify-center flex-shrink-0 text-[#9E3F5C]">
                      <Sparkles className="w-4.5 h-4.5 stroke-[1.75]" />
                    </div>
                    <span className="font-sans text-sm sm:text-base font-bold text-[#2B2225]">
                      Beauty Solutions
                    </span>
                  </div>
                  <div className="sm:col-span-7">
                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                      We bring the latest beauty trends & innovations to your fingertips.
                    </p>
                  </div>
                </div>

                {/* Row 3: For Every Skin Type */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-5 last:pb-0">
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full border border-[#F7D6DF] bg-white flex items-center justify-center flex-shrink-0 text-[#9E3F5C]">
                      <UserCheck className="w-4.5 h-4.5 stroke-[1.75]" />
                    </div>
                    <span className="font-sans text-sm sm:text-base font-bold text-[#2B2225]">
                      For Every Skin Type
                    </span>
                  </div>
                  <div className="sm:col-span-7">
                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                      A diverse range of shades and formulas suitable for all skin tones and types.
                    </p>
                  </div>
                </div>

              </div>

              {/* SHOP NOW Button (Brand Maroon Pink #9E3F5C + Hover #7C2F47) */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 shadow-pink-glow transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                  <span>SHOP NOW</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
