const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Force DNS resolution to use Google Public DNS (fixes Windows querySrv ECONNREFUSED issues on mongodb+srv)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

dotenv.config();

const app = express();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Security: Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows static images in /uploads to load on frontend
  contentSecurityPolicy: false // Handled by frontend bundler / CDN
}));

// Security: Prevent NoSQL Query Injection (sanitizes req.body, req.query, req.params)
app.use(mongoSanitize());

// Security: Strict CORS whitelist
const allowedOrigins = [
  'https://missnous.com',
  'https://www.missnous.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow server-to-server or tools without origin
    const isAllowed = 
      allowedOrigins.includes(origin) ||
      (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`) ||
      /^https:\/\/([a-zA-Z0-9-]+\.)*missnous\.com$/.test(origin) ||
      /^https:\/\/missnous[a-zA-Z0-9-]*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access blocked from unauthorized origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing with safe limits (2MB max to prevent payload exhaustion attacks)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global API rate limiter: 300 requests per 15 minutes per IP
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', globalApiLimiter);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root landing route (fixes 404 on http://localhost:5000/)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'MissNous E-Commerce API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

// Chrome DevTools probe handler (fixes devtools 404 & CSP warning)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/users', require('./routes/users'));
app.use('/api/blogs', require('./routes/blogs'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MissNous API is running' });
});

// Start Server with graceful EADDRINUSE handling
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 MissNous API Server running on http://localhost:${port}`);
    console.log(`📡 API Health: http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use by another process. Retrying on port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

if (!process.env.VERCEL) {
  startServer(DEFAULT_PORT);
}

module.exports = app;

// Connect to MongoDB with retry logic in background
const connectWithRetry = async () => {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`);

      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,   // 10 seconds timeout per attempt
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4,                          // Force IPv4 (fixes DNS issues)
        retryWrites: true,
        w: 'majority'
      });

      console.log('✅ Connected to MongoDB Atlas successfully!');
      break; // Exit loop on success

    } catch (err) {
      console.error(`❌ Connection attempt ${attempt} failed: ${err.message}`);

      if (attempt >= MAX_RETRIES) {
        console.error('\n💡 TROUBLESHOOTING STEPS:');
        console.error('   1. Go to https://cloud.mongodb.com');
        console.error('   2. Click "Network Access" → "Add IP Address"');
        console.error('   3. Click "Allow Access from Anywhere" (0.0.0.0/0)');
        console.error('   4. Click "Confirm" and wait 1-2 minutes');
        console.error('   5. Then restart this server with: npm run dev\n');
      }

      const waitMs = attempt * 3000;
      console.log(`⏳ Retrying in ${waitMs / 1000} seconds...`);
      await new Promise(res => setTimeout(res, waitMs));
    }
  }
};

connectWithRetry();
