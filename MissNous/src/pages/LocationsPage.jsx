import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
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
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { LOCATIONS } from '../data/locations';
import { PRODUCTS } from '../data/products';
import { UsaDeliveryMap } from '../components/DeliveryMap';

const CITY_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1477959858607-67ae27e44f93?auto=format&fit=crop&w=1200&q=80';

// 5. Why Choose Miss Nous Benefit Cards (Exact SEO content from docx)
const WHY_CHOOSE_BENEFITS = [
  {
    icon: Package,
    title: '100% Discreet Packaging',
    desc: 'Every order ships in a plain outer box with no logos, product names or flavour names outside.',
  },
  {
    icon: ShieldCheck,
    title: 'Gentle pH 4.5',
    desc: 'Set to pH 4.5, close to the natural vaginal range of about 3.8–4.5, for everyday comfort.',
  },
  {
    icon: Droplets,
    title: 'Silky, Non-Sticky Water Base',
    desc: 'A water-based glide that stays smooth without turning tacky, and washes off sheets and skin with water.',
  },
  {
    icon: Heart,
    title: 'Condom and Toy Friendly',
    desc: 'Water-based formulas are generally compatible with latex and polyisoprene condoms and silicone toys. Always check the packaging.',
  },
  {
    icon: Building2,
    title: 'Dispatched From Newark',
    desc: 'Orders are packed and shipped from our Newark base, so North Jersey customers get their parcels fast.',
  },
  {
    icon: Leaf,
    title: 'Clear Ingredient List',
    desc: 'No parabens and no oils. The full ingredient list and manufacturer details are on every product page.',
  },
];

// 6. Shipping & Delivery Timelines (Exact SEO content from docx)
const SHIPPING_TIMELINES = [
  {
    badge: '1–2 Days',
    region: 'North Jersey & Newark Metro',
    label: 'Fastest Local Delivery',
    desc: 'Orders placed before 2:00 PM EST on business days are packed the same day.',
  },
  {
    badge: '1–3 Days',
    region: 'Tri-State (NY, NJ, CT, PA)',
    label: 'Regional Delivery',
    desc: 'Shipped by USPS Priority Mail or UPS Ground, with tracking emailed to you.',
  },
  {
    badge: '2–5 Days',
    region: 'Central & Southern USA',
    label: 'Standard Tracked',
    desc: 'Tracked shipping with updates sent to your inbox from dispatch to doorstep.',
  },
  {
    badge: '3–7 Days',
    region: 'West Coast & Nationwide',
    label: 'All 50 States',
    desc: 'Discreet, sealed parcels delivered to every state.',
  },
];

// 7. Customer Reviews for Locations Page (US North Jersey customers matching docx guidelines)
const LOCAL_REVIEWS = [
  {
    id: 1,
    name: 'Jasmine R.',
    initials: 'JR',
    location: 'Newark, NJ',
    product: 'Strawberry Edition',
    rating: 5,
    quote:
      'Discreet packaging arrived at my Newark apartment the next day. The strawberry flavour is subtle and sweet, and rinses completely clean with water without any residue.',
  },
  {
    id: 2,
    name: 'David M.',
    initials: 'DM',
    location: 'Kearny, NJ',
    product: 'Pineapple Edition',
    rating: 5,
    quote:
      'We live in Kearny and our order arrived in a totally plain brown box. The gentle pH 4.5 water base feels great on sensitive skin with zero tackiness.',
  },
  {
    id: 3,
    name: 'Elena V.',
    initials: 'EV',
    location: 'Elizabeth, NJ',
    product: 'Strawberry Edition',
    rating: 5,
    quote:
      "Silky glide that lasts, condom-safe, and very comfortable. It's refreshing to find a brand that prioritizes purity and fast, private delivery.",
  },
  {
    id: 4,
    name: 'Marcus K.',
    initials: 'MK',
    location: 'Bayonne, NJ',
    product: 'Pineapple Edition',
    rating: 5,
    quote:
      'Fast delivery right across Hudson County. Plain outer box with no embarrassing labels. Great texture, wonderful pineapple scent, rinses clean.',
  },
];

// 8. Frequently Asked Questions (Exact SEO content from docx)
const LOCATION_FAQS = [
  {
    q: 'How discreet is the packaging when my order arrives?',
    a: 'Every order ships in a plain, unbranded box or padded mailer. The outside label has no product description, flavour or suggestive words. The return address reads only "MN Fulfillment".',
  },
  {
    q: 'Do you deliver to all cities in New Jersey and across the United States?',
    a: 'Yes. We have local guides for eight cities near Newark, but we ship to every city in New Jersey and all 50 states.',
  },
  {
    q: 'How fast will my order arrive if I live in North Jersey?',
    a: 'Most North Jersey orders arrive in 1–2 business days. Orders placed before 2:00 PM EST on a business day are packed the same day.',
  },
  {
    q: 'What will appear on my card or bank statement?',
    a: 'Your statement shows a neutral name, "MN Fulfillment". It does not mention lubricant or intimate products.',
  },
  {
    q: 'Are Miss Nous lubricants condom and toy safe?',
    a: 'Miss Nous is water-based. Water-based lubricants are generally compatible with latex and polyisoprene condoms and with silicone toys. Always check the condom or toy packaging, and stop use if irritation occurs.',
  },
  {
    q: 'What if my city isn\'t listed above?',
    a: 'We still deliver to you. Shop as normal, and your order ships in the same discreet packaging, with tracking emailed once it leaves Newark.',
  },
];

// Quick Filter tabs from docx: All Cities · Essex County · Hudson County · Union County · Bergen County
const FILTER_TABS = [
  { id: 'all', label: 'All Cities' },
  { id: 'essex', label: 'Essex County' },
  { id: 'hudson', label: 'Hudson County' },
  { id: 'union', label: 'Union County' },
  { id: 'bergen', label: 'Bergen County' },
];

export default function LocationsPage({
  onNavigate,
  products = PRODUCTS,
  onAddToCart,
  onViewProduct,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First FAQ open by default as requested

  // SEO metadata setup (Exact title, description and canonical from docx)
  useEffect(() => {
    document.title = 'Miss Nous Near You | Discreet Lubricant Delivery in North NJ';

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
    metaDesc.setAttribute(
      'content',
      'Find Miss Nous water-based intimate lubricant near you. Discreet delivery from Newark to Kearny, Elizabeth, Bayonne, East Orange and across the USA.'
    );

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
    canonical.setAttribute('href', 'https://missnous.com/locations');

    return () => {
      if (createdDesc) metaDesc.remove();
      else metaDesc.setAttribute('content', prevDesc);

      if (createdCanonical) canonical.remove();
      else canonical.setAttribute('href', prevCanonical);
    };
  }, []);

  // Filtered cities based on search & county filter
  const filteredCities = useMemo(() => {
    let list = LOCATIONS;

    if (selectedRegionFilter === 'essex') {
      list = list.filter((l) => (l.county || '').toLowerCase().includes('essex'));
    } else if (selectedRegionFilter === 'hudson') {
      list = list.filter((l) => (l.county || '').toLowerCase().includes('hudson'));
    } else if (selectedRegionFilter === 'union') {
      list = list.filter((l) => (l.county || '').toLowerCase().includes('union'));
    } else if (selectedRegionFilter === 'bergen') {
      list = list.filter((l) => (l.county || '').toLowerCase().includes('bergen'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((l) => {
        const nameMatch = l.name.toLowerCase().includes(q);
        const descMatch = (l.description || '').toLowerCase().includes(q);
        const countyMatch = (l.county || '').toLowerCase().includes(q);
        const zipMatch = (l.zipCodes || []).some((z) => z.includes(q));
        const neighMatch = (l.neighborhoods || []).some((n) =>
          n.toLowerCase().includes(q)
        );
        const stateMatch =
          'new jersey nj united states usa'.includes(q) ||
          (l.state || '').toLowerCase().includes(q);
        return nameMatch || descMatch || countyMatch || zipMatch || neighMatch || stateMatch;
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

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterClick = (filterId) => {
    setSelectedRegionFilter(filterId);
    if (filterId !== 'all') {
      setTimeout(() => {
        document.getElementById('cities-directory')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="bg-[#FFF9F5] text-[#2B2225] min-h-screen font-sans selection:bg-[#F7D6DF] selection:text-[#9E3F5C] overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION – Exact SEO content from docx
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden bg-[#240c15] text-white">
        {/* Master High-Res Background Image */}
        <img
          src="/location%20hero.png"
          alt="Miss Nous Intimate Lubricants in Location Setting"
          className="absolute inset-0 w-full h-full object-cover object-[78%_center] sm:object-center select-none pointer-events-none"
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#240c15]/90 via-[#240c15]/60 sm:via-[#240c15]/75 lg:via-[#240c15]/40 to-[#240c15]/20 sm:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240c15] via-transparent to-transparent lg:hidden pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl space-y-6 sm:space-y-7 text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E8D3A5]">
                Miss Nous · Location Finder
              </span>
              <span className="hidden sm:inline-block w-12 h-px bg-[#E8D3A5]/40" />
            </div>

            {/* Headline (H1 for SEO) */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-bold tracking-tight text-white leading-[1.08]">
              Find Miss Nous <br />
              <span className="bg-gradient-to-r from-[#E8D3A5] via-[#FFF3D6] to-[#E8D3A5] bg-clip-text text-transparent">
                Near Your City
              </span>
            </h1>

            {/* Subhead */}
            <p className="font-sans text-base sm:text-lg text-[#F7D6DF]/90 font-normal leading-relaxed max-w-xl">
              Discreet delivery of our strawberry and pineapple water-based lubricants, dispatched from Newark to your door.
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
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/30 font-sans text-xs uppercase tracking-wider font-semibold backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#E8D3A5]" />
                <span>Shop Flavours</span>
              </button>
            </div>

            {/* Trust badges (4 badges, in order from docx) */}
            <div className="pt-4 sm:pt-5 border-t border-white/15 max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { icon: Package, title: 'Discreet', line: 'Plain outer box' },
                { icon: Truck, title: 'Fast Local', line: 'North NJ delivery' },
                { icon: MapPin, title: 'Nationwide', line: 'All 50 states' },
                { icon: ShieldCheck, title: 'pH Balanced', line: 'Gentle pH 4.5' },
              ].map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all hover:bg-white/15 min-w-0"
                  >
                    <Icon className="w-4 h-4 text-[#E8D3A5] flex-shrink-0" strokeWidth={1.5} />
                    <div className="leading-tight text-left min-w-0 flex-1">
                      <p className="text-[11px] sm:text-xs font-bold text-white whitespace-nowrap">{b.title}</p>
                      <p className="text-[9px] sm:text-[10px] text-[#F7D6DF]/85 whitespace-nowrap">{b.line}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. LOCATION SEARCH – Exact SEO content from docx
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
                Search your city, county or zip code to see delivery times and your local city guide.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E3F5C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, county or zip code (e.g. Kearny, Newark, 07032, Hudson)"
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

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#5A4B50] mr-1">Quick filters:</span>
              {FILTER_TABS.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleFilterClick(btn.id)}
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

            {/* Live Instant Search Results */}
            {searchQuery.trim() && (
              <div className="max-w-3xl mx-auto mt-2 rounded-2xl bg-white border border-[#F7D6DF] shadow-xl overflow-hidden">
                {filteredCities.length > 0 ? (
                  <div className="divide-y divide-[#F7D6DF]/60">
                    {filteredCities.slice(0, 5).map((city) => (
                      <button
                        key={city.slug}
                        type="button"
                        onClick={() => handleCityClick(city.slug)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[#FDF2F5] transition-colors text-left cursor-pointer group"
                      >
                        <img
                          src={city.image || CITY_IMAGE_FALLBACK}
                          alt={city.imageAlt || city.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[#F7D6DF]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-[#2B2225] text-sm truncate">{city.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-bold text-[#9E3F5C] flex-shrink-0">
                              {city.distanceLabel || 'Local Area'}
                            </span>
                          </div>
                          <p className="text-xs text-[#5A4B50] mt-0.5">
                            {city.county}{city.state ? `, ${city.state}` : ''}
                          </p>
                          {city.zipCodes && city.zipCodes.length > 0 && (
                            <p className="text-[10px] text-[#A09095] mt-0.5">
                              ZIP: {city.zipCodes.slice(0, 4).join(', ')}{city.zipCodes.length > 4 ? '…' : ''}
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-[#9E3F5C] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          Open City Guide <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                    {filteredCities.length > 5 && (
                      <div className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => document.getElementById('cities-directory')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-xs font-bold text-[#9E3F5C] hover:underline cursor-pointer"
                        >
                          View all {filteredCities.length} results in directory ↓
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FDF2F5] flex items-center justify-center mx-auto">
                      <MapPin className="w-5 h-5 text-[#9E3F5C]" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-[#2B2225] text-sm">
                        No city guide found for "{searchQuery}"
                      </p>
                      <p className="text-xs text-[#5A4B50] mt-1 max-w-md mx-auto">
                        We don't have a city guide for that area yet, but we still deliver there. Miss Nous ships discreetly to all 50 states.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('shop')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#852f49] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Shop Flavours — We Ship Everywhere
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results line (Exact copy from docx) */}
            <div className="text-center text-xs font-medium text-[#7A6B70]">
              Showing <span className="font-bold text-[#9E3F5C]">{filteredCities.length}</span> city guides matching your search.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CITY SERVICE AREAS – Exact SEO content from docx
      ───────────────────────────────────────────────────────────── */}
      <section id="cities-directory" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FDF2F5] border-y border-[#F7D6DF] scroll-mt-24">
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
                Choose your city to see local delivery times, neighborhoods we cover and answers for your area.
              </p>
            </div>

            <div className="text-xs font-semibold text-[#9E3F5C] bg-white px-3.5 py-1.5 rounded-full border border-[#F7D6DF] shadow-xs">
              8 Cities Available
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

                    {/* Tag Pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2B2225] text-[11px] font-bold shadow-md">
                        <Navigation className="w-3 h-3 text-[#9E3F5C]" />
                        {city.distanceLabel || 'Local Area'}
                      </span>
                    </div>

                    {/* County Pill */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#E8D3A5] text-[10.5px] font-bold border border-white/10">
                        {city.county?.replace(' County', '') || 'North NJ'}
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

                    {/* Neighborhood Chips from docx */}
                    {city.neighborhoods?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {city.neighborhoods.slice(0, 4).map((n) => (
                          <span
                            key={n}
                            className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-semibold text-[#2B2225] border border-[#F7D6DF]"
                          >
                            {n}
                          </span>
                        ))}
                        {city.neighborhoods.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-semibold text-[#9E3F5C]">
                            +{city.neighborhoods.length - 4} more
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
                We don't have a city guide for that area yet, but we still deliver there. Miss Nous ships discreetly to all 50 states.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3F5C] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <span>Shop Flavours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PRODUCTS – Strawberry & Pineapple (Exact SEO content from docx)
      ───────────────────────────────────────────────────────────── */}
      <section id="products-section" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#2B2225] text-white scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E8D3A5]/30 text-[#E8D3A5] text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Two Signature Flavours</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our Products: Strawberry &amp; Pineapple
            </h2>
            <p className="text-sm sm:text-base text-[#F7D6DF]/80 leading-relaxed">
              Both are water-based, pH 4.5 and 100ml, and both ship in plain, unbranded packaging.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Strawberry Product Card */}
            <article className="group bg-[#361A23] rounded-3xl sm:rounded-[2.5rem] border border-[#9E3F5C]/40 hover:border-[#9E3F5C] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              <div
                onClick={() => handleGoProduct(strawberryProduct)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                {/* Subtle ambient blur behind */}
                <img
                  src={strawberryProduct?.image || '/jpt-6.jpeg'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#361A23]/40 pointer-events-none" />

                {/* Master Product Image */}
                <img
                  src={strawberryProduct?.image || '/jpt-6.jpeg'}
                  alt="Miss Nous Intimate Lubricant – Strawberry"
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

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white text-center sm:text-left">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5] block">
                    Flavoured intimate lubricant (100ml)
                  </span>
                  <h3
                    onClick={() => handleGoProduct(strawberryProduct)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    Miss Nous Intimate Lubricant – Strawberry
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    A silky, water-based lubricant with a sweet strawberry flavour. Non-sticky and rinses clean with water.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline justify-center sm:justify-start gap-3">
                    <span className="text-3xl font-bold text-white">$31.99</span>
                    <span className="text-sm line-through text-white/50">$39.99</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9E3F5C]/40 border border-[#9E3F5C] text-[#FFF9F5] text-[11px] font-bold">
                      20% Off
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(strawberryProduct)}
                      className="py-3 px-4 bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoProduct(strawberryProduct)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Pineapple Product Card */}
            <article className="group bg-[#302616] rounded-3xl sm:rounded-[2.5rem] border border-[#D4AF6A]/40 hover:border-[#D4AF6A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 relative">
              <div
                onClick={() => handleGoProduct(pineappleProduct)}
                className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-black/40 flex items-center justify-center cursor-pointer"
              >
                {/* Subtle ambient blur behind */}
                <img
                  src={pineappleProduct?.image || '/gpt-5.png'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#302616]/40 pointer-events-none" />

                {/* Master Product Image */}
                <img
                  src={pineappleProduct?.image || '/gpt-5.png'}
                  alt="Miss Nous Intimate Lubricant – Pineapple"
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

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 text-white text-center sm:text-left">
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8D3A5] block">
                    Flavoured intimate lubricant (100ml)
                  </span>
                  <h3
                    onClick={() => handleGoProduct(pineappleProduct)}
                    className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer hover:text-[#E8D3A5] transition-colors leading-snug"
                  >
                    Miss Nous Intimate Lubricant – Pineapple
                  </h3>
                  <p className="text-sm text-[#F7D6DF]/80 leading-relaxed line-clamp-3">
                    A silky, water-based lubricant with a light, tropical pineapple flavour. Non-sticky and rinses clean with water.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline justify-center sm:justify-start gap-3">
                    <span className="text-3xl font-bold text-white">$31.99</span>
                    <span className="text-sm line-through text-white/50">$39.99</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF6A]/30 border border-[#D4AF6A] text-[#E8D3A5] text-[11px] font-bold">
                      20% Off
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(pineappleProduct)}
                      className="py-3 px-4 bg-[#D4AF6A] hover:bg-[#c29c54] text-[#2B2225] font-sans text-xs uppercase tracking-wider font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoProduct(pineappleProduct)}
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
          5. WHY CHOOSE MISS NOUS? – Exact SEO content from docx
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Why Miss Nous
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225] tracking-tight">
              Why Choose Miss Nous?
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              Made to feel easy and comfortable, from first touch to easy rinse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {WHY_CHOOSE_BENEFITS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury hover:shadow-pink-glow hover:border-[#9E3F5C]/40 transition-all duration-300 space-y-4 group flex flex-col items-center sm:items-start text-center sm:text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] group-hover:bg-[#9E3F5C] group-hover:text-white transition-colors duration-300 shadow-xs mx-auto sm:mx-0">
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
          6. SHIPPING & DELIVERY COVERAGE – Exact SEO content from docx
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
              Every order is packed with care in Newark and shipped in plain packaging. Here is what to expect.
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
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2B2225] leading-snug">{item.region}</h3>
                  <p className="text-[11px] font-bold text-[#D4AF6A] uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Reassurance Banner from docx */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#2B2225] text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E8D3A5]">Privacy First</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">Unmarked, Neutral Packaging</h3>
              <p className="text-sm text-[#F7D6DF]/80 leading-relaxed">
                Nothing on the box or the shipping label mentions lubricant or intimate products. Your order details stay private.
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
          7. REVIEWS – Exact SEO content from docx
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
                Client Experience
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2225]">
              Real Reviews From Our Customers
            </h2>
            <p className="font-sans text-base text-[#5A4B50] leading-relaxed">
              What customers say after making Miss Nous part of their routine.
            </p>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOCAL_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D4AF6A]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#FDF2F5] text-[10px] font-bold text-[#9E3F5C] border border-[#F7D6DF]">
                      Verified Client
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#2B2225] leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F7D6DF]/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9E3F5C] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                    {rev.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-sm text-[#2B2225] truncate">{rev.name}</p>
                    <p className="text-[11px] text-[#7A6B70] truncate">
                      Verified Purchaser • {rev.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fallback Review Callout Banner from docx */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FDF2F5] border border-[#F7D6DF] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2225]">
                Be one of our first reviewers
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
                Tried Miss Nous? Tell us how it felt and help others choose with confidence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Thank you for sharing your experience! Please email your feedback to support@missnous.com.');
              }}
              className="px-7 py-3 rounded-full bg-white hover:bg-[#9E3F5C] text-[#2B2225] hover:text-white border border-[#F7D6DF] text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 flex-shrink-0 cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FREQUENTLY ASKED QUESTIONS – Exact SEO content from docx
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
              Answers about local delivery, discreet packaging and product care.
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
          9. FINAL CALL TO ACTION – Exact SEO content from docx
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
                  <span>Fast &amp; Discreet Delivery</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  Ready for Comfort? <br />
                  <span className="text-[#E8D3A5]">Find Miss Nous in Your City</span>
                </h2>

                <p className="text-base sm:text-lg text-[#F7D6DF]/85 font-normal leading-relaxed">
                  Silky, water-based, pH 4.5 lubricant in strawberry and pineapple. Shipped from our Newark base in plain, unbranded packaging.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('shop')}
                    className="px-7 py-3.5 rounded-full bg-[#9E3F5C] hover:bg-[#832e47] text-white font-sans text-sm font-bold uppercase tracking-wider shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Flavours Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={scrollToSearch}
                    className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-[#E8D3A5]" />
                    <span>Find Your Nearest City</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Custom Designed Delivery Network Map Box */}
              <div className="lg:col-span-6 w-full">
                <UsaDeliveryMap onCityClick={handleCityClick} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
