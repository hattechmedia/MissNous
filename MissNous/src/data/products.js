export const PRODUCTS = [
  {
    id: 'prod-1',
    _id: '6a9294e8f879ce3143960099',
    name: 'Miss Nous Strawberry Intimate Lubricant',
    subtitle: 'Flavored & Scented Intimate Lubricant (100ml)',
    category: 'Intimate Lubricants',
    categoryKey: 'lubricants',
    price: 31.99,
    originalPrice: 39.99,
    discount: '20% OFF',
    image: '/jpt-6.jpeg',
    images: ['/jpt-6.jpeg', '/gpt-2.png', '/gpt-14.png', '/gpt-1.png'],
    rating: 4.9,
    reviewsCount: 128,
    description: 'A colorful, water-based lubricant with a glycerin and propylene glycol base. 100ml size. Ships across the USA.'
  },
  {
    id: 'prod-pineapple',
    _id: 'prod-pineapple',
    name: 'Miss Nous Pineapple Intimate Lubricant',
    subtitle: 'Flavored & Scented Intimate Lubricant (100ml)',
    category: 'Intimate Lubricants',
    categoryKey: 'lubricants',
    price: 31.99,
    originalPrice: 39.99,
    discount: '20% OFF',
    image: '/gpt-5.png',
    images: ['/gpt-5.png', '/gpt-7.jpeg', '/gpt-8.jpeg', '/gpt-16.jpeg'],
    rating: 4.9,
    reviewsCount: 114,
    description: 'A silky, water-based lubricant with a light, fruit-inspired pineapple flavor. Set to a gentle pH so it stays comfortable on sensitive skin. 100ml size. Ships across the USA.'
  },
  {
    id: 'prod-2',
    _id: 'prod-2',
    name: 'Miss Nous Hydrating Serum',
    subtitle: 'Damask Rose & Hyaluronic Acid Facial Serum (50ml)',
    category: 'Facial Serums',
    categoryKey: 'serums',
    price: 110,
    image: '/product-2.png',
    rating: 4.9,
    reviewsCount: 94,
    description: 'Concentrated hydrating serum delivering deep botanical moisture, restoring natural radiance, elasticity, and long-lasting barrier softness.',
    features: [
      'Damask Rose & Hyaluronic Acid',
      'Deep Botanical Barrier Moisture',
      'Restores Natural Elasticity & Radiance',
      'Dermatologist Tested & Paraben-Free'
    ]
  }
];

export { PRODUCTS as getProducts };
