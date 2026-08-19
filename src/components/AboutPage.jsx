import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Leaf, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import image4 from '../assets/image-4.jpeg';
import image7 from '../assets/image-7.jpeg';
import image8 from '../assets/image-8.png';
import image9 from '../assets/image-9.png';

export default function AboutPage({ onNavigate }) {
  const section3Ref = useRef(null);
  const [isSection3Visible, setIsSection3Visible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSection3Visible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (section3Ref.current) {
      observer.observe(section3Ref.current);
    }

    return () => {
      if (section3Ref.current) {
        observer.unobserve(section3Ref.current);
      }
    };
  }, []);

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      
      {/* 1. INNER PAGE HERO WITH IMAGE-4 AS BACKGROUND */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">
        
        {/* Background Image image-4 with Lighter Opacity Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image4} 
            alt="Miss Nous About Us Header" 
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/60 via-[#2B2225]/25 to-[#2B2225]/40"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6 reveal-up">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              About Us
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            Designed for Your Everyday Wellness
          </h1>

          {/* Short Intro Paragraph */}
          <p className="font-sans text-base sm:text-lg text-[#FFF9F5] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            At Miss Nous, we believe intimate wellness should be celebrated with the same elegance, care, and quality as luxury skincare.
          </p>

        </div>
      </section>

      {/* 2. BRAND INTRODUCTION / OUR STORY WITH IMAGE-7 ON LEFT */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: image-7.jpeg from assets */}
          <div className="lg:col-span-6 relative reveal-left">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#F7D6DF] shadow-luxury bg-white aspect-square sm:aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center">
              <img 
                src={image7} 
                alt="Miss Nous Botanical Science" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-[#F7D6DF] shadow-md">
                <span className="text-xs font-semibold text-[#9E3F5C] font-sans">
                  Organic Botanical Science • Paris
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left reveal-right">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Our Story
              </span>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
              Crafted with Pure Intention and Botanical Care
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
              Founded in Paris, Miss Nous was created with a clear mission: to elevate daily intimate care into a graceful, nourishing ritual. We noticed that intimate wellness products often lacked the refined formulation and aesthetics of high-end beauty skincare.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
              Every formula is precisely calibrated to a pH 4.5 balance, blending pure organic aloe vera, natural fruit extracts, and plant-derived hyaluronic acid. We prioritize body harmony and absolute confidence in every drop.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
              Gentle yet effective, our products seamlessly integrate into your daily lifestyle while supporting long-term skin health.
            </p>

          </div>

        </div>
      </section>

      {/* 3. OUR APPROACH / OUR VALUES - SCROLL-TRIGGERED ANIMATED STAGE */}
      <section ref={section3Ref} className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-b border-[#F7D6DF]/60 relative overflow-hidden">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#F7D6DF]/35 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-10 sm:space-y-14">
          
          {/* Section Header */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Our Approach
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight leading-[1.18]">
              OUR APPROACH <br />
              to personalised beauty
            </h2>
          </div>

          {/* Master Stage Container - Responsive Grid on Mobile/Tablet, Floating Stage on Desktop */}
          <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:block items-center justify-center min-h-0 lg:min-h-[600px]">
            
            {/* 1. CENTRAL TILTED OVAL IMAGE */}
            <div className="relative z-10 w-[220px] h-[360px] sm:w-[280px] sm:h-[460px] lg:w-[350px] lg:h-[580px] rounded-full border-4 border-white shadow-2xl overflow-hidden transform -rotate-[12deg] lg:-rotate-[22deg] bg-white flex-shrink-0 mx-auto my-4 lg:my-0 lg:-mt-6">
              <img 
                src={image9} 
                alt="Miss Nous Personalised Beauty" 
                className="w-full h-full object-cover object-center scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* 2. APPROACH CARDS & CTA BUTTON */}
            {/* Mobile/Tablet Grid (< lg) vs Desktop Absolute Floating Stage (lg+) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:block gap-4 sm:gap-6 lg:gap-0 mt-6 lg:mt-0 lg:absolute lg:inset-0 z-20 pointer-events-none">
              
              {/* Box 1: Top Right */}
              <div className={`pointer-events-auto lg:absolute lg:-top-4 lg:right-[18%] z-20 bg-white/95 backdrop-blur-md border border-[#F7D6DF] sm:border-white/80 p-5 rounded-2xl shadow-luxury text-center space-y-2 w-full lg:w-[210px] hover:scale-105 transition-all duration-300 ${isSection3Visible ? 'animate-card-top-right' : 'opacity-100 lg:opacity-0'}`}>
                <div className="w-11 h-11 rounded-full bg-[#FFF9F5] text-[#D4AF6A] border border-[#E8D3A5] shadow-xs mx-auto flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#2B2225] leading-snug">
                  Thoughtfully Crafted
                </h3>
                <p className="font-sans text-[11px] text-[#5A4B50] font-normal leading-snug">
                  Precision pH 4.5 calibration to respect natural flora.
                </p>
              </div>

              {/* Box 2: Middle Left */}
              <div className={`pointer-events-auto lg:absolute lg:top-[28%] lg:left-[6%] z-20 bg-white/95 backdrop-blur-md border border-[#F7D6DF] sm:border-white/80 p-5 rounded-2xl shadow-luxury text-center space-y-2 w-full lg:w-[210px] hover:scale-105 transition-all duration-300 ${isSection3Visible ? 'animate-card-left' : 'opacity-100 lg:opacity-0'}`}>
                <div className="w-11 h-11 rounded-full bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] shadow-xs mx-auto flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#2B2225] leading-snug">
                  Quality First
                </h3>
                <p className="font-sans text-[11px] text-[#5A4B50] font-normal leading-snug">
                  100% organic, dermatologically tested botanicals.
                </p>
              </div>

              {/* Box 3: Middle Right */}
              <div className={`pointer-events-auto lg:absolute lg:top-[32%] lg:right-[6%] z-20 bg-white/95 backdrop-blur-md border border-[#F7D6DF] sm:border-white/80 p-5 rounded-2xl shadow-luxury text-center space-y-2 w-full lg:w-[210px] hover:scale-105 transition-all duration-300 ${isSection3Visible ? 'animate-card-right' : 'opacity-100 lg:opacity-0'}`}>
                <div className="w-11 h-11 rounded-full bg-[#FFF9F5] text-[#D4AF6A] border border-[#E8D3A5] shadow-xs mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#2B2225] leading-snug">
                  Customer Trust
                </h3>
                <p className="font-sans text-[11px] text-[#5A4B50] font-normal leading-snug">
                  Discreet luxury packaging and 30-day guarantee.
                </p>
              </div>

              {/* Box 4: Bottom Left */}
              <div className={`pointer-events-auto lg:absolute lg:-bottom-2 lg:left-[20%] z-20 bg-white/95 backdrop-blur-md border border-[#F7D6DF] sm:border-white/80 p-5 rounded-2xl shadow-luxury text-center space-y-2 w-full lg:w-[210px] hover:scale-105 transition-all duration-300 ${isSection3Visible ? 'animate-card-bottom-left' : 'opacity-100 lg:opacity-0'}`}>
                <div className="w-11 h-11 rounded-full bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] shadow-xs mx-auto flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#2B2225] leading-snug">
                  Comfort & Care
                </h3>
                <p className="font-sans text-[11px] text-[#5A4B50] font-normal leading-snug">
                  Silky, non-sticky textures designed for pure daily comfort.
                </p>
              </div>

              {/* Circle CTA Button */}
              <div className={`pointer-events-auto lg:absolute lg:-bottom-2 lg:right-[18%] z-30 col-span-1 sm:col-span-2 flex justify-center mt-4 lg:mt-0 ${isSection3Visible ? 'animate-button-pop' : 'opacity-100 lg:opacity-0'}`}>
                <button
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] border-4 border-white shadow-pink-glow flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform hover:scale-110 group cursor-pointer"
                >
                  <span className="font-sans text-xs font-bold uppercase tracking-wider leading-tight">Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 mt-1 text-[#FFF9F5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center space-y-12">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Why Miss Nous
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight">
              The Difference of Pure Botanical Care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left items-stretch">
            
            {/* Card 1: Featured Image (image-8.png) */}
            <div className="bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 overflow-hidden group min-h-[260px] flex items-center justify-center p-2">
              <img 
                src={image8} 
                alt="Miss Nous Pure Botanical Care" 
                className="w-full h-full object-cover rounded-tl-[3rem] rounded-tr-xl rounded-br-xl rounded-bl-xl group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Card 2: Selected Botanicals */}
            <div className="p-6 sm:p-7 bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 flex flex-col justify-between space-y-5 relative overflow-hidden group">
              {/* Top Row: Icon + Big Stylish Number Badge */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center border border-[#F7D6DF]">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold font-mono text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-1 rounded-full border border-[#F7D6DF]">01</span>
              </div>

              {/* Middle: Enhanced Heading & Description */}
              <div className="space-y-2">
                <h4 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Selected Botanicals
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                  Free from parabens, synthetic dyes, harsh chemicals, and artificial preservatives. 100% organic botanicals.
                </p>
              </div>

              {/* Bottom: Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F7D6DF]/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F7D6DF]">
                  <CheckCircle2 className="w-3 h-3 text-[#9E3F5C]" />
                  <span>100% Organic</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F7D6DF]">
                  <CheckCircle2 className="w-3 h-3 text-[#9E3F5C]" />
                  <span>Paraben Free</span>
                </span>
              </div>
            </div>

            {/* Card 3: Elegant Experience */}
            <div className="p-6 sm:p-7 bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-gold-glow transition-all duration-500 flex flex-col justify-between space-y-5 relative overflow-hidden group">
              {/* Top Row: Icon + Big Stylish Number Badge */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9F5] text-[#D4AF6A] flex items-center justify-center border border-[#E8D3A5]">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold font-mono text-[#B88A3B] bg-[#FFF9F5] px-2.5 py-1 rounded-full border border-[#E8D3A5]">02</span>
              </div>

              {/* Middle: Enhanced Heading & Description */}
              <div className="space-y-2">
                <h4 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Elegant Experience
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                  Silky skin feel that honors your body's natural harmony, pH 4.5 balance, and daily wellness rituals.
                </p>
              </div>

              {/* Bottom: Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F7D6DF]/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B88A3B] bg-[#FFF9F5] px-2.5 py-0.5 rounded-full border border-[#E8D3A5]">
                  <CheckCircle2 className="w-3 h-3 text-[#D4AF6A]" />
                  <span>pH 4.5 Balanced</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B88A3B] bg-[#FFF9F5] px-2.5 py-0.5 rounded-full border border-[#E8D3A5]">
                  <CheckCircle2 className="w-3 h-3 text-[#D4AF6A]" />
                  <span>Silky Touch</span>
                </span>
              </div>
            </div>

            {/* Card 4: Customer First */}
            <div className="p-6 sm:p-7 bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 flex flex-col justify-between space-y-5 relative overflow-hidden group">
              {/* Top Row: Icon + Big Stylish Number Badge */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center border border-[#F7D6DF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold font-mono text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-1 rounded-full border border-[#F7D6DF]">03</span>
              </div>

              {/* Middle: Enhanced Heading & Description */}
              <div className="space-y-2">
                <h4 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Customer First
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                  Complimentary express shipping and unbranded, discreet luxury delivery straight to your doorstep.
                </p>
              </div>

              {/* Bottom: Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F7D6DF]/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F7D6DF]">
                  <CheckCircle2 className="w-3 h-3 text-[#9E3F5C]" />
                  <span>Discreet Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F7D6DF]">
                  <CheckCircle2 className="w-3 h-3 text-[#9E3F5C]" />
                  <span>Express Shipping</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CLOSING CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
            Discover Something Made With Care.
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-xl mx-auto">
            Explore our organic intimate lubricants and hydrating facial serums formulated for everyday elegance.
          </p>

          <div className="pt-2">
            <button 
              onClick={() => onNavigate && onNavigate('shop')}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 gap-2"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
