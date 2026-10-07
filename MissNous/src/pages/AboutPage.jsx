import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Leaf, Lock, ArrowRight, CheckCircle2, Star, Droplets, FileText } from 'lucide-react';
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
import OrbitImages from '../components/OrbitImages';

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
          <h3 className="font-sans text-sm sm:text-base font-bold text-[#2B2225] leading-tight group-hover:text-[#9E3F5C] transition-colors">
            {title}
          </h3>
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
      icon: Heart,
      title: "Comfort & Care",
      subtitle: "Silky Non-Sticky Texture",
      details: "Lightweight, silky textures designed for instant absorption and daily skin comfort.",
      colorClass: "text-[#9E3F5C]",
      bgClass: "bg-[#FDF2F5]"
    },
    {
      icon: Sparkles,
      title: "Pure Integrity",
      subtitle: "Natural Essential Oils",
      details: "Nourishes skin with pure plant-based essential extracts for long-lasting health & radiance.",
      colorClass: "text-[#D4AF6A]",
      bgClass: "bg-[#FFF9F5]"
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

              {/* Pure product bottle - Significantly enlarged size */}
              <img
                src="/gpt-11-rem.png"
                alt="Miss Nous Personalised Beauty Bottle"
                className="relative z-10 h-[330px] w-auto object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          }
        />
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-6 sm:pt-8 max-w-5xl mx-auto">
        {/* Card 1: Water-based formulas */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[170px]">
          <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3 pr-3 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
            <span className="font-sans font-bold text-xs tracking-wider">
              01
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
            <Droplets className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="mt-4 space-y-1.5">
            <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
              Water-based formulas
            </h3>
            <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
              Clean hydration crafted with water forming the primary base of every formula.
            </p>
          </div>
        </div>

        {/* Card 2: Clear ingredient information */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[170px]">
          <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3 pr-3 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
            <span className="font-sans font-bold text-xs tracking-wider">
              02
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="mt-4 space-y-1.5">
            <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
              Clear ingredient information
            </h3>
            <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
              Transparent breakdown of all ingredients so you always know what you apply.
            </p>
          </div>
        </div>

        {/* Card 3: Straightforward product choices */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[170px]">
          <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3 pr-3 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
            <span className="font-sans font-bold text-xs tracking-wider">
              03
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="mt-4 space-y-1.5">
            <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
              Straightforward product choices
            </h3>
            <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>
            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
              Simple, intuitive product options that remove guesswork from intimate care.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button placed below Orbit Stage */}
      <div className="pt-6 sm:pt-8 text-center relative z-30 pointer-events-auto">
        <button
          onClick={() => onNavigate && onNavigate('shop')}
          className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Explore Our Products</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

export default function AboutPage({ onNavigate, onViewProduct }) {
  // Page Meta Description for SEO without changing browser tab title
  useEffect(() => {
    let metaDesc = document.querySelector('meta[name="description"]');
    let created = false;
    let prevDesc = '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      created = true;
    } else {
      prevDesc = metaDesc.getAttribute('content') || '';
    }
    metaDesc.setAttribute(
      'content',
      'Learn about Miss Nous, our approach to water-based intimate lubricants, clear product information, and our Strawberry and Pineapple flavors.'
    );

    return () => {
      if (created) {
        metaDesc.remove();
      } else {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  const section3Ref = useRef(null);
  const [isSection3Visible, setIsSection3Visible] = useState(false);

  const showcaseRef = useRef(null);
  const [isShowcaseVisible, setIsShowcaseVisible] = useState(false);

  const handleShopStrawberry = () => {
    const strawberryProduct = {
      id: 'prod-1',
      _id: '6a9294e8f879ce3143960099',
      name: 'Miss Nous Strawberry Intimate Lubricant',
      subtitle: 'Flavored & Scented Intimate Lubricant (100ml)',
      category: 'Strawberry Intimate Care',
      categoryKey: 'strawberry-intimate-care',
      price: 31.99,
      originalPrice: 39.99,
      discount: '20% OFF',
      image: '/jpt-6.jpeg',
      images: ['/jpt-6.jpeg', '/gpt-2.png', '/gpt-14.png', '/gpt-1.png'],
      rating: 4.9,
      reviewsCount: 128,
      description: 'A colorful, water-based lubricant with a glycerin and propylene glycol base. 100ml size. Ships across the USA.'
    };
    try {
      localStorage.setItem('missnous_selected_product', JSON.stringify(strawberryProduct));
    } catch (e) { }
    if (onViewProduct) {
      onViewProduct(strawberryProduct);
    } else if (onNavigate) {
      onNavigate('product-detail');
    }
  };

  const handleShopPineapple = () => {
    const pineappleProduct = {
      id: 'prod-pineapple',
      _id: 'prod-pineapple',
      name: 'Miss Nous Pineapple Intimate Lubricant',
      subtitle: 'Flavored & Scented Intimate Lubricant (100ml)',
      category: 'Pineapple Intimate Care',
      categoryKey: 'pineapple-intimate-care',
      price: 31.99,
      originalPrice: 39.99,
      discount: '20% OFF',
      image: '/gpt-5.png',
      images: ['/gpt-5.png', '/gpt-7.jpeg', '/gpt-8.jpeg'],
      rating: 4.9,
      reviewsCount: 114,
      description: 'A silky, water-based lubricant with a light, fruit-inspired pineapple flavor. Set to a gentle pH so it stays comfortable on sensitive skin. 100ml size. Ships across the USA.'
    };
    try {
      localStorage.setItem('missnous_selected_product', JSON.stringify(pineappleProduct));
    } catch (e) { }
    if (onViewProduct) {
      onViewProduct(pineappleProduct);
    } else if (onNavigate) {
      onNavigate('product-detail');
    }
  };

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

        {/* Background Image /gpt-10.png with Lighter Opacity Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gpt-10.png"
            alt="Miss Nous About Us Header"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/60 via-[#2B2225]/25 to-[#2B2225]/40"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6 reveal-up">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Our Story
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            The Care Behind Miss Nous

          </h1>

          {/* Short Intro Paragraph */}
          <p className="font-sans text-base sm:text-lg text-[#FFF9F5] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Miss Nous was created with a simple idea: intimate care should feel comfortable, straightforward, and easy to understand.
            We focus on water-based intimate lubricants with clear product information and simple choices. Our current range includes two flavors, Strawberry and Pineapple, made for adults who want an uncomplicated addition to their personal care routine.

          </p>

        </div>
      </section>

      {/* 2. BRAND INTRODUCTION / OUR STORY WITH IMAGE-7 ON LEFT */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: image-7.jpeg from assets */}
          <div className="lg:col-span-6 relative reveal-left">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#F7D6DF] shadow-luxury bg-white aspect-square sm:aspect-[4/3] lg:aspect-[4/5.25] max-h-[535px] mx-auto flex items-center justify-center">
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
              Why We Started

            </h2>

            <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
              Shopping for intimate care can feel more complicated than it needs to be. Labels are not always easy to understand, product differences can be unclear, and finding the right option can quickly become confusing.
              Miss Nous was created to offer a simpler experience.
              We believe intimate care should come with straightforward information, products that are easy to understand, and choices that do not leave you guessing. That approach guides everything we want the Miss Nous brand to represent.

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
              Our Approach to Ingredients
            </h2>
            <div className="space-y-3 max-w-2xl mx-auto text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
              <p>
                We believe you should be able to understand what you are using on your body.
                <br />
                Our lubricants are water-based, with water forming the largest part of the documented formula. The available product documentation also provides information about the ingredients used in the formula.
              </p>
              <p>
                Rather than relying on complicated marketing language, we aim to make important product and ingredient information clear and easy to find.
              </p>
            </div>
          </div>

          {/* Interactive React Bits OrbitImages Stage */}
          <ApproachOrbitStage onNavigate={onNavigate} />

        </div>
      </section>

      {/* 3.5 POPULAR RITUALS SHOWCASE SECTION (Right after Our Approach) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-b border-[#F7D6DF]/60 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

            {/* LEFT COLUMN: Text Content & CTA (Slides in from Left) */}
            <div className="lg:col-span-4 flex flex-col justify-between reveal-left py-0.5">

              {/* Top Text Block */}
              <div className="space-y-4 sm:space-y-5">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                  <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                    Product Information
                  </span>
                </div>

                {/* Main Copy */}
                <h3 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
                  Product Information Matters to Us
                </h3>

                {/* Description Paragraphs with clean, spacious line-height */}
                <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                  <p>
                    Intimate care is personal, so knowing more about the product you choose matters.
                  </p>
                  <p>
                    The available safety documentation for the water-based lubricant includes information about its ingredients, handling, storage, transport, and other product characteristics. The document also states that the product is not classified as a hazardous chemical under the referenced GHS system.
                  </p>
                  <p>
                    Our goal is to make relevant product information easier to understand so customers can make more informed choices.
                  </p>
                </div>
              </div>

              {/* CTA Pill Button aligned to bottom */}
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#9E3F5C] via-[#D96B8A] to-[#9E3F5C] hover:brightness-110 text-[#FFF9F5] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>VIEW ALL PRODUCTS</span>
                </button>
              </div>

            </div>

            {/* MIDDLE COLUMN: Large Featured Product Card (/gpt-5.png) */}
            <div className="lg:col-span-5 flex flex-col h-[440px] sm:h-[470px] lg:h-[485px] reveal-down">
              <div className="relative rounded-none overflow-hidden shadow-luxury bg-white group h-full flex items-center justify-center">
                <img
                  src="/gpt-5.png"
                  alt="Miss Nous Bestselling Botanical Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-30 pointer-events-none"></div>
              </div>
            </div>

            {/* RIGHT COLUMN: image-13 and image-11 */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-[440px] sm:h-[470px] lg:h-[485px] justify-between">

              {/* Top Card: /gpt-7.jpeg */}
              <div className="h-[48%] relative rounded-none overflow-hidden shadow-luxury bg-[#FDF2F5] group flex items-center justify-center reveal-down">
                <img
                  src="/gpt-7.jpeg"
                  alt="Miss Nous Formula Bottle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Card: image-11.png */}
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

            {/* Card 1: Featured Image (/gpt-14.png) */}
            <div className="bg-white rounded-tl-[3.5rem] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all duration-500 overflow-hidden group min-h-[260px] flex items-center justify-center p-2">
              <img
                src="/gpt-14.png"
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
                <h3 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Selected Botanicals
                </h3>
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
                <h3 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Elegant Experience
                </h3>
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
                <h3 className="font-sans text-xl font-medium text-[#2B2225] leading-snug">
                  Customer First
                </h3>
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

      {/* 5. CLOSING CTA BANNER WITH ORGANIC FLOATING BLOB IMAGES (Fully Mobile Responsive) */}
      <section className="relative py-12 sm:py-20 lg:py-24 min-h-[340px] sm:min-h-[440px] px-4 sm:px-8 lg:px-16 bg-gradient-to-r from-[#9E3F5C] via-[#8C354E] to-[#7C2F47] text-center overflow-hidden border-t border-[#E8D3A5]/30 flex items-center justify-center">

        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] sm:w-[44rem] h-[16rem] sm:h-[22rem] bg-[#D4AF6A]/15 rounded-full blur-[90px] sm:blur-[110px] pointer-events-none"></div>

        {/* ORGANIC FLOATING BLOB IMAGES - RESPONSIVE SIZES FOR ALL DEVICES */}

        {/* Top-Left Organic Blob: /gpt-8.jpeg */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-6 lg:top-6 lg:left-10 w-16 h-12 sm:w-36 sm:h-28 lg:w-44 lg:h-34 rounded-[50%_50%_70%_30%/40%_60%_40%_60%] overflow-hidden border border-[#E8D3A5]/50 shadow-lg sm:shadow-2xl transition-transform duration-700 hover:scale-105 group z-0 opacity-75 sm:opacity-100">
          <img
            src="/gpt-8.jpeg"
            alt="Miss Nous Bestselling Formula"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Bottom-Left Organic Blob: /gpt-10.png */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-8 lg:bottom-6 lg:left-14 w-14 h-16 sm:w-32 sm:h-36 lg:w-40 lg:h-44 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] overflow-hidden border border-[#E8D3A5]/50 shadow-lg sm:shadow-2xl transition-transform duration-700 hover:scale-105 group z-0 opacity-75 sm:opacity-100">
          <img
            src="/gpt-10.png"
            alt="Miss Nous Skincare Ritual"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Top-Right Organic Blob: image11 */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-6 lg:top-6 lg:right-10 w-16 h-16 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] overflow-hidden border border-[#E8D3A5]/50 shadow-lg sm:shadow-2xl transition-transform duration-700 hover:scale-105 group z-0 opacity-75 sm:opacity-100">
          <img
            src={image11}
            alt="Miss Nous Beauty Model"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Bottom-Right Organic Blob: /gpt-14.png */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-8 lg:bottom-6 lg:right-14 w-14 h-14 sm:w-30 sm:h-30 lg:w-38 lg:h-38 rounded-[70%_30%_50%_50%/50%_30%_70%_50%] overflow-hidden border border-[#E8D3A5]/50 shadow-lg sm:shadow-2xl transition-transform duration-700 hover:scale-105 group z-0 opacity-75 sm:opacity-100">
          <img
            src="/gpt-14.png"
            alt="Miss Nous Botanical Care"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Center Content Box */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-5 my-auto text-center">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-[#E8D3A5]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
            <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#FFF9F5]">
              Our Promise
            </span>
          </div>

          {/* Main Heading / Statement */}
          <h2 className="font-sans text-xl sm:text-3xl lg:text-4xl font-medium text-[#FFF9F5] tracking-tight leading-snug sm:leading-[1.25] drop-shadow-md max-w-5xl mx-auto">
            As Miss Nous grows, we want to keep the <br className="hidden sm:inline" />
            same principles at the heart of the brand:
          </h2>

          {/* Points as Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-md text-[#FFF9F5] transition-all duration-300 transform hover:scale-105">
              <CheckCircle2 className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" />
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide">
                Clear information
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-md text-[#FFF9F5] transition-all duration-300 transform hover:scale-105">
              <CheckCircle2 className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" />
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide">
                Simple choices
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-md text-[#FFF9F5] transition-all duration-300 transform hover:scale-105">
              <Droplets className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" />
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide">
                Water-based intimate care
              </span>
            </div>
          </div>

          {/* Concluding Paragraph */}
          <p className="font-sans text-xs sm:text-sm lg:text-base text-[#F7D6DF] font-normal leading-relaxed max-w-xl mx-auto drop-shadow-sm pt-0.5">
            We believe a better customer experience starts with making products easier to understand and easier to choose.
          </p>

          {/* Center Pill Button */}
          <div className="pt-2 sm:pt-3">
            <button
              onClick={() => onNavigate && onNavigate('shop')}
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 bg-[#FFF9F5] hover:bg-[#E8D3A5] text-[#9E3F5C] hover:text-[#2B2225] font-sans text-xs sm:text-sm font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* 6. BRAND COUNTER & FEATURED IMAGE SECTION (Right below Discover Something Made With Care) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-b border-[#F7D6DF]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Who We Make This For */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left reveal-left">

              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Who We Make This For
                </span>
              </div>

              {/* Section Title */}
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.18] tracking-tight">
                Who We Make This For
              </h2>

              {/* Description Paragraphs */}
              <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed">
                <p>
                  Miss Nous is made for adults looking for a simple water-based intimate lubricant that can fit naturally into their routine.
                </p>
                <p>
                  We keep our range focused so choosing between our products stays easy. Whether you prefer Strawberry or Pineapple, both options give you a flavored water-based lubricant without making the decision more complicated than it needs to be.
                </p>
              </div>

            </div>

            {/* Right Column: Featured Image (/gpt-12.png from public folder) */}
            <div className="lg:col-span-6 reveal-right flex items-center justify-center">
              <div className="relative w-full max-w-[540px] mx-auto group flex items-center justify-center">

                {/* Soft Luxury Glow behind image */}
                <div className="absolute inset-0 m-auto w-80 h-80 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none"></div>

                <img
                  src="/gpt-12.png"
                  alt="Miss Nous Botanical Product Care"
                  className="relative z-10 w-full h-auto max-h-[620px] object-contain rounded-[2rem] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. OUR FLAVORS PRODUCT CARDS SECTION (Strawberry & Pineapple) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-b border-[#F7D6DF]/60 relative overflow-hidden font-sans">

        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#F7D6DF]/30 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-10 sm:space-y-14 text-center">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5 reveal-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs w-fit mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Our Flavors
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight leading-[1.18]">
              Signature Water-Based Flavors
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed max-w-xl mx-auto">
              Designed for gentle hydration, easy cleaning, and familiar comfort — explore our signature intimate care formulas.
            </p>
          </div>

          {/* Two Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">

            {/* Product Card 1: Strawberry (jpt-6.jpeg) */}
            <div className="bg-white rounded-[2rem] border border-[#F7D6DF] shadow-luxury hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5 overflow-hidden flex flex-col group reveal-left">

              {/* Product Image Frame (Full bleed, no padding, no dividing line, no tags) */}
              <div
                onClick={handleShopStrawberry}
                className="relative w-full h-72 sm:h-84 overflow-hidden flex items-center justify-center cursor-pointer"
              >
                <img
                  src="/jpt-6.jpeg"
                  alt="Miss Nous Strawberry Intimate Lubricant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 text-left space-y-5">
                <div className="space-y-2.5">
                  <h3
                    onClick={handleShopStrawberry}
                    className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight group-hover:text-[#9E3F5C] transition-colors cursor-pointer"
                  >
                    Strawberry
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                    A strawberry-flavored water-based intimate lubricant for those who prefer a familiar, sweet flavor.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleShopStrawberry}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Shop Strawberry</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

            {/* Product Card 2: Pineapple (gpt-5.png) */}
            <div className="bg-white rounded-[2rem] border border-[#F7D6DF] shadow-luxury hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5 overflow-hidden flex flex-col group reveal-right">

              {/* Product Image Frame (Full bleed, no padding, no dividing line, no tags) */}
              <div
                onClick={handleShopPineapple}
                className="relative w-full h-72 sm:h-84 overflow-hidden flex items-center justify-center cursor-pointer"
              >
                <img
                  src="/gpt-5.png"
                  alt="Miss Nous Pineapple Intimate Lubricant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 text-left space-y-5">
                <div className="space-y-2.5">
                  <h3
                    onClick={handleShopPineapple}
                    className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight group-hover:text-[#9E3F5C] transition-colors cursor-pointer"
                  >
                    Pineapple
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                    A pineapple-flavored water-based intimate lubricant for those who prefer a tropical flavor.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleShopPineapple}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Shop Pineapple</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
