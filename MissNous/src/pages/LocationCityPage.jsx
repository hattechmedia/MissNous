import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Droplets,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Waves,
  X,
} from 'lucide-react';
import { CityDeliveryMap } from '../components/DeliveryMap';
import { LOCATIONS, getLocationBySlug } from '../data/locations';
import { PRODUCTS } from '../data/products';
import { CITY_PAGES_CONTENT, SHARED_CITY_BLOCKS } from '../data/cityPagesContent';

const CITY_PHOTO_FALLBACK =
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80';

const STEP_ICONS = {
  1: Sparkles,
  2: Droplets,
  3: Repeat,
  4: Waves,
};

const DUO_PRODUCTS_IMAGE = '/gpt-11-rem.png';
const WHY_CHOOSE_DUO_IMAGE = '/images/why-choose-duo.png';
const PURITY_TRANSPARENCY_IMAGE = '/images/purity-transparency.png';

function pickFlavourProducts(products) {
  const list = products?.length ? products : PRODUCTS;
  const strawberry =
    list.find((p) => (p.name || '').toLowerCase().includes('strawberry')) || list[0];
  const pineapple =
    list.find((p) => (p.name || '').toLowerCase().includes('pineapple')) || list[1] || list[0];
  return { strawberry, pineapple };
}

function HeroLocalShowcase({ cityData, distanceLabel }) {
  const badgeParts = (cityData?.hero?.floatingBadge || 'Near you · Local delivery available').split('·');
  const badgeTitle = badgeParts[0]?.trim() || 'Near you';
  const badgeSub = badgeParts[1]?.trim() || 'Local delivery available';
  const pillText = cityData?.hero?.pillLabel || (distanceLabel ? `${distanceLabel} from Newark` : 'Dispatched from Newark');

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto aspect-[1/1] sm:aspect-[5/4] flex items-center justify-center">
      {/* Soft Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-[#9E3F5C]/25 blur-3xl animate-[pulseGlow_4s_ease-in-out_infinite]" />

      {/* Main Oval/Circle Stage with Luxury Border */}
      <div className="relative w-[88%] aspect-square rounded-full border border-[#E8D3A5]/40 bg-gradient-to-b from-[#5c2438]/90 via-[#2B2225] to-[#1a1214] shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Soft Radial Gold/Rose Glow behind bottles */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(212,175,106,0.4) 0%, rgba(158,63,92,0.3) 50%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.1] bg-[length:24px_24px] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]" />

        {/* Transparent Duo Bottle Image */}
        <div className="relative z-20 w-full h-full flex items-center justify-center p-6 sm:p-8">
          <img
            src={DUO_PRODUCTS_IMAGE}
            alt="Miss Nous Strawberry and Pineapple intimate lubricants"
            className="w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-[float_6s_ease-in-out_infinite]"
          />
        </div>

        {/* Ambient Badge Pins */}
        <div className="absolute z-30 w-8 h-8 rounded-full bg-[#D4AF6A] flex items-center justify-center shadow-lg ring-2 ring-white/30 top-[12%] left-[14%]">
          <MapPin className="w-4 h-4 text-[#2B2225]" />
        </div>
        <div className="absolute z-30 w-8 h-8 rounded-full bg-[#9E3F5C] flex items-center justify-center shadow-lg ring-2 ring-white/30 top-[76%] left-[16%]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="absolute z-30 w-8 h-8 rounded-full bg-[#D4AF6A] flex items-center justify-center shadow-lg ring-2 ring-white/30 top-[56%] right-[10%]">
          <ShoppingBag className="w-4 h-4 text-[#2B2225]" />
        </div>
      </div>

      {/* Floating Near You Pill Badge from docx */}
      <div className="absolute top-2 right-0 sm:right-2 z-30 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 px-4 py-3 text-white shadow-xl max-w-[200px]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8D3A5]">{badgeTitle}</p>
        <p className="text-xs font-semibold mt-0.5">{badgeSub}</p>
        <MapPin className="w-4 h-4 text-[#E8D3A5] mt-1.5" />
      </div>

      {/* Distance / Dispatch Pill Label from docx */}
      <div className="absolute bottom-6 -right-1 sm:right-2 z-30 inline-flex items-center gap-2 rounded-full bg-[#2B2225]/90 backdrop-blur border border-[#E8D3A5]/40 px-4 py-2 text-white text-xs font-bold shadow-lg">
        <Car className="w-4 h-4 text-[#E8D3A5]" />
        <span>{pillText}</span>
      </div>
    </div>
  );
}

export default function LocationCityPage({
  slug,
  products = [],
  onNavigate,
  onViewProduct,
  onAddToCart,
}) {
  const location = useMemo(() => getLocationBySlug(slug), [slug]);
  const cityData = useMemo(() => {
    const key = (slug || 'newark').toLowerCase();
    return CITY_PAGES_CONTENT[key] || CITY_PAGES_CONTENT.newark;
  }, [slug]);

  const { strawberry, pineapple } = useMemo(() => pickFlavourProducts(products), [products]);
  const [heroImgError, setHeroImgError] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // SEO metadata setup matching docx specifications exactly
  useEffect(() => {
    if (!cityData) return;

    document.title = cityData.seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    let createdDesc = false;
    let prevDesc = '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      createdDesc = true;
    } else {
      prevDesc = metaDesc.getAttribute('content') || '';
    }
    metaDesc.setAttribute('content', cityData.seo.metaDescription);

    // Self-referencing canonical tag as specified in docx
    let canonical = document.querySelector('link[rel="canonical"]');
    let createdCanonical = false;
    let prevCanonical = '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
      createdCanonical = true;
    } else {
      prevCanonical = canonical.getAttribute('href') || '';
    }
    canonical.setAttribute('href', `https://missnous.com${cityData.seo.url}`);

    return () => {
      if (createdDesc) metaDesc.remove();
      else metaDesc.setAttribute('content', prevDesc);

      if (createdCanonical) canonical.remove();
      else canonical.setAttribute('href', prevCanonical);
    };
  }, [cityData]);

  useEffect(() => {
    if (location || !slug) return;
    if (onNavigate) onNavigate('locations');
  }, [location, slug, onNavigate]);

  if (!location) {
    return (
      <div className="min-h-[50vh] pt-32 text-center text-[#5A4B50] font-sans">
        Loading location…
      </div>
    );
  }

  const cityImage = heroImgError ? CITY_PHOTO_FALLBACK : location.image;

  const goShop = () => onNavigate && onNavigate('shop');
  const goProduct = (prod) => {
    if (onViewProduct && prod) onViewProduct(prod);
    else if (onNavigate) onNavigate('shop');
  };
  const addProduct = (prod) => {
    if (onAddToCart && prod) onAddToCart(prod, 1);
    else goProduct(prod);
  };

  const heroButtons = (cityData.hero.buttons || 'Shop Local Delivery · Compare Flavours').split('·');
  const primaryHeroBtn = heroButtons[0]?.trim() || `Shop ${location.name} Delivery`;
  const secondaryHeroBtn = heroButtons[1]?.trim() || 'Compare Flavours';

  return (
    <div className="bg-[#FFF9F5] text-[#2B2225] font-sans overflow-x-hidden selection:bg-[#F7D6DF] selection:text-[#9E3F5C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION – City-Specific SEO Angle & Heading
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col pt-24 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B2225] via-[#5c2438] to-[#2B2225]" />
        <img
          src={cityImage}
          alt={location.imageAlt || `Miss Nous intimate lubricant delivery in ${location.name}`}
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          onError={() => setHeroImgError(true)}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23E8D3A5\' stroke-width=\'0.5\' fill=\'none\' opacity=\'0.35\'/%3E%3C/svg%3E")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2225]/95 via-[#2B2225]/80 to-[#9E3F5C]/25" />

        {/* Breadcrumb matching docx */}
        <nav
          aria-label="Breadcrumb"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full pb-4 text-xs sm:text-sm text-[#F7D6DF]"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('locations')}
                className="font-semibold text-white hover:text-[#E8D3A5] transition-colors"
              >
                Locations
              </button>
            </li>
            <li aria-hidden className="opacity-60">
              /
            </li>
            <li className="font-medium text-white">{location.name}</li>
          </ol>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full flex-1 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" />
              {cityData.hero.eyebrow}
            </p>

            {/* H1 Heading (Exact line 1 & line 2 from docx) */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.06]">
              {cityData.hero.h1Line1} <br />
              <span className="bg-gradient-to-r from-[#E8D3A5] to-[#FFF9F5] bg-clip-text text-transparent">
                {cityData.hero.h1Line2}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#F7D6DF] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {cityData.hero.subhead}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
              <button
                type="button"
                onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9E3F5C] text-white font-bold text-xs uppercase tracking-wider shadow-pink-glow hover:bg-[#8a3650] transition-colors border border-[#E8D3A5]/20 cursor-pointer"
              >
                <span>{primaryHeroBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('loc-flavour')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#E8D3A5]/50 text-[#FFF9F5] font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>{secondaryHeroBtn}</span>
              </button>
            </div>
          </div>

          <div className="w-full pb-4 lg:pb-0">
            <HeroLocalShowcase cityData={cityData} distanceLabel={location.distanceLabel} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PRODUCTS SECTION – Exact Copy & Product Cards
      ───────────────────────────────────────────────────────────── */}
      <section id="loc-shop" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#2B2225] scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cityData.productsHeader.eyebrow}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
              {cityData.productsHeader.heading}
            </h2>
            <p className="text-[#F7D6DF]/80 text-sm sm:text-base leading-relaxed">
              {cityData.productsHeader.subline}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Strawberry Card */}
            <article className="group bg-[#361A23] rounded-3xl sm:rounded-[2.5rem] border border-[#9E3F5C]/40 hover:border-[#9E3F5C] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              <div
                onClick={() => goProduct(strawberry)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={strawberry?.image || '/jpt-6.jpeg'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#361A23]/40 pointer-events-none" />

                <img
                  src={strawberry?.image || '/jpt-6.jpeg'}
                  alt={`Miss Nous Strawberry intimate lubricant delivered in ${location.name} NJ`}
                  className="relative z-10 max-h-full max-w-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Diagonal Corner Ribbon (Discounted Offer) - Large & Seamless */}
                <div className="absolute top-[60px] sm:top-[68px] left-[60px] sm:left-[68px] -translate-x-1/2 -translate-y-1/2 -rotate-45 w-[290px] sm:w-[330px] py-2 sm:py-2.5 bg-gradient-to-r from-[#501525] via-[#A84260] to-[#501525] text-[#FFF9F5] font-sans text-xs sm:text-[13px] font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(0,0,0,0.65)] border-y-2 border-[#E8D3A5]/60 flex items-center justify-center gap-2 leading-none pointer-events-none z-20">
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E8D3A5] flex-shrink-0" />
                  <span className="whitespace-nowrap">Discounted Offer</span>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 z-20">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#9E3F5C] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                    Strawberry Edition
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E8D3A5] text-[10px] sm:text-[11px] font-bold border border-white/10">
                    100ml
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    Flavoured intimate lubricant (100ml)
                  </span>
                  <h3
                    onClick={() => goProduct(strawberry)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    Miss Nous Intimate Lubricant – Strawberry
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    A silky, water-based lubricant with a sweet strawberry flavour. Non-sticky and rinses clean with water.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">$31.99</span>
                    <span className="text-sm line-through text-white/50">$39.99</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9E3F5C]/40 border border-[#9E3F5C] text-[#FFF9F5] text-[11px] font-bold">
                      20% Off
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => addProduct(strawberry)}
                      className="py-3 px-4 bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goProduct(strawberry)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Pineapple Card */}
            <article className="group bg-[#302616] rounded-3xl sm:rounded-[2.5rem] border border-[#D4AF6A]/40 hover:border-[#D4AF6A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              <div
                onClick={() => goProduct(pineapple)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={pineapple?.image || '/gpt-5.png'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#302616]/40 pointer-events-none" />

                <img
                  src={pineapple?.image || '/gpt-5.png'}
                  alt={`Miss Nous Pineapple intimate lubricant delivered in ${location.name} NJ`}
                  className="relative z-10 max-h-full max-w-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Diagonal Corner Ribbon (Discounted Offer) - Large & Seamless */}
                <div className="absolute top-[60px] sm:top-[68px] left-[60px] sm:left-[68px] -translate-x-1/2 -translate-y-1/2 -rotate-45 w-[290px] sm:w-[330px] py-2 sm:py-2.5 bg-gradient-to-r from-[#501525] via-[#A84260] to-[#501525] text-[#FFF9F5] font-sans text-xs sm:text-[13px] font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(0,0,0,0.65)] border-y-2 border-[#E8D3A5]/60 flex items-center justify-center gap-2 leading-none pointer-events-none z-20">
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E8D3A5] flex-shrink-0" />
                  <span className="whitespace-nowrap">Discounted Offer</span>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 z-20">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#D4AF6A] text-[#2B2225] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                    Pineapple Edition
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E8D3A5] text-[10px] sm:text-[11px] font-bold border border-white/10">
                    100ml
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    Flavoured intimate lubricant (100ml)
                  </span>
                  <h3
                    onClick={() => goProduct(pineapple)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    Miss Nous Intimate Lubricant – Pineapple
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    A silky, water-based lubricant with a light, tropical pineapple flavour. Non-sticky and rinses clean with water.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">$31.99</span>
                    <span className="text-sm line-through text-white/50">$39.99</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF6A]/30 border border-[#D4AF6A] text-[#E8D3A5] text-[11px] font-bold">
                      20% Off
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => addProduct(pineapple)}
                      className="py-3 px-4 bg-[#D4AF6A] hover:bg-[#c29c54] text-[#2B2225] font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goProduct(pineapple)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHY CHOOSE MISS NOUS IN {CITY}? – City-Tailored Angle & 6 Cards
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Why Choose Miss Nous
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225] tracking-tight">
              Why Choose Miss Nous in {location.name}?
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
              {cityData.whyChoose.intro}
            </p>
          </div>

          {/* 3-Column Luxury Stage: Left Benefits (3) | Center Duo Showcase | Right Benefits (3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left 3 Cards */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-2 lg:order-1">
              {cityData.whyChoose.cards.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] font-bold text-sm flex-shrink-0 group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Duo Showcase Stage (Exact from docx) */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#2B2225] via-[#3d1824] to-[#1c1316] border border-[#E8D3A5]/40 p-6 sm:p-8 text-center text-white shadow-2xl flex flex-col items-center justify-between min-h-[460px] sm:min-h-[500px]">
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 45%, rgba(212,175,106,0.45) 0%, rgba(158,63,92,0.3) 50%, transparent 75%)',
                  }}
                />

                <div className="relative z-10 space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#E8D3A5]/40 text-[#E8D3A5] text-[11px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Signature Duo
                  </span>
                  <p className="text-xs text-[#F7D6DF]/80 pt-1">Strawberry &amp; Pineapple (100ml)</p>
                </div>

                <div className="relative z-10 my-4 w-full flex items-center justify-center">
                  <div className="relative w-full max-w-[320px] aspect-[1024/935] flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full bg-[#9E3F5C]/25 blur-2xl pointer-events-none animate-pulse" />
                    <img
                      src={WHY_CHOOSE_DUO_IMAGE}
                      alt={`Miss Nous Strawberry and Pineapple intimate lubricants in ${location.name}`}
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="relative z-10 w-full space-y-3 pt-2 border-t border-white/15">
                  <p className="text-[11px] text-[#E8D3A5] font-semibold tracking-wide">
                    Water-Based · pH 4.5 · Rinses Clean
                  </p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#9E3F5C] to-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-pink-glow hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Shop Both Flavours
                  </button>
                </div>
              </div>
            </div>

            {/* Right 3 Cards */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-3">
              {cityData.whyChoose.cards.slice(3, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] font-bold text-sm flex-shrink-0 group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300">
                      {idx + 4}
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FLAVOUR GUIDE: Which Flavour Should You Choose?
      ───────────────────────────────────────────────────────────── */}
      <section id="loc-flavour" className="py-16 sm:py-20 bg-[#FDF2F5] border-y border-[#F7D6DF] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Flavour Selection</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2225]">
              Which flavour should you choose?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-[#F7D6DF] shadow-luxury">
            {/* Strawberry Guide Card */}
            <div className="p-8 sm:p-10 space-y-5 bg-[#9E3F5C] text-white flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#E8D3A5]">
                  {SHARED_CITY_BLOCKS.flavourGuide.strawberry.eyebrow}
                </p>
                <h3 className="font-serif text-3xl font-bold">Strawberry</h3>
                <p className="text-sm text-white/90 font-medium">
                  {SHARED_CITY_BLOCKS.flavourGuide.strawberry.mood}
                </p>
                <dl className="space-y-3 text-sm pt-2 border-t border-white/20">
                  <div>
                    <dt className="font-bold text-[#E8D3A5]">Best for</dt>
                    <dd className="text-white/90 text-xs sm:text-sm mt-0.5">
                      {SHARED_CITY_BLOCKS.flavourGuide.strawberry.bestFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#E8D3A5]">Feel</dt>
                    <dd className="text-white/90 text-xs sm:text-sm mt-0.5">
                      {SHARED_CITY_BLOCKS.flavourGuide.strawberry.feel}
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={() => goProduct(strawberry)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#E8D3A5] hover:text-white transition-colors cursor-pointer"
              >
                <span>Select Strawberry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pineapple Guide Card */}
            <div className="p-8 sm:p-10 space-y-5 bg-[#FFF9F5] text-[#2B2225] flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">
                  {SHARED_CITY_BLOCKS.flavourGuide.pineapple.eyebrow}
                </p>
                <h3 className="font-serif text-3xl font-bold">Pineapple</h3>
                <p className="text-sm text-[#5A4B50] font-medium">
                  {SHARED_CITY_BLOCKS.flavourGuide.pineapple.mood}
                </p>
                <dl className="space-y-3 text-sm pt-2 border-t border-[#F7D6DF]">
                  <div>
                    <dt className="font-bold text-[#9E3F5C]">Best for</dt>
                    <dd className="text-[#5A4B50] text-xs sm:text-sm mt-0.5">
                      {SHARED_CITY_BLOCKS.flavourGuide.pineapple.bestFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#9E3F5C]">Feel</dt>
                    <dd className="text-[#5A4B50] text-xs sm:text-sm mt-0.5">
                      {SHARED_CITY_BLOCKS.flavourGuide.pineapple.feel}
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={() => goProduct(pineapple)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#9E3F5C] hover:text-[#7d2c43] transition-colors cursor-pointer"
              >
                <span>Select Pineapple</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. INGREDIENTS & PRODUCT INFORMATION – Exact SEO Copy
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Ingredients &amp; Product Information
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225] tracking-tight">
              Know What's in the Bottle
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
              {cityData.ingredientsIntro}
            </p>
          </div>

          {/* 4 Icon Tiles from shared blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {SHARED_CITY_BLOCKS.ingredientsInfo.iconTiles.map((tile, idx) => {
              const icons = [ShieldCheck, Droplets, Heart, Leaf];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-md hover:border-[#9E3F5C]/30 transition-all flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] flex items-center justify-center text-[#9E3F5C]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2225]">
                    {tile.title}
                  </h4>
                  <p className="text-xs text-[#5A4B50]">{tile.line}</p>
                </div>
              );
            })}
          </div>

          {/* 3 Ingredient Cards + Studio Purity Showcase Card */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column (7 cols): 3 Ingredient Cards */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {SHARED_CITY_BLOCKS.ingredientsInfo.ingredientCards.map((card, idx) => (
                <div key={idx} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center font-bold text-sm border border-[#F7D6DF]">
                      {card.num}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2225]">
                        {card.heading}
                      </h3>
                      <p className="text-xs text-[#9E3F5C] font-semibold uppercase tracking-wider">
                        {card.subheading}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed pt-1">
                    {card.points}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column (5 cols): Dark Side Card */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#2B2225] via-[#381622] to-[#1E1618] text-white p-7 sm:p-9 border border-[#E8D3A5]/30 shadow-2xl flex flex-col justify-between">
                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    <Sparkles className="w-3.5 h-3.5" />
                    {SHARED_CITY_BLOCKS.ingredientsInfo.darkCard.eyebrow}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {SHARED_CITY_BLOCKS.ingredientsInfo.darkCard.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7D6DF]/80 leading-relaxed">
                    {SHARED_CITY_BLOCKS.ingredientsInfo.darkCard.text}
                  </p>
                </div>

                {/* Visual Image Showcase */}
                <div className="relative z-10 my-6 flex items-center justify-center">
                  <div className="relative w-full max-w-[300px] aspect-[1024/935] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-inner overflow-hidden">
                    <img
                      src={PURITY_TRANSPARENCY_IMAGE}
                      alt={`Miss Nous ingredient transparency and sealed freshness for ${location.name}`}
                      className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Ticks and Button */}
                <div className="relative z-10 pt-4 border-t border-white/15 space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-[#E8D3A5] gap-2">
                    {SHARED_CITY_BLOCKS.ingredientsInfo.darkCard.ticks.map((tick, i) => (
                      <span key={i}>✓ {tick}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#9E3F5C] to-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-pink-glow hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    {SHARED_CITY_BLOCKS.ingredientsInfo.darkCard.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. HOW TO USE WATER-BASED LUBRICANTS (4 Steps)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#2B2225] text-white px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-12">
            How to use water-based lubricants
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-[#9E3F5C]/50" />
            {SHARED_CITY_BLOCKS.howToUse.map((s) => {
              const StepIcon = STEP_ICONS[s.step] || Sparkles;
              return (
                <div key={s.step} className="relative text-center space-y-3">
                  <div className="mx-auto w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-[#9E3F5C] to-[#5c2438] flex items-center justify-center loc-step-icon-glow">
                    <StepIcon className="w-7 h-7 text-[#FFF9F5]" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-[#A09095] px-2 leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. NEIGHBORHOOD COVERAGE – City-Specific Delivery Area
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <MapPin className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                {cityData.neighborhoodCoverage.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225] tracking-tight">
              {cityData.neighborhoodCoverage.heading}
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed">
              {cityData.neighborhoodCoverage.intro}
            </p>
          </div>

          {/* Area Boxes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {cityData.neighborhoodCoverage.cards.map((area, idx) => (
              <div
                key={idx}
                onClick={goShop}
                className="group p-5 sm:p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury hover:shadow-pink-glow hover:border-[#9E3F5C]/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center font-bold text-sm border border-[#F7D6DF] group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-1 rounded-full border border-[#F7D6DF]">
                    <Truck className="w-3 h-3" />
                    {area.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-xs text-[#5A4B50]">{area.line2}</p>
                </div>

                <div className="pt-3 border-t border-[#F7D6DF]/60 flex items-center justify-between text-xs font-semibold text-[#9E3F5C]">
                  <span className="text-[11px] text-[#A09095]">{cityData.neighborhoodCoverage.cardFooter}</span>
                  <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Order <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar: Zip Code Coverage */}
          {cityData.neighborhoodCoverage.zipBar && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#9E3F5C]" />
                  <h4 className="font-serif font-bold text-[#2B2225] text-base">
                    Postal Route Coverage
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                  {cityData.neighborhoodCoverage.zipBar}
                </p>
              </div>

              <button
                type="button"
                onClick={goShop}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-pink-glow transition-all duration-300 flex-shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cityData.neighborhoodCoverage.zipBarButton || `Order to ${location.name}`}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TRUST STRIP (Shipping, Privacy, Support)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-8 lg:px-16 bg-[#9E3F5C]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {SHARED_CITY_BLOCKS.trustStrip.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-3xl p-6 border border-white/20 ${
                i === 1 ? 'bg-[#2B2225] text-white md:-translate-y-3 shadow-xl' : 'bg-white/10 text-white backdrop-blur-sm'
              }`}
            >
              <ShieldCheck className="w-8 h-8 mb-3 text-[#E8D3A5]" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. CUSTOMER REVIEWS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Client Reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2225]">
              Real Customer Feedback
            </h2>
            <p className="text-sm text-[#5A4B50]">
              {cityData.reviewsIntro}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Verified Client',
                badge: `Customer in ${location.name}, NJ`,
                quote: `Fast delivery and the package was 100% plain and discreet. The strawberry flavour is light, subtle, and rinses completely clean with water.`,
              },
              {
                name: 'Verified Client',
                badge: `Customer in ${location.name}, NJ`,
                quote: `The gentle pH 4.5 water base feels so comfortable on sensitive skin. Zero stickiness or residue on sheets. Very happy with Miss Nous.`,
              },
              {
                name: 'Verified Client',
                badge: `Customer in ${location.name}, NJ`,
                quote: `Shipped promptly from Newark. Neutral billing and complete privacy as promised. Condom-safe and feels silky smooth throughout.`,
              },
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#D4AF6A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#2B2225] italic leading-relaxed">
                    "{rev.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#F7D6DF]/60">
                  <p className="font-serif font-bold text-sm text-[#2B2225]">{rev.name}</p>
                  <p className="text-[11px] text-[#7A6B70]">{rev.badge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. CITY-SPECIFIC FAQS – Exact 6 Questions & Answers from docx
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FDF2F5] border-t border-[#F7D6DF]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Help &amp; Local Info
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225]">
              {cityData.faq.heading}
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              {cityData.faq.intro}
            </p>
          </div>

          <div className="space-y-3.5">
            {cityData.faq.items.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#9E3F5C]/40 shadow-pink-glow'
                      : 'bg-white border-[#F7D6DF] hover:border-[#9E3F5C]/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left font-sans focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-lg font-bold sm:font-semibold transition-colors duration-200 leading-snug ${
                        isOpen ? 'text-[#9E3F5C]' : 'text-[#2B2225]'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#FDF2F5] text-[#9E3F5C] rotate-180'
                          : 'bg-[#FFF9F5] text-[#5A4B50] border border-[#F7D6DF]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-sm sm:text-base text-[#5A4B50] leading-relaxed border-t border-[#F7D6DF]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. HELPFUL GUIDES
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 border-t border-[#F7D6DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Helpful guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHARED_CITY_BLOCKS.helpfulGuides.map((g) => (
              <button
                key={g.title}
                type="button"
                onClick={() => {
                  if (g.path === '/shop') goShop();
                  else if (g.path === '/contact' && onNavigate) onNavigate('contact');
                  else if (onNavigate) onNavigate('blog');
                }}
                className="text-left rounded-2xl border border-[#F7D6DF] p-5 hover:border-[#9E3F5C] hover:shadow-md transition-all bg-[#FFF9F5] cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E3F5C]">{g.eyebrow}</span>
                <p className="font-semibold mt-2 text-sm leading-snug">{g.title}</p>
                <ArrowRight className="w-4 h-4 mt-3 text-[#9E3F5C]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. FINAL CTA WITH REAL CITY MAP & NEARBY CITY LINKS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#361A23] via-[#2B2225] to-[#1E1217] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-[#9E3F5C]/30">
            {/* Ambient luxury glow effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Headline, Copy & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/40 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>{cityData.finalCta.eyebrow}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  {cityData.finalCta.headingLine1} <br />
                  <span className="text-[#E8D3A5]">{cityData.finalCta.headingLine2}</span>
                </h2>

                <p className="text-base sm:text-lg text-[#F7D6DF]/85 font-normal leading-relaxed">
                  {cityData.finalCta.text}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => addProduct(strawberry)}
                    className="px-7 py-3.5 rounded-full bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-sm font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Strawberry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addProduct(pineapple)}
                    className="px-7 py-3.5 rounded-full bg-[#D4AF6A] hover:bg-[#c49f5a] text-[#2B2225] font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Pineapple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('locations')}
                    className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-[#E8D3A5]" />
                    <span>All Service Areas</span>
                  </button>
                </div>

                {/* Nearby City Links from docx */}
                {cityData.finalCta.nearbyLinks?.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="text-[#E8D3A5]/80 font-medium">Nearby city guides:</span>
                    {cityData.finalCta.nearbyLinks.map((nearbyName) => {
                      const cleanName = nearbyName.trim();
                      const nearbyLoc = LOCATIONS.find(
                        (l) => l.name.toLowerCase() === cleanName.toLowerCase()
                      );
                      if (!nearbyLoc) return null;
                      return (
                        <button
                          key={nearbyLoc.slug}
                          type="button"
                          onClick={() => onNavigate && onNavigate('location-city', nearbyLoc.slug)}
                          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/25 text-[#FFF9F5] border border-white/20 transition-all cursor-pointer font-semibold"
                        >
                          {cleanName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Real Municipal Boundary Map Box */}
              <div className="lg:col-span-6 w-full">
                <CityDeliveryMap location={location} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
