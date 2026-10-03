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
      question: "What is Miss Nous made from?",
      answer: "Our lubricant is water-based and built around organic botanicals, with a light preservative system to keep it fresh. We skip heavy, sticky fillers, and you can find the full ingredient list on each product page."
    },
    {
      question: "How and when should I use it?",
      answer: "Apply a small amount externally whenever you want added comfort. Because it is gentle and pH-balanced, it suits both daily and occasional use. For external use. Avoid contact with eyes."
    },
    {
      question: "Is it safe to taste or swallow?",
      answer: "No. Miss Nous is made for external use only and is not meant to be swallowed. The fruit-inspired flavor is there for scent and experience, not for eating, so please do not ingest it and keep it away from the eyes."
    },
    {
      question: "How much should I use?",
      answer: "A little goes a long way with a water-based formula, so start small and add more only if you need it."
    },
    {
      question: "Is it safe for sensitive skin?",
      answer: "Every formula is pH-balanced and made to be gentle on sensitive skin. If your skin reacts easily, do a small patch test first and stop use if any irritation occurs."
    },
    {
      question: "Can I use it with other products?",
      answer: "Our water-based formula is generally fine to pair with other intimate care products. Check the specific product page for any guidance that applies to that item."
    },
    {
      question: "Is it safe to use with condoms and toys?",
      answer: "Yes. Because Miss Nous is water-based, it works safely with latex condoms and with silicone toys, unlike oil-based or silicone-based lubricants. It also rinses off both easily with water."
    },
    {
      question: "What does pH-balanced mean, and why does it matter?",
      answer: "A pH-balanced formula is set to a level that feels natural and comfortable for the body, which helps reduce the risk of irritation compared with products that are not calibrated this way."
    },
    {
      question: "How should I store it?",
      answer: "Keep the bottle in a cool, dry place out of direct sunlight, with the cap closed tightly after each use. Keep it away from heat, sparks and open flames, and store it apart from food containers."
    },
    {
      question: "What flavors and sizes does it come in?",
      answer: "Two fruit-inspired flavors, pineapple and strawberry, each available in 100g and 220g."
    },
    {
      question: "What is your return policy?",
      answer: "Visit our returns page for full details on how returns and exchanges work."
    }
  ];

  return (
    <section className="relative bg-[#FDF2F5] py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#F7D6DF]">
      
      {/* Background Decorative Accent Shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F7D6DF]/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8D3A5]/30 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F7D6DF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              FAQ and Care Guide
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] leading-[1.2] tracking-tight">
            Frequently Asked Questions About Our Organic Lubricant
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
            Choosing the right intimate lubricant should feel easy, so we answered the questions we hear most below.
          </p>
        </div>

        {/* 2-Column Grid Layout: 35% Image / 65% FAQ Accordion Split with Equal Height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: ~35% Width Product Image matching exact right column height */}
          <div className="lg:col-span-4 flex flex-col reveal-left h-full">
            <div className="relative rounded-3xl overflow-hidden border border-[#F7D6DF] shadow-luxury bg-white group h-full flex-1 min-h-[350px] sm:min-h-[420px] lg:min-h-0">
              <img 
                src={image6} 
                alt="Miss Nous Organic Lubricant Care Guide" 
                className="w-full h-full lg:absolute lg:inset-0 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/45 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#F7D6DF] shadow-md flex items-center gap-2.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center flex-shrink-0 text-[#9E3F5C]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-semibold text-[#2B2225] leading-tight">
                    Pure Organic Lubricant
                  </h4>
                  <p className="font-sans text-[11px] text-[#9E3F5C] font-medium">
                    100% Certified Formula
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~65% Width FAQ Accordion */}
          <div className="lg:col-span-8 flex flex-col space-y-3 reveal-right h-full justify-between">
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
                    className="w-full px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4 text-left font-sans focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                      isOpen ? 'text-[#9E3F5C]' : 'text-[#2B2225]'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#FDF2F5] text-[#9E3F5C] rotate-180' : 'bg-white text-[#5A4B50] border border-[#F7D6DF]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Answer */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 border-t border-[#F7D6DF]/40 animate-fade-up">
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
