import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Leaf, Lock, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import img1 from '../assets/img-1.jpg';
import img2 from '../assets/img-2.jpg';
import image4 from '../assets/image-4.jpeg';
import image7 from '../assets/image-7.jpeg';
import image8 from '../assets/image-8.png';
import image9 from '../assets/image-9.png';
import image10 from '../assets/Imagr-10.png';
import image11 from '../assets/image-11.png';
import image12 from '../assets/image-12.jpeg';
import image13 from '../assets/image-13.jpeg';
import image15 from '../assets/image-15.png';
import image16 from '../assets/image-16.png';
import product1 from '../assets/product-1-rm.png';
import OrbitImages from './OrbitImages';

function CounterNumber({ endValue, decimalPlaces = 0, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1400;
        const steps = 45;
        const stepTime = duration / steps;
        const increment = endValue / steps;

        timer = setInterval(() => {
          start += increment;
          if (start >= endValue) {
            setCount(endValue);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, stepTime);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
    };
  }, [endValue]);

  const formattedCount = decimalPlaces > 0 ? count.toFixed(decimalPlaces) : Math.floor(count);

  return (
    <span ref={ref}>
      {formattedCount}{suffix}
    </span>
  );
}

function ApproachOrbitCard({ icon: Icon, title, subtitle, details, colorClass, bgClass, onHoverChange }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  return (
    <div 
      className="relative pointer-events-auto group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Moving Orbit Icon Badge - Full natural width & padding so text is never clipped */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-white/98 backdrop-blur-md border border-[#F7D6DF] rounded-2xl shadow-luxury flex items-center gap-3 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-pink-glow z-30 min-w-max whitespace-nowrap">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${bgClass || 'bg-[#FDF2F5]'} ${colorClass || 'text-[#9E3F5C]'} flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]`}>
          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </div>
        <div className="text-left whitespace-nowrap">
          <h4 className="font-sans text-sm sm:text-base font-bold text-[#2B2225] leading-tight group-hover:text-[#9E3F5C] transition-colors">
            {title}
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-medium leading-tight">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Popover Details Card on Hover */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 sm:w-64 p-4 bg-white/98 backdrop-blur-xl border border-[#F7D6DF] rounded-2xl shadow-2xl z-50 animate-fade-up pointer-events-none whitespace-normal">
          <div className="flex items-center gap-2 mb-1.5 border-b border-[#F7D6DF]/60 pb-1.5">
            <Icon className="w-4 h-4 text-[#9E3F5C]" />
            <h5 className="font-sans text-xs font-bold text-[#2B2225] uppercase tracking-wider">{title}</h5>
          </div>
          <p className="font-sans text-xs text-[#5A4B50] leading-relaxed font-normal">
            {details}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-sm"></div>
        </div>
      )}
    </div>
  );
}

function ApproachOrbitStage({ onNavigate }) {
  const [isPaused, setIsPaused] = useState(false);

  const approachItems = [
    {
      icon: Leaf,
      title: "Thoughtfully Crafted",
      subtitle: "pH 4.5 Botanical Formula",
      details: "Precision pH 4.5 calibration formulated to respect natural flora and maintain skin balance.",
      colorClass: "text-[#9E3F5C]",
      bgClass: "bg-[#FDF2F5]"
    },
    {
      icon: Award,
      title: "Quality First",
      subtitle: "100% Organic Extracts",
      details: "100% organic, dermatologically tested botanicals free from parabens or synthetic dyes.",
      colorClass: "text-[#D4AF6A]",
      bgClass: "bg-[#FFF9F5]"
    },
    {
      icon: ShieldCheck,
      title: "Customer Trust",
      subtitle: "30-Day Guarantee",
      details: "Discreet luxury packaging with a 30-day hassle-free satisfaction guarantee.",
      colorClass: "text-[#9E3F5C]",
      bgClass: "bg-[#FDF2F5]"
    },
    {
      icon: Heart,
      title: "Comfort & Care",
      subtitle: "Silky Non-Sticky Texture",
      details: "Lightweight, silky textures designed for instant absorption and daily skin comfort.",
      colorClass: "text-[#D4AF6A]",
      bgClass: "bg-[#FFF9F5]"
    },
    {
      icon: Sparkles,
      title: "Pure Integrity",
      subtitle: "Natural Essential Oils",
      details: "Nourishes skin with pure plant-based essential extracts for long-lasting health & radiance.",
      colorClass: "text-[#9E3F5C]",
      bgClass: "bg-[#FDF2F5]"
    }
  ];

  const customOrbitItems = approachItems.map((item, idx) => (
    <ApproachOrbitCard
      key={idx}
      {...item}
      onHoverChange={(hovered) => setIsPaused(hovered)}
    />
  ));

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center space-y-2 sm:space-y-3">
      <div className="relative w-full flex items-center justify-center">
        <OrbitImages
          items={customOrbitItems}
          shape="ellipse"
          baseWidth={1200}
          radiusX={440}
          radiusY={200}
          rotation={-4}
          duration={35}
          itemSize={240}
          responsive={true}
          aspectRatio="1200 / 580"
          showPath={true}
          pathColor="rgba(247, 214, 223, 0.7)"
          pathWidth={2}
          paused={isPaused}
          centerContent={
            <div className="relative group flex items-center justify-center pointer-events-auto">
              {/* Soft luxury gold & rose blur glow behind transparent bottle */}
              <div className="absolute inset-0 m-auto w-[340px] h-[340px] bg-[#D4AF6A]/25 rounded-full blur-[50px] pointer-events-none"></div>
              <div className="absolute inset-0 m-auto w-[280px] h-[280px] bg-[#9E3F5C]/15 rounded-full blur-[40px] pointer-events-none"></div>

              {/* Pure product bottle - Significantly enlarged size (330px height inside 400px vertical diameter ellipse) */}
              <img
                src={image16}
                alt="Miss Nous Personalised Beauty Bottle"
                className="relative z-10 h-[330px] w-auto object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          }
        />
      </div>

      {/* CTA Button placed below Orbit Stage */}
      <div className="pt-6 sm:pt-8 text-center relative z-30 pointer-events-auto">
        <button
          onClick={() => onNavigate && onNavigate('shop')}
          className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

export default function AboutPage({ onNavigate }) {
  const section3Ref = useRef(null);
  const [isSection3Visible, setIsSection3Visible] = useState(false);

  const showcaseRef = useRef(null);
  const [isShowcaseVisible, setIsShowcaseVisible] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsShowcaseVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => {
      if (showcaseRef.current) observer.unobserve(showcaseRef.current);
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

      {/* 3. OUR APPROACH / OUR VALUES - REACT BITS ORBIT IMAGES ANIMATED STAGE */}
      <section ref={section3Ref} className="py-8 sm:py-12 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-b border-[#F7D6DF]/60 relative overflow-hidden">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#F7D6DF]/35 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6 text-center">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Our Approach
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight leading-[1.18]">
              OUR APPROACH <br />
              to personalised beauty
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed max-w-xl mx-auto">
              Hover over the orbiting botanical pillars to explore how Miss Nous formulates each step for pure luxury & skin harmony.
            </p>
          </div>

          {/* Interactive React Bits OrbitImages Stage */}
          <ApproachOrbitStage onNavigate={onNavigate} />

        </div>
      </section>

      {/* 3.5 POPULAR RITUALS SHOWCASE SECTION (Right after Our Approach) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-b border-[#F7D6DF]/60 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            
            {/* LEFT COLUMN: 3 Vertically Stacked Animated Counter Lines (Slides in from Left) */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[460px] sm:min-h-[500px] reveal-left py-1 space-y-6">
              
              {/* Top Text Block */}
              <div className="space-y-3.5">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                  <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                    Bestseller Showcase
                  </span>
                </div>

                {/* Main Copy */}
                <h3 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
                  Shop our most popular products, trusted by beauty lovers everywhere.
                </h3>

                {/* Refined Description Paragraph */}
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                  Discover Miss Nous signature organic formulations, precisely crafted in Paris with natural botanicals to hydrate, repair, and protect your skin for long-lasting confidence.
                </p>
              </div>

              {/* 3 VERTICALLY STACKED ANIMATED COUNTER LINES (1 COUNTER PER LINE / ROW) */}
              <div className="space-y-3.5 py-4 border-y border-[#F7D6DF]/80">
                
                {/* Line 1: Counter 1 */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/90 border border-[#F7D6DF] shadow-xs group hover:shadow-pink-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-sans text-xl font-bold text-[#9E3F5C] leading-none">
                      <CounterNumber endValue={500} suffix="+" />
                    </div>
                    <div className="font-sans text-xs font-semibold text-[#2B2225] mt-1">
                      Happy Clients & Beauty Lovers
                    </div>
                  </div>
                </div>

                {/* Line 2: Counter 2 */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/90 border border-[#F7D6DF] shadow-xs group hover:shadow-gold-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#E8D3A5] flex items-center justify-center text-[#D4AF6A] shadow-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-sans text-xl font-bold text-[#2B2225] leading-none">
                      <CounterNumber endValue={100} decimalPlaces={0} suffix="%" />
                    </div>
                    <div className="font-sans text-xs font-semibold text-[#2B2225] mt-1">
                      Customer Satisfaction Rate
                    </div>
                  </div>
                </div>

                {/* Line 3: Counter 3 */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/90 border border-[#F7D6DF] shadow-xs group hover:shadow-pink-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-sans text-xl font-bold text-[#9E3F5C] leading-none">
                      <CounterNumber endValue={100} suffix="%" />
                    </div>
                    <div className="font-sans text-xs font-semibold text-[#2B2225] mt-1">
                      Organic Botanical Quality & Care
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA Pill Button matching Homepage Subscribe button style */}
              <div>
                <button
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#9E3F5C] via-[#D96B8A] to-[#9E3F5C] hover:brightness-110 text-[#FFF9F5] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>VIEW ALL PRODUCTS</span>
                </button>
              </div>

            </div>

            {/* MIDDLE COLUMN: Large Featured Product Card (image-12.jpeg) - Moves DOWN from TOP */}
            <div className="lg:col-span-5 flex flex-col reveal-down">
              <div className="relative rounded-none overflow-hidden shadow-luxury bg-white group h-full min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
                <img 
                  src={image12} 
                  alt="Miss Nous Bestselling Botanical Product" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-30 pointer-events-none"></div>
              </div>
            </div>

            {/* RIGHT COLUMN: image-13 moves DOWN from TOP, image-11 moves UP from BOTTOM */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full min-h-[460px] sm:min-h-[500px] justify-between">
              
              {/* Top Card: image-13.jpeg (38% Height) - Moves DOWN from TOP */}
              <div className="h-[38%] relative rounded-none overflow-hidden shadow-luxury bg-[#FDF2F5] group flex items-center justify-center reveal-down">
                <img 
                  src={image13} 
                  alt="Miss Nous Formula Bottle" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Card: image-11.png (Remaining Height) - Moves UP from BOTTOM */}
              <div className="flex-1 relative rounded-none overflow-hidden shadow-luxury bg-white group flex items-center justify-center reveal-up">
                <img 
                  src={image11} 
                  alt="Miss Nous Skincare Model" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
            
            {/* Card 1: Featured Image (image-15.png) */}
            <div className="bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 overflow-hidden group min-h-[260px] flex items-center justify-center p-2">
              <img 
                src={image15} 
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
