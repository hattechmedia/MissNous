import React from 'react';
import { ArrowLeft, Home, ShoppingBag, Search } from 'lucide-react';

export default function NotFoundPage({ onNavigate, onOpenSearch }) {
  return (
    <div className="min-h-[85vh] bg-[#FDF2F5] flex items-center justify-center py-20 px-4 sm:px-8 font-sans">
      <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-8 sm:p-14 max-w-xl w-full text-center space-y-6 animate-fade-up">
        
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold uppercase tracking-[0.2em]">
          <span>404 Error</span>
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
          Page Not Found
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#5A4B50] leading-relaxed max-w-md mx-auto">
          The page you are looking for does not exist, may have been relocated, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('shop')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#9E3F5C]" />
            <span>Explore Boutique</span>
          </button>
        </div>

        {onOpenSearch && (
          <div className="pt-2 border-t border-[#F7D6DF]/60">
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E3F5C] hover:underline cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Looking for something specific? Search products</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
