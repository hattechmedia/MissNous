import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, Eye, Heart, CheckCircle2, ArrowRight, ArrowLeft, Star, X } from 'lucide-react';
import video3 from '../assets/video-3.mp4';
import { PRODUCTS } from '../data/products';

export default function ShopPage({ onAddToCart, onToggleWishlist, wishlistItems = [], onNavigate }) {
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

  const filteredProducts = PRODUCTS.filter(product => {
    if (activeFilter === 'all') return true;
    return product.categoryKey === activeFilter;
  });

  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

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
        <div className="max-w-4xl mx-auto relative z-10 space-y-6 reveal-up">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              OUR COLLECTION
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            Explore Our Collection
          </h1>

          {/* Short Intro Description */}
          <p className="font-sans text-base sm:text-lg text-[#FFF9F5] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Discover our two flagship Parisian wellness formulations — crafted with pure organic botanicals, pH 4.5 precision, and silky textures for your daily care.
          </p>

        </div>
      </section>

      {/* 2. SIMPLE CATEGORY FILTER TABS */}
      <section className="py-12 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center">
        <div className="inline-flex items-center gap-3 p-2 bg-white border border-[#F7D6DF] rounded-full shadow-sm reveal-up">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeFilter === 'all' 
                ? 'bg-[#9E3F5C] text-white shadow-sm' 
                : 'text-[#5A4B50] hover:text-[#9E3F5C]'
            }`}
          >
            All Products
          </button>
          
          <button
            onClick={() => setActiveFilter('serums')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeFilter === 'serums' 
                ? 'bg-[#9E3F5C] text-white shadow-sm' 
                : 'text-[#5A4B50] hover:text-[#9E3F5C]'
            }`}
          >
            Serums
          </button>

          <button
            onClick={() => setActiveFilter('lubricants')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeFilter === 'lubricants' 
                ? 'bg-[#9E3F5C] text-white shadow-sm' 
                : 'text-[#5A4B50] hover:text-[#9E3F5C]'
            }`}
          >
            Lubricants
          </button>
        </div>
      </section>

      {/* 3. COMPACT PRODUCT SHOWCASE GRID */}
      <section className="py-6 sm:py-12 pb-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          
          {filteredProducts.map((product, idx) => (
            <div 
              key={product.id}
              className={`bg-white rounded-[2rem] border border-[#F7D6DF] shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-500 transform hover:-translate-y-1 p-5 sm:p-6 relative ${
                idx % 2 === 0 ? 'reveal-left' : 'reveal-right'
              }`}
            >
              
              {/* Product Image Stage - 100% Un-cropped, Aligned & Centered */}
              <div className="relative h-56 sm:h-64 lg:h-72 w-full rounded-2xl overflow-hidden mb-4 border border-[#F7D6DF] bg-gradient-to-b from-[#FDF2F5] via-[#FFF9F5] to-[#FDF2F5]/50 p-4 flex items-center justify-center group shadow-xs">
                
                {/* Soft Radial Ambient Glow */}
                <div className="absolute inset-0 m-auto w-40 h-40 bg-[#D4AF6A]/20 rounded-full blur-2xl pointer-events-none"></div>

                {/* 100% Un-cropped Bottle Image - Straight, Centered & Un-clipped */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="relative z-10 h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out p-1"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                      {product.category}
                    </span>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D4AF6A] text-[#D4AF6A]" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-[#2B2225] ml-0.5">{product.rating}</span>
                      <span className="text-[10px] text-[#A09095]">({product.reviewsCount})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-sans text-xl sm:text-2xl font-medium text-[#2B2225] leading-snug">
                    {product.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-[#F7D6DF] space-y-4">
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#9E3F5C]">
                      Rs. {product.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-3 px-4 bg-[#FFF9F5] hover:bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF6A]" />
                      <span>View Product</span>
                    </button>

                    <button
                      onClick={() => onAddToCart && onAddToCart(product)}
                      className="w-full py-3 px-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* 4. PRODUCT QUICK DETAILS MODAL */}
      {selectedProduct && (
        <div 
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF9F5] border border-[#F7D6DF] w-full max-w-2xl rounded-3xl shadow-luxury p-6 sm:p-8 relative overflow-y-auto my-auto max-h-[90vh] space-y-6"
          >
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FDF2F5] text-[#2B2225] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 bg-[#FDF2F5] rounded-2xl p-5 flex items-center justify-center">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="max-h-56 w-auto object-contain drop-shadow-md rounded-lg"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                    {selectedProduct.category}
                  </span>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF6A] text-[#D4AF6A]" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#2B2225]">{selectedProduct.rating || 4.9}</span>
                    <span className="text-[10px] text-[#A09095]">({selectedProduct.reviewsCount || 128})</span>
                  </div>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-medium text-[#2B2225]">
                  {selectedProduct.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="pt-1">
                  <span className="text-2xl font-bold text-[#9E3F5C]">
                    Rs. {selectedProduct.price}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5 pt-1">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#5A4B50]">
                      <CheckCircle2 className="w-4 h-4 text-[#9E3F5C]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => {
                      if (onAddToCart) onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-wider font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

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
