import React, { useState } from 'react';
import { Globe, MapPin, Navigation, ShieldCheck, Zap } from 'lucide-react';

/**
 * USA Nationwide Delivery Network Map Component
 * Displays a vector map of USA with Newark Hub as the main dispatch center
 * and dashed network routing lines to major cities across the USA.
 */
export function UsaDeliveryMap() {
  const [activeCity, setActiveCity] = useState(null);

  const hub = { name: 'Newark Hub (Dispatch)', x: 420, y: 110, isHub: true, state: 'NJ' };

  const destinations = [
    { id: 'nyc', name: 'NYC Metro', x: 440, y: 96, state: 'NY', eta: 'Same-Day' },
    { id: 'jc', name: 'Jersey City & Kearny', x: 424, y: 122, state: 'NJ', eta: 'Same-Day' },
    { id: 'phl', name: 'Philadelphia', x: 405, y: 132, state: 'PA', eta: '1-Day' },
    { id: 'bos', name: 'Boston', x: 454, y: 78, state: 'MA', eta: '1-Day' },
    { id: 'chi', name: 'Chicago', x: 315, y: 118, state: 'IL', eta: '1-2 Days' },
    { id: 'atl', name: 'Atlanta', x: 352, y: 210, state: 'GA', eta: '1-2 Days' },
    { id: 'mia', name: 'Miami', x: 406, y: 284, state: 'FL', eta: '2 Days' },
    { id: 'dfw', name: 'Dallas', x: 252, y: 236, state: 'TX', eta: '2 Days' },
    { id: 'den', name: 'Denver', x: 185, y: 142, state: 'CO', eta: '2 Days' },
    { id: 'lax', name: 'Los Angeles', x: 68, y: 196, state: 'CA', eta: '2-3 Days' },
    { id: 'sea', name: 'Seattle', x: 72, y: 56, state: 'WA', eta: '2-3 Days' },
  ];

  return (
    <div className="w-full bg-[#07130E]/95 rounded-3xl border border-[#2EA043]/40 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Subtle background radar glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2EA043]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2D1F] border border-[#2EA043]/50 text-[#3FB950] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-inner">
          <Globe className="w-3.5 h-3.5 text-[#3FB950] animate-pulse" />
          <span>Nationwide Delivery Network</span>
        </div>

        <h3 className="font-sans text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <span>Delivering Across USA</span>
        </h3>
        <p className="text-xs text-[#9AE6B4]/80 leading-relaxed font-normal">
          Direct dispatch from our Newark hub to all 50 states via temperature-controlled, 100% plain packaging.
        </p>
      </div>

      {/* Interactive Vector Map Stage */}
      <div className="relative my-4 sm:my-6 w-full aspect-[500/320] select-none">
        <svg
          viewBox="0 0 500 320"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="usa-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2EA043" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>

            {/* Glowing Gradient for Route Lines */}
            <linearGradient id="route-line-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3FB950" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2EA043" stopOpacity="0.4" />
            </linearGradient>

            {/* Hub Radial Glow */}
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3FB950" stopOpacity="1" />
              <stop offset="60%" stopColor="#2EA043" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0F2D1F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="320" fill="url(#usa-grid)" rx="16" />

          {/* Stylized USA Continental Landmass Outline */}
          <path
            d="M 68 56 
               Q 110 52, 185 54 
               Q 250 56, 320 62 
               Q 370 70, 420 74 
               L 458 72 
               Q 466 78, 460 92 
               L 442 100 
               Q 432 110, 424 130 
               L 412 152 
               Q 408 178, 396 220 
               L 412 280 
               Q 400 292, 390 286 
               Q 378 240, 362 232 
               Q 330 236, 296 242 
               L 266 276 
               Q 250 280, 238 250 
               L 220 236 
               Q 175 240, 130 226 
               L 78 206 
               Q 62 192, 54 162 
               Q 44 132, 52 102 
               Z"
            fill="#0A1C14"
            stroke="#2EA043"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="transition-colors duration-500 hover:fill-[#0D2419]"
          />

          {/* Great Lakes & Geographical Accents */}
          <ellipse cx="340" cy="74" rx="22" ry="10" fill="#07130E" stroke="#2EA043" strokeWidth="0.8" strokeOpacity="0.6" />
          <ellipse cx="368" cy="80" rx="14" ry="7" fill="#07130E" stroke="#2EA043" strokeWidth="0.8" strokeOpacity="0.6" />

          {/* Dashed Dispatch Route Lines from Newark Hub to all destination nodes */}
          {destinations.map((city) => (
            <g key={`route-${city.id}`}>
              <line
                x1={hub.x}
                y1={hub.y}
                x2={city.x}
                y2={city.y}
                stroke="#3FB950"
                strokeWidth={activeCity === city.id ? 2 : 1.2}
                strokeDasharray="4 4"
                strokeOpacity={activeCity === city.id ? 0.95 : 0.55}
                className="transition-all duration-300"
              />
            </g>
          ))}

          {/* Destination Nodes */}
          {destinations.map((city) => {
            const isHovered = activeCity === city.id;
            return (
              <g
                key={`node-${city.id}`}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveCity(city.id)}
                onMouseLeave={() => setActiveCity(null)}
              >
                {/* Ping ring on hover */}
                {isHovered && (
                  <circle cx={city.x} cy={city.y} r="10" fill="none" stroke="#56D364" strokeWidth="1.5" className="animate-ping" />
                )}

                {/* Node point */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 5.5 : 4}
                  fill="#3FB950"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-md"
                />

                {/* City Tag Label */}
                <foreignObject
                  x={city.x > 380 ? city.x - 90 : city.x < 100 ? city.x - 10 : city.x - 45}
                  y={city.y > 220 ? city.y - 24 : city.y + 6}
                  width="110"
                  height="26"
                  className="pointer-events-none"
                >
                  <div
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-md ${
                      isHovered
                        ? 'bg-[#3FB950] text-[#07130E] scale-105 border border-white'
                        : 'bg-[#0A1C14]/90 text-white/95 border border-[#2EA043]/40'
                    }`}
                  >
                    <span>{city.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central Newark Hub Beacon */}
          <g className="cursor-pointer">
            <circle cx={hub.x} cy={hub.y} r="18" fill="url(#hub-glow)" />
            <circle cx={hub.x} cy={hub.y} r="12" fill="none" stroke="#56D364" strokeWidth="1.5" className="animate-ping opacity-80" />
            <circle cx={hub.x} cy={hub.y} r="6.5" fill="#56D364" stroke="#FFFFFF" strokeWidth="2" className="shadow-lg" />

            {/* Hub Tag Label */}
            <foreignObject x={hub.x - 65} y={hub.y - 30} width="130" height="28" className="pointer-events-none">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3FB950] text-[#07130E] font-black text-[10px] tracking-wide uppercase shadow-[0_0_15px_rgba(63,185,80,0.8)] border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Newark Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-[#2EA043]/30 grid grid-cols-3 gap-2 text-center relative z-10">
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Dispatch</p>
          <p className="text-xs sm:text-sm font-bold text-white">Same-Day</p>
        </div>
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Packaging</p>
          <p className="text-xs sm:text-sm font-bold text-white">100% Plain</p>
        </div>
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Coverage</p>
          <p className="text-xs sm:text-sm font-bold text-white">All 50 States</p>
        </div>
      </div>
    </div>
  );
}

/**
 * City Specific Delivery Network Map Component
 * Displays a styled local delivery map for the active city (e.g. Kearny, Newark, etc.)
 * showing local dispatch routes to all residential neighborhoods in that city.
 */
export function CityDeliveryMap({ location }) {
  const [activeZone, setActiveZone] = useState(null);

  const cityName = location?.name || 'Local City';
  const county = location?.county || 'New Jersey';
  const neighborhoods = (location?.neighborhoods && location.neighborhoods.length > 0)
    ? location.neighborhoods
    : ['Downtown District', 'North Residential', 'Waterfront Plaza', 'Central Avenue', 'South Boundary', 'Meadowlands Route'];

  // Radial positions for neighborhood nodes around the central depot
  const nodeSlots = [
    { x: 250, y: 70, align: 'top' },
    { x: 375, y: 105, align: 'right' },
    { x: 410, y: 190, align: 'right' },
    { x: 360, y: 280, align: 'right' },
    { x: 250, y: 310, align: 'bottom' },
    { x: 135, y: 275, align: 'left' },
    { x: 90, y: 190, align: 'left' },
    { x: 125, y: 105, align: 'left' },
  ];

  const zones = neighborhoods.slice(0, 8).map((name, idx) => ({
    id: `zone-${idx}`,
    name,
    x: nodeSlots[idx % nodeSlots.length].x,
    y: nodeSlots[idx % nodeSlots.length].y,
    eta: idx % 2 === 0 ? 'Doorstep Delivery' : 'Fast Local Courier',
  }));

  const depot = { name: `${cityName} Depot`, x: 250, y: 185 };

  return (
    <div className="w-full bg-[#07130E]/95 rounded-3xl border border-[#2EA043]/40 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2EA043]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2D1F] border border-[#2EA043]/50 text-[#3FB950] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-inner">
          <Navigation className="w-3.5 h-3.5 text-[#3FB950] animate-pulse" />
          <span>Local Doorstep Dispatch</span>
        </div>

        <h3 className="font-sans text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <span>Delivering Across {cityName}</span>
        </h3>
        <p className="text-xs text-[#9AE6B4]/80 leading-relaxed font-normal">
          Direct local courier dispatch to all postal routes and neighborhoods across {cityName}, {county}.
        </p>
      </div>

      {/* Interactive City Territory Vector Map Stage */}
      <div className="relative my-4 sm:my-6 w-full aspect-[500/360] select-none">
        <svg
          viewBox="0 0 500 360"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="city-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#2EA043" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>

            {/* Central Depot Glow */}
            <radialGradient id="depot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3FB950" stopOpacity="1" />
              <stop offset="60%" stopColor="#2EA043" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F2D1F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="360" fill="url(#city-grid)" rx="16" />

          {/* Stylized City Municipal Polygon Perimeter */}
          <polygon
            points="250,30 360,55 440,130 460,230 390,320 250,345 120,325 50,230 65,120 160,50"
            fill="#0A1C14"
            stroke="#2EA043"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="transition-colors duration-500 hover:fill-[#0D2419]"
          />

          {/* Arterial Boulevard Ring Line */}
          <circle cx="250" cy="185" r="95" fill="none" stroke="#2EA043" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <circle cx="250" cy="185" r="140" fill="none" stroke="#2EA043" strokeWidth="0.6" strokeDasharray="2 4" strokeOpacity="0.3" />

          {/* Radial Dispatch Route Lines from Depot to Neighborhoods */}
          {zones.map((zone) => (
            <line
              key={`line-${zone.id}`}
              x1={depot.x}
              y1={depot.y}
              x2={zone.x}
              y2={zone.y}
              stroke="#3FB950"
              strokeWidth={activeZone === zone.id ? 2 : 1.2}
              strokeDasharray="4 4"
              strokeOpacity={activeZone === zone.id ? 0.95 : 0.55}
              className="transition-all duration-300"
            />
          ))}

          {/* Neighborhood Destination Nodes */}
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
                  <circle cx={zone.x} cy={zone.y} r="10" fill="none" stroke="#56D364" strokeWidth="1.5" className="animate-ping" />
                )}

                {/* Node point */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? 5.5 : 4}
                  fill="#3FB950"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-md"
                />

                {/* Neighborhood Tag Label */}
                <foreignObject
                  x={zone.x > 300 ? zone.x - 110 : zone.x < 150 ? zone.x - 10 : zone.x - 55}
                  y={zone.y > 240 ? zone.y - 24 : zone.y + 6}
                  width="130"
                  height="26"
                  className="pointer-events-none"
                >
                  <div
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-md ${
                      isHovered
                        ? 'bg-[#3FB950] text-[#07130E] scale-105 border border-white'
                        : 'bg-[#0A1C14]/90 text-white/95 border border-[#2EA043]/40'
                    }`}
                  >
                    <span>{zone.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central Depot Beacon */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="20" fill="url(#depot-glow)" />
            <circle cx={depot.x} cy={depot.y} r="13" fill="none" stroke="#56D364" strokeWidth="1.5" className="animate-ping opacity-80" />
            <circle cx={depot.x} cy={depot.y} r="7" fill="#56D364" stroke="#FFFFFF" strokeWidth="2" className="shadow-lg" />

            {/* Depot Tag Label */}
            <foreignObject x={depot.x - 70} y={depot.y - 32} width="140" height="28" className="pointer-events-none">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3FB950] text-[#07130E] font-black text-[10px] tracking-wide uppercase shadow-[0_0_15px_rgba(63,185,80,0.8)] border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{cityName} Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-[#2EA043]/30 grid grid-cols-3 gap-2 text-center relative z-10">
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Courier</p>
          <p className="text-xs sm:text-sm font-bold text-white">Local Doorstep</p>
        </div>
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Privacy</p>
          <p className="text-xs sm:text-sm font-bold text-white">100% Discreet</p>
        </div>
        <div className="p-2 rounded-xl bg-[#0F2D1F]/50 border border-[#2EA043]/20">
          <p className="text-[10px] uppercase font-bold text-[#3FB950]">Speed</p>
          <p className="text-xs sm:text-sm font-bold text-white">1-2 Days</p>
        </div>
      </div>
    </div>
  );
}
