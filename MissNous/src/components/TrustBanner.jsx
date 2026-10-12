import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Heart, Sparkles, Droplet } from 'lucide-react';

function CounterNumber({ endValue, decimalPlaces = 0, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1400; // ms
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

  return (
    <span ref={ref}>
      {prefix}
      {decimalPlaces > 0 ? count.toFixed(decimalPlaces) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function TrustBanner() {
  const trustItems = [
    {
      id: 'happy-customers',
      endValue: 500,
      prefix: '',
      suffix: '+',
      decimalPlaces: 0,
      label: 'Happy Customers',
      icon: Heart
    },
    {
      id: 'water-based-formula',
      endValue: 100,
      prefix: '',
      suffix: '%',
      decimalPlaces: 0,
      label: 'Water-Based Formula',
      icon: Droplet
    },
    {
      id: 'ph-balanced',
      endValue: 4.5,
      prefix: 'pH ',
      suffix: '',
      decimalPlaces: 1,
      label: 'Balanced for Comfort',
      icon: ShieldCheck
    },
    {
      id: 'fruit-flavors',
      endValue: 2,
      prefix: '',
      suffix: '',
      decimalPlaces: 0,
      label: 'Fruit-Inspired Flavors',
      icon: Sparkles
    }
  ];

  return (
    <section className="relative w-full max-w-full bg-gradient-to-r from-[#9E3F5C] via-[#B84A6B] to-[#9E3F5C] border-y border-[#D96B8A]/40 py-2.5 sm:py-6 lg:py-8 px-1.5 sm:px-8 lg:px-16 shadow-pink-glow z-10 overflow-hidden">
      
      {/* Decorative ambient gold shimmer lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/60 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/60 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto reveal-up">
        <div className="grid grid-cols-4 gap-0.5 sm:gap-4 lg:gap-0 divide-x divide-[#D96B8A]/30 lg:divide-[#D96B8A]/40">
          
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1 sm:gap-3 lg:gap-4 px-0.5 sm:px-4 lg:px-8 py-1 sm:py-2 group hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-300"
              >
                {/* Golden Badge Icon */}
                <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-white/15 border border-[#D4AF6A]/50 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:border-[#E8D3A5] group-hover:bg-white/25 transition-all duration-300">
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#E8D3A5]" />
                </div>

                {/* Animated Golden Counter & Concise Label */}
                <div className="space-y-0 sm:space-y-0.5 min-w-0">
                  <div className="font-sans text-xs sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#E8D3A5] gold-gradient-text drop-shadow-xs leading-none sm:leading-tight">
                    <CounterNumber 
                      endValue={item.endValue} 
                      decimalPlaces={item.decimalPlaces} 
                      prefix={item.prefix}
                      suffix={item.suffix} 
                    />
                  </div>
                  <span className="block font-sans text-[8px] xs:text-[9px] sm:text-xs lg:text-sm font-semibold tracking-tight sm:tracking-wide uppercase text-[#FFF9F5]/90 leading-tight">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </section>
  );
}
