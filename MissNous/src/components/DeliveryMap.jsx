import React, { useState } from 'react';
import { Globe, MapPin, Navigation, Sparkles, Truck } from 'lucide-react';
import { LOCATIONS } from '../data/locations';

/**
 * Main Locations Page Delivery Network Map
 * Styled strictly in Miss Nous website theme (Deep Velvet Maroon, Warm Gold, Rose Glow).
 * Features all 8 service cities (Newark Hub + 7 surrounding cities + Nationwide routing).
 */
export function UsaDeliveryMap() {
  const [activeCity, setActiveCity] = useState(null);

  // Newark is the primary home base / dispatch center
  const hub = { name: 'Newark Hub (Dispatch Base)', x: 240, y: 175, isHub: true, distance: 'Home base' };

  // All 7 surrounding service cities from the directory
  const serviceCities = [
    { id: 'east-newark', name: 'East Newark', x: 295, y: 155, distance: '~2.0 mi', eta: 'Same-Day' },
    { id: 'kearny', name: 'Kearny', x: 315, y: 110, distance: '~2.5 mi', eta: 'Same-Day' },
    { id: 'north-arlington', name: 'North Arlington', x: 310, y: 62, distance: '~4.8 mi', eta: 'Same-Day' },
    { id: 'east-orange', name: 'East Orange', x: 155, y: 115, distance: '~4.5 mi', eta: 'Same-Day' },
    { id: 'hillside', name: 'Hillside', x: 165, y: 235, distance: '~4.7 mi', eta: 'Same-Day' },
    { id: 'elizabeth', name: 'Elizabeth', x: 215, y: 285, distance: '~3.7 mi', eta: 'Same-Day' },
    { id: 'bayonne', name: 'Bayonne', x: 345, y: 265, distance: '~4.1 mi', eta: 'Same-Day' },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-[#260E18]/95 via-[#1E0A12]/95 to-[#16070D]/95 rounded-3xl border border-[#E8D3A5]/30 p-5 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Brand luxury ambient glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E3F5C]/20 border border-[#E8D3A5]/40 text-[#E8D3A5] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-inner">
          <Globe className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
          <span>8 Core Cities &amp; Nationwide Network</span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          Delivering Across Newark Metro <br className="hidden sm:inline" />
          <span className="text-[#E8D3A5]">&amp; All 50 States</span>
        </h3>
        <p className="text-xs text-[#F7D6DF]/80 leading-relaxed font-normal">
          Direct dispatch from our Newark hub to all 8 local New Jersey cities and nationwide via discreet, 100% plain packaging.
        </p>
      </div>

      {/* Interactive Vector Regional & City Network Map */}
      <div className="relative my-4 sm:my-6 w-full aspect-[500/340] select-none">
        <svg
          viewBox="0 0 500 340"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Miss Nous Luxury Grid */}
            <pattern id="theme-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#E8D3A5" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>

            {/* Central Hub Beacon Radial Glow */}
            <radialGradient id="theme-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8D3A5" stopOpacity="1" />
              <stop offset="50%" stopColor="#9E3F5C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E0A12" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="340" fill="url(#theme-grid)" rx="16" />

          {/* Stylized Regional Metro Perimeter (Northern New Jersey Dispatch Territory) */}
          <path
            d="M 240 35 
               Q 335 45, 360 85 
               L 380 150 
               Q 395 210, 365 290 
               L 320 315 
               Q 230 325, 175 305 
               L 125 245 
               Q 105 175, 120 115 
               L 170 55 
               Z"
            fill="#2B121D"
            stroke="#E8D3A5"
            strokeWidth="1.6"
            strokeOpacity="0.75"
            strokeLinejoin="round"
            className="transition-colors duration-500 hover:fill-[#331624]"
          />

          {/* Passaic River & Newark Bay Stylized Geographic Waterline */}
          <path
            d="M 305 45 Q 315 110, 290 160 Q 275 195, 295 240 L 330 280"
            fill="none"
            stroke="#9E3F5C"
            strokeWidth="2"
            strokeOpacity="0.45"
            strokeDasharray="3 3"
          />

          {/* Outbound Nationwide Indicator Line (Connecting all 50 states) */}
          <g className="opacity-75 hover:opacity-100 transition-opacity">
            <line
              x1={hub.x}
              y1={hub.y}
              x2="465"
              y2="45"
              stroke="#E8D3A5"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx="465" cy="45" r="4" fill="#D4AF6A" stroke="#FFFFFF" strokeWidth="1" />
            <foreignObject x="375" y="22" width="120" height="24" className="pointer-events-none">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9E3F5C] text-[#FFF9F5] text-[8px] font-bold uppercase tracking-wider border border-[#E8D3A5]/50 shadow-md">
                <Truck className="w-2.5 h-2.5" />
                <span>All 50 States</span>
              </div>
            </foreignObject>
          </g>

          {/* Dashed Dispatch Lines from Newark Hub to All 7 Cities */}
          {serviceCities.map((city) => (
            <line
              key={`route-${city.id}`}
              x1={hub.x}
              y1={hub.y}
              x2={city.x}
              y2={city.y}
              stroke={activeCity === city.id ? '#FFF3D6' : '#E8D3A5'}
              strokeWidth={activeCity === city.id ? 2 : 1.3}
              strokeDasharray="4 4"
              strokeOpacity={activeCity === city.id ? 0.95 : 0.65}
              className="transition-all duration-300"
            />
          ))}

          {/* The 7 Surrounding Service City Nodes */}
          {serviceCities.map((city) => {
            const isHovered = activeCity === city.id;
            return (
              <g
                key={`city-${city.id}`}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveCity(city.id)}
                onMouseLeave={() => setActiveCity(null)}
              >
                {/* Ping ring on hover */}
                {isHovered && (
                  <circle cx={city.x} cy={city.y} r="10" fill="none" stroke="#E8D3A5" strokeWidth="1.5" className="animate-ping" />
                )}

                {/* City point */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#361A23"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-md"
                />

                {/* City Tag Label */}
                <foreignObject
                  x={city.x > 270 ? city.x + 8 : city.x - 110}
                  y={city.y - 12}
                  width="115"
                  height="26"
                  className="pointer-events-none"
                >
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-md ${
                      isHovered
                        ? 'bg-[#E8D3A5] text-[#2B2225] scale-105 border border-white'
                        : 'bg-[#1E0A12]/95 text-white/95 border border-[#E8D3A5]/35'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-[8px] text-[#F7D6DF]/70 font-normal">({city.distance})</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central Newark Hub Beacon */}
          <g className="cursor-pointer">
            <circle cx={hub.x} cy={hub.y} r="20" fill="url(#theme-hub-glow)" />
            <circle cx={hub.x} cy={hub.y} r="13" fill="none" stroke="#E8D3A5" strokeWidth="1.6" className="animate-ping opacity-85" />
            <circle cx={hub.x} cy={hub.y} r="6.5" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2" className="shadow-lg" />

            {/* Hub Tag Label */}
            <foreignObject x={hub.x - 70} y={hub.y - 32} width="140" height="28" className="pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#9E3F5C] via-[#A84260] to-[#9E3F5C] text-white font-black text-[10px] tracking-wide uppercase shadow-[0_0_15px_rgba(232,211,165,0.7)] border border-[#E8D3A5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8D3A5] animate-pulse" />
                <span>Newark Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Footer Metrics in Website Theme */}
      <div className="pt-3 border-t border-[#E8D3A5]/20 grid grid-cols-3 gap-2 text-center relative z-10">
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Local Dispatch</p>
          <p className="text-xs sm:text-sm font-bold text-white">8 NJ Cities</p>
        </div>
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Packaging</p>
          <p className="text-xs sm:text-sm font-bold text-white">100% Discreet</p>
        </div>
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Coverage</p>
          <p className="text-xs sm:text-sm font-bold text-white">All 50 States</p>
        </div>
      </div>
    </div>
  );
}

/**
 * City Specific Delivery Network Map Component
 * Styled in Miss Nous website theme (Deep Velvet Maroon, Warm Gold, Rose Glow).
 * Accurately plots the exact delivery areas / neighborhoods of that specific city.
 */
export function CityDeliveryMap({ location }) {
  const [activeZone, setActiveZone] = useState(null);

  const cityName = location?.name || 'Local City';
  const county = location?.county || 'New Jersey';
  const neighborhoods = (location?.neighborhoods && location.neighborhoods.length > 0)
    ? location.neighborhoods
    : ['Central District', 'North Residential', 'Waterfront Plaza', 'Main Avenue', 'South Boundary', 'Meadowlands Edge'];

  // Geographic distribution coordinates for neighborhoods around city center
  const nodeSlots = [
    { x: 250, y: 65 },
    { x: 375, y: 100 },
    { x: 410, y: 185 },
    { x: 360, y: 275 },
    { x: 250, y: 305 },
    { x: 135, y: 270 },
    { x: 90, y: 185 },
    { x: 125, y: 100 },
  ];

  const zones = neighborhoods.slice(0, 8).map((name, idx) => ({
    id: `zone-${idx}`,
    name,
    x: nodeSlots[idx % nodeSlots.length].x,
    y: nodeSlots[idx % nodeSlots.length].y,
  }));

  const depot = { name: `${cityName} Hub`, x: 250, y: 180 };

  return (
    <div className="w-full bg-gradient-to-br from-[#260E18]/95 via-[#1E0A12]/95 to-[#16070D]/95 rounded-3xl border border-[#E8D3A5]/30 p-5 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Brand luxury ambient glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E3F5C]/20 border border-[#E8D3A5]/40 text-[#E8D3A5] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-inner">
          <Navigation className="w-3.5 h-3.5 text-[#E8D3A5] animate-pulse" />
          <span>Local Doorstep Delivery Areas</span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          Delivering Across {cityName} <br className="hidden sm:inline" />
          <span className="text-[#E8D3A5]">All Neighborhood Routes</span>
        </h3>
        <p className="text-xs text-[#F7D6DF]/80 leading-relaxed font-normal">
          Direct courier dispatch to all postal codes and residential neighborhoods across {cityName}, {county}.
        </p>
      </div>

      {/* Interactive City Territory Vector Map Stage */}
      <div className="relative my-4 sm:my-6 w-full aspect-[500/350] select-none">
        <svg
          viewBox="0 0 500 350"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="theme-city-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#E8D3A5" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>

            {/* Central Depot Glow */}
            <radialGradient id="theme-depot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8D3A5" stopOpacity="1" />
              <stop offset="50%" stopColor="#9E3F5C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E0A12" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="350" fill="url(#theme-city-grid)" rx="16" />

          {/* Stylized Municipal Territory Polygon */}
          <polygon
            points="250,28 360,52 440,125 460,225 390,315 250,338 120,320 50,225 65,115 160,48"
            fill="#2B121D"
            stroke="#E8D3A5"
            strokeWidth="1.6"
            strokeOpacity="0.75"
            strokeLinejoin="round"
            className="transition-colors duration-500 hover:fill-[#331624]"
          />

          {/* Concentric Zone Rings */}
          <circle cx="250" cy="180" r="95" fill="none" stroke="#9E3F5C" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
          <circle cx="250" cy="180" r="140" fill="none" stroke="#E8D3A5" strokeWidth="0.8" strokeDasharray="2 4" strokeOpacity="0.25" />

          {/* Radial Dispatch Route Lines from City Hub to All Neighborhoods */}
          {zones.map((zone) => (
            <line
              key={`line-${zone.id}`}
              x1={depot.x}
              y1={depot.y}
              x2={zone.x}
              y2={zone.y}
              stroke={activeZone === zone.id ? '#FFF3D6' : '#E8D3A5'}
              strokeWidth={activeZone === zone.id ? 2 : 1.3}
              strokeDasharray="4 4"
              strokeOpacity={activeZone === zone.id ? 0.95 : 0.65}
              className="transition-all duration-300"
            />
          ))}

          {/* Neighborhood Area Nodes */}
          {zones.map((zone) => {
            const isHovered = activeZone === zone.id;
            return (
              <g
                key={`node-${zone.id}`}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveZone(zone.id)}
                onMouseLeave={() => setActiveZone(null)}
              >
                {/* Ping ring on hover */}
                {isHovered && (
                  <circle cx={zone.x} cy={zone.y} r="10" fill="none" stroke="#E8D3A5" strokeWidth="1.5" className="animate-ping" />
                )}

                {/* Node point */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#361A23"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-md"
                />

                {/* Neighborhood Tag Label */}
                <foreignObject
                  x={zone.x > 260 ? zone.x + 8 : zone.x - 128}
                  y={zone.y - 12}
                  width="125"
                  height="26"
                  className="pointer-events-none"
                >
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-md ${
                      isHovered
                        ? 'bg-[#E8D3A5] text-[#2B2225] scale-105 border border-white'
                        : 'bg-[#1E0A12]/95 text-white/95 border border-[#E8D3A5]/35'
                    }`}
                  >
                    <span>{zone.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central Depot Hub Beacon */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="20" fill="url(#theme-depot-glow)" />
            <circle cx={depot.x} cy={depot.y} r="13" fill="none" stroke="#E8D3A5" strokeWidth="1.6" className="animate-ping opacity-85" />
            <circle cx={depot.x} cy={depot.y} r="6.5" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2" className="shadow-lg" />

            {/* Depot Tag Label */}
            <foreignObject x={depot.x - 70} y={depot.y - 32} width="140" height="28" className="pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#9E3F5C] via-[#A84260] to-[#9E3F5C] text-white font-black text-[10px] tracking-wide uppercase shadow-[0_0_15px_rgba(232,211,165,0.7)] border border-[#E8D3A5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8D3A5] animate-pulse" />
                <span>{cityName} Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Footer Metrics in Website Theme */}
      <div className="pt-3 border-t border-[#E8D3A5]/20 grid grid-cols-3 gap-2 text-center relative z-10">
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Courier</p>
          <p className="text-xs sm:text-sm font-bold text-white">Local Doorstep</p>
        </div>
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Privacy</p>
          <p className="text-xs sm:text-sm font-bold text-white">100% Plain Box</p>
        </div>
        <div className="p-2 rounded-xl bg-[#361A23]/60 border border-[#E8D3A5]/20">
          <p className="text-[10px] uppercase font-bold text-[#E8D3A5]">Delivery</p>
          <p className="text-xs sm:text-sm font-bold text-white">Fast &amp; Direct</p>
        </div>
      </div>
    </div>
  );
}
