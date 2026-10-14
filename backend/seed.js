const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Admin
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@missnous.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeMeImmediately@MissNous2026!';
    const adminExists = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail.toLowerCase().trim(),
        password: adminPassword,
        role: 'admin',
        phone: '+92 300 0000000',
        address: 'Miss Nous HQ Atelier',
        city: 'Karachi',
        country: 'Pakistan'
      });
      console.log(`✅ Admin seeded for ${adminEmail}. (Remember to change default password on first login!)`);
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Seed Categories
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany([
        { name: 'Intimate Lubricants', key: 'lubricants' },
        { name: 'Facial Serums', key: 'serums' }
      ]);
      console.log('✅ Categories seeded');
    } else {
      console.log('ℹ️  Categories already exist');
    }

    // Seed Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany([
        {
          name: 'Touch of Love - Strawberry',
          subtitle: 'Flavored & Scented Intimate Lubricant (100ml)',
          category: 'Intimate Lubricants',
          categoryKey: 'lubricants',
          price: 31.99,
          originalPrice: 39.99,
          discount: '20% OFF',
          stock: 25,
          rating: 4.9,
          reviewsCount: 128,
          image: '/product-1-rm.png',
          description: 'Silky, water-based formula infused with natural strawberry extracts. 100% organic, non-sticky, and pH 4.5 calibrated for gentle daily comfort.',
          features: [
            '100% Organic Water-Based Formula',
            'Infused with Natural Strawberry Extracts',
            'pH 4.5 Balanced for Gentle Comfort',
            'Non-Sticky & Easy to Rinse'
          ]
        },
        {
          name: 'Miss Nous Hydrating Serum',
          subtitle: 'Damask Rose & Hyaluronic Acid Facial Serum (50ml)',
          category: 'Facial Serums',
          categoryKey: 'serums',
          price: 2450,
          stock: 18,
          rating: 4.9,
          reviewsCount: 94,
          image: '/product-2.png',
          description: 'Concentrated hydrating serum delivering deep botanical moisture, restoring natural radiance, elasticity, and long-lasting barrier softness.',
          features: [
            'Damask Rose & Hyaluronic Acid',
            'Deep Botanical Barrier Moisture',
            'Restores Natural Elasticity & Radiance',
            'Dermatologist Tested & Paraben-Free'
          ]
        }
      ]);
      console.log('✅ Products seeded');
    } else {
      console.log('ℹ️  Products already exist');
    }

    console.log('\n🎉 Seed complete! You can now run: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
