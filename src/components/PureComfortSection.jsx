import React from 'react';
import { Sparkles } from 'lucide-react';
import image4 from '../assets/image-4.jpeg';

export default function PureComfortSection({ onNavigate }) {
  return (
    <section className="relative bg-[#FDF2F5] py-0 border-t border-[#F7D6DF]/60 overflow-hidden">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
        
        {/* LEFT SIDE: Text Content */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left p-6 sm:p-12 lg:p-20 order-2 lg:order-1">
          
          {/* Eyebrow / Subheading Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F7D6DF] shadow-xs w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Pure Comfort
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            Miss Nous Hydrating Serum.
          </h2>

          {/* Description Paragraph */}
          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-xl">
            Miss Nous Hydrating Serum delivers deep hydration with natural botanicals, restoring balance, softness, and radiance. Lightweight, fast-absorbing, and perfect for daily use on all skin types.
          </p>

          {/* Buy Now CTA Button -> Links to Shop Page */}
          <div className="pt-2">
            <button 
              onClick={() => onNavigate && onNavigate('shop')}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Buy Now
            </button>
          </div>

        </div>

        {/* RIGHT SIDE: image-4 banner with NO spacing around section and NO rounded corners */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 w-full h-full min-h-[380px] sm:min-h-[480px]">
          <img 
            src={image4} 
            alt="Miss Nous Hydrating Serum" 
            className="w-full h-full object-cover rounded-none shadow-none"
          />
        </div>

      </div>

    </section>
  );
}
