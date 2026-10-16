import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Droplets,
  Heart,
  Leaf,
  MapPin,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Waves,
} from 'lucide-react';
import TestimonialsSection from '../components/TestimonialsSection';
import FaqSection from '../components/FaqSection';
import { getLocationBySlug } from '../data/locations';
import {
  FLAVOUR_COMPARE,
  HELPFUL_GUIDES,
  HOW_TO_USE_STEPS,
  SHIPPING_PRIVACY,
} from '../data/locationPageContent';
import { PRODUCTS } from '../data/products';
import productHero from '../assets/product-1-rm.png';

const CITY_PHOTO_FALLBACK =
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80';

const STEP_ICONS = {
  sparkles: Sparkles,
  droplet: Droplets,
  repeat: Repeat,
  waves: Waves,
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

function HeroLocalShowcase({ distanceLabel }) {
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

        {/* Transparent Duo Bottle Image (gpt-11-rem.png) - Perfectly fitted inside circle */}
        <div className="relative z-20 w-full h-full flex items-center justify-center p-6 sm:p-8">
          <img
            src={DUO_PRODUCTS_IMAGE}
            alt="Miss Nous Strawberry and Pineapple intimate lubricants"
            className="w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-[float_6s_ease-in-out_infinite]"
          />
        </div>

        {/* Ambient Badge Pins around perimeter */}
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

      {/* Floating Near You Pill Badge */}
      <div className="absolute top-2 right-0 sm:right-2 z-30 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 px-4 py-3 text-white shadow-xl max-w-[180px]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8D3A5]">Near you</p>
        <p className="text-xs font-semibold mt-0.5">Local delivery available</p>
        <MapPin className="w-4 h-4 text-[#E8D3A5] mt-1.5" />
      </div>

      {/* Distance Badge */}
      {distanceLabel && (
        <div className="absolute bottom-6 -right-1 sm:right-2 z-30 inline-flex items-center gap-2 rounded-full bg-[#2B2225]/90 backdrop-blur border border-[#E8D3A5]/40 px-4 py-2 text-white text-xs font-bold shadow-lg">
          <Car className="w-4 h-4 text-[#E8D3A5]" />
          {distanceLabel} from Newark
        </div>
      )}
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
  const { strawberry, pineapple } = useMemo(() => pickFlavourProducts(products), [products]);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    if (!location) return;
    const title = `Order Intimate Lubricants in ${location.name}, NJ | Miss Nous`;
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      `Shop Miss Nous Strawberry & Pineapple water-based lubricants with discreet delivery in ${location.name} and nearby North Jersey.`
    );
  }, [location]);

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

  return (
    <div className="bg-[#FFF9F5] text-[#2B2225] font-sans overflow-x-hidden">
      {/* 1 — Hero + main CTA (local finder style) */}
      <section className="relative min-h-[92vh] flex flex-col pt-24 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B2225] via-[#5c2438] to-[#2B2225]" />
        <img
          src={cityImage}
          alt=""
          aria-hidden
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
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" />
              Miss Nous · Local finder
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.06]">
              Find your feel-good in{' '}
              <span className="bg-gradient-to-r from-[#E8D3A5] to-[#FFF9F5] bg-clip-text text-transparent">
                {location.name}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#F7D6DF] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discreet delivery, Strawberry &amp; Pineapple water-based lubricants—pH-balanced and shipped from Newark to{' '}
              {location.name}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9E3F5C] text-white font-bold text-sm shadow-lg hover:bg-[#8a3650] transition-colors border border-[#E8D3A5]/20"
              >
                Explore nearby
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#E8D3A5]/50 text-[#FFF9F5] font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Shop flavours
              </button>
            </div>
          </div>
          <div className="w-full pb-4 lg:pb-0">
            <HeroLocalShowcase distanceLabel={location.distanceLabel} />
          </div>
        </div>
      </section>

      {/* 2 — Shop Strawberry & Pineapple (Full-bleed product image stages edge-to-edge) */}
      <section id="loc-shop" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#2B2225] scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available in {location.name}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
              Shop Strawberry &amp; Pineapple
            </h2>
            <p className="text-[#F7D6DF]/80 text-sm sm:text-base leading-relaxed">
              Both 100ml · Gentle water-based formula · Discreet delivery to {location.name}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Strawberry Card */}
            <article className="group bg-[#361A23] rounded-3xl sm:rounded-[2.5rem] border border-[#9E3F5C]/40 hover:border-[#9E3F5C] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              {/* Product Image Stage: Image covers the ENTIRE top box edge-to-edge */}
              <div
                onClick={() => goProduct(strawberry)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                {/* Subtle ambient blur behind */}
                <img
                  src={strawberry?.image || '/jpt-6.jpeg'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#361A23]/40 pointer-events-none" />

                {/* Master Product Image - 100% Complete ("Poori Image") */}
                <img
                  src={strawberry?.image || '/jpt-6.jpeg'}
                  alt={strawberry?.name || 'Miss Nous Strawberry Intimate Lubricant'}
                  className="relative z-10 max-h-full max-w-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Diagonal Corner Ribbon (Discounted Offer) */}
                <div className="absolute top-0 left-0 w-48 sm:w-52 h-48 sm:h-52 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-[42px] sm:top-[48px] -left-[54px] sm:-left-[52px] w-[260px] sm:w-[280px] h-8 sm:h-9 bg-gradient-to-r from-[#501525] via-[#A84260] to-[#501525] text-[#FFF9F5] font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider -rotate-45 shadow-[0_4px_14px_rgba(0,0,0,0.5)] border-y border-[#E8D3A5]/40 flex items-center justify-center gap-1.5 leading-none">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] flex-shrink-0" />
                    <span className="whitespace-nowrap">Discounted Offer</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                  <span className="px-3 py-1 rounded-full bg-[#9E3F5C] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                    Strawberry Edition
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E8D3A5] text-[11px] font-bold border border-white/10">
                    100ml
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    FLAVORED &amp; SCENTED INTIMATE LUBRICANT (100ML)
                  </span>
                  <h3
                    onClick={() => goProduct(strawberry)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    {strawberry?.name || 'Miss Nous Strawberry Intimate Lubricant'}
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    {strawberry?.description ||
                      'A colorful, water-based lubricant with a glycerin and propylene glycol base. 100ml size. Ships across the USA.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      ${Number(strawberry?.price || 31.99).toFixed(2)}
                    </span>
                    {strawberry?.originalPrice && (
                      <span className="text-sm line-through text-white/50">
                        ${Number(strawberry.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9E3F5C]/40 border border-[#9E3F5C] text-[#FFF9F5] text-[11px] font-bold">
                      20% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => addProduct(strawberry)}
                      className="py-3 px-4 bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goProduct(strawberry)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Pineapple Card */}
            <article className="group bg-[#302616] rounded-3xl sm:rounded-[2.5rem] border border-[#D4AF6A]/40 hover:border-[#D4AF6A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              {/* Product Image Stage: Image covers the ENTIRE top box edge-to-edge */}
              <div
                onClick={() => goProduct(pineapple)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                {/* Subtle ambient blur behind */}
                <img
                  src={pineapple?.image || '/gpt-5.png'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#302616]/40 pointer-events-none" />

                {/* Master Product Image - 100% Complete ("Poori Image") */}
                <img
                  src={pineapple?.image || '/gpt-5.png'}
                  alt={pineapple?.name || 'Miss Nous Pineapple Intimate Lubricant'}
                  className="relative z-10 max-h-full max-w-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Diagonal Corner Ribbon (Discounted Offer) */}
                <div className="absolute top-0 left-0 w-48 sm:w-52 h-48 sm:h-52 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-[42px] sm:top-[48px] -left-[54px] sm:-left-[52px] w-[260px] sm:w-[280px] h-8 sm:h-9 bg-gradient-to-r from-[#501525] via-[#A84260] to-[#501525] text-[#FFF9F5] font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider -rotate-45 shadow-[0_4px_14px_rgba(0,0,0,0.5)] border-y border-[#E8D3A5]/40 flex items-center justify-center gap-1.5 leading-none">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8D3A5] flex-shrink-0" />
                    <span className="whitespace-nowrap">Discounted Offer</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF6A] text-[#2B2225] text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                    Pineapple Edition
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E8D3A5] text-[11px] font-bold border border-white/10">
                    100ml
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    FLAVORED &amp; SCENTED INTIMATE LUBRICANT (100ML)
                  </span>
                  <h3
                    onClick={() => goProduct(pineapple)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    {pineapple?.name || 'Miss Nous Pineapple Intimate Lubricant'}
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    {pineapple?.description ||
                      'A silky, water-based lubricant with a light, fruit-inspired pineapple flavor. Set to a gentle pH so it stays comfortable on sensitive skin. 100ml size.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      ${Number(pineapple?.price || 31.99).toFixed(2)}
                    </span>
                    {pineapple?.originalPrice && (
                      <span className="text-sm line-through text-white/50">
                        ${Number(pineapple.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF6A]/30 border border-[#D4AF6A] text-[#E8D3A5] text-[11px] font-bold">
                      20% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => addProduct(pineapple)}
                      className="py-3 px-4 bg-[#D4AF6A] hover:bg-[#c29c54] text-[#2B2225] font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goProduct(pineapple)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3 — Why Choose Miss Nous? */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60 relative overflow-hidden">
        {/* Subtle decorative glow accents */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#F7D6DF]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#E8D3A5]/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Why Choose Miss Nous
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
              Why Choose Miss Nous in {location.name}?
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
              Choosing an intimate lubricant is personal. We designed every part of ours so you can feel completely comfortable, confident, and cared for in {location.name}.
            </p>
          </div>

          {/* 3-Column Luxury Stage: Left Benefits (3) | Center Duo Bottles Showcase | Right Benefits (3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Benefits Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-2 lg:order-1">
              {[
                {
                  icon: Truck,
                  title: 'Discreet Delivery to ' + location.name,
                  desc: 'Shipped from Newark in plain, unbranded boxes with zero product names on the outside for total privacy.',
                },
                {
                  icon: ShieldCheck,
                  title: 'pH 4.5 Balanced Comfort',
                  desc: 'Calibrated to match natural intimate physiology (pH 4.0–4.5), preventing irritation, dryness, or stinging.',
                },
                {
                  icon: Droplets,
                  title: 'Silky, Non-Sticky Glide',
                  desc: 'Lightweight water base that glides smoothly without tackiness and rinses off effortlessly with warm water.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] flex-shrink-0 group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Duo Showcase Stage (4 cols) */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#2B2225] via-[#3d1824] to-[#1c1316] border border-[#E8D3A5]/40 p-6 sm:p-8 text-center text-white shadow-2xl flex flex-col items-center justify-between min-h-[460px] sm:min-h-[500px]">
                {/* Ambient Radial Spotlight */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 45%, rgba(212,175,106,0.45) 0%, rgba(158,63,92,0.3) 50%, transparent 75%)',
                  }}
                />

                {/* Top Badge */}
                <div className="relative z-10 space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#E8D3A5]/40 text-[#E8D3A5] text-[11px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Signature Duo Formula
                  </span>
                  <p className="text-xs text-[#F7D6DF]/80 pt-1">Strawberry &amp; Pineapple (100ml)</p>
                </div>

                {/* Duo Bottle Visual */}
                <div className="relative z-10 my-4 w-full flex items-center justify-center">
                  <div className="relative w-full max-w-[320px] aspect-[1024/935] flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full bg-[#9E3F5C]/25 blur-2xl pointer-events-none animate-pulse" />
                    <img
                      src={WHY_CHOOSE_DUO_IMAGE}
                      alt="Miss Nous Strawberry and Pineapple Intimate Lubricants"
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Bottom Reassurance + CTA */}
                <div className="relative z-10 w-full space-y-3 pt-2 border-t border-white/15">
                  <p className="text-[11px] text-[#E8D3A5] font-semibold tracking-wide">
                    100% Water-Based · Condom &amp; Toy Safe
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

            {/* Right Benefits Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-3">
              {[
                {
                  icon: Sparkles,
                  title: 'Fruit-Inspired, Not Overpowering',
                  desc: 'Delicate strawberry and pineapple essences without artificial syrups—kissable, light, and natural.',
                },
                {
                  icon: Heart,
                  title: 'Condom & Silicone Toy Safe',
                  desc: '100% compatible with natural rubber latex, polyisoprene condoms, and all medical-grade silicone accessories.',
                },
                {
                  icon: Leaf,
                  title: 'Zero Harsh Chemicals',
                  desc: '0% parabens, 0% petrochemicals, 0% artificial dyes. Gentle care for sensitive skin in every drop.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] flex-shrink-0 group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Which flavour */}
      <section className="py-16 sm:py-20 bg-[#FDF2F5] border-y border-[#F7D6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-10">Which flavour should you choose?</h2>
          <div className="grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-[#F7D6DF] shadow-luxury">
            {(['strawberry', 'pineapple']).map((key) => {
              const data = FLAVOUR_COMPARE[key];
              const isBerry = key === 'strawberry';
              return (
                <div
                  key={key}
                  className={`p-8 sm:p-10 space-y-4 ${isBerry ? 'bg-[#9E3F5C] text-white' : 'bg-[#FFF9F5] text-[#2B2225]'}`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">{data.mood}</p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold capitalize">{key}</h3>
                  <p className="text-sm opacity-90">{data.vibe}</p>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-bold">Best for</dt>
                      <dd className="opacity-90">{data.bestFor}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">Sensory notes</dt>
                      <dd className="opacity-90">{data.notes}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => goProduct(isBerry ? strawberry : pineapple)}
                    className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${
                      isBerry ? 'text-[#E8D3A5]' : 'text-[#9E3F5C]'
                    }`}
                  >
                    Select {key}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 — Ingredients & Product Transparency Redesign */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] border-t border-[#F7D6DF]/60">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Purity &amp; Quality Transparency
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
              Ingredients &amp; Product Information
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4B50] font-normal leading-relaxed max-w-2xl mx-auto">
              Transparent labels—know what touches your body before you checkout. Every Miss Nous bottle contains a carefully calibrated, pH-conscious formula for everyday comfort in {location.name}.
            </p>
          </div>

          {/* 4 Purity Highlights / Guarantee Badges Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'pH 4.5 Balanced',
                desc: 'Protects natural intimate flora',
                icon: ShieldCheck,
                color: 'text-[#9E3F5C]',
                bg: 'bg-[#FDF2F5]',
              },
              {
                title: '100% Water-Based',
                desc: 'Never sticky, rinses easily',
                icon: Droplets,
                color: 'text-[#9E3F5C]',
                bg: 'bg-[#FDF2F5]',
              },
              {
                title: 'Condom & Toy Safe',
                desc: 'Latex & silicone compatible',
                icon: Heart,
                color: 'text-[#9E3F5C]',
                bg: 'bg-[#FDF2F5]',
              },
              {
                title: 'Zero Harsh Chemicals',
                desc: 'Paraben, dye & sulfate-free',
                icon: Leaf,
                color: 'text-[#9E3F5C]',
                bg: 'bg-[#FDF2F5]',
              },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F7D6DF] shadow-sm hover:shadow-md hover:border-[#9E3F5C]/30 transition-all flex flex-col items-center text-center space-y-2.5"
                >
                  <div className={`w-12 h-12 rounded-2xl ${badge.bg} flex items-center justify-center ${badge.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2225] leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-[#5A4B50]">{badge.desc}</p>
                </div>
              );
            })}
          </div>

          {/* 2-Column Masterpiece Layout: 3 Detailed Pillars + Studio Purity Showcase Card */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column (7 cols): 3 Ingredient Breakdown Pillars */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center font-bold text-sm border border-[#F7D6DF]">
                    01
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2225]">
                      Pure Hydrating Base
                    </h3>
                    <p className="text-xs text-[#9E3F5C] font-semibold uppercase tracking-wider">
                      Optimal Glide &amp; Velvet Cushion
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">Purified Water (Aqua):</strong> Medical-grade sterile water base delivering instant, refreshing hydration.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">Plant-Derived Glycerin:</strong> Draws and locks in moisture for a seamless, long-lasting silkiness.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">Propylene Glycol:</strong> Enhances lubricity and velvety cushion, preventing dry-down friction.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center font-bold text-sm border border-[#F7D6DF]">
                    02
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2225]">
                      Active Botanical Essences &amp; Care
                    </h3>
                    <p className="text-xs text-[#9E3F5C] font-semibold uppercase tracking-wider">
                      Naturally Scented &amp; Body-Safe
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">Food-Grade Flavor Extracts:</strong> Authentic strawberry and pineapple sensory notes, safe for oral and intimate use.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">pH-Balancing Citric Acid:</strong> Gently calibrated to female intimate physiology (pH 4.0 - 4.5).
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#5A4B50]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E3F5C] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B2225]">Gentle Preservation:</strong> Certified preservative system ensuring bottle sterility without irritating delicate tissue.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FDF2F5] to-white border border-[#F7D6DF] shadow-luxury space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2225]">
                      What We Strictly Leave Out
                    </h3>
                    <p className="text-xs text-[#9E3F5C] font-semibold uppercase tracking-wider">
                      Our Non-Negotiable Safety Standard
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-medium text-[#5A4B50]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Parabens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Petrochemicals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Sticky Silicone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Artificial Dyes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Sugars / Sorbitol</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9E3F5C]" />
                    <span>0% Animal Byproducts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Studio Quality Card with Duo Bottles Showcase */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#2B2225] via-[#381622] to-[#1E1618] text-white p-7 sm:p-9 border border-[#E8D3A5]/30 shadow-2xl flex flex-col justify-between">
                {/* Background Ambient Glow */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 35%, rgba(232,211,165,0.35) 0%, rgba(158,63,92,0.3) 50%, transparent 80%)',
                  }}
                />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Newark Studio Verified
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    Pure Formulation, Tested for Daily Comfort
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7D6DF]/80 leading-relaxed">
                    Every batch of Miss Nous Strawberry and Pineapple intimate lubricants is blended with care, bottled locally in New Jersey, and sealed for freshness.
                  </p>
                </div>

                {/* Purity & Transparency Image Showcase */}
                <div className="relative z-10 my-6 sm:my-8 flex items-center justify-center">
                  <div className="relative w-full max-w-[320px] aspect-[1024/935] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-3 sm:p-4 shadow-inner overflow-hidden">
                    <div className="absolute inset-4 rounded-full bg-[#9E3F5C]/20 blur-xl pointer-events-none" />
                    <img
                      src={PURITY_TRANSPARENCY_IMAGE}
                      alt="Miss Nous Purity & Quality Transparency Ingredients Information"
                      className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Reassurance Footer */}
                <div className="relative z-10 pt-4 border-t border-white/15 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#E8D3A5]">
                    <span>✓ Batch-Tested</span>
                    <span>✓ Discreet Packing</span>
                    <span>✓ Shipped to {location.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('loc-shop')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#9E3F5C] to-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-pink-glow hover:opacity-95 transition-opacity"
                  >
                    Shop Both Flavours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — How to use (timeline) */}
      <section className="py-16 sm:py-20 bg-[#2B2225] text-white px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-12">How to use water-based lubricants</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-[#9E3F5C]/50" />
            {HOW_TO_USE_STEPS.map((s) => {
              const StepIcon = STEP_ICONS[s.icon] || Sparkles;
              return (
                <div key={s.title} className="relative text-center space-y-3">
                  <div className="mx-auto w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-[#9E3F5C] to-[#5c2438] flex items-center justify-center loc-step-icon-glow">
                    <StepIcon className="w-7 h-7 text-[#FFF9F5]" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-[#A09095] px-2 leading-relaxed">{s.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7 — Order in [City] */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden grid lg:grid-cols-2 bg-white border border-[#F7D6DF] shadow-luxury">
          <div className="relative min-h-[260px] lg:min-h-full">
            <img src={cityImage} alt={location.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#9E3F5C]/30 mix-blend-multiply" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 border border-[#F7D6DF]">
              <p className="text-xs font-bold text-[#9E3F5C] uppercase">From our Newark studio</p>
              <p className="text-sm font-semibold">18 Garibaldi Avenue, Newark, NJ 07114</p>
            </div>
          </div>
          <div className="p-8 sm:p-10 space-y-4">
            <h2 className="font-serif text-3xl font-bold">Order intimate lubricants in {location.name}</h2>
            <p className="text-[#5A4B50] text-sm leading-relaxed">{location.description}</p>
            {location.distanceLabel && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#9E3F5C]">
                <Truck className="w-4 h-4" />
                Approximately {location.distanceLabel} from Miss Nous Newark
              </p>
            )}
            <p className="text-sm text-[#5A4B50]">
              Whether you are in {location.name} or passing through North Jersey, we pack every order with care and
              ship in plain outer packaging—no flavour names on the box.
            </p>
            <button
              type="button"
              onClick={goShop}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9E3F5C] text-white text-sm font-bold"
            >
              <ShoppingBag className="w-4 h-4" />
              Start your order
            </button>
          </div>
        </div>
      </section>

      {/* 8 — Shipping, privacy, returns */}
      <section className="py-14 px-4 sm:px-8 lg:px-16 bg-[#9E3F5C]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {SHIPPING_PRIVACY.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-3xl p-6 border border-white/20 ${
                i === 1 ? 'bg-[#2B2225] text-white md:-translate-y-3 shadow-xl' : 'bg-white/10 text-white backdrop-blur-sm'
              }`}
            >
              <ShieldCheck className="w-8 h-8 mb-3 text-[#E8D3A5]" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-90">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9 — Customer Reviews */}
      <TestimonialsSection />

      {/* 10 — FAQs */}
      <FaqSection id="faq" />

      {/* 11 — Helpful guides */}
      <section className="py-14 border-t border-[#F7D6DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Helpful guides</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {HELPFUL_GUIDES.map((g) => (
              <button
                key={g.title}
                type="button"
                onClick={() => onNavigate && onNavigate(g.page)}
                className="snap-start flex-shrink-0 w-64 text-left rounded-2xl border border-[#F7D6DF] p-5 hover:border-[#9E3F5C] hover:shadow-md transition-all bg-[#FFF9F5]"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E3F5C]">{g.hint}</span>
                <p className="font-semibold mt-2 text-sm leading-snug">{g.title}</p>
                <ArrowRight className="w-4 h-4 mt-3 text-[#9E3F5C]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 12 — Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-[#2B2225] via-[#9E3F5C] to-[#2B2225] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Ready for {location.name}? Pick a flavour.</h2>
          <p className="text-[#F7D6DF] text-sm sm:text-base">
            Strawberry or Pineapple—same organic water-based comfort. Add to bag or explore full product details.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => addProduct(strawberry)}
              className="px-6 py-3 rounded-full bg-[#FFF9F5] text-[#9E3F5C] font-bold text-sm"
            >
              Buy Strawberry
            </button>
            <button
              type="button"
              onClick={() => addProduct(pineapple)}
              className="px-6 py-3 rounded-full bg-[#E8D3A5] text-[#2B2225] font-bold text-sm"
            >
              Buy Pineapple
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('locations')}
              className="px-6 py-3 rounded-full border border-white/40 font-semibold text-sm"
            >
              All service areas
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
