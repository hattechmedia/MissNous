import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sophia Laurent',
    role: 'Verified Buyer • Paris, France',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The Touch of Love Strawberry lubricant is pure luxury. Silky, non-sticky, and calibrated at pH 4.5 for complete comfort. It has truly elevated our intimate rituals!',
    product: 'Touch of Love - Strawberry'
  },
  {
    id: 2,
    name: 'Camille Moreau',
    role: 'Verified Purchaser • Lyon, France',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The Hydrating Serum with Damask Rose and Hyaluronic Acid absorbed into my skin like magic. My face feels glowing, soft, and deeply nourished every morning.',
    product: 'Miss Nous Hydrating Serum'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Verified Purchaser • Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: '100% organic purity, refined scents, and packaged with ultimate Parisian elegance. I appreciate how discreet the shipping was. Absolutely 10/10 recommendation!',
    product: 'Touch of Love - Strawberry'
  },
  {
    id: 4,
    name: 'Amara Vance',
    role: 'Verified Purchaser • London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'Finally a wellness brand that puts organic purity and luxurious aesthetics first. My skin texture has noticeably improved within just two weeks of use.',
    product: 'Miss Nous Hydrating Serum'
  },
  {
    id: 5,
    name: 'Chloe Dubois',
    role: 'Verified Purchaser • Geneva, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The natural botanical aroma is divine without any artificial chemical harshness. Miss Nous standard of organic luxury is unmatched!',
    product: 'Touch of Love - Strawberry'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  // Auto-play cycle every 5 seconds (pauses on mouse hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-16 sm:py-24 px-0 bg-gradient-to-b from-[#FFF9F5] via-[#FDF2F5]/80 to-[#FFF9F5] border-t border-[#F7D6DF]/60 overflow-hidden relative font-sans">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#E8D3A5]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full space-y-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto px-4 space-y-3 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Client Experience
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2225] tracking-tight">
            Words of Love & Harmony
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
            Real feedback from clients across Europe who have embraced Miss Nous in their daily self-care rituals.
          </p>
        </div>

        {/* CAROUSEL STAGE CONTAINER (Generous bottom padding prevents clipping of avatar & star pill) */}
        <div 
          className="relative w-full overflow-hidden pt-4 pb-20 sm:pb-24 reveal-up"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* LEFT NAVIGATION BUTTON */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white flex items-center justify-center shadow-pink-glow transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* RIGHT NAVIGATION BUTTON */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white flex items-center justify-center shadow-pink-glow transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* SLIDING TRACK: ALL CARDS ARE SAME SIZE, CENTERING THE ACTIVE CARD PERFECTLY */}
          <div 
            className="flex items-center gap-6 sm:gap-8 transition-transform duration-600 ease-out"
            style={{
              transform: `translateX(calc(50% - (min(85vw, 540px) / 2) - (${currentIndex} * (min(85vw, 540px) + 24px))))`,
              willChange: 'transform'
            }}
          >
            {TESTIMONIALS.map((item, idx) => {
              const isActive = idx === currentIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleDotClick(idx)}
                  className={`w-[85vw] sm:w-[500px] lg:w-[540px] flex-shrink-0 transition-all duration-500 py-4 ${
                    isActive 
                      ? 'opacity-100 scale-100 z-20 pointer-events-auto shadow-luxury' 
                      : 'opacity-35 hover:opacity-75 scale-95 z-10 cursor-pointer filter blur-[0.2px]'
                  }`}
                >
                  {/* SLEEK MODERN LUXURY CARD SHAPE */}
                  <div className="relative bg-white rounded-3xl border border-[#F7D6DF] shadow-sm p-6 sm:p-10 pb-16 text-center space-y-4 transition-all duration-300 hover:shadow-pink-glow">
                    
                    {/* Client Name */}
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#9E3F5C] tracking-tight">
                      {item.name}
                    </h3>

                    {/* Role & Location Subtitle */}
                    <p className="font-sans text-xs sm:text-sm font-medium text-[#5A4B50]">
                      {item.role}
                    </p>

                    {/* Decorative Gold Accent Line */}
                    <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2"></div>

                    {/* Review Quote Body */}
                    <p className="font-sans text-xs sm:text-sm lg:text-base text-[#2B2225] font-normal leading-relaxed italic max-w-md mx-auto px-1 sm:px-4">
                      "{item.quote}"
                    </p>

                    {/* BOTTOM OVERLAPPING AVATAR BUBBLE & STAR RATING PILL */}
                    <div className="absolute -bottom-11 sm:-bottom-13 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                      
                      {/* Avatar Image Bubble */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#9E3F5C] text-white flex items-center justify-center p-0.5 transform transition-transform duration-300 hover:scale-105">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      {/* Verified Client Badge Pill */}
                      <div className="mt-1 px-4 py-1 rounded-full bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow flex items-center justify-center text-[10px] font-bold tracking-wider uppercase border border-white/60">
                        <span>Verified Client</span>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* BOTTOM PAGINATION DOTS */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 h-2.5 bg-[#9E3F5C] rounded-full shadow-xs'
                  : 'w-2.5 h-2.5 bg-[#F7D6DF] hover:bg-[#9E3F5C]/60 rounded-full'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
