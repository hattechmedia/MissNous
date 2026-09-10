import React, { useRef } from 'react';
import { Sparkles, ShoppingBag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function FeaturedProductsSection({ onAddToCart, onToggleWishlist, wishlistItems = [], onNavigate, products = PRODUCTS, onViewProduct }) {
  const scrollContainerRef = useRef(null);

  const isWishlisted = (product) => {
    const pid = product?._id || product?.id;
    return wishlistItems.some(item => (item._id || item.id) === pid);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  const isCarouselMode = products.length >= 3;

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Centered Section Header with Navigation Arrows */}
        <div className="text-center max-w-2xl mx-auto space-y-3 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Bestsellers
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2225] tracking-tight">
            Flagship Organic Rituals
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
            Formulated in Paris with pure organic botanicals for gentle body harmony and daily radiance.
          </p>

          {/* Left / Right Arrow Controls when 3 or more products exist */}
          {isCarouselMode && (
            <div className="flex items-center justify-center gap-3 pt-3">
              <button 
                onClick={scrollLeft}
                className="w-11 h-11 rounded-full bg-white border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous products"
                title="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-11 h-11 rounded-full bg-white border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Next products"
                title="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Products Layout */}
        {isCarouselMode ? (
          /* Single Horizontal Row Carousel Slider when 3+ Products (Wide Centered Cards) */
          <div 
            ref={scrollContainerRef}
            className="flex items-stretch justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto scroll-smooth py-4 px-2 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div 
                key={product.id || product._id}
                className="w-[350px] sm:w-[500px] lg:w-[580px] max-w-full flex-shrink-0 bg-white rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-500 transform hover:-translate-y-1 p-7 sm:p-10 relative text-left"
              >
                {/* Product Image Stage (Extra Wide & Enlarged) */}
                <div 
                  onClick={() => onViewProduct && onViewProduct(product)}
                  className="relative h-64 sm:h-80 lg:h-96 w-full rounded-3xl overflow-hidden mb-6 border border-[#F7D6DF] bg-gradient-to-b from-[#FDF2F5] via-[#FFF9F5] to-[#FDF2F5]/50 p-6 flex items-center justify-center group shadow-xs cursor-pointer"
                >
                  <div className="absolute inset-0 m-auto w-56 h-56 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none"></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="relative z-10 h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out p-1"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                      {product.category}
                    </span>
                    
                    <h3 
                      onClick={() => onViewProduct && onViewProduct(product)}
                      className="font-sans text-xl sm:text-2xl font-bold text-[#2B2225] leading-snug line-clamp-1 cursor-pointer hover:text-[#9E3F5C] transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F7D6DF] space-y-4">
                    <span className="text-2xl sm:text-3xl font-bold text-[#9E3F5C] block text-left">
                      ${product.price}
                    </span>

                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        onClick={() => onViewProduct && onViewProduct(product)}
                        className="py-3.5 px-4 bg-[#FFF9F5] hover:bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#D4AF6A]" />
                        <span>View Product</span>
                      </button>

                      <button
                        onClick={() => onAddToCart && onAddToCart(product)}
                        className="py-3.5 px-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Wide Grid Layout for <= 2 Products (Centered) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch justify-items-center max-w-7xl mx-auto">
            {products.map((product, idx) => (
              <div 
                key={product.id || product._id}
                className={`w-full max-w-[580px] bg-white rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-500 transform hover:-translate-y-1 p-7 sm:p-10 relative text-left ${
                  idx % 2 === 0 ? 'reveal-left' : 'reveal-right'
                }`}
              >
                {/* Product Image Stage (Enlarged) */}
                <div 
                  onClick={() => onViewProduct && onViewProduct(product)}
                  className="relative h-64 sm:h-80 lg:h-96 w-full rounded-3xl overflow-hidden mb-6 border border-[#F7D6DF] bg-gradient-to-b from-[#FDF2F5] via-[#FFF9F5] to-[#FDF2F5]/50 p-6 flex items-center justify-center group shadow-xs cursor-pointer"
                >
                  <div className="absolute inset-0 m-auto w-56 h-56 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none"></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="relative z-10 h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out p-1"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 
                      onClick={() => onViewProduct && onViewProduct(product)}
                      className="font-sans text-xl sm:text-2xl font-bold text-[#2B2225] leading-snug cursor-pointer hover:text-[#9E3F5C] transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F7D6DF] space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-[#9E3F5C]">
                        ${product.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <button
                        onClick={() => onViewProduct && onViewProduct(product)}
                        className="w-full py-3.5 px-4 bg-[#FFF9F5] hover:bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#D4AF6A]" />
                        <span>View Product</span>
                      </button>

                      <button
                        onClick={() => onAddToCart && onAddToCart(product)}
                        className="w-full py-3.5 px-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
