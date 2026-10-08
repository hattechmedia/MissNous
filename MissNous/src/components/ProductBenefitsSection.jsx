import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import product1 from '../assets/product-1-rm.png';
import image9 from '../assets/image-9.png';

export default function ProductBenefitsSection({ onNavigate }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const leftBenefits = [
    {
      id: 'left-1',
      title: 'Delivered discreetly to your door.',
      description: 'Order in minutes and let your flavor arrive quickly, in plain packaging.'
    },
    {
      id: 'left-2',
      title: 'Made for daily comfort.',
      description: 'Every batch is pH-balanced and tested in small quantities, so the formula stays consistent and gentle.'
    },
    {
      id: 'left-3',
      title: 'Designed for every body.',
      description: 'Our lubricant is made to feel comfortable for anyone, whatever your skin type or how often you use it.'
    }
  ];

  const rightBenefits = [
    {
      id: 'right-1',
      title: 'Fruit-inspired, not overpowering.',
      description: 'We use light, fruit-inspired flavors instead of heavy artificial syrups, so comfort and enjoyment share the same bottle.'
    },
    {
      id: 'right-2',
      title: 'Made with recognizable ingredients.',
      description: 'We build the formula around organic botanicals and a clean water base, and publish the full ingredient list on every product page.'
    },
    {
      id: 'right-3',
      title: 'Held to a higher standard.',
      description: 'From the formula to the bottle, every detail is made with your comfort in mind.'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden py-10 sm:py-12 lg:py-14 px-4 sm:px-12 lg:px-20 xl:px-28 border-t border-[#F7D6DF] w-full max-w-full"
    >
      {/* Background Image with Parallax Scroll Effect (image-9) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll sm:bg-fixed"
        style={{ backgroundImage: `url(${image9})` }}
      >
        <div className="absolute inset-0 bg-[#FFF9F5]/94 backdrop-blur-xs"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-4 sm:space-y-6">
        
        {/* Section Header matching site's global eyebrow badge & heading typography */}
        <div className="text-center space-y-2 max-w-3xl mx-auto reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Why Miss Nous
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            The Miss Nous Difference in Intimate Care
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
            Choosing an intimate lubricant is personal, so we made every part of ours something you can feel good about. Here is what sets Miss Nous apart.
          </p>
        </div>

        {/* Interactive Diagram Stage with Tightened Vertical Spacing */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center min-h-[500px]">
          
          {/* LEFT COLUMN: 4 cols */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-16 order-2 lg:order-1 lg:pl-4 xl:pl-8">
            {leftBenefits.map((b, index) => (
              <div 
                key={b.id} 
                className={`relative group text-left transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
                style={{ transitionDelay: `${index * 150 + 100}ms` }}
              >
                <div className="space-y-0.5 pb-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] tracking-tight group-hover:text-[#9E3F5C] transition-colors">
                    {b.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#706065] font-normal leading-relaxed max-w-xs">
                    {b.description}
                  </p>
                </div>

                {/* Horizontal Underline running underneath text all the way to bottle ring dot */}
                <div className="hidden lg:flex items-center w-full relative">
                  <div className="w-full h-0.5 bg-[#9E3F5C]"></div>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#9E3F5C] bg-[#FFF9F5] flex items-center justify-center flex-shrink-0 -mr-1.5 z-20 shadow-xs group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9E3F5C]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER BOTTLE: 4 cols */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 relative py-1">
            <div className="relative group flex items-center justify-center w-full">
              <div className="absolute inset-0 m-auto w-72 h-72 bg-[#D4AF6A]/25 rounded-full blur-[60px] pointer-events-none z-0"></div>
              
              <img 
                src="/pr-2.png" 
                alt="Miss Nous Skincare Bottle" 
                className="relative z-10 h-[380px] sm:h-[480px] lg:h-[580px] w-auto object-contain scale-105 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: 4 cols */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-16 order-3 lg:pr-4 xl:pr-8">
            {rightBenefits.map((b, index) => (
              <div 
                key={b.id} 
                className={`relative group text-left lg:text-right transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: `${index * 150 + 100}ms` }}
              >
                <div className="space-y-0.5 pb-1.5">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] tracking-tight group-hover:text-[#9E3F5C] transition-colors">
                    {b.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#706065] font-normal leading-relaxed max-w-xs ml-0 lg:ml-auto">
                    {b.description}
                  </p>
                </div>

                {/* Horizontal Underline running from bottle ring dot underneath text */}
                <div className="hidden lg:flex items-center w-full relative">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#9E3F5C] bg-[#FFF9F5] flex items-center justify-center flex-shrink-0 -ml-1.5 z-20 shadow-xs group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9E3F5C]"></div>
                  </div>
                  <div className="w-full h-0.5 bg-[#9E3F5C]"></div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Fully Rounded Pill CTA Button placed tight under bottle */}
        <div className="pt-1 text-center reveal-up">
          <button 
            onClick={() => onNavigate && onNavigate('shop')}
            className="inline-flex items-center justify-center px-10 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            Shop Now
          </button>
        </div>

      </div>

    </section>
  );
}
