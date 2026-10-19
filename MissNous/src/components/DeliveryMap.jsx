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

          {/* Central Newark Hub Beacon (Clean static glow, no moving circles) */}
          <g className="cursor-pointer">
            <circle cx={hub.x} cy={hub.y} r="28" fill="url(#usa-hub-glow)" />
            <circle cx={hub.x} cy={hub.y} r="16" fill="none" stroke="#E8D3A5" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx={hub.x} cy={hub.y} r="8" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2" className="shadow-2xl" />

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
 * Each city has its own authentic municipal territory silhouette and boundaries
 * matching official Google Maps and OpenStreetMap data with the red dotted boundary line.
 */
export const CITY_MAP_CONFIGS = {
  newark: {
    boundaryPath: 'M 110.8,163.8 L 114.2,170.9 L 121.3,173.9 L 123.7,180.5 L 136,168 L 140.1,170 L 147.7,162.5 L 151.3,162.8 L 171.7,149.6 L 161,201.9 L 145.7,227.7 L 147.6,229.4 L 144.7,234.7 L 153.8,237.7 L 167,253.2 L 172.7,278 L 184.3,287.9 L 232.3,283.5 L 240.7,279.7 L 248.2,288.3 L 252.2,286.9 L 282.2,316.5 L 314.3,252.8 L 314.4,239.2 L 305.5,213.7 L 304.8,200.1 L 310.5,165.4 L 307.7,155.9 L 300.6,151.6 L 279.3,154.3 L 262.5,172.2 L 248.9,172.4 L 243.1,165.4 L 237.8,142.9 L 240.7,112.6 L 264.1,61.8 L 238.8,43.7 L 227.2,39.7 L 220.4,54.3 L 220.3,65.7 L 207.7,72.8 L 195.1,110.3 L 181.3,135.9 L 157.2,135.8 L 154.9,144.8 L 144.2,141.5 L 147.9,130.1 L 137.9,129.1 L 126.7,156.1 L 121.8,153.2 Z',
    arteries: [
      { d: 'M 115,165 Q 230,170 310,165', name: 'I-280' },
      { d: 'M 148,230 Q 230,235 314,245', name: 'I-78' },
      { d: 'M 235,42 L 245,165 L 282,315', name: 'Rt 21 / McCarter Hwy' },
      { d: 'M 245,285 L 314,250', name: 'NJ Turnpike (I-95)' },
    ],
    zones: [
      { name: 'Forest Hill', x: 245, y: 75 },
      { name: 'North Ward', x: 210, y: 115 },
      { name: 'Roseville', x: 165, y: 145 },
      { name: 'University Heights', x: 175, y: 195 },
      { name: 'Ironbound', x: 295, y: 200 },
      { name: 'Central Ward', x: 235, y: 235 },
      { name: 'Weequahic', x: 185, y: 280 },
    ],
  },

  'east-newark': {
    boundaryPath: 'M 120.1,332 L 162,331 L 160.5,274.6 L 213.7,288 L 222.5,224.8 L 321.6,250.6 L 363.1,253.1 L 380.2,124.9 L 239.2,74.7 L 178.7,41 L 154.9,21.8 L 122.4,276.6 Z',
    arteries: [
      { d: 'M 120,330 L 363,253', name: 'I-280 Route' },
      { d: 'M 130,175 L 370,175', name: 'Central Ave' },
      { d: 'M 178,41 L 160,274', name: 'Passaic Ave' },
    ],
    zones: [
      { name: 'Bridge Plaza', x: 200, y: 75 },
      { name: 'John Street District', x: 290, y: 110 },
      { name: 'Passaic Riverfront', x: 160, y: 205 },
      { name: 'Sylvan Park', x: 315, y: 205 },
      { name: 'Harrison Border', x: 220, y: 285 },
    ],
  },

  kearny: {
    boundaryPath: 'M 113.5,155.8 L 140.6,167.9 L 145.7,157.2 L 171.7,166.3 L 173.5,181.5 L 170.8,182.1 L 184.5,201.3 L 189.8,199.1 L 198.7,208.3 L 237.9,204.7 L 252.3,211.8 L 256.9,217.5 L 257.8,227.2 L 246.3,284 L 247.8,306.3 L 259.4,332 L 305.2,291.8 L 320.9,242.1 L 331.5,228 L 337.1,222.6 L 369.8,209.2 L 382.1,198.8 L 386.7,183.5 L 381.7,175.2 L 374.7,171.7 L 340.1,177.9 L 327.3,170 L 325.3,151.1 L 339,125.9 L 330.4,121.5 L 326.5,124.5 L 322.1,123.1 L 313.1,103.7 L 316.4,94.1 L 308.6,74.5 L 295.8,67.1 L 280,65 L 269.8,72.8 L 268.2,80.7 L 261,85.6 L 262.1,89.6 L 254.8,93.6 L 237.6,86.1 L 227.4,87.7 L 220.3,79.7 L 217.6,63.4 L 167,28.6 L 161.2,62.6 L 145.1,83.7 L 134.7,109.9 L 118.4,133.7 Z',
    arteries: [
      { d: 'M 167,29 L 259,332', name: 'Kearny Ave' },
      { d: 'M 125,160 L 370,180', name: 'Belleville Tpk / I-280' },
      { d: 'M 185,200 L 335,225', name: 'Truck Rt 1-9' },
    ],
    zones: [
      { name: 'Arlington Section', x: 220, y: 75 },
      { name: 'Manor Section', x: 160, y: 115 },
      { name: 'Belgrove Drive', x: 145, y: 160 },
      { name: 'Kearny Ave Corridor', x: 215, y: 225 },
      { name: 'Meadowlands Edge', x: 325, y: 170 },
      { name: 'South Kearny', x: 260, y: 285 },
    ],
  },

  elizabeth: {
    boundaryPath: 'M 28,138.2 L 50.3,154.2 L 56.5,172.9 L 65.3,171.3 L 97.2,201 L 106.8,216.1 L 112.5,216.4 L 231,322.3 L 264.7,278 L 286.5,258 L 301.6,255.6 L 377.6,267.4 L 471.7,115.7 L 397.1,53.7 L 386.8,56.3 L 379.5,44.6 L 371.1,40 L 352.6,40.1 L 346.7,46.6 L 299.9,48.1 L 227.2,56.3 L 198.3,37.5 L 184.4,39.7 L 176.2,45.5 L 177,56.5 L 148.5,113.9 L 137.6,113 L 133.8,109 L 130.2,118.6 L 119.3,120.3 L 115.6,128.6 L 94.6,109.2 L 84.5,126.4 L 58.2,123 Z',
    arteries: [
      { d: 'M 176,46 L 265,278', name: 'US Route 1-9' },
      { d: 'M 353,40 L 231,322', name: 'NJ Turnpike (I-95)' },
      { d: 'M 56,173 L 378,267', name: 'Broad St / I-278' },
    ],
    zones: [
      { name: 'Westminster', x: 195, y: 80 },
      { name: 'Elmora', x: 110, y: 160 },
      { name: 'Midtown Elizabeth', x: 230, y: 120 },
      { name: 'Frog Hollow', x: 175, y: 215 },
      { name: 'Elizabethport', x: 345, y: 180 },
      { name: 'Peterstown', x: 165, y: 265 },
      { name: 'Bayway', x: 270, y: 265 },
    ],
  },

  bayonne: {
    boundaryPath: 'M 31.7,320.9 L 44,322.8 L 99.8,332 L 137.8,323.2 L 163.4,331.2 L 223.5,300.2 L 284.5,300.2 L 308.5,282.3 L 424.5,282.5 L 447.5,229.5 L 387.3,201 L 267.6,130 L 262.7,113.2 L 260.7,102.8 L 259.6,99.2 L 256.5,90 L 253.4,81.3 L 253.1,76.9 L 255.7,73.1 L 255.9,70.4 L 255.4,67.5 L 249.8,54.5 L 249.6,53.1 L 206.1,23.6 L 196,40.7 L 188.8,52.3 L 183,62 L 175.1,75.2 L 175.1,75.3 L 153.8,111.6 L 151.6,115.1 L 143.5,129.1 L 143.2,129.5 L 141.7,132.2 L 138.9,137.1 L 136,142 L 135.1,143.4 L 125.8,159.5 L 124.5,161.6 L 119.4,169.8 L 118.2,172 L 111.2,183.9 L 102.2,199.1 L 94.4,212.2 L 91.1,217.9 L 82.7,232.2 L 77.8,240.4 L 75,245.1 L 65.7,261 L 65.6,261.2 L 63.1,265.5 L 37.6,309.4 L 36.2,311.8 L 34.7,314.9 L 34.6,315.2 L 34.5,315.4 L 33.5,317.5 L 33.1,318.3 L 32.7,319.1 Z',
    arteries: [
      { d: 'M 206,24 L 37,309', name: 'Kennedy Blvd / Rt 440' },
      { d: 'M 240,65 L 100,332', name: 'Broadway Corridor' },
      { d: 'M 160,160 L 447,230', name: 'Military Ocean Terminal Pier' },
    ],
    zones: [
      { name: 'Uptown / 45th St', x: 220, y: 65 },
      { name: 'Pamrapo', x: 190, y: 105 },
      { name: 'Broadway Corridor', x: 215, y: 140 },
      { name: 'Midtown Bayonne', x: 175, y: 205 },
      { name: 'Constable Hook', x: 345, y: 250 },
      { name: 'Centreville', x: 135, y: 240 },
      { name: 'Bergen Point', x: 85, y: 290 },
    ],
  },

  'east-orange': {
    boundaryPath: 'M 134.7,270.9 L 151.8,281.1 L 159.1,274.5 L 191,277.3 L 179.4,306.5 L 213.4,315 L 220.8,291.8 L 284.2,288.6 L 298,291.9 L 307.3,277.9 L 311.8,279.6 L 319.9,258.3 L 323.8,259.6 L 332,239.2 L 334.5,240.1 L 340.2,225.7 L 342.1,226.4 L 365.3,167.3 L 309.1,85 L 229.2,45 L 204.9,132 L 221.5,158.1 L 219.1,171.6 L 134.7,270.9 Z',
    arteries: [
      { d: 'M 135,271 L 365,167', name: 'I-280 Expressway' },
      { d: 'M 229,45 L 220,292', name: 'Garden State Pkwy' },
      { d: 'M 160,180 L 330,240', name: 'Central Ave' },
    ],
    zones: [
      { name: 'Doddtown', x: 250, y: 85 },
      { name: 'Presidential Heights', x: 185, y: 125 },
      { name: 'Ampere', x: 310, y: 125 },
      { name: 'Brick Church Area', x: 180, y: 215 },
      { name: 'Greenwood', x: 315, y: 220 },
      { name: 'Central Avenue District', x: 240, y: 275 },
    ],
  },

  hillside: {
    boundaryPath: 'M 135.9,120 L 141.9,138.3 L 152.2,145.4 L 154.9,151.5 L 164.8,151.2 L 174.2,159.9 L 189,160.2 L 200.5,183.7 L 196.4,190.9 L 200.9,197.7 L 204.1,229.6 L 213.7,227.7 L 222.1,233.3 L 230.6,228.2 L 232.4,234.6 L 247.3,242.2 L 249.3,252.9 L 270.2,281.5 L 264.8,294.1 L 266.3,299.4 L 275.9,303 L 289.3,315 L 332.2,228.7 L 331.1,213.7 L 342.9,203.4 L 364.1,200.1 L 359.9,197.3 L 345.7,135.3 L 338.4,121.5 L 288.2,74.4 L 165.5,45.2 L 155.5,54.3 L 147.9,76.7 L 148.4,96.2 L 135.9,120 Z',
    arteries: [
      { d: 'M 136,120 L 364,200', name: 'US Route 22' },
      { d: 'M 165,45 L 289,315', name: 'North Broad / Liberty Ave' },
    ],
    zones: [
      { name: 'Conant Town', x: 210, y: 85 },
      { name: 'Westminster Border', x: 165, y: 125 },
      { name: 'Liberty Avenue Corridor', x: 310, y: 135 },
      { name: 'Saybrook', x: 315, y: 220 },
      { name: 'Lyons Farms', x: 245, y: 275 },
    ],
  },

  'north-arlington': {
    boundaryPath: 'M 119.2,189.2 L 219.3,258 L 224.4,276.4 L 222.7,286.3 L 235.5,297.8 L 237.4,303.7 L 254.7,300 L 273.4,306.6 L 278.6,313.5 L 289.7,315 L 303.6,307.3 L 301.4,299.8 L 308.3,298.1 L 307.9,290.4 L 315.3,290.4 L 314.8,282.6 L 318.4,275.3 L 332.1,263.6 L 298.4,225.2 L 315.3,189.9 L 313.5,173.8 L 338.1,167.5 L 346.2,168.5 L 379.6,194.5 L 362.3,167.2 L 359.6,152.6 L 318.9,122.9 L 291.6,112.4 L 293.6,107.5 L 288.5,105.6 L 238.3,91.5 L 235.6,96.4 L 163.6,45 L 163.4,58.2 L 171.7,95.5 L 119.2,189.2 Z',
    arteries: [
      { d: 'M 163,45 L 289,315', name: 'Ridge Road (Rt 17)' },
      { d: 'M 119,189 L 379,194', name: 'Belleville Tpk' },
    ],
    zones: [
      { name: 'Ridge Road District', x: 240, y: 90 },
      { name: 'River Road', x: 175, y: 135 },
      { name: 'Schuyler Avenue Corridor', x: 310, y: 145 },
      { name: 'Meadowlands Overlook', x: 315, y: 235 },
      { name: 'Porete Avenue Area', x: 250, y: 285 },
    ],
  },
};

/**
 * Real City Delivery Network Map Component
 * Displays the specific city's official municipal boundary with Google Maps red dotted border,
 * local arteries, and accurately positioned neighborhood delivery routes.
 * Pure clean map display: no right-side boxes, no overlapping labels, text cleanly positioned inside.
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
        .slice(0, 6)
        .map((name, idx) => {
          const angles = [30, 90, 150, 210, 270, 330];
          const rad = (angles[idx % angles.length] * Math.PI) / 180;
          return {
            id: `zone-${idx}`,
            name,
            x: Math.round(depot.x + Math.cos(rad) * 95),
            y: Math.round(depot.y + Math.sin(rad) * 75),
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
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#E8D3A5" strokeWidth="0.5" strokeOpacity="0.07" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="360" fill={`url(#city-grid-${citySlug})`} rx="20" />

          {/* Main Transit Arteries & Grid Lines */}
          {cityConfig.arteries?.map((art, idx) => (
            <path
              key={`artery-${idx}`}
              d={art.d}
              fill="none"
              stroke="#E8D3A5"
              strokeWidth={1.2}
              strokeOpacity={0.2}
              strokeDasharray="4 4"
            />
          ))}

          {/* Official Municipal Territory Polygon (Filled with Brand Maroon) */}
          <path
            d={cityConfig.boundaryPath}
            fill="#2D121F"
            className="transition-colors duration-500 hover:fill-[#381627] drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          />

          {/* Inner Accent Line for Territory Definition */}
          <path
            d={cityConfig.boundaryPath}
            fill="none"
            stroke="#E8D3A5"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeLinejoin="round"
          />

          {/* The Exact Red Dotted Municipal Boundary Line (Google Maps Style) */}
          <path
            d={cityConfig.boundaryPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.8"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
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
              strokeWidth={activeZone === zone.id ? 2 : 1.2}
              strokeDasharray="3 3"
              strokeOpacity={activeZone === zone.id ? 0.9 : 0.45}
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
                {/* Node pin dot */}
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? '#FFF3D6' : '#E8D3A5'}
                  stroke="#8B2F49"
                  strokeWidth="1.8"
                  className="transition-all duration-200"
                />

                {/* Clean, readable text label inside map with halo shadow */}
                <text
                  x={zone.x}
                  y={zone.y > 230 ? zone.y - 8 : zone.y + 13}
                  textAnchor="middle"
                  fill={isHovered ? '#FFF3D6' : '#FFFFFF'}
                  fontSize="9"
                  fontWeight="600"
                  letterSpacing="0.2"
                  className="pointer-events-none select-none transition-colors duration-200"
                  style={{
                    textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(26,7,16,0.95)',
                  }}
                >
                  {zone.name}
                </text>

                {/* Floating highlight badge on hover only */}
                {isHovered && (
                  <foreignObject
                    x={zone.x - 65}
                    y={zone.y - 34}
                    width="130"
                    height="28"
                    className="pointer-events-none"
                  >
                    <div className="w-full flex justify-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8D3A5] text-[#240C16] shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-white">
                        <span>{zone.name}</span>
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Central City Hub Depot Beacon (Compact, elegant, non-overlapping) */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="18" fill={`url(#city-depot-glow-${citySlug})`} />
            <circle cx={depot.x} cy={depot.y} r="5" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="1.8" />

            {/* Sleek compact Hub pill */}
            <g transform={`translate(${depot.x - 48}, ${depot.y - 23})`}>
              <rect
                width="96"
                height="18"
                rx="9"
                fill="#8B2F49"
                stroke="#E8D3A5"
                strokeWidth="1.2"
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              />
              <circle cx="12" cy="9" r="3" fill="#E8D3A5" />
              <text
                x="52"
                y="12.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="8.5"
                fontWeight="800"
                letterSpacing="0.8"
              >
                {cityName.toUpperCase()} HUB
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
