import React from 'react';
import { Sparkles, Heart, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import image14 from '../assets/image-14.png';
import image9 from '../assets/image-9.png';

export default function SkinRitualSection({ onNavigate }) {
  const points = [
    {
      id: 'point-1',
      title: 'Gentle and considered.',
      description: 'Built with organic botanicals and a clean water base for smooth, reliable comfort.',
      icon: Heart
    },
    {
      id: 'point-2',
      title: 'Made for everyone.',
      description: 'Our intimate lubricant is designed to suit a wide range of bodies and needs.',
      icon: Users
    },
    {
      id: 'point-3',
      title: 'Kind to sensitive skin.',
      description: 'Because the formula is pH-balanced, it stays gentle enough for daily use, even on skin that reacts easily.',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-0 font-sans overflow-hidden relative border-t border-[#F7D6DF]/60">
      <div className="w-full max-w-[1380px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 relative items-stretch">
          
          {/* UNIFIED PARALLAX BACKGROUND LAYER */}
          <div className="absolute inset-0 flex flex-col pointer-events-none z-0">
            {/* Top Parallax portion behind heading */}
            <div 
              className="h-[200px] sm:h-[220px] lg:h-[230px] w-full relative overflow-hidden bg-cover bg-center bg-no-repeat bg-scroll sm:bg-fixed"
              style={{ backgroundImage: `url(${image9})` }}
            >
              <div className="absolute inset-0 bg-[#FFF9F5]/88 backdrop-blur-xs border-b border-[#F7D6DF]/60" />
            </div>
            {/* Bottom Soft Pink portion spanning full width */}
            <div className="flex-1 bg-[#FDF2F5] border-t border-[#F7D6DF]/60 w-full" />
          </div>

          {/* LEFT COLUMN: Model Photo Kept As Is */}
          <div className="lg:col-span-5 relative z-10 flex flex-col min-h-[480px] lg:min-h-full reveal-left">
            <div className="p-6 sm:p-8 lg:p-10 lg:pl-12 pt-10 sm:pt-12 lg:pt-14 flex items-start justify-center h-full">
              <div className="w-full max-w-[430px] h-[440px] sm:h-[480px] lg:h-[540px] overflow-hidden shadow-sm rounded-3xl border border-[#F7D6DF]">
                <img 
                  src="/gpt-9.png" 
                  alt="Made to Suit Every Body, Not Just One Type" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Heading Top + Intro & Three Points List + Care Note & Button */}
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-between reveal-right">
            
            {/* Top Heading Area */}
            <div className="min-h-[200px] sm:min-h-[220px] lg:min-h-[230px] px-6 sm:px-10 lg:px-12 pt-10 sm:pt-12 lg:pt-14 pb-4 flex flex-col justify-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  For Every Body
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight max-w-2xl">
                Made to Suit Every Body, Not Just One Type
              </h2>
            </div>

            {/* Bottom Content Box: Soft Pink bg-[#FDF2F5] */}
            <div className="p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-between space-y-6">
              
              <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
                Sensitive skin should never mean settling for less comfort. Our formula is gentle enough for daily use and made to work with your body, not against it.
              </p>

              {/* Three Points List */}
              <div className="divide-y divide-[#F7D6DF] border-y border-[#F7D6DF]">
                {points.map((pt) => {
                  const Icon = pt.icon;
                  return (
                    <div key={pt.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start py-4">
                      <div className="sm:col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-[#F7D6DF] bg-white flex items-center justify-center flex-shrink-0 text-[#9E3F5C] shadow-xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-sans text-sm sm:text-base font-bold text-[#2B2225]">
                          {pt.title}
                        </span>
                      </div>
                      <div className="sm:col-span-7">
                        <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                          {pt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="pt-1">
                <button
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 shadow-pink-glow transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                  <span>Shop Now</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
