/** Service-area cities near Miss Nous (Newark, NJ). City landing pages at /locations/:slug. */
export const LOCATIONS = [
  {
    slug: 'newark',
    name: 'Newark',
    county: 'Essex County',
    state: 'New Jersey',
    zipCodes: ['07101', '07102', '07103', '07104', '07105', '07107', '07108', '07112', '07114'],
    distanceMiles: null,
    distanceLabel: 'Home base',
    featured: true,
    tagline: 'Core city & neighborhood guides',
    neighborhoods: ['Ironbound', 'Downtown Newark', 'Forest Hill', 'University Heights', 'Weequahic', 'North Ward', 'Roseville', 'Central Ward'],
    description:
      'Our home city and the heart of Miss Nous. Dedicated pages for Ironbound, Downtown, and other neighborhoods are on the way.',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Newark, New Jersey cityscape',
  },
  {
    slug: 'east-newark',
    name: 'East Newark',
    county: 'Hudson County',
    state: 'New Jersey',
    zipCodes: ['07029'],
    distanceMiles: 2.0,
    distanceLabel: '~2.0 miles',
    neighborhoods: ['Passaic Riverfront', 'John Street District', 'Central Borough', 'Sylvan Park Area', 'Harrison Border', 'Bridge Plaza'],
    description:
      'A compact borough just across the Passaic—easy reach from our Garibaldi Avenue studio for local pickup and delivery.',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'East Newark area streetscape',
  },
  {
    slug: 'kearny',
    name: 'Kearny',
    county: 'Hudson County',
    state: 'New Jersey',
    zipCodes: ['07032', '07099'],
    distanceMiles: 2.5,
    distanceLabel: '~2.5 miles',
    neighborhoods: ['Arlington Section', 'South Kearny', 'Manor Section', 'Kearny Avenue Corridor', 'West Hudson', 'Belgrove Drive', 'Meadowlands Edge'],
    description:
      'Historic Kearny sits minutes from Newark—part of the close-knit community we serve across Hudson and Essex counties.',
    image: '/images/locations/kearny.jpg',
    imageAlt: 'Kearny, New Jersey aerial cityscape and waterfront',
  },
  {
    slug: 'elizabeth',
    name: 'Elizabeth',
    county: 'Union County',
    state: 'New Jersey',
    zipCodes: ['07201', '07202', '07206', '07207', '07208'],
    distanceMiles: 3.7,
    distanceLabel: '~3.7 miles',
    neighborhoods: ['Elmora', 'Midtown / Downtown', 'Peterstown', 'Bayway', 'Elizabethport', 'Westminster', 'Frog Hollow'],
    description:
      'New Jersey’s fourth-largest city—diverse neighborhoods and waterfront views within a short drive of Miss Nous.',
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Elizabeth area city view',
  },
  {
    slug: 'bayonne',
    name: 'Bayonne',
    county: 'Hudson County',
    state: 'New Jersey',
    zipCodes: ['07002'],
    distanceMiles: 4.1,
    distanceLabel: '~4.1 miles',
    neighborhoods: ['Bergen Point', 'Constable Hook', 'Centreville', 'Midtown Bayonne', 'Uptown / 45th St', 'Pamrapo', 'Broadway Corridor'],
    description:
      'Peninsula city with bridge views and a strong local spirit—we’re proud to extend discreet wellness delivery to Bayonne.',
    image:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bayonne and Hudson County waterfront',
  },
  {
    slug: 'east-orange',
    name: 'East Orange',
    county: 'Essex County',
    state: 'New Jersey',
    zipCodes: ['07017', '07018', '07019'],
    distanceMiles: 4.5,
    distanceLabel: '~4.5 miles',
    neighborhoods: ['Ampere', 'Greenwood', 'Doddtown', 'Presidential Heights', 'City Center', 'Brick Church Area', 'Central Avenue District'],
    description:
      'Tree-lined blocks and vibrant culture in Essex County—one of our nearest neighbors beyond Newark’s borders.',
    image:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'East Orange residential streets',
  },
  {
    slug: 'hillside',
    name: 'Hillside',
    county: 'Union County',
    state: 'New Jersey',
    zipCodes: ['07205'],
    distanceMiles: 4.7,
    distanceLabel: '~4.7 miles',
    neighborhoods: ['Lyons Farms', 'Westminster Border', 'Hillside Center', 'Conant Town', 'Saybrook', 'Liberty Avenue Corridor'],
    description:
      'Quiet suburban charm with quick access to Newark—ideal for customers who value privacy and fast local shipping.',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Hillside township neighborhood',
  },
  {
    slug: 'north-arlington',
    name: 'North Arlington',
    county: 'Bergen County',
    state: 'New Jersey',
    zipCodes: ['07031'],
    distanceMiles: 4.8,
    distanceLabel: '~4.8 miles',
    neighborhoods: ['Ridge Road District', 'Schuyler Avenue Corridor', 'Meadowlands Overlook', 'River Road', 'Porete Avenue Area', 'Centennial Park Area'],
    description:
      'Bergen County community overlooking the Meadowlands—within our extended local service radius from Newark.',
    image:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'North Arlington and Meadowlands views',
  },
];

export const FEATURED_LOCATION = LOCATIONS.find((loc) => loc.featured);
export const NEARBY_LOCATIONS = LOCATIONS.filter((loc) => !loc.featured);

function normalizeLocationSlug(slug) {
  return String(slug).toLowerCase().trim().replace(/_/g, '-');
}

export function getLocationBySlug(slug) {
  if (!slug) return null;
  const normalized = normalizeLocationSlug(slug);
  return LOCATIONS.find((loc) => loc.slug === normalized) || null;
}

export function getLocationSlugFromPath(pathname) {
  if (!pathname) return null;
  const path = pathname.replace(/\/+$/, '');
  const match = path.match(/\/locations\/([^/]+)$/i);
  return match ? normalizeLocationSlug(match[1]) : null;
}
