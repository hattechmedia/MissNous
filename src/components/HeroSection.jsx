import React, { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import video2 from '../assets/video-2.mp4';

import { PRODUCTS } from '../data/products';

export default function HeroSection({ onNavigate }) {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start time set to 3.8s to skip initial product frame & resolution shift
    const START_TIME = 3.8;

    const handleLoadedMetadata = () => {
      if (video.currentTime < START_TIME) {
        video.currentTime = START_TIME;
      }
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= START_TIME) {
        if (!isVideoReady) setIsVideoReady(true);
      } else {
        video.currentTime = START_TIME;
      }
      if (video.duration && video.currentTime >= video.duration - 0.4) {
        video.currentTime = START_TIME;
      }
    };

    const handleEnded = () => {
      video.currentTime = START_TIME;
      video.play().catch(() => {});
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (video.currentTime >= START_TIME) {
      setIsVideoReady(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVideoReady]);

  return (
    <section className="relative overflow-hidden bg-[#2B2225] min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 flex items-center justify-center px-4 sm:px-8 lg:px-16 border-b border-[#F7D6DF]/60">
      
      {/* Background Video Animation Extending Behind Navbar with Seamless Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#2B2225]">
        <video 
          ref={videoRef}
          src={video2}
          autoPlay 
          muted 
          playsInline 
          className={`w-full h-full object-cover object-center scale-[1.05] transition-opacity duration-500 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle Dark Overlay for optimal text readability */}
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Floating Ambient Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#D4AF6A]/20 rounded-full blur-[140px] pointer-events-none z-5"></div>

      {/* Text Content Overlay on top of Background Video */}
      <div className="max-w-4xl mx-auto w-full text-center relative z-10 space-y-6 reveal-up">
        
        {/* Subtitle Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
            100% Organic Beauty & Care
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sans text-4xl sm:text-5xl lg:text-7xl font-medium text-[#FFF9F5] tracking-tight leading-[1.12] drop-shadow-md">
          Healthy skin starts with natural care.
        </h1>

        {/* Description Paragraph */}
        <p className="font-sans text-base sm:text-lg text-[#FFF9F5] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
          Discover our 100% organic skincare line made with natural botanicals to hydrate, repair, and protect your skin every day.
        </p>

        {/* Buy Now CTA Button -> Links to Shop Page */}
        <div className="pt-4">
          <button 
            onClick={() => onNavigate && onNavigate('shop')}
            className="inline-flex items-center justify-center px-10 py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-1"
          >
            Buy Now
          </button>
        </div>

      </div>

    </section>
  );
}
