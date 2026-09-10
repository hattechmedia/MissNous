import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShoppingBag, Heart, CheckCircle2, ArrowRight, ArrowLeft, 
  Star, ShieldCheck, Truck, RefreshCw, Zap, Award, Leaf, Lock 
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductDetailPage({ 
  product, 
  products = PRODUCTS, 
  onAddToCart, 
  onNavigate, 
  onViewProduct, 
  onToggleWishlist, 
  wishlistItems = [],
  currentUser,
  onOpenAuthModal
}) {
  // Fallback to first available product if none selected
  const activeProduct = product || products[0] || {};
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Reset quantity and scroll top when product changes
  useEffect(() => {
    setQuantity(1);
    setActiveTab('description');
    setAddedAnimation(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeProduct?._id, activeProduct?.id]);

  if (!activeProduct || !activeProduct.name) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDF2F5] px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#2B2225] mb-4">Product Not Found</h2>
        <button 
          onClick={() => onNavigate && onNavigate('shop')}
          className="px-6 py-3 bg-[#9E3F5C] text-[#FFF9F5] rounded-full font-bold text-sm"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some(
    item => (item._id || item.id) === (activeProduct._id || activeProduct.id)
  );

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(activeProduct, quantity, true);
    }
  };

  const handleBuyNowClick = () => {
    if (onAddToCart) {
      onAddToCart(activeProduct, quantity, false);
    }
    if (currentUser) {
      if (onNavigate) {
        onNavigate('checkout');
      }
    } else {
      if (onOpenAuthModal) {
        onOpenAuthModal('login');
      } else if (onNavigate) {
        onNavigate('checkout');
      }
    }
  };

  // Filter related products (exclude current product)
  const relatedProducts = products
    .filter(p => (p._id || p.id) !== (activeProduct._id || activeProduct.id))
    .slice(0, 4);

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      
      {/* 2-COLUMN MAIN PRODUCT SHOWCASE (Left Image / Right Details) */}
      <section className="pt-28 sm:pt-36 pb-10 sm:pb-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: High Quality Product Image Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-12 border border-[#F7D6DF] shadow-luxury flex items-center justify-center min-h-[380px] sm:min-h-[480px] group overflow-hidden">
              
              {/* Soft Luxury Glow behind Product Image */}
              <div className="absolute inset-0 m-auto w-[280px] h-[280px] bg-[#F7D6DF]/40 rounded-full blur-[60px] pointer-events-none"></div>
              
              {/* Product Badge */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E3F5C] text-[#FFF9F5] font-sans text-[11px] font-bold uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3 h-3 animate-pulse text-[#E8D3A5]" />
                  <span>{activeProduct.category || 'Organic Ritual'}</span>
                </span>
              </div>

              {/* Main Product Image */}
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                className="relative z-10 max-h-[340px] sm:max-h-[420px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />

            </div>
          </div>

          {/* RIGHT COLUMN: Product Details & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  {activeProduct.category || 'Intimate Skincare'}
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight leading-tight">
                {activeProduct.name}
              </h1>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-4 border-b border-[#F7D6DF]/60 pb-5">
              <span className="font-sans text-3xl sm:text-4xl font-bold text-[#9E3F5C]">
                ${activeProduct.price}
              </span>
            </div>

            {/* Short Description */}
            <p className="font-sans text-sm text-[#5A4B50] font-normal leading-relaxed">
              {activeProduct.description || "Our signature organic formulation calibrated at pH 4.5 to restore natural skin harmony, hydration, and long-lasting radiance."}
            </p>

            {/* Product Key Features Checklist */}
            {activeProduct.features && activeProduct.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2">
                {activeProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#2B2225] bg-white px-3 py-2 rounded-xl border border-[#F7D6DF]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* QUANTITY SELECTOR ROW */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Select Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center bg-white rounded-full border border-[#F7D6DF] shadow-xs p-1">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-9 h-9 rounded-full bg-[#FDF2F5] hover:bg-[#F7D6DF] text-[#9E3F5C] font-bold text-base flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[#2B2225]">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-9 h-9 rounded-full bg-[#FDF2F5] hover:bg-[#F7D6DF] text-[#9E3F5C] font-bold text-base flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-[#5A4B50] font-medium">
                  Total: <strong className="text-[#9E3F5C] font-bold">${(activeProduct.price * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (ADD TO CART & BUY NOW) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* ADD TO BAG BUTTON */}
                <button
                  onClick={handleAddToCartClick}
                  className="w-full py-4 px-6 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* BUY NOW BUTTON */}
                <button
                  onClick={handleBuyNowClick}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#D4AF6A] via-[#E8D3A5] to-[#B88A3B] hover:brightness-110 text-[#2B2225] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-md flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-[#2B2225]" />
                  <span>Buy Now</span>
                </button>

              </div>
            </div>



          </div>

        </div>
      </section>

      {/* COMPREHENSIVE PRODUCT DESCRIPTION & RITUAL TABS */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-b border-[#F7D6DF]/60">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Tab Navigation Buttons - 100% Responsive for Mobile & Desktop */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 border-b border-[#F7D6DF] pb-4 px-1 max-w-full">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center whitespace-nowrap sm:whitespace-normal ${
                activeTab === 'description'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-md'
                  : 'bg-white text-[#5A4B50] hover:text-[#9E3F5C] border border-[#F7D6DF]'
              }`}
            >
              Description & Benefits
            </button>

            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center whitespace-nowrap sm:whitespace-normal ${
                activeTab === 'ingredients'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-md'
                  : 'bg-white text-[#5A4B50] hover:text-[#9E3F5C] border border-[#F7D6DF]'
              }`}
            >
              Key Ingredients
            </button>

            <button
              onClick={() => setActiveTab('usage')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center whitespace-nowrap sm:whitespace-normal ${
                activeTab === 'usage'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-md'
                  : 'bg-white text-[#5A4B50] hover:text-[#9E3F5C] border border-[#F7D6DF]'
              }`}
            >
              How to Use
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-[#F7D6DF] shadow-sm text-left">
            
            {activeTab === 'description' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sans text-xl font-bold text-[#2B2225]">
                  Formulated in Paris for Pure Skin Harmony
                </h3>
                <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
                  {activeProduct.description}
                </p>
                <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
                  Miss Nous signature formulas are crafted with meticulous attention to physiological pH calibration (pH 4.5), ensuring that your natural skin barrier remains balanced, deeply hydrated, and free from irritation. Free from parabens, synthetic fragrances, and artificial preservatives.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-[#FDF2F5] rounded-2xl border border-[#F7D6DF]">
                    <h4 className="font-bold text-xs text-[#9E3F5C] uppercase tracking-wider mb-1">pH 4.5 Balanced</h4>
                    <p className="text-xs text-[#5A4B50]">Maintains natural acidic skin barrier</p>
                  </div>
                  <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#E8D3A5]">
                    <h4 className="font-bold text-xs text-[#D4AF6A] uppercase tracking-wider mb-1">100% Organic</h4>
                    <p className="text-xs text-[#5A4B50]">Pure botanical plant extracts</p>
                  </div>
                  <div className="p-4 bg-[#FDF2F5] rounded-2xl border border-[#F7D6DF]">
                    <h4 className="font-bold text-xs text-[#9E3F5C] uppercase tracking-wider mb-1">Dermatologist Approved</h4>
                    <p className="text-xs text-[#5A4B50]">Safe for sensitive skin types</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sans text-xl font-bold text-[#2B2225]">
                  Pure Organic Botanical Ingredients
                </h3>
                <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
                  We source only the highest grade botanical extracts to ensure maximal safety and skin nourishment:
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <Leaf className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-[#2B2225]">Organic Aloe Vera Gel:</strong> Deeply hydrates and soothes skin redness and sensitive areas.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <Leaf className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-[#2B2225]">Plant Hyaluronic Acid:</strong> Locks in moisture for 24-hour skin elasticity and freshness.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <Leaf className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-[#2B2225]">Rose Hydrosol & Chamomile:</strong> Calms delicate skin and provides a natural, subtle French aroma.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sans text-xl font-bold text-[#2B2225]">
                  Daily Wellness & Application Guide
                </h3>
                <ol className="space-y-3 pt-2">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <span className="w-6 h-6 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">1</span>
                    <span>Dispense 1-2 pumps onto clean, dry hands.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <span className="w-6 h-6 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">2</span>
                    <span>Gently apply over desired intimate or facial skin areas in smooth upward motions.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#5A4B50]">
                    <span className="w-6 h-6 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">3</span>
                    <span>Allow to absorb naturally. Use daily as part of your morning & evening self-care ritual.</span>
                  </li>
                </ol>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="space-y-10 text-center">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Complete Your Ritual
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight">
                Related Products
              </h2>
            </div>

            {/* Related Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {relatedProducts.map(relProduct => (
                <div 
                  key={relProduct._id || relProduct.id}
                  className="bg-white rounded-[2rem] border border-[#F7D6DF] shadow-luxury p-5 flex flex-col justify-between group hover:shadow-pink-glow transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Image Box */}
                    <div 
                      onClick={() => onViewProduct && onViewProduct(relProduct)}
                      className="bg-[#FDF2F5] rounded-2xl p-4 aspect-square flex items-center justify-center relative cursor-pointer overflow-hidden"
                    >
                      <img 
                        src={relProduct.image} 
                        alt={relProduct.name} 
                        className="max-h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E3F5C]">
                        {relProduct.category}
                      </span>
                      <h3 
                        onClick={() => onViewProduct && onViewProduct(relProduct)}
                        className="font-sans text-base font-medium text-[#2B2225] hover:text-[#9E3F5C] cursor-pointer transition-colors line-clamp-1"
                      >
                        {relProduct.name}
                      </h3>
                      <p className="text-xs text-[#5A4B50] line-clamp-2 mt-1 font-normal">
                        {relProduct.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 mt-4 border-t border-[#F7D6DF]/60 flex items-center justify-between gap-2">
                    <span className="font-bold text-lg text-[#9E3F5C]">
                      ${relProduct.price}
                    </span>
                    <button
                      onClick={() => onViewProduct && onViewProduct(relProduct)}
                      className="px-4 py-2 bg-[#FFF9F5] hover:bg-[#9E3F5C] hover:text-white text-[#9E3F5C] border border-[#F7D6DF] text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
