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
 * Each city has its own authentic municipal territory silhouette, waterways,
 * road arteries, and accurately positioned neighborhood nodes.
 */
export const CITY_MAP_CONFIGS = {
  newark: {
    boundaryPath: 'M 126.3,165.6 L 130.4,172.5 L 139,175.5 L 141.9,181.9 L 156.8,169.8 L 161.8,171.7 L 171,164.4 L 175.4,164.7 L 200.1,151.9 L 187.2,202.7 L 168.6,227.8 L 170.9,229.4 L 167.4,234.6 L 178.4,237.5 L 194.4,252.5 L 201.3,276.6 L 215.4,286.2 L 273.6,281.9 L 283.7,278.3 L 292.8,286.6 L 297.7,285.3 L 334,314 L 373,252.2 L 373.1,239 L 362.3,214.2 L 361.4,201 L 368.3,167.3 L 365,158.1 L 356.4,153.9 L 330.5,156.5 L 310.2,173.9 L 293.7,174.1 L 286.7,167.3 L 280.2,145.4 L 283.7,116 L 312.1,66.7 L 281.5,49.1 L 267.4,45.2 L 259.2,59.4 L 259,70.4 L 243.8,77.3 L 228.5,113.8 L 211.8,138.6 L 182.5,138.5 L 179.7,147.3 L 166.8,144.1 L 171.2,133 L 159.1,132 L 145.6,158.2 L 139.7,155.4 L 126.3,165.6 Z',
    waterPath: 'M 312.1,66.7 Q 355,110 368.3,167.3 Q 362,214 373,252.2 L 475,252 L 475,45 L 312.1,45 Z',
    waterName: 'Passaic River & Newark Bay',
    waterPos: { x: 405, y: 120 },
    arteries: [
      { d: 'M 130,170 Q 250,175 365,160', name: 'I-280' },
      { d: 'M 170,230 Q 250,235 370,245', name: 'I-78' },
      { d: 'M 275,48 L 285,165 L 330,310', name: 'Rt 21 / McCarter Hwy' },
      { d: 'M 290,285 L 370,250', name: 'NJ Turnpike (I-95)' },
    ],
    zones: [
      { name: 'Forest Hill', x: 270, y: 75 },
      { name: 'North Ward', x: 235, y: 110 },
      { name: 'Roseville', x: 165, y: 145 },
      { name: 'Downtown Newark', x: 250, y: 160 },
      { name: 'University Heights', x: 195, y: 175 },
      { name: 'Central Ward', x: 230, y: 215 },
      { name: 'Ironbound', x: 320, y: 195 },
      { name: 'Weequahic', x: 195, y: 255 },
    ],
  },

  'east-newark': {
    boundaryPath: 'M 134.6,315 L 171.8,314.2 L 170.5,265.1 L 217.7,276.8 L 225.5,221.8 L 313.4,244.2 L 350.2,246.4 L 365.4,134.8 L 240.3,91.1 L 186.7,61.7 L 165.6,45 L 136.7,266.8 L 134.6,315 Z',
    waterPath: 'M 165.6,45 L 136.7,266.8 L 134.6,315 L 60,315 L 60,45 Z',
    waterName: 'Passaic River',
    waterPos: { x: 95, y: 175 },
    arteries: [
      { d: 'M 134,315 L 350,246', name: 'I-280 Route' },
      { d: 'M 140,175 L 360,175', name: 'Central Ave' },
      { d: 'M 186,62 L 170,265', name: 'Passaic Ave' },
    ],
    zones: [
      { name: 'Bridge Plaza', x: 180, y: 85 },
      { name: 'John Street District', x: 265, y: 105 },
      { name: 'Passaic Riverfront', x: 155, y: 220 },
      { name: 'Central Borough', x: 250, y: 165 },
      { name: 'Sylvan Park Area', x: 310, y: 195 },
      { name: 'Harrison Border', x: 210, y: 280 },
    ],
  },

  kearny: {
    boundaryPath: 'M 128.7,158.5 L 152.8,169.2 L 157.3,159.7 L 180.4,167.8 L 182,181.3 L 179.6,181.8 L 191.8,198.9 L 196.5,196.9 L 204.4,205.1 L 239.2,201.9 L 252,208.2 L 256.1,213.3 L 256.9,221.9 L 246.7,272.3 L 248,292.1 L 258.3,315 L 299,279.3 L 312.9,235.2 L 322.3,222.7 L 327.3,217.9 L 356.3,206 L 367.2,196.8 L 371.3,183.2 L 366.9,175.8 L 360.7,172.7 L 330,178.2 L 318.6,171.2 L 316.8,154.4 L 329,132 L 321.4,128.1 L 317.9,130.8 L 314,129.5 L 306,112.3 L 308.9,103.8 L 302,86.4 L 290.6,79.8 L 276.6,77.9 L 267.5,84.9 L 266.1,91.9 L 259.7,96.2 L 260.7,99.8 L 254.2,103.3 L 238.9,96.7 L 229.9,98.1 L 223.6,91 L 221.2,76.5 L 176.2,45.6 L 171.1,75.8 L 156.8,94.5 L 147.6,117.8 L 133.1,138.9 L 128.7,158.5 Z',
    waterPath: 'M 356.3,206 Q 371,183 360.7,172 L 475,172 L 475,345 L 258.3,345 L 258.3,315 L 299,279.3 Z',
    waterName: 'Hackensack River & Meadowlands',
    waterPos: { x: 390, y: 245 },
    arteries: [
      { d: 'M 176,46 L 258,315', name: 'Kearny Ave' },
      { d: 'M 140,165 L 360,180', name: 'Belleville Tpk / I-280' },
      { d: 'M 190,198 L 330,220', name: 'Truck Rt 1-9' },
    ],
    zones: [
      { name: 'Arlington Section', x: 235, y: 80 },
      { name: 'Manor Section', x: 175, y: 110 },
      { name: 'Kearny Avenue Corridor', x: 220, y: 155 },
      { name: 'Belgrove Drive', x: 150, y: 165 },
      { name: 'West Hudson', x: 185, y: 195 },
      { name: 'Meadowlands Edge', x: 325, y: 160 },
      { name: 'South Kearny', x: 255, y: 280 },
    ],
  },

  elizabeth: {
    boundaryPath: 'M 45,141.4 L 65.6,156.2 L 71.3,173.5 L 79.4,172 L 108.9,199.5 L 117.8,213.5 L 123.1,213.7 L 232.6,311.6 L 263.7,270.7 L 283.9,252.2 L 297.8,250 L 368.1,260.9 L 455,120.7 L 386.1,63.4 L 376.6,65.8 L 369.8,55 L 362.1,50.7 L 345,50.8 L 339.5,56.8 L 296.3,58.2 L 229.1,65.8 L 202.4,48.4 L 189.6,50.4 L 182,55.8 L 182.7,66 L 156.4,119 L 146.3,118.2 L 142.8,114.5 L 139.5,123.4 L 129.4,124.9 L 126,132.6 L 106.6,114.7 L 97.3,130.6 L 73,127.4 L 45,141.4 Z',
    waterPath: 'M 455,120.7 L 368.1,260.9 L 297.8,250 L 263.7,270.7 L 232.6,311.6 L 270,350 L 485,350 L 485,120 Z',
    waterName: 'Arthur Kill & Newark Bay',
    waterPos: { x: 385, y: 295 },
    arteries: [
      { d: 'M 182,56 L 263,270', name: 'US Route 1-9' },
      { d: 'M 362,51 L 232,311', name: 'NJ Turnpike (I-95)' },
      { d: 'M 71,173 L 368,260', name: 'Broad St / I-278' },
    ],
    zones: [
      { name: 'Westminster', x: 185, y: 80 },
      { name: 'Midtown / Downtown', x: 235, y: 145 },
      { name: 'Elmora', x: 115, y: 165 },
      { name: 'Elizabethport', x: 345, y: 190 },
      { name: 'Frog Hollow', x: 195, y: 215 },
      { name: 'Peterstown', x: 180, y: 265 },
      { name: 'Bayway', x: 275, y: 265 },
    ],
  },

  bayonne: {
    boundaryPath: 'M 56.1,305.1 L 67.6,306.9 L 119.7,315 L 155.1,307.3 L 179,314.3 L 235,287.2 L 291.9,287.2 L 314.3,271.5 L 422.5,271.7 L 443.9,225.3 L 387.8,200.4 L 276.1,138.1 L 271.5,123.4 L 269.7,114.3 L 268.6,111.1 L 265.7,103.1 L 262.8,95.5 L 262.6,91.6 L 265,88.3 L 265.2,85.9 L 264.7,83.4 L 259.5,72 L 259.3,70.8 L 218.7,45 L 209.3,59.9 L 202.6,70.1 L 197.2,78.5 L 189.8,90.1 L 189.8,90.2 L 169.9,121.9 L 167.9,125 L 160.3,137.2 L 160,137.6 L 158.6,139.9 L 156,144.2 L 153.3,148.5 L 152.5,149.7 L 143.8,163.8 L 142.6,165.6 L 137.8,172.8 L 136.7,174.7 L 130.2,185.1 L 121.8,198.4 L 114.5,209.9 L 111.4,214.9 L 103.6,227.4 L 99,234.6 L 96.4,238.7 L 87.7,252.6 L 87.6,252.8 L 85.3,256.5 L 61.5,295 L 60.2,297.1 L 58.8,299.8 L 58.7,300.1 L 58.6,300.2 L 57.7,302.1 L 57.3,302.8 L 56.9,303.5 L 56.1,305.1 Z',
    waterPath: 'M 218.7,45 L 160.3,137.2 L 87.7,252.6 L 56.1,305.1 L 15,305 L 15,45 Z',
    waterName: 'Newark Bay',
    waterPos: { x: 75, y: 150 },
    arteries: [
      { d: 'M 218,45 L 60,300', name: 'Kennedy Blvd / Rt 440' },
      { d: 'M 240,65 L 120,315', name: 'Broadway Corridor' },
      { d: 'M 180,180 L 430,225', name: 'Military Ocean Terminal Pier' },
    ],
    zones: [
      { name: 'Uptown / 45th St', x: 230, y: 70 },
      { name: 'Pamrapo', x: 195, y: 105 },
      { name: 'Broadway Corridor', x: 220, y: 140 },
      { name: 'Midtown Bayonne', x: 190, y: 180 },
      { name: 'Constable Hook', x: 330, y: 250 },
      { name: 'Centreville', x: 160, y: 225 },
      { name: 'Bergen Point', x: 100, y: 285 },
    ],
  },

  'east-orange': {
    boundaryPath: 'M 134.7,270.9 L 151.8,281.1 L 159.1,274.5 L 191,277.3 L 179.4,306.5 L 213.4,315 L 220.8,291.8 L 284.2,288.6 L 298,291.9 L 307.3,277.9 L 311.8,279.6 L 319.9,258.3 L 323.8,259.6 L 332,239.2 L 334.5,240.1 L 340.2,225.7 L 342.1,226.4 L 365.3,167.3 L 309.1,85 L 229.2,45 L 204.9,132 L 221.5,158.1 L 219.1,171.6 L 134.7,270.9 Z',
    waterPath: null,
    waterName: null,
    arteries: [
      { d: 'M 135,271 L 365,167', name: 'I-280 Expressway' },
      { d: 'M 229,45 L 220,292', name: 'Garden State Pkwy' },
      { d: 'M 160,180 L 330,240', name: 'Central Ave' },
    ],
    zones: [
      { name: 'Doddtown', x: 250, y: 80 },
      { name: 'Presidential Heights', x: 180, y: 115 },
      { name: 'Ampere', x: 310, y: 115 },
      { name: 'City Center', x: 250, y: 175 },
      { name: 'Brick Church Area', x: 180, y: 220 },
      { name: 'Greenwood', x: 315, y: 225 },
      { name: 'Central Avenue District', x: 230, y: 280 },
    ],
  },

  hillside: {
    boundaryPath: 'M 135.9,120 L 141.9,138.3 L 152.2,145.4 L 154.9,151.5 L 164.8,151.2 L 174.2,159.9 L 189,160.2 L 200.5,183.7 L 196.4,190.9 L 200.9,197.7 L 204.1,229.6 L 213.7,227.7 L 222.1,233.3 L 230.6,228.2 L 232.4,234.6 L 247.3,242.2 L 249.3,252.9 L 270.2,281.5 L 264.8,294.1 L 266.3,299.4 L 275.9,303 L 289.3,315 L 332.2,228.7 L 331.1,213.7 L 342.9,203.4 L 364.1,200.1 L 359.9,197.3 L 345.7,135.3 L 338.4,121.5 L 288.2,74.4 L 165.5,45.2 L 155.5,54.3 L 147.9,76.7 L 148.4,96.2 L 135.9,120 Z',
    waterPath: null,
    waterName: null,
    arteries: [
      { d: 'M 136,120 L 364,200', name: 'US Route 22' },
      { d: 'M 165,45 L 289,315', name: 'North Broad / Liberty Ave' },
    ],
    zones: [
      { name: 'Conant Town', x: 210, y: 80 },
      { name: 'Westminster Border', x: 165, y: 120 },
      { name: 'Liberty Avenue Corridor', x: 310, y: 130 },
      { name: 'Hillside Center', x: 250, y: 180 },
      { name: 'Saybrook', x: 320, y: 215 },
      { name: 'Lyons Farms', x: 250, y: 275 },
    ],
  },

  'north-arlington': {
    boundaryPath: 'M 119.2,189.2 L 219.3,258 L 224.4,276.4 L 222.7,286.3 L 235.5,297.8 L 237.4,303.7 L 254.7,300 L 273.4,306.6 L 278.6,313.5 L 289.7,315 L 303.6,307.3 L 301.4,299.8 L 308.3,298.1 L 307.9,290.4 L 315.3,290.4 L 314.8,282.6 L 318.4,275.3 L 332.1,263.6 L 298.4,225.2 L 315.3,189.9 L 313.5,173.8 L 338.1,167.5 L 346.2,168.5 L 379.6,194.5 L 362.3,167.2 L 359.6,152.6 L 318.9,122.9 L 291.6,112.4 L 293.6,107.5 L 288.5,105.6 L 238.3,91.5 L 235.6,96.4 L 163.6,45 L 163.4,58.2 L 171.7,95.5 L 119.2,189.2 Z',
    waterPath: 'M 163.6,45 L 171.7,95.5 L 119.2,189.2 L 65,189 L 65,45 Z',
    waterName: 'Passaic River',
    waterPos: { x: 100, y: 120 },
    arteries: [
      { d: 'M 163,45 L 289,315', name: 'Ridge Road (Rt 17)' },
      { d: 'M 119,189 L 379,194', name: 'Belleville Tpk' },
    ],
    zones: [
      { name: 'Ridge Road District', x: 240, y: 85 },
      { name: 'River Road', x: 175, y: 130 },
      { name: 'Schuyler Avenue Corridor', x: 310, y: 140 },
      { name: 'Centennial Park Area', x: 260, y: 180 },
      { name: 'Meadowlands Overlook', x: 320, y: 235 },
      { name: 'Porete Avenue Area', x: 255, y: 285 },
    ],
  },
};

/**
 * Real City Delivery Network Map Component
 * Displays the specific city's official municipal boundary with Google Maps red dotted border,
 * authentic waterways, transit lines, and local neighborhood delivery routes.
 * Clean, pure map display with static glowing hub and no moving circles.
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
            x: Math.round(depot.x + Math.cos(rad) * 105),
            y: Math.round(depot.y + Math.sin(rad) * 85),
          };
        });

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-br from-[#240C16] via-[#1A0710] to-[#14050D] rounded-3xl border border-[#E8D3A5]/35 p-3 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.7)] relative overflow-hidden flex items-center justify-center">
      {/* Brand luxury ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#9E3F5C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF6A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left: Red Dotted Official Boundary Pill Badge matching Google Maps */}
      <div className="absolute top-3 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B0E1B]/90 border border-[#EF4444]/70 shadow-[0_4px_14px_rgba(239,68,68,0.35)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
          <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider uppercase">
            {cityName} Boundary
          </span>
        </div>
      </div>

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

          {/* Natural Water Features (Rivers, Harbors & Bays) */}
          {cityConfig.waterPath && (
            <g>
              <path
                d={cityConfig.waterPath}
                fill="#120610"
                stroke="#9E3F5C"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                className="opacity-95"
              />
              {cityConfig.waterName && cityConfig.waterPos && (
                <text
                  x={cityConfig.waterPos.x}
                  y={cityConfig.waterPos.y}
                  textAnchor="middle"
                  fill="#E8D3A5"
                  fillOpacity="0.35"
                  fontSize="8.5"
                  fontStyle="italic"
                  fontWeight="600"
                  letterSpacing="1"
                  className="select-none pointer-events-none"
                >
                  {cityConfig.waterName}
                </text>
              )}
            </g>
          )}

          {/* Main Transit Arteries & Grid Lines */}
          {cityConfig.arteries?.map((art, idx) => (
            <path
              key={`artery-${idx}`}
              d={art.d}
              fill="none"
              stroke="#E8D3A5"
              strokeWidth={1.3}
              strokeOpacity={0.25}
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
              strokeWidth={activeZone === zone.id ? 2.5 : 1.3}
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

          {/* Central City Hub Depot Beacon (Clean static glow, no moving circles) */}
          <g className="cursor-pointer">
            <circle cx={depot.x} cy={depot.y} r="24" fill={`url(#city-depot-glow-${citySlug})`} />
            <circle cx={depot.x} cy={depot.y} r="14" fill="none" stroke="#E8D3A5" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx={depot.x} cy={depot.y} r="7" fill="#E8D3A5" stroke="#FFFFFF" strokeWidth="2" className="shadow-2xl" />

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
