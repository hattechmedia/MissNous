import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Sparkles, ArrowRight, Building2 } from 'lucide-react';
import { LOCATIONS, FEATURED_LOCATION, NEARBY_LOCATIONS } from '../data/locations';
const CITY_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1477959858607-67ae27e44f93?auto=format&fit=crop&w=1200&q=80';

function LocationCard({ location, featured = false, onNavigate }) {
  const [imgSrc, setImgSrc] = useState(location.image);

  useEffect(() => {
    setImgSrc(location.image);
  }, [location.image]);

  const handleExplore = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('location-city', location.slug);
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-[#F7D6DF]/80 bg-white shadow-luxury transition-all duration-500 hover:shadow-xl hover:border-[#9E3F5C]/30 hover:-translate-y-1 ${
        featured ? 'md:col-span-2 lg:col-span-12' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-[280px] sm:h-[340px] lg:h-[380px]' : 'h-[220px] sm:h-[240px]'}`}>
        <img
          src={imgSrc}
          alt={location.imageAlt || location.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={() => {
            if (imgSrc !== CITY_IMAGE_FALLBACK) setImgSrc(CITY_IMAGE_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/90 via-[#2B2225]/35 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {location.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E3F5C] text-[#FFF9F5] text-[11px] font-bold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Home base
            </span>
          )}
          {location.distanceLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#2B2225] text-[11px] font-bold backdrop-blur-sm border border-[#F7D6DF]">
              <Navigation className="w-3.5 h-3.5 text-[#9E3F5C]" />
              {location.distanceLabel}
            </span>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-5 sm:p-6 ${featured ? 'sm:p-8' : ''}`}>
          <h2 className={`font-serif text-[#FFF9F5] font-bold tracking-tight ${featured ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-2xl'}`}>
            {location.name}
          </h2>
          {location.tagline && (
            <p className="mt-1 text-sm sm:text-base text-[#F7D6DF] font-medium">{location.tagline}</p>
          )}
        </div>
      </div>

      <div className={`p-5 sm:p-6 space-y-4 ${featured ? 'lg:flex lg:items-start lg:gap-8 lg:p-8' : ''}`}>
        <div className={featured ? 'lg:flex-1 space-y-4' : 'space-y-4'}>
          <p className="text-sm sm:text-[15px] text-[#5A4B50] leading-relaxed">{location.description}</p>

          {location.neighborhoods?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E3F5C]">Neighborhood guides</p>
              <div className="flex flex-wrap gap-2">
                {location.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2F5] text-[#2B2225] border border-[#F7D6DF]"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#A09095] italic">Neighborhood pages — coming soon.</p>
            </div>
          )}
        </div>

        <div className={featured ? 'lg:flex-shrink-0 lg:self-end' : ''}>
          <a
            href={`/locations/${location.slug}`}
            onClick={handleExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-sm font-bold border border-[#F7D6DF] group/btn hover:bg-[#9E3F5C] hover:text-white hover:border-[#9E3F5C] transition-all duration-300"
            aria-label={`Explore ${location.name}`}
          >
            <span>Explore {location.name}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function LocationsPage({ onNavigate }) {
  useEffect(() => {
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
      'Miss Nous serves Newark, NJ and nearby communities including East Newark, Kearny, Elizabeth, Bayonne, East Orange, Hillside, and North Arlington.'
    );

    return () => {
      if (created) metaDesc.remove();
      else metaDesc.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="bg-[#FFF9F5] text-[#2B2225] min-h-screen font-sans">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden border-b border-[#F7D6DF]/60">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F5] via-[#FFF9F5] to-[#F7D6DF]/40" />
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-[#9E3F5C]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-48 rounded-full bg-[#D4AF6A]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-5 reveal-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] text-xs font-bold uppercase tracking-widest text-[#9E3F5C] shadow-xs">
            <MapPin className="w-4 h-4" />
            Service areas
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B2225] leading-tight max-w-4xl mx-auto">
            Local to <span className="text-[#9E3F5C]">Newark</span>, trusted across North Jersey
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5A4B50] leading-relaxed">
            From our studio at{' '}
            <strong className="text-[#2B2225] font-semibold">18 Garibaldi Avenue, Newark</strong>, we deliver discreet wellness to
            neighborhoods and cities within minutes. Select your area to open a full local guide with shop, FAQs, and delivery info.
          </p>
        </div>
      </section>

      {/* Featured Newark */}
      {FEATURED_LOCATION && (
        <section className="px-4 sm:px-8 lg:px-16 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 reveal-up">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2225]">Newark &amp; neighborhoods</h2>
              <p className="mt-2 text-sm text-[#5A4B50] max-w-xl">
                Start with Newark — neighborhood-specific guides (Ironbound, Downtown, and more) are next.
              </p>
            </div>
            <Building2 className="hidden sm:block w-10 h-10 text-[#D4AF6A]/80 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-1 reveal-up">
            <LocationCard location={FEATURED_LOCATION} featured onNavigate={onNavigate} />
          </div>
        </section>
      )}

      {/* Nearby cities grid */}
      <section className="px-4 sm:px-8 lg:px-16 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="mb-8 reveal-up">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2225]">Nearby cities</h2>
          <p className="mt-2 text-sm text-[#5A4B50]">
            Approximate distance from Miss Nous, Newark — {LOCATIONS.length - 1} communities we proudly serve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {NEARBY_LOCATIONS.map((loc, index) => (
            <div key={loc.slug} className="reveal-up" style={{ animationDelay: `${index * 60}ms` }}>
              <LocationCard location={loc} onNavigate={onNavigate} />
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-14 sm:mt-16 rounded-3xl bg-[#9E3F5C] p-8 sm:p-10 text-center text-[#FFF9F5] shadow-luxury reveal-up border border-[#D4AF6A]/20">
          <p className="font-serif text-2xl sm:text-3xl font-bold mb-3">Questions about delivery in your city?</p>
          <p className="text-sm sm:text-base text-[#F7D6DF] max-w-xl mx-auto mb-6">
            Our team knows North Jersey block by block. Reach out for pickup, shipping, or store hours.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('contact')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFF9F5] text-[#9E3F5C] font-bold text-sm hover:bg-[#E8D3A5] transition-colors shadow-md"
          >
            Contact Miss Nous
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
