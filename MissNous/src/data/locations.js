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
    neighborhoods: ['Ironbound', 'Downtown', 'Forest Hill', 'North Ward', 'University Heights', 'Weequahic', 'Vailsburg'],
    description:
      'Our home city, where every order is packed and dispatched. Most Newark orders arrive within one to two days.',
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
    neighborhoods: ['Passaic Riverfront', 'John Street', 'Central Borough', 'Sherman Avenue'],
    description:
      'A small borough just across the Passaic from our Newark base, so your order makes one of our shortest trips.',
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
    neighborhoods: ['Arlington Section', 'South Kearny', 'The Manor', 'Kearny Avenue', 'Schuyler Avenue', 'Kearny Point'],
    description:
      'A close-knit town minutes from Newark. Discreet delivery to every corner, from the Arlington section to South Kearny.',
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
    neighborhoods: ['Elmora', 'Midtown', 'Peterstown', 'Elizabethport', 'North End', 'Bayway', 'Westminster'],
    description:
      "New Jersey's fourth-largest city, with fast local delivery to every neighborhood from Elmora to Elizabethport.",
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
    neighborhoods: ['Bergen Point', 'Constable Hook', 'Centerville', 'Port Johnson', 'Uptown'],
    description:
      'A peninsula city with bridge views and strong local pride. Plain-box delivery from Bergen Point to the north end.',
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
    neighborhoods: ['Ampere', 'Doddtown', 'Elmwood', 'Brick Church', 'Presidential Estates'],
    description:
      'Tree-lined blocks and a lively community in Essex County, one of our nearest neighbors for quick delivery.',
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
    neighborhoods: ['Lyons Farms', 'Westminster Border', 'Hillside Center', 'Salem Section'],
    description:
      'A quiet suburban township right on the Newark border, with quick and discreet delivery to your door.',
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
    neighborhoods: ['Ridge Road', 'Schuyler Avenue Corridor', 'Meadowlands Overlook', 'Belleville Turnpike'],
    description:
      'A Bergen County community overlooking the Meadowlands, within our fast local delivery area.',
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
