import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Droplets,
  Globe,
  Heart,
  Leaf,
  MapPin,
  Navigation,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { LOCATIONS, FEATURED_LOCATION, NEARBY_LOCATIONS } from '../data/locations';
import { PRODUCTS } from '../data/products';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';

const CITY_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1477959858607-67ae27e44f93?auto=format&fit=crop&w=1200&q=80';

const DUO_PRODUCTS_IMAGE = '/gpt-11-rem.png';

const STATES_DATA = [
  {
    code: 'NJ',
    name: 'New Jersey',
    tag: 'Home Hub & Same-Day Dispatch',
    transitTime: '1 – 2 Business Days',
    description:
      'Direct local fulfillment from our Newark studio across Essex, Hudson, Bergen, Union, and all 21 New Jersey counties.',
    highlights: ['Dispatched from 18 Garibaldi Ave', 'Fastest transit time', 'Local studio pickup available'],
    badgeColor: 'bg-[#9E3F5C] text-white',
    accentBorder: 'hover:border-[#9E3F5C]',
  },
  {
    code: 'NY',
    name: 'New York',
    tag: 'Tri-State Express Transit',
    transitTime: '1 – 2 Business Days',
    description:
      'Swift ground transit to Manhattan, Brooklyn, Queens, Bronx, Staten Island, Long Island, and Upstate New York.',
    highlights: ['Next-day corridor shipping', 'Discreet plain outer boxes', 'USPS & UPS tracking'],
    badgeColor: 'bg-[#2B2225] text-[#E8D3A5]',
    accentBorder: 'hover:border-[#D4AF6A]',
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    tag: 'Eastern Regional Transit',
    transitTime: '2 – 3 Business Days',
    description:
      'Direct courier routes into Philadelphia, Bucks County, Lehigh Valley, Pittsburgh, and communities statewide.',
    highlights: ['Prompt corridor ground dispatch', 'Tamper-evident seals', 'Zero product labels outside'],
    badgeColor: 'bg-[#5c2438] text-white',
    accentBorder: 'hover:border-[#9E3F5C]',
  },
  {
    code: 'USA',
    name: 'All 50 US States',
    tag: 'Nationwide Delivery Coverage',
    transitTime: '2 – 4 Business Days',
    description:
      'Reliable, private shipping from California to Florida. Every order arrives in unbranded packaging with neutral return info.',
    highlights: ['50-State coverage including HI & AK', 'Free shipping on eligible orders', 'Discreet billing name'],
    badgeColor: 'bg-[#D4AF6A] text-[#2B2225]',
    accentBorder: 'hover:border-[#D4AF6A]',
  },
];

const WHY_CHOOSE_BENEFITS = [
  {
    icon: Package,
    title: '100% Discreet Packaging',
    desc: 'Shipped in plain, unbranded outer boxes with zero logos or product names. Your complete privacy is guaranteed.',
  },
  {
    icon: ShieldCheck,
    title: 'pH 4.5 Clinically Calibrated',
    desc: 'Carefully tuned to complement delicate intimate physiology (pH 4.0–4.5), preventing dryness, stinging, or imbalance.',
  },
  {
    icon: Droplets,
    title: 'Silky, Non-Sticky Water Base',
    desc: 'Water-soluble formula providing long-lasting glide without tackiness. Never stains sheets and rinses clean with water.',
  },
  {
    icon: Heart,
    title: 'Condom & Silicone Toy Safe',
    desc: 'Compatible with natural rubber latex, polyisoprene condoms, and all medical-grade silicone accessories.',
  },
  {
    icon: Building2,
    title: 'Handcrafted in Essex County, NJ',
    desc: 'Small-batch blended and inspected with pharmaceutical care from our studio at 18 Garibaldi Avenue, Newark.',
  },
  {
    icon: Leaf,
    title: 'Zero Harsh Chemicals',
    desc: 'Free from parabens, petrochemicals, silicones, and synthetic dyes. Gentle, body-conscious botanical care.',
  },
];

const SHIPPING_TIMELINES = [
  {
    region: 'North Jersey & Newark Metro',
    time: '1 – 2 Days',
    status: 'Fastest Ground Transit',
    desc: 'Same-day packaging from our local studio when ordered before 2:00 PM EST.',
  },
  {
    region: 'Tri-State (NY, NJ, CT, PA)',
    time: '1 – 3 Days',
    status: 'Direct Regional Courier',
    desc: 'Immediate road network handoff through USPS Priority & UPS Ground.',
  },
  {
    region: 'Central & Southern USA',
    time: '2 – 3 Days',
    status: 'Standard Tracked',
    desc: 'Fast express dispatch with real-time tracking updates delivered to your inbox.',
  },
  {
    region: 'West Coast & Nationwide',
    time: '3 – 4 Days',
    status: 'Full Nationwide Coverage',
    desc: 'Discreet, tamper-proof packages delivered reliably to all 50 states.',
  },
];


const LOCATION_FAQS = [
  {
    q: 'How discreet is the shipping packaging when my order arrives?',
    a: 'Every Miss Nous order is packed in a neutral, unbranded shipping box or padded mailer. There are no product descriptions, no flavour names, and no suggestive words on the outside label. The return address appears neutrally as "MN Fulfillment".',
  },
  {
    q: 'Do you deliver to all cities in New Jersey and across the United States?',
    a: 'Yes! While our primary dispatch hub is located in Newark, NJ, we ship across all 21 New Jersey counties and nationwide to all 50 US states via USPS and UPS.',
  },
  {
    q: 'How fast will my order arrive if I live in North Jersey?',
    a: 'Orders placed on business days before 2:00 PM EST are packaged the same day. For Newark, Kearny, East Newark, Elizabeth, and surrounding North Jersey cities, delivery typically takes 1 to 2 business days.',
  },
  {
    q: 'What will appear on my credit card or bank billing statement?',
    a: 'To safeguard your privacy, your bank or credit card statement will show a discreet, neutral billing descriptor like "MISS NOUS LLC" or "MN WELLNESS".',
  },
  {
    q: 'Are Miss Nous lubricants condom and toy safe?',
    a: 'Yes, absolutely. Both Strawberry and Pineapple lubricants are 100% water-based, making them completely safe for natural rubber latex condoms, polyisoprene, and all silicone toys.',
  },
  {
    q: 'What if my city is not listed in the directory above?',
    a: 'Our directory highlights nearby North Jersey community hubs, but our delivery network covers every zip code across the entire United States. You can order directly to any US address through our shop.',
  },
];

export default function LocationsPage({
  onNavigate,
  products = PRODUCTS,
  onAddToCart,
  onViewProduct,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // SEO metadata setup
  useEffect(() => {
    document.title = 'Service Locations & Discreet Delivery | Miss Nous';
    let metaDesc = document.querySelector('meta[name="description"]');
    let created = false;
    let prevDesc = '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      created = true;
    } else {
      prevDesc = metaDesc.getAttribute('content') || '';
    }
    metaDesc.setAttribute(
      'content',
      'Discover Miss Nous local delivery areas across Newark, Kearny, Hudson, Essex County, and nationwide 50-state discreet shipping for organic intimate lubricants.'
    );

    return () => {
      if (created) metaDesc.remove();
      else metaDesc.setAttribute('content', prevDesc);
    };
  }, []);

  // Filtered cities based on search & region filter
  const filteredCities = useMemo(() => {
    let list = LOCATIONS;

    if (selectedRegionFilter === 'hudson') {
      list = list.filter((l) =>
        ['kearny', 'east-newark', 'bayonne'].includes(l.slug)
      );
    } else if (selectedRegionFilter === 'essex') {
      list = list.filter((l) =>
        ['newark', 'east-orange'].includes(l.slug)
      );
    } else if (selectedRegionFilter === 'nj-nearby') {
      list = list.filter((l) => l.slug !== 'newark');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((l) => {
        const nameMatch = l.name.toLowerCase().includes(q);
        const descMatch = l.description.toLowerCase().includes(q);
        const neighMatch = (l.neighborhoods || []).some((n) =>
          n.toLowerCase().includes(q)
        );
        const stateMatch = 'new jersey nj united states usa'.includes(q);
        return nameMatch || descMatch || neighMatch || stateMatch;
      });
    }

    return list;
  }, [searchQuery, selectedRegionFilter]);

  const strawberryProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('strawberry')) ||
    PRODUCTS[0];
  const pineappleProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('pineapple')) ||
    PRODUCTS[1] ||
    PRODUCTS[0];

  const handleCityClick = (slug) => {
    if (onNavigate) onNavigate('location-city', slug);
  };

  const handleGoProduct = (prod) => {
    if (onViewProduct && prod) onViewProduct(prod);
    else if (onNavigate) onNavigate('shop');
  };

  const handleAddProduct = (prod) => {
    if (onAddToCart && prod) onAddToCart(prod, 1);
    else handleGoProduct(prod);
  };

  const scrollToSearch = () => {
    document.getElementById('find-location')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FFF9F5] text-[#2B2225] min-h-screen font-sans selection:bg-[#F7D6DF] selection:text-[#9E3F5C] overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION – Heading, short description, CTA
      ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION – Heading, short description, CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] lg:min-h-[84vh] flex items-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden bg-[#240c15] text-white">
        {/* Master High-Res Background Image (location hero.png) - Zoomed Out */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/location%20hero.png"
            alt="Miss Nous Intimate Lubricants in Location Setting"
            className="w-full h-full object-cover object-[80%_center] lg:object-[84%_center] scale-[0.80] sm:scale-[0.82] lg:scale-[0.85] origin-right select-none"
          />
        </div>

        {/* Cinematic Gradient Overlays for Razor-Sharp Left Text Readability & Edge Blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#240c15] via-[#240c15]/90 sm:via-[#240c15]/75 lg:via-[#240c15]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#240c15] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#240c15] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240c15] via-transparent to-[#240c15]/40 lg:hidden pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl space-y-6 sm:space-y-7 text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E8D3A5]">
                MISS NOUS · LOCATION FINDER
              </span>
              <span className="hidden sm:inline-block w-12 h-px bg-[#E8D3A5]/40" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-bold tracking-tight text-white leading-[1.08]">
              Find Miss Nous <br />
              <span className="bg-gradient-to-r from-[#E8D3A5] via-[#FFF3D6] to-[#E8D3A5] bg-clip-text text-transparent">
                Near Your City
              </span>
            </h1>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg text-[#F7D6DF]/90 font-normal leading-relaxed max-w-xl">
              Discover nearby stockists, discreet delivery, and your favorite flavours — now closer to you.
            </p>

            {/* 2 CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={scrollToSearch}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#9E3F5C] hover:bg-[#852f49] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-[#E8D3A5]/30"
              >
                <span>Find Your Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('shop')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/30 font-sans text-xs uppercase tracking-wider font-semibold backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#E8D3A5]" />
                <span>Shop Flavours</span>
              </button>
            </div>

            {/* Bottom 4 Badges */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <Package className="w-7 h-7 text-[#E8D3A5] flex-shrink-0" strokeWidth={1.5} />
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-white">Discreet</p>
                  <p className="text-[11px] text-[#F7D6DF]/80">Outer Box</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-7 h-7 text-[#E8D3A5] flex-shrink-0" strokeWidth={1.5} />
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-white">Fast Local</p>
                  <p className="text-[11px] text-[#F7D6DF]/80">Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-7 h-7 text-[#E8D3A5] flex-shrink-0" strokeWidth={1.5} />
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-white">Nationwide</p>
                  <p className="text-[11px] text-[#F7D6DF]/80">Coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-[#E8D3A5] flex-shrink-0" strokeWidth={1.5} />
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-bold text-white">Trusted &amp;</p>
                  <p className="text-[11px] text-[#F7D6DF]/80">pH Balanced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FIND YOUR LOCATION – City / State Search
      ───────────────────────────────────────────────────────────── */}
      <section
        id="find-location"
        className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 -mt-8 relative z-20 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl sm:rounded-[2.5rem] bg-white border border-[#F7D6DF] shadow-2xl p-6 sm:p-10 space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">
                <Search className="w-3.5 h-3.5" />
                Live Location Search
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2225]">
                Find Your Delivery Route
              </h2>
              <p className="text-sm text-[#5A4B50]">
                Search your city, county, or zip code to see dedicated delivery speeds and service guides.
              </p>
            </div>

            {/* Input Bar */}
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E3F5C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, neighborhood, or state (e.g. Newark, Kearny, Hudson, New Jersey)..."
                className="w-full pl-13 pr-12 py-4 rounded-full bg-[#FFF9F5] border-2 border-[#F7D6DF] text-[#2B2225] placeholder:text-[#A09095] text-sm sm:text-base focus:outline-none focus:border-[#9E3F5C] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FDF2F5] hover:bg-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-bold text-[#5A4B50] mr-2">Quick filters:</span>
              {[
                { id: 'all', label: 'All Cities' },
                { id: 'hudson', label: 'Hudson County' },
                { id: 'essex', label: 'Essex County' },
                { id: 'nj-nearby', label: 'Nearby Newark' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setSelectedRegionFilter(btn.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedRegionFilter === btn.id
                      ? 'bg-[#9E3F5C] text-white shadow-xs'
                      : 'bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF] hover:bg-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Result Counter */}
            <div className="text-center text-xs font-medium text-[#7A6B70]">
              Showing <span className="font-bold text-[#9E3F5C]">{filteredCities.length}</span> active city guides matching your search.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. BROWSE BY STATE – State Cards
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Globe className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Regional Logistics
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
              Browse by State &amp; Territory
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              We dispatch directly from North Jersey to guarantee rapid, temperature-stable transit and complete shipping discretion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATES_DATA.map((state) => (
              <div
                key={state.code}
                className={`p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${state.accentBorder} flex flex-col justify-between space-y-5`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-3xl font-bold text-[#2B2225]">{state.code}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${state.badgeColor}`}>
                      {state.transitTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2B2225]">{state.name}</h3>
                    <p className="text-xs font-semibold text-[#9E3F5C] uppercase tracking-wide mt-0.5">{state.tag}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">{state.description}</p>

                  <ul className="space-y-2 pt-2 border-t border-[#F7D6DF]/60 text-xs text-[#5A4B50]">
                    {state.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9E3F5C] flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={scrollToSearch}
                  className="w-full py-2.5 rounded-full bg-[#FDF2F5] hover:bg-[#9E3F5C] text-[#2B2225] hover:text-white border border-[#F7D6DF] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Delivery Info</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. EXPLORE CITIES – City Directory
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FDF2F5] border-y border-[#F7D6DF]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#F7D6DF] text-xs font-bold uppercase tracking-wider text-[#9E3F5C]">
                <Building2 className="w-3.5 h-3.5" />
                <span>Local Community Directory</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225]">
                Explore City Service Areas
              </h2>
              <p className="text-sm sm:text-base text-[#5A4B50]">
                Select your city to view local dispatch times, customer reviews, and neighborhood delivery details.
              </p>
            </div>

            <div className="text-xs font-semibold text-[#9E3F5C]">
              {filteredCities.length} Cities Available
            </div>
          </div>

          {/* Cities Grid */}
          {filteredCities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {filteredCities.map((city) => (
                <article
                  key={city.slug}
                  onClick={() => handleCityClick(city.slug)}
                  className="group rounded-3xl overflow-hidden bg-white border border-[#F7D6DF] shadow-luxury hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                >
                  {/* City Image Stage */}
                  <div className="relative h-48 w-full overflow-hidden bg-black/30">
                    <img
                      src={city.image || CITY_IMAGE_FALLBACK}
                      alt={city.imageAlt || city.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = CITY_IMAGE_FALLBACK;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/85 via-[#2B2225]/20 to-transparent" />

                    {/* Distance Pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2B2225] text-[11px] font-bold shadow-md">
                        <Navigation className="w-3 h-3 text-[#9E3F5C]" />
                        {city.distanceLabel || 'Local Area'}
                      </span>
                    </div>

                    {/* City Name at Bottom of Image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                        {city.name}
                      </h3>
                      {city.tagline && (
                        <p className="text-[11px] text-[#E8D3A5] font-medium truncate">{city.tagline}</p>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-[#5A4B50] line-clamp-3 leading-relaxed">
                      {city.description}
                    </p>

                    {/* Neighborhoods tags if available */}
                    {city.neighborhoods?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {city.neighborhoods.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-semibold text-[#2B2225] border border-[#F7D6DF]"
                          >
                            {n}
                          </span>
                        ))}
                        {city.neighborhoods.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-semibold text-[#9E3F5C]">
                            +{city.neighborhoods.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-3 border-t border-[#F7D6DF]/60 flex items-center justify-between text-xs font-bold text-[#9E3F5C]">
                      <span>Open City Guide</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-[#F7D6DF] text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <Compass className="w-10 h-10 text-[#9E3F5C] mx-auto opacity-70" />
              <h3 className="font-serif text-xl font-bold text-[#2B2225]">
                No specific city guide found for "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                Don’t worry! We ship our water-based lubricants to every town and city in the United States in plain, unmarked boxes.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3F5C] text-white text-xs font-bold uppercase tracking-wider"
              >
                <span>Shop All Lubricants</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. OUR PRODUCTS – Strawberry & Pineapple Lubricants
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#2B2225] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Two Signature Formulas</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our Products: Strawberry &amp; Pineapple
            </h2>
            <p className="text-sm sm:text-base text-[#F7D6DF]/80 leading-relaxed">
              Both formulated on our silky organic water base · pH 4.5 Balanced · 100ml size · Shipped with complete privacy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Strawberry Product Card */}
            <article className="group bg-[#361A23] rounded-3xl sm:rounded-[2.5rem] border border-[#9E3F5C]/40 hover:border-[#9E3F5C] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1">
              <div
                onClick={() => handleGoProduct(strawberryProduct)}
                className="relative h-88 sm:h-[440px] lg:h-[480px] w-full overflow-hidden bg-black/40 cursor-pointer"
              >
                <img
                  src={strawberryProduct?.image || '/jpt-6.jpeg'}
                  alt={strawberryProduct?.name || 'Miss Nous Strawberry Intimate Lubricant'}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#361A23] via-transparent to-transparent opacity-60 pointer-events-none" />
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#9E3F5C] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  Strawberry Edition
                </span>
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#E8D3A5] text-[11px] font-bold border border-white/10">
                  100ml
                </span>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    FLAVORED &amp; SCENTED INTIMATE LUBRICANT (100ML)
                  </span>
                  <h3
                    onClick={() => handleGoProduct(strawberryProduct)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    {strawberryProduct?.name || 'Miss Nous Strawberry Intimate Lubricant'}
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    {strawberryProduct?.description ||
                      'A colorful, water-based lubricant with a glycerin and propylene glycol base. 100ml size. Ships discreetly across the USA.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      ${Number(strawberryProduct?.price || 31.99).toFixed(2)}
                    </span>
                    {strawberryProduct?.originalPrice && (
                      <span className="text-sm line-through text-white/50">
                        ${Number(strawberryProduct.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9E3F5C]/40 border border-[#9E3F5C] text-[#FFF9F5] text-[11px] font-bold">
                      20% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(strawberryProduct)}
                      className="py-3 px-4 bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoProduct(strawberryProduct)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Pineapple Product Card */}
            <article className="group bg-[#302616] rounded-3xl sm:rounded-[2.5rem] border border-[#D4AF6A]/40 hover:border-[#D4AF6A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1">
              <div
                onClick={() => handleGoProduct(pineappleProduct)}
                className="relative h-88 sm:h-[440px] lg:h-[480px] w-full overflow-hidden bg-black/40 cursor-pointer"
              >
                <img
                  src={pineappleProduct?.image || '/gpt-5.png'}
                  alt={pineappleProduct?.name || 'Miss Nous Pineapple Intimate Lubricant'}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#302616] via-transparent to-transparent opacity-60 pointer-events-none" />
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#D4AF6A] text-[#2B2225] text-[11px] font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  Pineapple Edition
                </span>
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#E8D3A5] text-[11px] font-bold border border-white/10">
                  100ml
                </span>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5]">
                    FLAVORED &amp; SCENTED INTIMATE LUBRICANT (100ML)
                  </span>
                  <h3
                    onClick={() => handleGoProduct(pineappleProduct)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    {pineappleProduct?.name || 'Miss Nous Pineapple Intimate Lubricant'}
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    {pineappleProduct?.description ||
                      'A silky, water-based lubricant with a light, fruit-inspired pineapple flavor. Set to a gentle pH so it stays comfortable on sensitive skin. 100ml size.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      ${Number(pineappleProduct?.price || 31.99).toFixed(2)}
                    </span>
                    {pineappleProduct?.originalPrice && (
                      <span className="text-sm line-through text-white/50">
                        ${Number(pineappleProduct.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF6A]/30 border border-[#D4AF6A] text-[#E8D3A5] text-[11px] font-bold">
                      20% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(pineappleProduct)}
                      className="py-3 px-4 bg-[#D4AF6A] hover:bg-[#c29c54] text-[#2B2225] font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoProduct(pineappleProduct)}
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

      {/* ─────────────────────────────────────────────────────────────
          6. WHY CHOOSE MISS NOUS? – Key Benefits
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Verified Purity
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2B2225] tracking-tight">
              Why Choose Miss Nous?
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              We formulated every drop to feel effortless, comfortable, and body-respecting—from first touch to easy rinse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {WHY_CHOOSE_BENEFITS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2225] group-hover:text-[#9E3F5C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SHIPPING & DELIVERY COVERAGE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FDF2F5] border-y border-[#F7D6DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF]">
              <Truck className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Nationwide Transit
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225]">
              Shipping &amp; Delivery Coverage
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              Every package is handled with discretion and care from our Newark facility. Here is what you can expect when ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHIPPING_TIMELINES.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-5 h-5 text-[#9E3F5C]" />
                    <span className="text-xs font-bold text-[#9E3F5C] bg-[#FDF2F5] px-2.5 py-1 rounded-full border border-[#F7D6DF]">
                      {item.time}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2B2225] leading-snug">{item.region}</h3>
                  <p className="text-[11px] font-bold text-[#D4AF6A] uppercase tracking-wider">{item.status}</p>
                  <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Discreet Box Reassurance Banner */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#2B2225] text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E8D3A5]">Privacy First Guarantee</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">Unmarked, Neutral Packaging</h3>
              <p className="text-sm text-[#F7D6DF]/80 leading-relaxed">
                No mention of lubricants or intimate products anywhere on the outer box or shipping label. Handled directly with complete customer confidentiality.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('shop')}
              className="px-8 py-3.5 rounded-full bg-[#9E3F5C] hover:bg-[#852f49] text-white text-xs font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 flex-shrink-0 cursor-pointer"
            >
              Order With Privacy
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CUSTOMER REVIEWS (Same as Home Page)
      ───────────────────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ─────────────────────────────────────────────────────────────
          9. FREQUENTLY ASKED QUESTIONS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FDF2F5] border-t border-[#F7D6DF]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Help &amp; Ordering Info
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225]">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              Clear answers regarding local deliveries, discreet packaging, and product care.
            </p>
          </div>

          <div className="space-y-3.5">
            {LOCATION_FAQS.map((faq, idx) => {
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
                    className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left font-sans focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                        isOpen ? 'text-[#9E3F5C]' : 'text-[#2B2225]'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#FDF2F5] text-[#9E3F5C] rotate-180'
                          : 'bg-[#FFF9F5] text-[#5A4B50] border border-[#F7D6DF]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5A4B50] leading-relaxed border-t border-[#F7D6DF]/40">
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
          10. FINAL CTA – Find Your Nearest City & Shop Flavours
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#361A23] via-[#2B2225] to-[#1E1217] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#9E3F5C]/30">
            {/* Ambient luxury glow effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/40 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
                <span>Fast &amp; Discreet Delivery Across New Jersey &amp; All 50 States</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready for Pure Comfort? <br />
                <span className="text-[#E8D3A5]">Find Miss Nous in Your City</span>
              </h2>

              <p className="text-base sm:text-lg text-[#F7D6DF]/85 font-normal leading-relaxed max-w-2xl">
                Experience silky, organic water-based intimate care crafted to balance and protect. Shipped directly from our Newark hub in plain, unbranded packaging with complete discretion.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="px-8 py-3.5 rounded-full bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-sm font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Flavours Now</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToSearch}
                  className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#E8D3A5]" />
                  <span>Find Your Nearest City</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. NEWSLETTER INNER CIRCLE (Exact match to Home Page End)
      ───────────────────────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
