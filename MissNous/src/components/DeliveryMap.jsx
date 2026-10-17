import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { LOCATIONS } from '../data/locations';

/**
 * Real USA Delivery Network Map Component
 * Displays the real geographic USA map (Albers projection) in Miss Nous brand luxury theme.
 * Points represent the 8 service cities listed on the Locations page radiating from Newark Hub.
 * All header/footer text removed as requested — pure map with dispatch hub & 8 city routes.
 */
export function UsaDeliveryMap({ onCityClick }) {
  const [activeCity, setActiveCity] = useState(null);

  // Exact coordinates matching the 959x593 real USA SVG map
  // Newark / North Jersey is located at (840, 198)
  const hub = { name: 'Newark Hub (Dispatch)', x: 840, y: 198 };

  // Well-balanced radial coordinates for the 8 Service Cities fanning across the map
  const CITY_COORDINATES = {
    'north-arlington': { x: 180, y: 110 },
    'kearny':          { x: 390, y: 155 },
    'east-newark':     { x: 600, y: 195 },
    'newark':          { x: 770, y: 265 },
    'bayonne':         { x: 680, y: 440 },
    'elizabeth':       { x: 480, y: 435 },
    'east-orange':     { x: 340, y: 310 },
    'hillside':        { x: 170, y: 370 },
  };

  const destinations = LOCATIONS.map((loc) => ({
    id: loc.slug,
    slug: loc.slug,
    name: loc.name,
    county: loc.county,
    distanceLabel: loc.distanceLabel,
    x: CITY_COORDINATES[loc.slug]?.x || 500,
    y: CITY_COORDINATES[loc.slug]?.y || 300,
  }));

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-br from-[#240C16] via-[#1A0710] to-[#14050D] rounded-3xl border border-[#E8D3A5]/35 p-3 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.7)] relative overflow-hidden flex items-center justify-center">
      {/* Brand luxury ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Real USA SVG Map with Precision Routing Overlay */}
      <div className="relative w-full aspect-[959/593] select-none">
        <svg
          viewBox="0 0 959 593"
          className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Miss Nous Hub Glow Gradient */}
            <radialGradient id="usa-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3D6" stopOpacity="1" />
              <stop offset="45%" stopColor="#E8D3A5" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#9E3F5C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1A0710" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Real Geographic USA Map Silhouette */}
          <image
            href="/usa-map.svg"
            x="0"
            y="0"
            width="959"
            height="593"
            preserveAspectRatio="xMidYMid meet"
            className="opacity-95"
          />

          {/* Dashed Gold Route Lines from Newark Hub across USA */}
          {destinations.map((city) => (
            <g key={`route-${city.id}`}>
              <line
                x1={hub.x}
                y1={hub.y}
                x2={city.x}
                y2={city.y}
                stroke={activeCity === city.id ? '#FFF3D6' : '#E8D3A5'}
                strokeWidth={activeCity === city.id ? 2.5 : 1.5}
                strokeDasharray="5 5"
                strokeOpacity={activeCity === city.id ? 1 : 0.65}
                className="transition-all duration-300"
              />
            </g>
          ))}

          {/* Destination Nodes for the 8 Service Cities */}
          {destinations.map((city) => {
            const isHovered = activeCity === city.id;
            return (
              <g
                key={`node-${city.id}`}
                className="cursor-pointer group"
                onClick={() => onCityClick && onCityClick(city.slug)}
                onMouseEnter={() => setActiveCity(city.id)}
                onMouseLeave={() => setActiveCity(null)}
              >
                {/* Ping ring on hover */}
                {isHovered && (
                  <circle cx={city.x} cy={city.y} r="16" fill="none" stroke="#E8D3A5" strokeWidth="2" className="animate-ping" />
                )}

                {/* Node point */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 8 : 6}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#361A23"
                  strokeWidth="2"
                  className="transition-all duration-200 shadow-md"
                />

                {/* City Tag Label */}
                <foreignObject
                  x={city.x - 70}
                  y={city.y > 420 ? city.y - 36 : city.y + 10}
                  width="140"
                  height="34"
                  className="pointer-events-none"
                >
                  <div className="w-full flex justify-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-lg ${
                        isHovered
                          ? 'bg-[#E8D3A5] text-[#2B2225] scale-105 border border-white'
                          : 'bg-[#1F0A14]/95 text-white/95 border border-[#E8D3A5]/40 backdrop-blur-md'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8D3A5]" />
                      <span>{city.name}</span>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central Newark Hub Beacon */}
          <g className="cursor-pointer">
            <circle cx={hub.x} cy={hub.y} r="30" fill="url(#usa-hub-glow)" />
            <circle cx={hub.x} cy={hub.y} r="18" fill="none" stroke="#E8D3A5" strokeWidth="2.5" className="animate-ping opacity-90" />
            <circle cx={hub.x} cy={hub.y} r="9" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-2xl" />

            {/* Hub Tag Label */}
            <foreignObject x={hub.x - 135} y={hub.y - 40} width="160" height="34" className="pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#9E3F5C] via-[#A84260] to-[#9E3F5C] text-white font-black text-[11px] tracking-wide uppercase shadow-[0_0_20px_rgba(232,211,165,0.8)] border-2 border-[#E8D3A5]">
                <span className="w-2 h-2 rounded-full bg-[#E8D3A5] animate-pulse" />
                <span>Newark Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * Real City Delivery Network Map Component
 * Displays the real New Jersey state geographic map with local city hub and neighborhood routes.
 * All header/footer text removed as requested — pure map with central hub and local areas.
 */
export function CityDeliveryMap({ location }) {
  const [activeZone, setActiveZone] = useState(null);

  const cityName = location?.name || 'Local City';
  const neighborhoods = (location?.neighborhoods && location.neighborhoods.length > 0)
    ? location.neighborhoods
    : ['Central District', 'North Residential', 'Waterfront Plaza', 'Main Avenue', 'South Boundary', 'Meadowlands Edge'];

  // Geographic distribution coordinates in New Jersey SVG space (viewBox -8038 -13966 14262 26999)
  // Northern NJ / Newark Metro hub coordinates: (2200, -6800)
  const depot = { name: `${cityName} Hub`, x: 2200, y: -6800 };

  // Radial offsets around the northern NJ city hub
  const nodeOffsets = [
    { dx: -200, dy: -3200 },
    { dx: 2600, dy: -2400 },
    { dx: 3800, dy: 600 },
    { dx: 2400, dy: 3400 },
    { dx: -400, dy: 4600 },
    { dx: -2600, dy: 2800 },
    { dx: -3800, dy: -400 },
    { dx: -2400, dy: -2400 },
  ];

  const zones = neighborhoods.slice(0, 8).map((name, idx) => ({
    id: `zone-${idx}`,
    name,
    x: depot.x + nodeOffsets[idx % nodeOffsets.length].dx,
    y: depot.y + nodeOffsets[idx % nodeOffsets.length].dy,
  }));

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-br from-[#240C16] via-[#1A0710] to-[#14050D] rounded-3xl border border-[#E8D3A5]/35 p-3 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.7)] relative overflow-hidden flex items-center justify-center">
      {/* Brand luxury ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Real New Jersey SVG Map with Neighborhood Routing Overlay */}
      <div className="relative w-full aspect-[14262/26999] max-h-[380px] select-none flex items-center justify-center">
        <svg
          viewBox="-8038 -13966 14262 26999"
          className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Central Depot Hub Glow */}
            <radialGradient id="nj-depot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3D6" stopOpacity="1" />
              <stop offset="45%" stopColor="#E8D3A5" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#9E3F5C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1A0710" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Real New Jersey Geographic Map Silhouette */}
          <image
            href="/nj-map.svg"
            x="-8038"
            y="-13966"
            width="14262"
            height="26999"
            preserveAspectRatio="xMidYMid meet"
            className="opacity-95"
          />

          {/* Dashed Gold Route Lines from City Hub to Local Neighborhoods */}
          {zones.map((zone) => (
            <line
              key={`line-${zone.id}`}
              x1={depot.x}
              y1={depot.y}
              x2={zone.x}
              y2={zone.y}
              stroke={activeZone === zone.id ? '#FFF3D6' : '#E8D3A5'}
              strokeWidth={activeZone === zone.id ? 70 : 45}
              strokeDasharray="140 140"
              strokeOpacity={activeZone === zone.id ? 1 : 0.7}
              className="transition-all duration-300"
            />
          ))}

          {/* Neighborhood Area Destination Nodes */}
          {zones.map((zone) => {
            const isHovered = activeZone === zone.id;
            return (
              <g
                key={`node-${zone.id}`}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveZone(zone.id)}
                onMouseLeave={() => setActiveZone(null)}
              >
                {/* Node point */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? 240 : 180}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#361A23"
                  strokeWidth="50"
                  className="transition-all duration-200"
                />

                {/* Neighborhood Tag Label */}
                <foreignObject
                  x={zone.x > depot.x ? zone.x + 250 : zone.x - 3600}
                  y={zone.y - 450}
                  width="3500"
                  height="900"
                  className="pointer-events-none"
                >
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-lg ${
                      isHovered
                        ? 'bg-[#E8D3A5] text-[#2B2225] scale-105 border border-white'
                        : 'bg-[#1F0A14]/95 text-white/95 border border-[#E8D3A5]/40 backdrop-blur-md'
                    }`}
                  >
                    <span>{zone.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central City Hub Depot Beacon */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="900" fill="url(#nj-depot-glow)" />
            <circle cx={depot.x} cy={depot.y} r="550" fill="none" stroke="#E8D3A5" strokeWidth="80" className="animate-ping opacity-90" />
            <circle cx={depot.x} cy={depot.y} r="300" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="70" className="shadow-2xl" />

            {/* City Hub Tag Label */}
            <foreignObject x={depot.x - 2000} y={depot.y - 1500} width="4000" height="1100" className="pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#9E3F5C] via-[#A84260] to-[#9E3F5C] text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(232,211,165,0.85)] border-2 border-[#E8D3A5]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8D3A5] animate-pulse" />
                <span>{cityName} Hub</span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    </div>
  );
}
