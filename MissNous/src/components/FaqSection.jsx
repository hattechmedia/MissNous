import React, { useState } from 'react';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import image6 from '../assets/image-6.jpeg';

export default function FaqSection() {
  // State to track which FAQ item is currently expanded (defaulting to the first item)
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqs = [
    {
      question: "What skin types is Miss Nous Hydrating Serum suitable for?",
      answer: "Miss Nous Hydrating Serum is dermatologically formulated to be gentle and effective across all skin types—including dry, oily, combination, sensitive, and mature skin."
    },
    {
      question: "How and when should I apply the serum?",
      answer: "Apply 3 to 4 drops to clean, slightly damp skin twice daily (morning and evening). Gently press and smooth across your face and neck until fully absorbed before applying moisturizer."
    },
    {
      question: "Is the serum safe for sensitive or reactive skin?",
      answer: "Yes, absolutely. Our formula is 100% organic, pH-calibrated, and dermatologically tested. It is free from harsh sulfates, parabens, and synthetic irritants."
    },
    {
      question: "Can I use this serum alongside other skincare products?",
      answer: "Yes. Miss Nous serum layers effortlessly beneath your favorite moisturizers, SPF, or makeup. For best absorption, apply after cleansing and before heavier creams."
    },
    {
      question: "When can I expect to see visible skin improvements?",
      answer: "You will feel instant hydration and skin softness after the very first application. Noticeable improvements in skin texture, radiance, and barrier softness typically appear within 7 to 14 days of consistent daily use."
    },
    {
      question: "How should I store the serum to preserve botanical potency?",
      answer: "Store your serum bottle in a cool, dry place away from direct sunlight. Ensure the cap is tightly closed after each daily routine."
    },
    {
      question: "What is your return or satisfaction policy?",
      answer: "We stand by our skincare quality with a 30-day hassle-free satisfaction guarantee. If you are not delighted with your results, contact our support team for a swift refund or replacement."
    }
  ];

  return (
    <section id="faq" className="relative bg-[#FDF2F5] py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#F7D6DF] scroll-mt-24">
      
      {/* Background Decorative Accent Shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F7D6DF]/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8D3A5]/30 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F7D6DF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              FAQ & Care Guide
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our organic skincare formulations, application tips, and daily routines.
          </p>
        </div>

        {/* 2-Column Grid Layout: 35% Image / 65% FAQ Accordion Split with Equal Height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: ~35% Width Product Image matching exact right column height */}
          <div className="lg:col-span-4 flex flex-col reveal-left h-full">
            <div className="relative rounded-3xl overflow-hidden border border-[#F7D6DF] shadow-luxury bg-white group h-full flex-1 min-h-[350px] sm:min-h-[420px] lg:min-h-0">
              <img 
                src={image6} 
                alt="Miss Nous Skincare Product" 
                className="w-full h-full lg:absolute lg:inset-0 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/45 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#F7D6DF] shadow-md flex items-center gap-2.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center flex-shrink-0 text-[#9E3F5C]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-sans text-xs font-semibold text-[#2B2225] leading-tight">
                    Pure Organic Lubricant
                  </span>
                  <p className="font-sans text-[11px] text-[#9E3F5C] font-medium">
                    100% Certified Formula
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~65% Width FAQ Accordion */}
          <div className="lg:col-span-8 flex flex-col space-y-3.5 reveal-right h-full justify-between">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-[#9E3F5C]/40 shadow-pink-glow' 
                      : 'bg-[#FFF9F5] border-[#F7D6DF] hover:border-[#9E3F5C]/30 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left font-sans focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                      isOpen ? 'text-[#9E3F5C]' : 'text-[#2B2225]'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#FDF2F5] text-[#9E3F5C] rotate-180' : 'bg-white text-[#5A4B50] border border-[#F7D6DF]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Answer */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-[#F7D6DF]/40 animate-fade-up">
                      <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
}
