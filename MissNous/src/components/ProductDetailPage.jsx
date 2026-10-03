import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ShoppingBag, ShoppingCart, Heart, CheckCircle2, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ChevronDown,
  Star, ShieldCheck, Truck, RefreshCw, Zap, Award, Leaf, Lock, Droplets, Layers, FlaskConical,
  Palette, Package, FileText, Flame, HelpCircle
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import image17 from '../assets/Image-17.png';

// Helper to determine if product is the Strawberry Water-Based Lubricant
export const isStrawberryLubricantProduct = (prod) => {
  if (!prod) return false;
  const name = (prod.name || '').toLowerCase();
  const catKey = (prod.categoryKey || '').toLowerCase();
  const id = prod._id || prod.id || '';
  const img = prod.image || '';

  if (name.includes('pineapple') || id === 'prod-1' || img.includes('gpt-7') || img.includes('gpt-8')) {
    return false;
  }

  return (
    name.includes('strawberry') ||
    catKey === 'strawberry-intimate-care' ||
    id === 'prod-2' ||
    id === '6a9294e8f879ce3143960099' ||
    img.includes('gpt-6')
  );
};

export const isPineappleLubricantProduct = (prod) => {
  if (!prod) return true;
  return !isStrawberryLubricantProduct(prod);
};

export const getProductDisplayName = (prod) => {
  if (!prod) return '';
  if (isStrawberryLubricantProduct(prod)) return 'Touch of Love Strawberry Water-Based Lubricant';
  return 'Touch of Love Pineapple Water-Based Lubricant';
};

export const getProductDisplayCategory = (prod) => {
  if (!prod) return 'Intimate Care';
  if (isStrawberryLubricantProduct(prod)) return 'Strawberry Intimate Care';
  return 'Pineapple Intimate Care';
};

export const getProductDisplayDescription = (prod) => {
  if (!prod) return '';
  if (isStrawberryLubricantProduct(prod)) {
    return 'A colorful, water-based lubricant with a glycerin and propylene glycol base. 100ml size. Ships across the USA.';
  }
  return 'A silky, water-based lubricant with a light, fruit-inspired pineapple flavor. Set to a gentle pH so it stays comfortable on sensitive skin. 100ml size. Ships across the USA.';
};

export const getProductDisplayPrice = (prod) => {
  if (!prod) return 31.99;
  return isStrawberryLubricantProduct(prod) ? 31.99 : (prod.price || 31.99);
};

export const getProductDisplayOriginalPrice = (prod) => {
  if (!prod) return 39.99;
  return isStrawberryLubricantProduct(prod) ? 39.99 : (prod.originalPrice || null);
};

export const getProductDisplayDiscount = (prod) => {
  if (!prod) return '20% OFF';
  return isStrawberryLubricantProduct(prod) ? '20% OFF' : (prod.discount || null);
};

export const STRAWBERRY_INGREDIENTS = [
  {
    number: '01',
    title: 'Water (Aqua)',
    description: 'The base of the formula.',
    icon: Droplets
  },
  {
    number: '02',
    title: 'Glycerin',
    description: 'A humectant that helps keep the formula smooth and moist.',
    icon: Sparkles
  },
  {
    number: '03',
    title: 'Propylene Glycol',
    description: 'A humectant that supports the slippery feel.',
    icon: Layers
  },
  {
    number: '04',
    title: 'Hydroxyethylcellulose, Xanthan Gum, and Carbomer',
    description: 'Thickeners that give the gel-like texture.',
    icon: FlaskConical
  },
  {
    number: '05',
    title: 'Sodium Acrylate, Disodium EDTA',
    description: 'Help with texture and keep the formula stable.',
    icon: ShieldCheck
  },
  {
    number: '06',
    title: 'Methylisothiazolinone, Iodopropynyl Butylcarbamate',
    description: 'Preservatives that protect the product from bacteria and mold.',
    icon: CheckCircle2
  }
];

export const STRAWBERRY_BENEFITS = [
  {
    number: '01',
    title: 'Water-based formula',
    description: 'Built on water and glycerin, with no oil in the ingredient list.',
    icon: Droplets,
    badge: 'Oil-Free Purity'
  },
  {
    number: '02',
    title: 'Smooth, gel-like texture',
    description: 'Hydroxyethylcellulose, xanthan gum, and carbomer give it body.',
    icon: Sparkles,
    badge: 'Velvety Cushion'
  },
  {
    number: '03',
    title: 'Moisture-supporting base',
    description: 'Glycerin and propylene glycol help keep the formula moist.',
    icon: Heart,
    badge: 'Hydrating Humectant'
  },
  {
    number: '04',
    title: 'Colorful',
    description: 'It has a colorful appearance.',
    icon: Palette,
    badge: 'Vibrant Appeal'
  },
  {
    number: '05',
    title: 'Strawberry scent',
    description: 'Strawberry flavor.',
    icon: Flame,
    badge: 'Aromatic Delight'
  },
  {
    number: '06',
    title: '100ml Size',
    description: '100ml net content in a compact, easy-to-use bottle.',
    icon: Package,
    badge: '100ml'
  },
  {
    number: '07',
    title: 'Clear ingredient list and manufacturer',
    description: 'You see what is inside and who makes it before you buy.',
    icon: FileText,
    badge: 'Full Disclosure'
  },
  {
    number: '08',
    title: 'Discreet delivery',
    description: 'Sealed pack, plain outer box, no product name outside.',
    icon: Lock,
    badge: '100% Confidential'
  }
];

export const STRAWBERRY_SAFETY_POINTS = [
  {
    number: '01',
    title: 'Do a patch test',
    description: 'Try a small amount first. Stop use if you notice redness, itching, or irritation.',
  },
  {
    number: '02',
    title: 'Check for sensitivities',
    description: 'The formula contains preservatives, including methylisothiazolinone, which can cause reactions in sensitive people.',
  },
  {
    number: '03',
    title: 'Keep away from eyes',
    description: 'If it gets in your eyes, rinse with plenty of water for at least 15 minutes. See a doctor if discomfort continues.',
  },
  {
    number: '04',
    title: 'Do not swallow',
    description: 'Accidental ingestion can be harmful. Call a doctor if it happens.',
  },
  {
    number: '05',
    title: "Keep out of children's reach",
    description: 'Store the pack tightly closed.',
  },
  {
    number: '06',
    title: 'Ask a doctor if you are unsure',
    description: 'This matters most if you are pregnant, have a medical condition, or have known allergies.',
  },
];

export const STRAWBERRY_REVIEWS = [
  {
    id: 1,
    name: 'Sophia Laurent',
    role: 'Verified Buyer • New York, USA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The Touch of Love Strawberry lubricant is pure luxury. Silky, non-sticky, and calibrated at pH 4.5 for complete comfort. It has truly elevated our intimate rituals!'
  },
  {
    id: 2,
    name: 'Jessica Miller',
    role: 'Verified Buyer • California, USA',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The strawberry flavor is subtle and delightful—not overly sweet or artificial. Easy to rinse off with water and leaves zero residue. Highly recommend!'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Verified Buyer • Miami, Florida',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: '100% water-based purity, lovely glide, and packaged with ultimate discreet elegance. Ships sealed in a plain box with fast delivery. Highly recommended!'
  },
  {
    id: 4,
    name: 'Hannah K.',
    role: 'Verified Buyer • Austin, Texas',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'Best water-based lube we have tried. Smooth, gel-like texture that lasts without drying out too fast. Gentle formula with zero irritation.'
  },
  {
    id: 5,
    name: 'Chloe Dubois',
    role: 'Verified Buyer • Chicago, Illinois',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The natural botanical aroma is divine without any artificial chemical harshness. Miss Nous standard of organic luxury is truly unmatched!'
  }
];

export const STRAWBERRY_FAQS = [
  {
    question: "What is Touch of Love Strawberry?",
    answer: "Touch of Love Strawberry is a colorful, water-based lubricant. It comes in a 100ml size. The formula uses a water, glycerin, and propylene glycol base with thickeners for a smooth, gel-like texture."
  },
  {
    question: "Who makes Touch of Love Strawberry?",
    answer: "Guangdong CokeLife Biotechnology Co., Ltd. manufactures it. The factory is in Yingde City, Qingyuan City, Guangdong Province, China. You can see the manufacturer's name and address in the product details above."
  },
  {
    question: "What are the main ingredients?",
    answer: "The base is water, glycerin, and propylene glycol. Hydroxyethylcellulose, xanthan gum, and carbomer thicken it. Preservatives protect the product, and the full ingredient list appears on the pack."
  },
  {
    question: "Should I do a patch test first?",
    answer: "Yes. Apply a small amount to a small area first and wait [24 hours]. Stop use if you notice redness, itching, or irritation, and talk to a doctor if you are unsure."
  }
];

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

  const isStrawberryProduct = isStrawberryLubricantProduct(activeProduct);
  const displayName = getProductDisplayName(activeProduct);
  const displayDescription = getProductDisplayDescription(activeProduct);

  const displayFeatures = isStrawberryProduct
    ? null
    : (activeProduct.features || []);

  // Gallery image sets for each product
  const STRAWBERRY_GALLERY = ['/gpt-6.png', '/gpt-1.png', '/gpt-2.png', '/jpt-6.jpeg'];
  const PINEAPPLE_GALLERY = ['/gpt-7.jpeg', '/gpt-5.png', '/gpt-8.jpeg'];

  const galleryImages = isStrawberryProduct
    ? STRAWBERRY_GALLERY
    : PINEAPPLE_GALLERY;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeSafetyIndex, setActiveSafetyIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(galleryImages[0] || activeProduct.image);

  // Reviews Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewHovered, setIsReviewHovered] = useState(false);
  const touchReviewStartX = useRef(null);

  // Auto-play cycle for reviews every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isReviewHovered) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % STRAWBERRY_REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentReviewIndex, isReviewHovered]);

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % STRAWBERRY_REVIEWS.length);
  };

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + STRAWBERRY_REVIEWS.length) % STRAWBERRY_REVIEWS.length);
  };

  const handleReviewDotClick = (index) => {
    setCurrentReviewIndex(index);
  };

  const handleReviewTouchStart = (e) => {
    touchReviewStartX.current = e.touches[0].clientX;
  };

  const handleReviewTouchEnd = (e) => {
    if (!touchReviewStartX.current) return;
    const diff = touchReviewStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNextReview();
      else handlePrevReview();
    }
    touchReviewStartX.current = null;
  };

  // Reset quantity, size, active image, and scroll top when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedSize('100ml');
    setAddedAnimation(false);
    const isStraw = isStrawberryLubricantProduct(activeProduct);
    const currentGallery = isStraw ? STRAWBERRY_GALLERY : PINEAPPLE_GALLERY;
    const defaultActive = isStraw ? '/gpt-6.png' : '/gpt-7.jpeg';
    setActiveImage(currentGallery[0] || defaultActive);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeProduct?._id, activeProduct?.id, activeProduct?.name, activeProduct?.image]);

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

  const handleAddToCartClick = (overrideQty = null, overrideSize = null, setExactQty = false) => {
    if (onAddToCart) {
      const finalQty = overrideQty !== null ? overrideQty : quantity;
      const finalSize = overrideSize !== null ? overrideSize : selectedSize;
      const itemToAdd = {
        ...activeProduct,
        price: isStrawberryProduct ? 31.99 : (activeProduct.price || 31.99),
        originalPrice: isStrawberryProduct ? 39.99 : (activeProduct.originalPrice || 39.99),
        name: displayName,
        description: displayDescription,
        ...(isStrawberryProduct ? { selectedSize: finalSize } : {})
      };
      onAddToCart(itemToAdd, finalQty, true, setExactQty);
    }
  };

  const handleBuyNowClick = () => {
    const itemToAdd = {
      ...activeProduct,
      price: isStrawberryProduct ? 31.99 : (activeProduct.price || 31.99),
      originalPrice: isStrawberryProduct ? 39.99 : (activeProduct.originalPrice || 39.99),
      name: displayName,
      description: displayDescription,
      ...(isStrawberryProduct ? { selectedSize } : {})
    };
    if (onAddToCart) {
      onAddToCart(itemToAdd, quantity, false);
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

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans">
      
      {/* 2-COLUMN MAIN PRODUCT SHOWCASE (Left Image / Right Details) */}
      <section className="pt-28 sm:pt-36 pb-10 sm:pb-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* LEFT COLUMN: High Quality Product Image Frame with Thumbnail Blocks outside on the Left */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-center md:items-stretch h-full">
            
            {/* Thumbnail Blocks Column (Outside left of main card - close together) */}
            <div className="flex flex-row md:flex-col gap-1 sm:gap-1.5 justify-start w-full md:w-auto flex-shrink-0">
              {galleryImages.map((imgSrc, idx) => {
                const isActive = activeImage === imgSrc;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgSrc)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 rounded-2xl border-2 transition-all duration-300 p-0 flex items-center justify-center overflow-hidden bg-white shadow-sm cursor-pointer group ${
                      isActive
                        ? 'border-[#9E3F5C] shadow-pink-glow ring-2 ring-[#9E3F5C]/30 scale-105 opacity-100 z-10'
                        : 'border-[#F7D6DF] opacity-75 hover:opacity-100 hover:border-[#9E3F5C]/60 hover:scale-102'
                    }`}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`Product Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Product Image Stage (No padding, rounded corners to edge) */}
            <div className="relative flex-1 bg-white rounded-3xl sm:rounded-[2rem] p-0 border border-[#F7D6DF] shadow-luxury flex items-center justify-center group overflow-hidden w-full h-full min-h-[360px] sm:min-h-[430px] lg:min-h-[470px]">
              
              {/* Main Product Image */}
              <img 
                src={activeImage} 
                alt={displayName} 
                className="relative z-10 w-full h-[360px] sm:h-[430px] lg:h-[470px] object-cover rounded-3xl sm:rounded-[2rem] transition-all duration-500 group-hover:scale-[1.01]"
              />

            </div>

          </div>

          {/* RIGHT COLUMN: Product Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7 text-left lg:py-2 h-full">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  {activeProduct.category || 'Intimate Skincare'}
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225] tracking-tight leading-tight">
                {displayName}
              </h1>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3.5 border-b border-[#F7D6DF]/60 pb-5">
              <span className="font-sans text-3xl sm:text-4xl font-bold text-[#9E3F5C]">
                ${isStrawberryProduct ? '31.99' : (activeProduct.price || 31.99)}
              </span>
              {(isStrawberryProduct || activeProduct.originalPrice) && (
                <span className="font-sans text-lg sm:text-xl font-medium text-[#7A6B70] line-through">
                  ${isStrawberryProduct ? '39.99' : activeProduct.originalPrice}
                </span>
              )}
              {(isStrawberryProduct || activeProduct.discount) && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FDF2F5] border border-[#9E3F5C]/30 text-[#9E3F5C] text-xs font-bold uppercase tracking-wider">
                  {isStrawberryProduct ? '20% OFF' : activeProduct.discount}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="font-sans text-sm text-[#5A4B50] font-normal leading-relaxed">
              {displayDescription}
            </p>

            {/* SIZE DISPLAY */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div className="font-sans text-sm sm:text-base font-bold uppercase tracking-wider text-[#2B2225]">
                Size: <span className="text-[#9E3F5C] font-extrabold ml-1">100ml</span>
              </div>
              <span className="text-xs text-[#9E3F5C] font-semibold">
                Ships across the USA
              </span>
            </div>


            {/* ACTION BUTTONS (ADD TO CART & BUY NOW) */}
            <div className="space-y-3 pt-3 sm:pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* ADD TO CART BUTTON */}
                <button
                  onClick={handleAddToCartClick}
                  className="w-full py-4 px-6 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs uppercase tracking-widest font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
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

      {/* PRODUCT SPECIFICATIONS & DETAILS SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-6xl mx-auto">
          
          {/* 2-Column Layout (Left: Title & Points, Right: Details table) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Heading & 2 Points */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                {/* Tagline / Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                    Authentic Specifications & Details
                  </span>
                </div>

                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
                  {displayName} Product Details
                </h2>

                <div className="w-16 h-0.5 bg-gradient-to-r from-[#9E3F5C] via-[#D4AF6A] to-transparent"></div>
              </div>

              {/* Just Points */}
              <ul className="space-y-4 text-sm sm:text-base text-[#5A4B50] font-sans pt-1">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 bg-[#9E3F5C] flex-shrink-0" />
                  <span className="leading-relaxed">
                    {displayName} is a water-based lubricant. It appears as a liquid and comes in a 100ml size.
                  </span>
                </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 bg-[#9E3F5C] flex-shrink-0" />
                    <span className="leading-relaxed">
                      The formula builds on water, glycerin, and propylene glycol, with thickeners for a smooth, easy-to-absorb texture. Every pack ships sealed.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Product Details (Structured Table Layout) */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="text-left mb-3">
                  <h3 className="font-sans text-base sm:text-lg font-bold uppercase tracking-wider text-[#2B2225]">
                    PRODUCT DETAILS
                  </h3>
                </div>

                {/* Proper Structured Specifications Table */}
                <div className="w-full overflow-hidden rounded-xl border border-[#2B2225]/15 bg-white/70 shadow-xs">
                  <table className="w-full font-sans text-xs sm:text-sm text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] w-[35%] sm:w-[32%] bg-[#FDF2F5]/60 align-top">
                          Product:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#2B2225] align-top text-left">
                          {displayName}
                        </td>
                      </tr>

                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Type:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          Water-based lubricant
                        </td>
                      </tr>

                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Size:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          100ml
                        </td>
                      </tr>

                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Appearance:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          {isStrawberryProduct ? 'Colorful liquid' : 'Light golden liquid'}
                        </td>
                      </tr>

                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Flavor / scent:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          {isStrawberryProduct ? 'Strawberry' : 'Pineapple'}
                        </td>
                      </tr>

                      <tr className="border-b border-[#2B2225]/10 hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Manufacturer:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          <div className="font-semibold text-[#2B2225]">Guangdong CokeLife Biotechnology Co., Ltd., China</div>
                          <div className="text-[11px] font-normal text-[#7A6B70] mt-0.5 leading-relaxed">
                            Building H8, Wanyang Innovation City, Yingde City, Qingyuan City, Guangdong Province, China
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-[#FFF9F5]/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5 font-semibold text-[#5A4B50] bg-[#FDF2F5]/60 align-top">
                          Applicant company:
                        </td>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[#2B2225] align-top text-left">
                          <div className="font-semibold text-[#2B2225]">Guangzhou Haoyimai Trading Co., Ltd.</div>
                          <div className="text-[11px] font-normal text-[#7A6B70] mt-0.5 leading-relaxed">
                            Baiyun District, Guangzhou, China
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        </section>

      {/* TOUCH OF LOVE STRAWBERRY INGREDIENTS SECTION (Interactive Bottle Breakdown) */}
      {isStrawberryProduct && (
        <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#9E3F5C] text-[#FFF9F5] relative overflow-hidden">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10 space-y-16">
            
            {/* Centered Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#E8D3A5]">
                  Formulation Breakdown
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#D4AF6A] tracking-tight">
                Touch of Love Strawberry Ingredients
              </h2>

              <div className="w-12 h-0.5 bg-[#D4AF6A] rounded-full mx-auto my-2"></div>

              <p className="font-sans text-xs sm:text-sm text-white font-normal leading-relaxed">
                Listed from the highest amount to the lowest.
              </p>
            </div>

            {/* INTERACTIVE BOTTLE CALLOUT BREAKDOWN (No cards, No borders) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 relative">
              
              {/* LEFT COLUMN: Ingredients 01, 02, 03 */}
              <div className="w-full lg:w-5/12 space-y-10 sm:space-y-14 order-2 lg:order-1">
                {STRAWBERRY_INGREDIENTS.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start lg:items-center justify-start lg:justify-end gap-3 sm:gap-4 group"
                  >
                    {/* Content on Left (Desktop text-right) */}
                    <div className="lg:text-right flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 text-[#E8D3A5] font-sans font-bold text-xs tracking-wider mb-1">
                        <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF6A]"></span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#E8D3A5] text-[11px] font-bold">
                          {item.number}
                        </span>
                        <span className="lg:hidden w-1.5 h-1.5 rounded-full bg-[#D4AF6A]"></span>
                      </div>

                      <h3 className="font-sans text-base sm:text-lg lg:text-xl font-bold text-[#D4AF6A] group-hover:text-[#E8D3A5] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <div className="w-8 h-0.5 bg-[#D4AF6A] rounded-full my-1.5 lg:ml-auto"></div>

                      <p className="font-sans text-xs sm:text-sm text-white leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Connector Line pointing towards Center Bottle */}
                    <div className="hidden lg:flex items-center flex-shrink-0">
                      <div className="w-12 xl:w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-[#D4AF6A]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#D4AF6A] shadow-[0_0_12px_#D4AF6A] ring-4 ring-white/10"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CENTER COLUMN: Product Bottle Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-3/12 xl:w-4/12 flex justify-center items-center relative py-4 lg:py-0 order-1 lg:order-2"
              >
                {/* Ambient Glow behind Bottle */}
                <div className="absolute inset-0 m-auto w-64 h-64 sm:w-72 sm:h-72 bg-[#D4AF6A]/20 rounded-full blur-[70px] pointer-events-none"></div>
                <div className="absolute inset-0 m-auto w-48 h-48 sm:w-56 sm:h-56 bg-white/15 rounded-full blur-[50px] pointer-events-none"></div>

                <img 
                  src={isStrawberryProduct ? '/product-2.png' : '/gpt-7.jpeg'} 
                  alt={displayName} 
                  className="relative z-10 max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] xl:max-h-[560px] w-auto object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* RIGHT COLUMN: Ingredients 04, 05, 06 */}
              <div className="w-full lg:w-5/12 space-y-10 sm:space-y-14 order-3">
                {STRAWBERRY_INGREDIENTS.slice(3, 6).map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start lg:items-center justify-start gap-3 sm:gap-4 group"
                  >
                    {/* Connector Line pointing towards Text from Center Bottle */}
                    <div className="hidden lg:flex items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#D4AF6A] shadow-[0_0_12px_#D4AF6A] ring-4 ring-white/10"></div>
                      <div className="w-12 xl:w-20 h-0.5 bg-gradient-to-r from-[#D4AF6A] via-[#D4AF6A] to-transparent"></div>
                    </div>

                    {/* Content on Right (Desktop text-left) */}
                    <div className="text-left flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 text-[#E8D3A5] font-sans font-bold text-xs tracking-wider mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#E8D3A5] text-[11px] font-bold">
                          {item.number}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]"></span>
                      </div>

                      <h3 className="font-sans text-base sm:text-lg lg:text-xl font-bold text-[#D4AF6A] group-hover:text-[#E8D3A5] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <div className="w-8 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>

                      <p className="font-sans text-xs sm:text-sm text-white leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* PRODUCT BENEFITS SECTION (Cards Grid) */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] relative overflow-hidden">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-[#F7D6DF]/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-[#D4AF6A]/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          
          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Sensory & Wellness Advantages
              </span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2225] tracking-tight">
              Benefits of {displayName}
            </h2>

            <div className="w-12 h-0.5 bg-[#D4AF6A] rounded-full mx-auto my-2"></div>

            <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed max-w-xl mx-auto">
              Silky, skin-friendly, and thoughtfully crafted — discover the key benefits that elevate every intimate moment.
            </p>
          </div>

          {/* 4 Cards In A Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {STRAWBERRY_BENEFITS.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.number}
                  className="relative bg-white rounded-3xl p-6 sm:p-7 text-left shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border border-[#F7D6DF] overflow-hidden min-h-[220px]"
                >
                  {/* Top Right Corner Dark Pink Circle with Number */}
                  <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center pt-3.5 pr-3.5 sm:pt-4 sm:pr-4 shadow-sm border border-[#F7D6DF]/40 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
                    <span className="font-sans font-bold text-xs sm:text-sm tracking-wider">
                      {item.number}
                    </span>
                  </div>

                  {/* Top Left Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-xs group-hover:scale-110 group-hover:bg-[#9E3F5C] group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Middle Content */}
                  <div className="mt-5 space-y-2">
                    <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug">
                      {item.title}
                    </h3>

                    <div className="w-7 h-0.5 bg-[#D4AF6A] rounded-full my-1.5"></div>

                    <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW TO USE SECTION (PARALLAX WITH IMG-20) */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
        {/* Background Image with Smooth Parallax effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed filter brightness-90"
          style={{ backgroundImage: "url('/Img-20.png')" }}
        >
          {/* Dark Luxury Overlay matching Homepage Parallax section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/85 via-[#2B2225]/65 to-[#2B2225]/75 backdrop-blur-[1px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Centered Header & Application Description */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-[#E8D3A5]/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#E8D3A5]">
                Application Guide
              </span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              How to Use {displayName}?
            </h2>

              {/* Golden Touch Divider */}
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#E8D3A5] to-transparent mx-auto my-2.5"></div>

              <p className="font-sans text-sm sm:text-base text-white/95 leading-relaxed font-medium max-w-4xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Check the pack before you use it. Make sure the seal is intact and the expiry date is valid. Wash your hands first, since clean hands keep the product hygienic. Apply a small amount and add more if you need it [confirm on label]. Water-based formulas can dry out with time, so reapply as needed [confirm on label]. When you finish, close the pack tightly and store it in a cool, dry, well-ventilated place, away from heat and food.
              </p>
            </div>

          </div>
        </section>

      {/* SAFETY INFORMATION SECTION */}
      <section className="pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14">
          
          {/* Centered Header & Tagline */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#D4AF6A]/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A] animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Safety & Precautions
              </span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
              Safety Information and Precautions
            </h2>

            {/* Golden Touch Divider */}
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2.5"></div>
          </div>

          {/* Safety Information Cards Grid (6 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {STRAWBERRY_SAFETY_POINTS.map((item) => (
              <div
                key={item.number}
                className="relative bg-gradient-to-br from-[#8A334D] to-[#6E2339] border border-[#D4AF6A]/35 hover:border-[#D4AF6A] p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl hover:shadow-[#8A334D]/25 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group overflow-hidden"
              >
                {/* Top Row: Bold Number Digit & Golden Sparkle */}
                <div className="flex items-center justify-between pb-2">
                  <span className="font-sans text-3xl sm:text-4xl font-black text-[#FFDF78] drop-shadow-sm tracking-tight">
                    {item.number}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#FFDF78] opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Content: Title & Full Description */}
                <div className="space-y-2 mt-2">
                  <h4 className="font-sans text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-[#FFF0F4]/90 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Subtle Golden Accent Line */}
                <div className="w-8 h-0.5 bg-[#D4AF6A] mt-4 rounded-full group-hover:w-16 transition-all duration-300"></div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AFFORDABLE PRICING SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14">
          
          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#D4AF6A]/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A] animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Transparent Value
              </span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
              {displayName} at an Affordable Price
            </h2>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2.5"></div>

              <div className="space-y-1">
                <p className="font-sans text-sm sm:text-base text-[#5A4B50] leading-relaxed font-normal">
                  Clear pricing in USD. No hidden charges.
                </p>
                <p className="font-sans text-xs sm:text-sm text-[#7A6B70] font-medium">
                  Sales tax is added at checkout where it applies.
                </p>
              </div>
            </div>

            {/* Pricing Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
              
              {/* Card 1: 100ml */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-[#F7D6DF] hover:border-[#D4AF6A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold uppercase tracking-wider">
                      save 20%
                    </span>
                    <span className="text-xs font-medium text-[#7A6B70]">Single Pack</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#2B2225]">
                      100ml
                    </h3>
                    <p className="text-xs text-[#5A4B50] mt-1">
                      Compact discovery size
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-3xl sm:text-4xl font-black text-[#2B2225] tracking-tight">
                        $31.99
                      </span>
                      <span className="font-sans text-base text-[#7A6B70] line-through font-medium">
                        $39.99
                      </span>
                      <span className="text-xs text-[#7A6B70] font-medium">USD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F7D6DF]/60">
                  <button
                    onClick={() => { 
                      setSelectedSize('100ml'); 
                      setQuantity(1);
                      handleAddToCartClick(1, '100ml', true); 
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#FDF2F5] hover:bg-[#9E3F5C] text-[#9E3F5C] hover:text-white border border-[#F7D6DF] hover:border-[#9E3F5C] font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Select 100ml</span>
                  </button>
                </div>
              </div>

              {/* Card 2: 2 x 100ml (Featured) */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF6A] shadow-xl shadow-[#D4AF6A]/15 flex flex-col justify-between group transform md:-translate-y-2">
                {/* Popular Ribbon / Top Tag */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#9E3F5C] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    <Sparkles className="w-3 h-3 text-[#E8D3A5]" />
                    <span>Most Popular</span>
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF7E8] border border-[#D4AF6A]/50 text-[#B88A3B] text-xs font-bold uppercase tracking-wider">
                      save 20%
                    </span>
                    <span className="text-xs font-medium text-[#7A6B70]">Twin Pack</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#2B2225]">
                      2 x 100ml
                    </h3>
                    <p className="text-xs text-[#5A4B50] mt-1">
                      Twin-pack for regular intimate use
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-3xl sm:text-4xl font-black text-[#2B2225] tracking-tight">
                        $63.98
                      </span>
                      <span className="font-sans text-base text-[#7A6B70] line-through font-medium">
                        $79.98
                      </span>
                      <span className="text-xs text-[#7A6B70] font-medium">USD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F7D6DF]/60">
                  <button
                    onClick={() => { 
                      setSelectedSize('100ml'); 
                      setQuantity(2);
                      handleAddToCartClick(2, '100ml', true); 
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#9E3F5C]/25"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Select Twin Pack</span>
                  </button>
                </div>
              </div>

              {/* Card 3: 3 x 100ml bundle */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-[#F7D6DF] hover:border-[#D4AF6A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#9E3F5C]/30 text-[#9E3F5C] text-xs font-bold uppercase tracking-wider">
                      save 20%
                    </span>
                    <span className="text-xs font-medium text-[#7A6B70]">Bundle Pack</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#2B2225]">
                      3 x 100ml bundle
                    </h3>
                    <p className="text-xs text-[#5A4B50] mt-1">
                      Three-bottle bundle for maximum value
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-3xl sm:text-4xl font-black text-[#2B2225] tracking-tight">
                        $95.97
                      </span>
                      <span className="font-sans text-base text-[#7A6B70] line-through font-medium">
                        $119.97
                      </span>
                      <span className="text-xs text-[#7A6B70] font-medium">USD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F7D6DF]/60">
                  <button
                    onClick={() => { 
                      setSelectedSize('100ml'); 
                      setQuantity(3);
                      handleAddToCartClick(3, '100ml', true); 
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF6A] via-[#E8D3A5] to-[#B88A3B] hover:brightness-105 text-[#2B2225] font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#2B2225]" />
                    <span>Select Bundle</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

      {/* TOUCH OF LOVE STRAWBERRY SHIPPING & RETURNS USA SECTION */}
      {isStrawberryProduct && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
          <div className="max-w-6xl mx-auto space-y-14 sm:space-y-16">
            
            {/* Centered Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#D4AF6A]/40 shadow-xs">
                <Truck className="w-3.5 h-3.5 text-[#9E3F5C]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Nationwide Fulfillment
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
                Shipping and Returns in the USA
              </h2>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2.5"></div>

              <p className="font-sans text-sm sm:text-base text-[#5A4B50] leading-relaxed font-normal max-w-xl mx-auto">
                Fast, dependable delivery and 100% confidential packaging delivered straight to your door across all 50 states.
              </p>
            </div>

            {/* 3 Shipping Cards with Floating Center Top Icons (Half above, half inside) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto pt-6 items-stretch">
              
              {/* Card 1: Delivery Time */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 pt-10 sm:pt-12 text-center border border-[#F7D6DF] hover:border-[#D4AF6A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                {/* Floating Top-Center Icon (Half outside, half inside) */}
                <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-[#9E3F5C] to-[#7C2F47] text-white border-2 border-[#D4AF6A] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(158,63,92,0.35)] transition-all duration-300">
                  <Truck className="w-5 sm:w-6 h-5 sm:h-6 text-[#E8D3A5]" />
                </div>

                <div className="space-y-3 mt-1">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2B2225] tracking-tight">
                    Delivery time
                  </h3>
                  
                  <div className="w-8 h-0.5 bg-[#D4AF6A] mx-auto rounded-full"></div>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                    [3–7 business days] to all 50 states.
                  </p>
                </div>
              </div>

              {/* Card 2: Discreet Packaging */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 pt-10 sm:pt-12 text-center border border-[#F7D6DF] hover:border-[#D4AF6A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                {/* Floating Top-Center Icon (Half outside, half inside) */}
                <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-[#9E3F5C] to-[#7C2F47] text-white border-2 border-[#D4AF6A] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(158,63,92,0.35)] transition-all duration-300">
                  <Package className="w-5 sm:w-6 h-5 sm:h-6 text-[#E8D3A5]" />
                </div>

                <div className="space-y-3 mt-1">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2B2225] tracking-tight">
                    Discreet packaging
                  </h3>

                  <div className="w-8 h-0.5 bg-[#D4AF6A] mx-auto rounded-full"></div>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                    Your parcel arrives in a plain box with no product name outside.
                  </p>
                </div>
              </div>

              {/* Card 3: Order Tracking */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 pt-10 sm:pt-12 text-center border border-[#F7D6DF] hover:border-[#D4AF6A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                {/* Floating Top-Center Icon (Half outside, half inside) */}
                <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-[#9E3F5C] to-[#7C2F47] text-white border-2 border-[#D4AF6A] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(158,63,92,0.35)] transition-all duration-300">
                  <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-[#E8D3A5]" />
                </div>

                <div className="space-y-3 mt-1">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2B2225] tracking-tight">
                    Order tracking
                  </h3>

                  <div className="w-8 h-0.5 bg-[#D4AF6A] mx-auto rounded-full"></div>

                  <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed font-normal">
                    We email a tracking number once your order ships.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* TOUCH OF LOVE STRAWBERRY REVIEWS SECTION (HOME PAGE TESTIMONIALS STYLE) */}
      {isStrawberryProduct && (
        <section className="py-16 sm:py-24 px-0 bg-gradient-to-b from-[#FFF9F5] via-[#FDF2F5]/80 to-[#FFF9F5] overflow-hidden relative font-sans">
          
          {/* Background Soft Glow Accents */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#E8D3A5]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full space-y-6 relative z-10">
            
            {/* Section Header */}
            <div className="text-center max-w-xl mx-auto px-4 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4AF6A]/40 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  Verified Client Feedback
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
                Touch of Love Strawberry Reviews
              </h2>

              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2"></div>

              <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                Real feedback from clients across the USA who have embraced Touch of Love Strawberry in their intimate rituals.
              </p>
            </div>

            {/* CAROUSEL STAGE CONTAINER */}
            <div 
              className="relative w-full overflow-hidden pt-4 pb-20 sm:pb-24"
              onMouseEnter={() => setIsReviewHovered(true)}
              onMouseLeave={() => setIsReviewHovered(false)}
              onTouchStart={handleReviewTouchStart}
              onTouchEnd={handleReviewTouchEnd}
            >
              
              {/* LEFT NAVIGATION BUTTON */}
              <button
                onClick={handlePrevReview}
                className="absolute left-3 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white flex items-center justify-center shadow-pink-glow transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* RIGHT NAVIGATION BUTTON */}
              <button
                onClick={handleNextReview}
                className="absolute right-3 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white flex items-center justify-center shadow-pink-glow transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* SLIDING TRACK: CENTERING THE ACTIVE CARD PERFECTLY */}
              <div 
                className="flex items-center gap-6 sm:gap-8 transition-transform duration-600 ease-out"
                style={{
                  transform: `translateX(calc(50% - (min(85vw, 540px) / 2) - (${currentReviewIndex} * (min(85vw, 540px) + 24px))))`,
                  willChange: 'transform'
                }}
              >
                {STRAWBERRY_REVIEWS.map((item, idx) => {
                  const isActive = idx === currentReviewIndex;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleReviewDotClick(idx)}
                      className={`w-[85vw] sm:w-[500px] lg:w-[540px] flex-shrink-0 transition-all duration-500 py-4 ${
                        isActive 
                          ? 'opacity-100 scale-100 z-20 pointer-events-auto shadow-luxury' 
                          : 'opacity-35 hover:opacity-75 scale-95 z-10 cursor-pointer filter blur-[0.2px]'
                      }`}
                    >
                      {/* LUXURY CARD SHAPE MATCHING HOME PAGE */}
                      <div className="relative bg-white rounded-3xl border border-[#F7D6DF] shadow-sm p-6 sm:p-10 pb-16 text-center space-y-4 transition-all duration-300 hover:shadow-pink-glow">
                        
                        {/* Star Rating in Gold */}
                        <div className="flex items-center justify-center gap-1 text-[#D4AF6A]">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#D4AF6A]" />
                          ))}
                        </div>

                        {/* Client Name */}
                        <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#9E3F5C] tracking-tight">
                          {item.name}
                        </h3>

                        {/* Role & Location Subtitle */}
                        <p className="font-sans text-xs sm:text-sm font-medium text-[#5A4B50]">
                          {item.role}
                        </p>

                        {/* Decorative Gold Accent Line */}
                        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2"></div>

                        {/* Review Quote Body */}
                        <p className="font-sans text-xs sm:text-sm lg:text-base text-[#2B2225] font-normal leading-relaxed italic max-w-md mx-auto px-1 sm:px-4">
                          "{item.quote}"
                        </p>

                        {/* BOTTOM OVERLAPPING AVATAR BUBBLE & VERIFIED BADGE */}
                        <div className="absolute -bottom-11 sm:-bottom-13 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                          
                          {/* Avatar Image Bubble */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#9E3F5C] text-white flex items-center justify-center p-0.5 transform transition-transform duration-300 hover:scale-105">
                            <img 
                              src={item.avatar} 
                              alt={item.name} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>

                          {/* Verified Client Badge Pill */}
                          <div className="mt-1 px-4 py-1 rounded-full bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow flex items-center justify-center text-[10px] font-bold tracking-wider uppercase border border-white/60">
                            <span>Verified Buyer</span>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* BOTTOM PAGINATION DOTS */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {STRAWBERRY_REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReviewDotClick(idx)}
                  className={`transition-all duration-300 cursor-pointer ${
                    idx === currentReviewIndex
                      ? 'w-8 h-2.5 bg-[#9E3F5C] rounded-full shadow-xs'
                      : 'w-2.5 h-2.5 bg-[#F7D6DF] hover:bg-[#9E3F5C]/60 rounded-full'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </section>
      )}

      {/* TOUCH OF LOVE STRAWBERRY FAQS & BUY ONLINE SECTION */}
      {isStrawberryProduct && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] relative font-sans overflow-hidden">
          
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-10 right-10 w-80 h-80 bg-[#F7D6DF]/40 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E8D3A5]/30 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16 relative z-10">
            
            {/* SECTION HEADER */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                  FAQ & Care Guide
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2B2225] tracking-tight">
                Touch of Love Strawberry FAQs
              </h2>

              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto my-2"></div>

              <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal leading-relaxed">
                Clear answers regarding formula specifications, origin, safety precautions, and ordering across the USA.
              </p>
            </div>

            {/* FAQS ACCORDION LIST */}
            <div className="space-y-3.5">
              {STRAWBERRY_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'bg-white border-[#9E3F5C]/40 shadow-pink-glow' 
                        : 'bg-white/80 border-[#F7D6DF] hover:border-[#9E3F5C]/30 hover:bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                      className="w-full px-5 sm:px-7 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left font-sans focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-200 ${
                        isOpen ? 'text-[#9E3F5C]' : 'text-[#2B2225]'
                      }`}>
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen 
                          ? 'bg-[#FDF2F5] text-[#9E3F5C] rotate-180 border border-[#F7D6DF]' 
                          : 'bg-[#FFF9F5] text-[#5A4B50] border border-[#F7D6DF]'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Expandable Answer */}
                    {isOpen && (
                      <div className="px-5 sm:px-7 pb-5 pt-1 border-t border-[#F7D6DF]/40 animate-fade-up">
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
        </section>
      )}

      {/* BUY TOUCH OF LOVE STRAWBERRY ONLINE CTA SECTION (MATCHING HOMEPAGE CTA STYLE) */}
      {isStrawberryProduct && (
        <section className="w-full bg-[#FDF2F5] py-12 sm:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Banner Card with Image-17 background */}
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex items-center p-6 sm:p-10 lg:p-14 group shadow-xl border border-[#E8D3A5]/30 bg-[#9E3F5C]">
              
              {/* Background Image */}
              <img 
                src={image17} 
                alt="Buy Touch of Love Strawberry Online" 
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 group-hover:scale-100"
              />
              
              {/* Subtle Overlays for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B2225]/90 via-[#2B2225]/75 to-[#2B2225]/45 sm:to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/75 via-transparent to-[#2B2225]/40"></div>

              {/* Banner Content Grid */}
              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Side Text Content */}
                <div className="lg:col-span-8 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-[#E8D3A5]/40 text-[#E8D3A5]">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF6A]" />
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFF9F5]">
                      Discreet Delivery Across USA
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E8D3A5] leading-tight tracking-tight drop-shadow-md">
                    Buy Touch of Love Strawberry Online
                  </h2>

                  <p className="font-sans text-xs sm:text-sm lg:text-base text-[#FFF9F5]/90 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
                    Ready to order Touch of Love Strawberry? Choose the 100ml size, enter your shipping details, and check out securely. Once your order ships, you can track it from your email. Your parcel arrives in plain, discreet packaging across the USA.
                  </p>
                </div>

                {/* Right Side: Just Add to Cart Button */}
                <div className="lg:col-span-4 relative z-10 flex items-center justify-start lg:justify-end">
                  <button
                    onClick={handleAddToCartClick}
                    className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#D4AF6A] via-[#E8D3A5] to-[#B88A3B] hover:brightness-110 active:scale-95 text-[#2B2225] font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#2B2225]" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

    </div>
  );
}
