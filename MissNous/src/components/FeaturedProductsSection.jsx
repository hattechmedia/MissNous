import React, { useRef } from 'react';
import { Sparkles, ShoppingBag, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { 
  getProductDisplayName, 
  getProductDisplayDescription, 
  getProductDisplayCategory,
  getProductDisplayPrice, 
  getProductDisplayOriginalPrice, 
  getProductDisplayDiscount 
} from './ProductDetailPage';

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

  // Exactly 2 best-selling intimate lubricants for the homepage (Strawberry & Pineapple)
  const defaultLubricants = PRODUCTS.slice(0, 2);
  let displayProducts = [];

  if (Array.isArray(products) && products.length > 0) {
    const filtered = products.filter(p => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const catKey = (p.categoryKey || '').toLowerCase();
      return (
        name.includes('strawberry') || 
        name.includes('pineapple') || 
        cat.includes('lubricant') || 
        catKey.includes('lubricant')
      );
    });

    if (filtered.length >= 2) {
      displayProducts = filtered.slice(0, 2);
    } else if (filtered.length === 1) {
      // Find the other product from default list to guarantee 2 products
      const missing = defaultLubricants.find(d => 
        (d.id !== filtered[0].id && d._id !== filtered[0]._id && !filtered[0].name.toLowerCase().includes(d.name.toLowerCase().includes('pineapple') ? 'pineapple' : 'strawberry'))
      );
      displayProducts = missing ? [filtered[0], missing] : defaultLubricants;
    } else {
      displayProducts = defaultLubricants;
    }
  } else {
    displayProducts = defaultLubricants;
  }

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Bestsellers
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
            Our Two Best-Selling Organic Intimate Lubricants
          </h2>

          <p className="font-sans text-[18px] text-[#5A4B50] font-normal leading-relaxed">
            Both formulas are water-based and built on a gentle glycerin base, with the full ingredient list on every product page so you always know what you are putting on your body. Each one carries a fruit-inspired flavor, so comfort and a little enjoyment come from the same bottle. Pick the flavor that fits your mood.
          </p>
        </div>

        {/* 2-Column Wide Centered Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch justify-items-center max-w-5xl mx-auto">
          {displayProducts.map((product, idx) => (
            <div 
              key={product.id || product._id}
              className={`w-full bg-white rounded-3xl sm:rounded-[2rem] border border-[#F7D6DF] shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-500 transform hover:-translate-y-1 p-5 sm:p-7 relative text-left reveal-up`}
            >
              {/* 3D Wrapped Diagonal Ribbon Badge on Outer Card */}
              {getProductDisplayDiscount(product) && (
                <div className="absolute top-0 left-0 w-36 sm:w-40 h-36 sm:h-40 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-6 sm:top-7 -left-11 sm:-left-12 w-48 sm:w-52 h-6 sm:h-7 bg-gradient-to-r from-[#501525] via-[#A84260] to-[#501525] text-[#FFF9F5] font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider -rotate-45 shadow-[0_4px_12px_rgba(0,0,0,0.4)] border-y border-[#E8D3A5]/40 flex items-center justify-center pr-5 sm:pr-6 gap-1 leading-none">
                    <Sparkles className="w-3 h-3 text-[#E8D3A5] flex-shrink-0" />
                    <span className="whitespace-nowrap drop-shadow-xs leading-none">Discounted Offer</span>
                  </div>
                </div>
              )}

              {/* Product Image Stage */}
              <div 
                onClick={() => onViewProduct && onViewProduct(product)}
                className="relative h-64 sm:h-72 lg:h-80 w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-5 group cursor-pointer shadow-xs border border-[#F7D6DF]/60 bg-[#FFF9F5]"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-left">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                    {getProductDisplayCategory(product)}
                  </span>
                  
                  <h3 
                    onClick={() => onViewProduct && onViewProduct(product)}
                    className="font-sans text-lg sm:text-xl font-bold text-[#2B2225] leading-snug tracking-tight line-clamp-1 cursor-pointer hover:text-[#9E3F5C] transition-colors"
                    title={getProductDisplayName(product)}
                  >
                    {getProductDisplayName(product)}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed line-clamp-2">
                    {getProductDisplayDescription(product)}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F7D6DF] space-y-4">
                  <div className="flex items-baseline gap-2.5 text-left">
                    <span className="text-2xl font-bold text-[#9E3F5C]">
                      ${getProductDisplayPrice(product)}
                    </span>
                    {getProductDisplayOriginalPrice(product) && (
                      <span className="text-sm text-[#7A6B70] line-through font-normal">
                        ${getProductDisplayOriginalPrice(product)}
                      </span>
                    )}
                    {getProductDisplayDiscount(product) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FDF2F5] border border-[#9E3F5C]/30 text-[#9E3F5C] text-[10px] font-bold">
                        {getProductDisplayDiscount(product)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      onClick={() => onViewProduct && onViewProduct(product)}
                      className="py-3 px-3 bg-[#FFF9F5] hover:bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF6A]" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => onAddToCart && onAddToCart({
                        ...product,
                        name: getProductDisplayName(product),
                        description: getProductDisplayDescription(product),
                        price: getProductDisplayPrice(product),
                        originalPrice: getProductDisplayOriginalPrice(product),
                        discount: getProductDisplayDiscount(product)
                      })}
                      className="py-3 px-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
