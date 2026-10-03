import React from 'react';
import { Sparkles, Droplet, ShieldCheck, CheckCircle2, Sliders, Info } from 'lucide-react';

export default function SafetyTrustBand() {
  const safetyClaims = [
    {
      id: 'claim-1',
      title: 'Water-Based',
      subtitle: 'Rinses clean, no oily residue',
      icon: Droplet
    },
    {
      id: 'claim-2',
      title: 'Condom & Toy Safe',
      subtitle: 'Works with latex condoms & silicone toys',
      icon: ShieldCheck
    },
    {
      id: 'claim-3',
      title: 'Paraben-Free',
      subtitle: 'No parabens in the formula',
      icon: CheckCircle2
    },
    {
      id: 'claim-4',
      title: 'pH-Balanced',
      subtitle: 'Calibrated for everyday comfort',
      icon: Sliders
    }
  ];

  return (
    <section className="relative bg-[#FFF9F5] py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16 border-y border-[#F7D6DF]/60 overflow-hidden">
      
      {/* Decorative Shimmer Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/40 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 text-center reveal-up">
        
        {/* Header Area */}
        <div className="space-y-3 max-w-3xl mx-auto pb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Made to Feel Safe
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
            Comfort You Can Feel Good About
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#7A6B70] font-medium flex items-center justify-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <span>For External Use • Avoid contact with eyes</span>
          </p>
        </div>

        {/* 4 Chips Container: Desktop 1 Row (4 cols), Mobile 2x2 Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {safetyClaims.map((claim) => {
            const Icon = claim.icon;
            return (
              <div 
                key={claim.id}
                className="bg-white/90 p-5 sm:p-6 rounded-2xl border border-[#F7D6DF] shadow-xs hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 flex flex-col items-center text-center space-y-3 group"
              >
                {/* Golden/Pink Icon Badge */}
                <div className="w-11 h-11 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Claim Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-sans text-sm sm:text-base font-bold text-[#2B2225] tracking-tight group-hover:text-[#9E3F5C] transition-colors">
                    {claim.title}
                  </h3>
                  <p className="font-sans text-xs text-[#5A4B50] font-normal leading-relaxed">
                    {claim.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
