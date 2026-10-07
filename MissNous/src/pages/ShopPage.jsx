import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, ShoppingCart, Eye, Heart, CheckCircle2, ArrowRight, ArrowLeft, Star, X } from 'lucide-react';
import video3 from '../assets/video-3.mp4';
import { PRODUCTS } from '../data/products';
import { 
  getProductDisplayName, 
  getProductDisplayDescription,
  getProductDisplayPrice,
  getProductDisplayOriginalPrice,
  getProductDisplayDiscount
} from './ProductDetailPage';

export default function ShopPage({ onAddToCart, onToggleWishlist, wishlistItems = [], onNavigate, products = PRODUCTS, categories = [], onViewProduct }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Smooth video loop for Shop Page background animation
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const START_TIME = 0.5;

    const handleLoadedMetadata = () => {
      if (video.currentTime < START_TIME) {
        video.currentTime = START_TIME;
      }
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= START_TIME) {
        if (!isVideoReady) setIsVideoReady(true);
      }
      if (video.duration && video.currentTime >= video.duration - 0.3) {
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

    if (video.readyState >= 2 || video.currentTime >= START_TIME) {
      setIsVideoReady(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVideoReady]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedProduct(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProduct]);

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    // Match by categoryKey, category name, or category _id
    return (
      product.categoryKey === activeFilter ||
      product.category === activeFilter ||
      product.categoryKey?.toLowerCase() === activeFilter?.toLowerCase() ||
      product.category?.toLowerCase() === activeFilter?.toLowerCase()
    );
  });

  const isWishlisted = (product) => {
    const pid = product?._id || product?.id;
    return wishlistItems.some(item => (item._id || item.id) === pid);
  };

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      
      {/* 1. ELEGANT SHOP HEADER WITH BACKGROUND VIDEO-3 */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">
        
        {/* Background Video video-3.mp4 */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#2B2225]">
          <video 
            ref={videoRef}
            src={video3} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover object-center scale-[1.05] transition-opacity duration-500 ${
              isVideoReady ? 'opacity-55' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/65 via-[#2B2225]/30 to-[#2B2225]/45"></div>
        </div>

        {/* Text Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4 reveal-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="w-4 h-4 text-[#F7D6DF]" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#FFF9F5]">
              Botanical Beauty Rituals
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            The Intimate Collection
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#F7D6DF] max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            Discover 100% organic, pH-balanced formulas designed for silky comfort, deep botanical moisture, and everyday skin confidence.
          </p>
        </div>
      </section>

      {/* 2. SIMPLE CATEGORY FILTER TABS */}
      <section className="py-12 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center">
        <div className="inline-flex items-center gap-2 p-2 bg-white border border-[#F7D6DF] rounded-full shadow-sm reveal-up overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all bg-[#9E3F5C] text-white shadow-sm cursor-pointer"
          >
            All Products
          </button>
        </div>
      </section>

      {/* 3. ELEGANT PRODUCT SHOWCASE GRID */}
      <section className="py-6 sm:py-12 pb-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch justify-items-center">
          
          {filteredProducts.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-[#A09095]">
              <p className="text-sm font-medium">No products found in this category yet.</p>
            </div>
          ) : filteredProducts.map((product, idx) => (
            <div 
              key={product._id || product.id}
              className={`w-full max-w-[580px] bg-white rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-500 transform hover:-translate-y-1 p-7 sm:p-10 relative ${
                idx % 2 === 0 ? 'reveal-left' : 'reveal-right'
              }`}
            >
              
              {/* Product Image Stage */}
              <div 
                onClick={() => onViewProduct && onViewProduct(product)}
                className="relative h-64 sm:h-80 lg:h-96 w-full rounded-3xl overflow-hidden mb-6 border border-[#F7D6DF]/60 group cursor-pointer shadow-xs"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 
                    onClick={() => onViewProduct && onViewProduct(product)}
                    className="font-sans text-lg sm:text-xl lg:text-[1.35rem] font-bold text-[#2B2225] leading-snug tracking-tight whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:text-[#9E3F5C] transition-colors"
                  >
                    {getProductDisplayName(product)}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                    {getProductDisplayDescription(product)}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-[#F7D6DF] space-y-4">
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#9E3F5C]">
                      ${getProductDisplayPrice(product)}
                    </span>
                    {getProductDisplayOriginalPrice(product) && (
                      <span className="text-base sm:text-lg text-[#7A6B70] line-through font-normal">
                        ${getProductDisplayOriginalPrice(product)}
                      </span>
                    )}
                    {getProductDisplayDiscount(product) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FDF2F5] border border-[#9E3F5C]/30 text-[#9E3F5C] text-xs font-bold">
                        {getProductDisplayDiscount(product)}
                      </span>
                    )}
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
                      onClick={() => onAddToCart && onAddToCart({
                        ...product,
                        name: getProductDisplayName(product),
                        description: getProductDisplayDescription(product),
                        price: getProductDisplayPrice(product),
                        originalPrice: getProductDisplayOriginalPrice(product),
                        discount: getProductDisplayDiscount(product)
                      })}
                      className="w-full py-3.5 px-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-[#FFF9F5] border-t border-[#F7D6DF]/60 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
            Find What Feels Right for You.
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#5A4B50] font-normal leading-relaxed max-w-xl mx-auto">
            Formulated in Paris with 100% organic botanicals, dermatologist tested, and packaged with complete privacy.
          </p>

          <div className="pt-4">
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center justify-center px-10 py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 gap-2"
            >
              <span>Explore Our Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
