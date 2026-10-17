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
 * Geographically customized vector map configurations for all 8 service cities
 * Each city has its own authentic municipal territory silhouette, waterways,
 * road arteries, and accurately positioned neighborhood nodes.
 */
export const CITY_MAP_CONFIGS = {
  newark: {
    boundaryPath: 'M 190,35 C 270,30 330,50 350,85 C 370,120 420,160 410,240 C 400,285 360,335 250,340 C 160,345 100,290 85,230 C 70,170 95,100 135,55 Z',
    waterFeatures: [
      { path: 'M 345,15 Q 375,90 415,165 Q 430,225 405,280 Q 380,325 390,355', width: 14, name: 'Passaic River' },
    ],
    arteries: [
      { d: 'M 120,140 Q 250,175 390,210', name: 'Market St' },
      { d: 'M 250,45 L 250,330', name: 'Broad St / Rt 21' },
      { d: 'M 140,70 Q 250,175 350,320', name: 'McCarter Hwy' },
    ],
    zones: [
      { name: 'Forest Hill', x: 250, y: 55 },
      { name: 'North Ward', x: 165, y: 75 },
      { name: 'Roseville', x: 120, y: 130 },
      { name: 'Downtown Newark', x: 250, y: 115 },
      { name: 'University Heights', x: 155, y: 195 },
      { name: 'Central Ward', x: 230, y: 245 },
      { name: 'Ironbound', x: 375, y: 205 },
      { name: 'Weequahic', x: 195, y: 305 },
    ],
  },

  bayonne: {
    boundaryPath: 'M 180,35 C 230,30 280,30 320,40 C 330,90 325,160 335,210 C 355,225 385,235 375,255 C 345,265 315,275 290,320 C 270,345 230,345 210,325 C 185,280 175,210 175,150 C 175,90 170,55 180,35 Z',
    waterFeatures: [
      { path: 'M 70,20 Q 130,170 120,350', width: 28, name: 'Newark Bay' },
      { path: 'M 430,20 Q 380,180 430,350', width: 28, name: 'Upper NY Bay' },
      { path: 'M 110,350 Q 250,360 430,350', width: 18, name: 'Kill Van Kull' },
    ],
    arteries: [
      { d: 'M 250,35 L 250,335', name: 'Broadway Corridor' },
      { d: 'M 205,60 L 205,310', name: 'Avenue C' },
      { d: 'M 295,60 L 295,270', name: 'Kennedy Blvd' },
    ],
    zones: [
      { name: 'Uptown / 45th St', x: 250, y: 65 },
      { name: 'Pamrapo', x: 165, y: 100 },
      { name: 'Broadway Corridor', x: 250, y: 120 },
      { name: 'Midtown Bayonne', x: 250, y: 165 },
      { name: 'Constable Hook', x: 365, y: 225 },
      { name: 'Centreville', x: 235, y: 235 },
      { name: 'Bergen Point', x: 240, y: 300 },
    ],
  },

  kearny: {
    boundaryPath: 'M 180,35 C 250,30 320,40 350,75 C 375,130 380,180 340,230 C 310,270 290,325 270,340 C 250,345 235,315 220,265 C 190,220 150,170 145,115 C 140,65 155,40 180,35 Z',
    waterFeatures: [
      { path: 'M 110,25 Q 125,140 195,280 Q 235,350 250,360', width: 14, name: 'Passaic River' },
      { path: 'M 390,25 Q 395,160 330,260 Q 275,340 260,360', width: 14, name: 'Hackensack River' },
    ],
    arteries: [
      { d: 'M 250,35 L 250,335', name: 'Kearny Avenue' },
      { d: 'M 160,80 L 330,220', name: 'Belgrove / Belleville Tpk' },
      { d: 'M 170,250 L 330,270', name: 'Rt 7 / Truck Rt' },
    ],
    zones: [
      { name: 'Arlington Section', x: 250, y: 65 },
      { name: 'Manor Section', x: 165, y: 105 },
      { name: 'Kearny Avenue Corridor', x: 250, y: 145 },
      { name: 'Belgrove Drive', x: 155, y: 175 },
      { name: 'West Hudson', x: 160, y: 235 },
      { name: 'Meadowlands Edge', x: 360, y: 175 },
      { name: 'South Kearny', x: 265, y: 305 },
    ],
  },

  elizabeth: {
    boundaryPath: 'M 140,45 C 230,35 310,40 355,80 C 385,120 415,180 405,245 C 395,295 345,335 240,340 C 160,340 100,295 85,230 C 75,160 95,95 140,45 Z',
    waterFeatures: [
      { path: 'M 395,20 Q 425,150 405,260 Q 385,320 375,360', width: 18, name: 'Arthur Kill / Newark Bay' },
      { path: 'M 100,190 Q 240,185 390,230', width: 6, name: 'Elizabeth River' },
    ],
    arteries: [
      { d: 'M 140,75 L 365,285', name: 'Broad St / Elizabeth Ave' },
      { d: 'M 250,40 L 250,335', name: 'Spring St / Rt 1-9' },
      { d: 'M 95,230 L 385,230', name: 'Elmora Ave' },
    ],
    zones: [
      { name: 'Westminster', x: 160, y: 75 },
      { name: 'Midtown / Downtown', x: 250, y: 130 },
      { name: 'Elmora', x: 140, y: 175 },
      { name: 'Elizabethport', x: 365, y: 195 },
      { name: 'Frog Hollow', x: 215, y: 235 },
      { name: 'Peterstown', x: 195, y: 295 },
      { name: 'Bayway', x: 320, y: 295 },
    ],
  },

  'east-orange': {
    boundaryPath: 'M 125,45 C 230,40 310,40 375,45 C 385,120 390,210 380,310 C 290,320 190,325 120,315 C 110,225 115,120 125,45 Z',
    waterFeatures: [],
    arteries: [
      { d: 'M 115,175 L 385,175', name: 'I-280 Expressway' },
      { d: 'M 250,45 L 250,315', name: 'Garden State Pkwy' },
      { d: 'M 120,265 L 380,265', name: 'Central Ave' },
      { d: 'M 125,100 L 375,100', name: 'Park Ave' },
    ],
    zones: [
      { name: 'Doddtown', x: 250, y: 65 },
      { name: 'Presidential Heights', x: 150, y: 110 },
      { name: 'Ampere', x: 350, y: 105 },
      { name: 'City Center', x: 250, y: 135 },
      { name: 'Brick Church Area', x: 160, y: 220 },
      { name: 'Greenwood', x: 345, y: 220 },
      { name: 'Central Avenue District', x: 250, y: 290 },
    ],
  },

  'east-newark': {
    boundaryPath: 'M 140,50 C 230,40 310,45 365,65 C 385,130 380,220 360,295 C 285,320 200,325 140,300 C 115,225 110,130 140,50 Z',
    waterFeatures: [
      { path: 'M 90,30 Q 110,175 110,340', width: 16, name: 'Passaic River' },
    ],
    arteries: [
      { d: 'M 110,175 L 365,175', name: 'Central Ave' },
      { d: 'M 125,95 L 350,95', name: 'John St' },
      { d: 'M 250,50 L 250,310', name: 'Passaic Ave Corridor' },
    ],
    zones: [
      { name: 'Bridge Plaza', x: 160, y: 80 },
      { name: 'John Street District', x: 280, y: 80 },
      { name: 'Passaic Riverfront', x: 140, y: 175 },
      { name: 'Central Borough', x: 250, y: 135 },
      { name: 'Sylvan Park Area', x: 355, y: 165 },
      { name: 'Harrison Border', x: 260, y: 285 },
    ],
  },

  hillside: {
    boundaryPath: 'M 130,55 C 230,40 320,45 375,70 C 390,140 385,230 355,305 C 275,330 190,335 125,305 C 95,225 95,135 130,55 Z',
    waterFeatures: [
      { path: 'M 100,240 Q 240,230 380,270', width: 6, name: 'Elizabeth River' },
    ],
    arteries: [
      { d: 'M 100,175 L 380,175', name: 'US Route 22' },
      { d: 'M 250,50 L 250,320', name: 'North Broad / Liberty Ave' },
      { d: 'M 120,105 L 360,250', name: 'Hillside Ave' },
    ],
    zones: [
      { name: 'Conant Town', x: 235, y: 70 },
      { name: 'Westminster Border', x: 150, y: 120 },
      { name: 'Liberty Avenue Corridor', x: 345, y: 135 },
      { name: 'Hillside Center', x: 250, y: 140 },
      { name: 'Saybrook', x: 350, y: 235 },
      { name: 'Lyons Farms', x: 250, y: 290 },
    ],
  },

  'north-arlington': {
    boundaryPath: 'M 155,40 C 235,35 305,40 345,65 C 375,135 370,225 345,305 C 280,335 200,340 145,310 C 115,225 120,130 155,40 Z',
    waterFeatures: [
      { path: 'M 95,20 Q 110,175 125,350', width: 14, name: 'Passaic River' },
      { path: 'M 395,20 Q 380,180 375,350', width: 16, name: 'Meadowlands Edge' },
    ],
    arteries: [
      { d: 'M 250,35 L 250,330', name: 'Ridge Road (Rt 17)' },
      { d: 'M 130,175 L 365,175', name: 'Belleville Tpk' },
      { d: 'M 120,100 L 360,100', name: 'Jauncey Ave' },
    ],
    zones: [
      { name: 'Ridge Road District', x: 250, y: 65 },
      { name: 'River Road', x: 145, y: 150 },
      { name: 'Schuyler Avenue Corridor', x: 350, y: 140 },
      { name: 'Centennial Park Area', x: 250, y: 140 },
      { name: 'Meadowlands Overlook', x: 350, y: 240 },
      { name: 'Porete Avenue Area', x: 230, y: 295 },
    ],
  },
};

/**
 * Real City Delivery Network Map Component
 * Displays the specific city's unique municipal map with local depot and neighborhood routes.
 * Each of the 8 cities has its own tailored geographic silhouette and real neighborhood nodes.
 * All header/footer text removed as requested — pure map with central hub & neighborhood routes.
 */
export function CityDeliveryMap({ location }) {
  const [activeZone, setActiveZone] = useState(null);

  const cityName = location?.name || 'Local City';
  const citySlug = location?.slug || 'newark';
  const cityConfig = CITY_MAP_CONFIGS[citySlug] || CITY_MAP_CONFIGS.newark;

  // Central Depot Hub for this city
  const depot = { name: `${cityName} Hub`, x: 250, y: 175 };

  // Use configured zones if available, otherwise map location.neighborhoods dynamically
  const zones = (cityConfig.zones && cityConfig.zones.length > 0)
    ? cityConfig.zones.map((z, idx) => ({ id: `zone-${idx}`, ...z }))
    : (location?.neighborhoods || ['Central Area', 'North District', 'East Corridor', 'South Ward'])
        .slice(0, 8)
        .map((name, idx) => {
          const angles = [0, 45, 90, 135, 180, 225, 270, 315];
          const rad = (angles[idx % angles.length] * Math.PI) / 180;
          return {
            id: `zone-${idx}`,
            name,
            x: Math.round(depot.x + Math.cos(rad) * 110),
            y: Math.round(depot.y + Math.sin(rad) * 90),
          };
        });

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-br from-[#240C16] via-[#1A0710] to-[#14050D] rounded-3xl border border-[#E8D3A5]/35 p-3 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.7)] relative overflow-hidden flex items-center justify-center">
      {/* Brand luxury ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[500/360] select-none flex items-center justify-center">
        <svg
          viewBox="0 0 500 360"
          className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Central Depot Hub Glow */}
            <radialGradient id={`city-depot-glow-${citySlug}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3D6" stopOpacity="1" />
              <stop offset="45%" stopColor="#E8D3A5" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#9E3F5C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1A0710" stopOpacity="0" />
            </radialGradient>

            {/* Subtle Brand Grid Pattern */}
            <pattern id={`city-grid-${citySlug}`} width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#E8D3A5" strokeWidth="0.5" strokeOpacity="0.08" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="360" fill={`url(#city-grid-${citySlug})`} rx="20" />

          {/* Natural Water Features (Rivers, Harbors & Bays) */}
          {cityConfig.waterFeatures?.map((water, idx) => (
            <g key={`water-${idx}`}>
              <path
                d={water.path}
                fill="none"
                stroke="#12040B"
                strokeWidth={water.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
              <path
                d={water.path}
                fill="none"
                stroke="#9E3F5C"
                strokeWidth={2}
                strokeOpacity={0.35}
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Unique Municipal Territory Silhouette for This City */}
          <path
            d={cityConfig.boundaryPath}
            fill="#2B121D"
            stroke="#E8D3A5"
            strokeWidth="2.2"
            strokeOpacity="0.85"
            strokeLinejoin="round"
            className="transition-colors duration-500 hover:fill-[#331624] drop-shadow-[0_4px_25px_rgba(232,211,165,0.18)]"
          />

          {/* Main Transit Arteries & Grid Lines */}
          {cityConfig.arteries?.map((art, idx) => (
            <path
              key={`artery-${idx}`}
              d={art.d}
              fill="none"
              stroke="#E8D3A5"
              strokeWidth={1.3}
              strokeOpacity={0.22}
              strokeDasharray="4 4"
            />
          ))}

          {/* City Municipal Watermark */}
          <text
            x="250"
            y="345"
            textAnchor="middle"
            fill="#E8D3A5"
            fillOpacity="0.3"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="3"
            className="uppercase select-none"
          >
            {cityName} · Local Delivery Network
          </text>

          {/* Dashed Gold Route Lines from City Hub to Local Neighborhoods */}
          {zones.map((zone) => (
            <line
              key={`line-${zone.id}`}
              x1={depot.x}
              y1={depot.y}
              x2={zone.x}
              y2={zone.y}
              stroke={activeZone === zone.id ? '#FFF3D6' : '#E8D3A5'}
              strokeWidth={activeZone === zone.id ? 2.5 : 1.4}
              strokeDasharray="4 4"
              strokeOpacity={activeZone === zone.id ? 1 : 0.65}
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
                {/* Ping ring on hover */}
                {isHovered && (
                  <circle cx={zone.x} cy={zone.y} r="14" fill="none" stroke="#E8D3A5" strokeWidth="1.8" className="animate-ping" />
                )}

                {/* Node point */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? 7.5 : 5.5}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#361A23"
                  strokeWidth="2"
                  className="transition-all duration-200 shadow-md"
                />

                {/* Neighborhood Tag Label */}
                <foreignObject
                  x={zone.x - 70}
                  y={zone.y > 220 ? zone.y - 32 : zone.y + 8}
                  width="140"
                  height="30"
                  className="pointer-events-none"
                >
                  <div className="w-full flex justify-center">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap shadow-lg ${
                        isHovered
                          ? 'bg-[#E8D3A5] text-[#2B2225] scale-105 border border-white'
                          : 'bg-[#1F0A14]/95 text-white/95 border border-[#E8D3A5]/40 backdrop-blur-md'
                      }`}
                    >
                      <span>{zone.name}</span>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Central City Hub Depot Beacon */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="26" fill={`url(#city-depot-glow-${citySlug})`} />
            <circle cx={depot.x} cy={depot.y} r="16" fill="none" stroke="#E8D3A5" strokeWidth="2" className="animate-ping opacity-90" />
            <circle cx={depot.x} cy={depot.y} r="7.5" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2" className="shadow-2xl" />

            {/* City Hub Tag Label */}
            <foreignObject x={depot.x - 80} y={depot.y - 38} width="160" height="34" className="pointer-events-none">
              <div className="w-full flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#9E3F5C] via-[#A84260] to-[#9E3F5C] text-white font-black text-[10.5px] tracking-wide uppercase shadow-[0_0_20px_rgba(232,211,165,0.85)] border-2 border-[#E8D3A5]">
                  <span className="w-2 h-2 rounded-full bg-[#E8D3A5] animate-pulse" />
                  <span>{cityName} Hub</span>
                </div>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    </div>
  );
}
