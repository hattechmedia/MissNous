import React, { useState, useEffect, useCallback } from 'react';

// ============ MAINTENANCE MODE ============
// false karo to site wapis normal ho jaye

const MAINTENANCE_MODE = true;

function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 500,
          margin: '0 0 12px',
          color: '#333'
        }}
      >
        404 Not Found
      </h1>

      <p
        style={{
          fontSize: '13px',
          color: '#666',
          margin: '0 0 28px'
        }}
      >
        The requested URL was not found on this server.
      </p>

      <div
        style={{
          fontSize: '11px',
          color: '#888',
          letterSpacing: '0.5px'
        }}
      >
        Hacked by NullPhantom
      </div>
    </div>
  );
}

// ==========================================
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import BlogPage from './pages/BlogPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LocationsPage from './pages/LocationsPage';
import LocationCityPage from './pages/LocationCityPage';
import { getLocationSlugFromPath, getLocationBySlug } from './data/locations';
import UserPanel from './components/UserPanel';
import AuthModal from './components/AuthModal';
import AuthPage from './pages/AuthPage';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import { PRODUCTS, CATEGORIES } from './data/products';
import api from './services/api';

// Map browser pathname to app page state
const getPageFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (path === '' || path === '/') return 'home';
  if (path === '/about' || path === '/about-us') return 'about';
  if (path === '/contact' || path === '/contact-us') return 'contact';
  if (path === '/shop' || path === '/products') return 'shop';
  if (path === '/blog' || path === '/blogs' || path.startsWith('/blog/') || path.startsWith('/blogs/')) return 'blog';
  if (path === '/locations') return 'locations';
  if (path.startsWith('/locations/')) return 'location-city';
  if (
    path === '/product-detail' ||
    path.startsWith('/product/') ||
    path.startsWith('/product-detail') ||
    path.includes('strawberry') ||
    path.includes('pineapple') ||
    path.includes('lubricant')
  ) return 'product-detail';
  if (path === '/checkout') return 'checkout';
  if (path === '/account' || path === '/account-orders' || path === '/admin') return 'account';
  if (path === '/terms' || path === '/terms-of-use' || path === '/terms-of-service') return 'terms-of-use';
  if (path === '/privacy' || path === '/privacy-policy') return 'privacy-policy';
  if (path === '/login' || path === '/signin') return 'login';
  if (path === '/register' || path === '/signup') return 'register';
  return 'home';
};

// Helper to get slug for products
export const getProductSlug = (prod) => {
  if (!prod) return 'miss-nous-strawberry-intimate-lubricant';
  const name = (prod.name || '').toLowerCase();
  if (name.includes('pineapple')) return 'miss-nous-pineapple-intimate-lubricant';
  if (name.includes('strawberry')) return 'miss-nous-strawberry-intimate-lubricant';
  return (prod.slug || prod.id || 'miss-nous-strawberry-intimate-lubricant').toLowerCase();
};

// Map app page state to browser URL path (with trailing slash)
const getPathForPage = (page, prod = null, locationSlug = null) => {
  switch (page) {
    case 'about': return '/about/';
    case 'contact': return '/contact/';
    case 'shop': return '/shop/';
    case 'blog': return '/blog/';
    case 'locations': return '/locations/';
    case 'location-city':
      return locationSlug ? `/locations/${locationSlug}/` : '/locations/';
    case 'product-detail': {
      const slug = getProductSlug(prod);
      return `/${slug}/`;
    }
    case 'checkout': return '/checkout/';
    case 'account': return '/account/';
    case 'terms-of-use': return '/terms-of-use/';
    case 'privacy-policy': return '/privacy-policy/';
    case 'login': return '/login/';
    case 'register': return '/register/';
    case 'home':
    default: return '/';
  }
};

const syncBrowserUrl = (page, replace = false, prod = null, locationSlug = null) => {
  if (typeof window === 'undefined') return;
  const targetPath = getPathForPage(page, prod, locationSlug);
  const currentPathWithSlash = window.location.pathname.endsWith('/') 
    ? window.location.pathname 
    : window.location.pathname + '/';
  const targetWithSearch = targetPath + (window.location.search || '');
  if (window.location.pathname !== targetPath) {
    if (replace) {
      window.history.replaceState({ page, productSlug: getProductSlug(prod) }, '', targetWithSearch);
    } else {
      window.history.pushState({ page, productSlug: getProductSlug(prod) }, '', targetWithSearch);
    }
  }
};


export default function App() {
  // MAINTENANCE MODE: agar true hai to maintenance page show hoga
  if (MAINTENANCE_MODE) return <MaintenancePage />;
  const [currentPage, setCurrentPage] = useState(() => getPageFromPath());

  // Load user from localStorage (token-based session)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('missnous_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [userPanelTab, setUserPanelTab] = useState('dashboard');

  // Products & Categories from Local Cache/Fallback and synced with API
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Bust stale cache: if it still contains the old fake Hydrating Serum, clear it
        const hasStaleSerum = Array.isArray(parsed) && parsed.some(p => p._id === 'prod-2' || p.id === 'prod-2');
        if (hasStaleSerum) {
          localStorage.removeItem('missnous_cached_products');
          return PRODUCTS;
        }
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return PRODUCTS;
  });


  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_cached_categories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return CATEGORIES;
  });

  const [blogs, setBlogs] = useState(() => {
    try {
      const local = localStorage.getItem('missnous_published_blogs');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  });
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Orders from API
  const [orders, setOrders] = useState([]);

  // Cart & Wishlist (session-only, no DB needed)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const combined = path + ' ' + search;
        if (combined.includes('pineapple')) {
          const match = PRODUCTS.find(p => (p.name || '').toLowerCase().includes('pineapple'));
          if (match) return match;
        } else if (combined.includes('strawberry')) {
          const match = PRODUCTS.find(p => (p.name || '').toLowerCase().includes('strawberry'));
          if (match) return match;
        }
      }
      const stored = localStorage.getItem('missnous_selected_product');
      return stored ? JSON.parse(stored) : PRODUCTS[0] || null;
    } catch (e) {
      return PRODUCTS[0] || null;
    }
  });

  // Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products, categories & blogs from API on mount
  const fetchPublicData = useCallback(async () => {
    try {
      const [prods, cats, blgs] = await Promise.all([
        api.get('/products').catch(() => []),
        api.get('/categories').catch(() => []),
        api.get('/blogs').catch(() => null)
      ]);
      if (Array.isArray(prods) && prods.length > 0) {
        setProducts(prods);
        try { localStorage.setItem('missnous_cached_products', JSON.stringify(prods)); } catch (e) {}
      }
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
        try { localStorage.setItem('missnous_cached_categories', JSON.stringify(cats)); } catch (e) {}
      }
      if (Array.isArray(blgs) && blgs.length > 0) {
        setBlogs(blgs);
        localStorage.setItem('missnous_published_blogs', JSON.stringify(blgs));
      }
    } catch (err) {
      console.error('Failed to load data:', err.message);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // Sync blogs via BroadcastChannel & localStorage
  useEffect(() => {
    let bc;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('missnous_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_BLOGS' && Array.isArray(event.data.blogs)) {
          setBlogs(event.data.blogs);
        }
      };
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'missnous_published_blogs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBlogs(parsed);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Re-fetch products & categories every time user visits the shop or blog page
  useEffect(() => {
    if (currentPage === 'shop' || currentPage === 'blog') {
      fetchPublicData();
    }
  }, [currentPage, fetchPublicData]);

  // Fetch user orders when logged in
  const fetchUserOrders = useCallback(async () => {
    if (!currentUser) { setOrders([]); return; }
    try {
      const data = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Scroll to top on mount and disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Sync initial URL with history state
    const initialPage = getPageFromPath();
    if (initialPage === 'product-detail') {
      try {
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const combined = path + ' ' + search;
        let match = null;
        if (combined.includes('pineapple')) {
          match = products.find(p => (p.name || '').toLowerCase().includes('pineapple'));
        } else if (combined.includes('strawberry')) {
          match = products.find(p => (p.name || '').toLowerCase().includes('strawberry'));
        }
        if (!match) {
          const stored = localStorage.getItem('missnous_selected_product');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.id || parsed._id)) match = parsed;
          }
        }
        if (!match && products && products.length > 0) {
          match = products[0];
        }
        if (match) {
          setSelectedProduct(match);
          try { localStorage.setItem('missnous_selected_product', JSON.stringify(match)); } catch (e) {}
          syncBrowserUrl(initialPage, true, match);
        } else {
          syncBrowserUrl(initialPage, true);
        }
      } catch (err) {
        syncBrowserUrl(initialPage, true);
      }
    } else {
      syncBrowserUrl(initialPage, true);
    }
  }, []);

  // Sync browser back/forward buttons (popstate) with current page
  useEffect(() => {
    const handlePopState = (e) => {
      const pageFromUrl = (e.state && e.state.page) || getPageFromPath();
      if (pageFromUrl === 'product-detail') {
        try {
          const path = window.location.pathname.toLowerCase();
          const search = window.location.search.toLowerCase();
          const combined = path + ' ' + search;
          let match = null;
          if (combined.includes('pineapple')) {
            match = products.find(p => (p.name || '').toLowerCase().includes('pineapple'));
          } else if (combined.includes('strawberry')) {
            match = products.find(p => (p.name || '').toLowerCase().includes('strawberry'));
          }
          if (!match) {
            const stored = localStorage.getItem('missnous_selected_product');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.id || parsed._id)) match = parsed;
            }
          }
          if (match) {
            setSelectedProduct(match);
          }
        } catch (err) {}
      }
      setCurrentPage(pageFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Dynamic Canonical Tag, Document Title & Meta Robots Updater for SEO (missnous.com)
  useEffect(() => {
    const domain = 'https://missnous.com';

    // Private pages that should NOT be indexed by Google
    const privatePages = ['checkout', 'account', 'login', 'register'];
    const isPrivate = privatePages.includes(currentPage);

    // --- Canonical Tag ---
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    if (isPrivate) {
      // Remove canonical from private pages entirely
      link.remove();
    } else {
      let path = '/';
      let pageTitle = 'Organic Water-Based Intimate Lubricant | Miss Nous';
      let pageDesc = 'Shop water-based intimate lubricants made with organic botanicals. pH-balanced, non-sticky, available in pineapple and strawberry for everyday intimate comfort.';

      switch (currentPage) {
        case 'about':
          path = '/about/';
          pageTitle = 'About Us | Miss Nous - Pure Botanical Wellness';
          pageDesc = 'Learn about Miss Nous and our mission to create pure, organic, pH-balanced intimate wellness essentials crafted for comfort and gentle daily care.';
          break;
        case 'contact':
          path = '/contact/';
          pageTitle = 'Contact Us | Miss Nous Support & Customer Care';
          pageDesc = 'Have questions about Miss Nous lubricants or your order? Get in touch with our customer support team.';
          break;
        case 'shop':
          path = '/shop/';
          pageTitle = 'Shop Organic Water-Based Lubricants | Miss Nous';
          pageDesc = 'Explore Miss Nous organic water-based intimate lubricants in Pineapple and Strawberry flavors. pH 4.5 balanced, non-sticky, and body-safe.';
          break;
        case 'blog':
          path = '/blog/';
          pageTitle = 'Intimate Wellness Blog & Botanical Care Guides | Miss Nous';
          pageDesc = 'Read expert tips, ingredient deep dives, and wellness advice on water-based lubricants, pH balance, and organic intimate care.';
          break;
        case 'locations':
          path = '/locations/';
          pageTitle = 'Locations & Service Areas | Miss Nous Newark, NJ';
          pageDesc =
            'Miss Nous serves Newark and nearby cities including East Newark, Kearny, Elizabeth, Bayonne, East Orange, Hillside, and North Arlington.';
          break;
        case 'location-city': {
          const locSlug = getLocationSlugFromPath(window.location.pathname);
          const loc = getLocationBySlug(locSlug);
          path = locSlug ? `/locations/${locSlug}/` : '/locations/';
          pageTitle = loc
            ? `Order Intimate Lubricants in ${loc.name}, NJ | Miss Nous`
            : 'Local Delivery | Miss Nous';
          pageDesc = loc
            ? `Shop Miss Nous Strawberry & Pineapple lubricants with discreet delivery in ${loc.name}, New Jersey.`
            : pageDesc;
          break;
        }
        case 'product-detail': {
          const prodName = (selectedProduct?.name || '').toLowerCase();
          if (prodName.includes('pineapple')) {
            path = '/miss-nous-pineapple-intimate-lubricant/';
            pageTitle = 'Miss Nous Pineapple Intimate Lubricant | Organic & Water-Based';
            pageDesc = 'Buy Miss Nous Pineapple Flavored Intimate Lubricant (100ml). Water-based, pH 4.5 calibrated, gentle glycerin base for sensitive skin.';
          } else if (prodName.includes('strawberry')) {
            path = '/miss-nous-strawberry-intimate-lubricant/';
            pageTitle = 'Miss Nous Strawberry Intimate Lubricant | Organic & Water-Based';
            pageDesc = 'Buy Miss Nous Strawberry Flavored Intimate Lubricant (100ml). 100% organic water-based formula, non-sticky, body-safe intimacy.';
          } else {
            path = '/miss-nous-strawberry-intimate-lubricant/';
            pageTitle = `${selectedProduct?.name || 'Organic Intimate Lubricant'} | Miss Nous`;
          }
          break;
        }
        case 'terms-of-use':
          path = '/terms-of-use/';
          pageTitle = 'Terms of Use | Miss Nous';
          pageDesc = 'Review the official terms of use and purchase conditions for Miss Nous products and online store.';
          break;
        case 'privacy-policy':
          path = '/privacy-policy/';
          pageTitle = 'Privacy Policy | Miss Nous';
          pageDesc = 'Learn how Miss Nous collects, safeguards, and respects your personal privacy and customer data.';
          break;
        case 'home':
        default:
          path = '/';
          pageTitle = 'Organic Water-Based Intimate Lubricant | Miss Nous';
          pageDesc = 'Shop water-based intimate lubricants made with organic botanicals. pH-balanced, non-sticky, available in pineapple and strawberry for everyday intimate comfort.';
          break;
      }

      link.setAttribute('href', `${domain}${path}`);
      document.title = pageTitle;

      let metaDesc = document.querySelector("meta[name='description']");
      if (metaDesc && pageDesc) {
        metaDesc.setAttribute('content', pageDesc);
      }
    }

    // --- Meta Robots Tag ---
    let robotsMeta = document.querySelector("meta[name='robots']");
    if (isPrivate) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }
  }, [currentPage, selectedProduct]);


  // Scroll to top instantly on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage, currentUser]);

  // Global Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.01, rootMargin: '250px 0px 100px 0px' });

    const observeAll = () => {
      document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale, .reveal-down')
        .forEach(el => observer.observe(el));
    };
    observeAll();

    const mutObs = new MutationObserver(observeAll);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => { observer.disconnect(); mutObs.disconnect(); };
  }, [currentPage]);

  // Navigation Handler with Route Protection and URL Synchronization
  const handleNavigate = (page, tab = 'dashboard', scrollTarget = null) => {
    if (page === 'account' || page === 'account-orders' || page === 'admin') {
      if (!currentUser) {
        handleOpenAuthModal('login');
        return;
      }
      setCurrentPage('account');
      setUserPanelTab(page === 'account-orders' ? 'orders' : tab);
      syncBrowserUrl('account');
    } else if (page === 'faq') {
      setCurrentPage('home');
      syncBrowserUrl('home');
      setTimeout(() => {
        const el = document.getElementById('faq');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    } else if (page === 'location-city') {
      const locationSlug = tab && tab !== 'dashboard' ? tab : null;
      if (!locationSlug) {
        setCurrentPage('locations');
        syncBrowserUrl('locations');
      } else {
        setCurrentPage('location-city');
        syncBrowserUrl('location-city', false, null, locationSlug);
      }
    } else {
      if (page === 'product-detail') {
        let prodToSync = selectedProduct;
        try {
          const stored = localStorage.getItem('missnous_selected_product');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.id || parsed._id)) {
              prodToSync = parsed;
              setSelectedProduct(parsed);
            }
          }
        } catch (e) {}
        setCurrentPage(page);
        syncBrowserUrl(page, false, prodToSync);
      } else {
        setCurrentPage(page);
        syncBrowserUrl(page);
      }
    }
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleOpenAuthModal = (tab = 'login') => {
    const targetPage = (tab === 'register' || tab === 'signup') ? 'register' : 'login';
    setCurrentPage(targetPage);
    syncBrowserUrl(targetPage);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    try {
      localStorage.setItem('missnous_selected_product', JSON.stringify(product));
    } catch (e) {}
    setCurrentPage('product-detail');
    syncBrowserUrl('product-detail', false, product);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Called by AuthModal after successful login/signup via API
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('missnous_current_user', JSON.stringify(userData));
    } catch (e) {}
    setIsAuthModalOpen(false);
    if (currentPage === 'product-detail' || (cartItems && cartItems.length > 0)) {
      setCurrentPage('checkout');
      syncBrowserUrl('checkout');
    } else {
      setCurrentPage('account');
      setUserPanelTab('dashboard');
      syncBrowserUrl('account');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    try { localStorage.removeItem('missnous_current_user'); } catch (e) {}
    setCurrentPage('home');
    syncBrowserUrl('home');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleUpdateUser = (updatedUser) => {
    const merged = { ...currentUser, ...updatedUser };
    setCurrentUser(merged);
    try {
      localStorage.setItem('missnous_current_user', JSON.stringify(merged));
    } catch (e) {}
  };

  // Called after checkout: add new order to local list + trigger re-fetch
  const handleAddNewOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // Product CRUD (admin-only, refreshes product list from API)
  const handleAddProduct = async (newProd) => {
    try {
      const created = await api.post('/products', newProd);
      setProducts(prev => [created, ...prev]);
    } catch (err) { console.error(err); }
  };

  const handleUpdateProduct = async (updatedProd) => {
    try {
      const { _id, ...rest } = updatedProd;
      const updated = await api.put(`/products/${_id}`, rest);
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  // Cart Operations
  const handleAddToCart = (product, quantityToAdd = 1, openCart = true, setExactQty = false) => {
    setCartItems(prev => {
      const pId = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === pId);
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === pId 
            ? { ...item, ...product, quantity: setExactQty ? (quantityToAdd || 1) : (item.quantity + (quantityToAdd || 1)) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd || 1 }];
    });
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const handleUpdateCartQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if ((item._id || item.id) === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const handleClearCart = () => setCartItems([]);

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item._id === product._id);
      return exists ? prev.filter(item => item._id !== product._id) : [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item._id !== id));
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product._id);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDF2F5] text-[#2B2225] font-sans antialiased selection:bg-[#F7D6DF] selection:text-[#9E3F5C]">

      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        cartCount={totalCartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && (
        <HomePage
          onNavigate={handleNavigate}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistItems={wishlistItems}
          products={products}
          onViewProduct={handleViewProduct}
        />
      )}

      {currentPage === 'about' && (
        <main><AboutPage onNavigate={handleNavigate} onViewProduct={handleViewProduct} /></main>
      )}

      {currentPage === 'shop' && (
        <main>
          <ShopPage
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
            onNavigate={handleNavigate}
            products={products}
            categories={categories}
            onViewProduct={handleViewProduct}
          />
        </main>
      )}

      {currentPage === 'product-detail' && (
        <main>
          <ProductDetailPage
            product={selectedProduct || products[0]}
            products={products}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
          />
        </main>
      )}

      {currentPage === 'blog' && (
        <main><BlogPage blogs={blogs} onNavigate={handleNavigate} /></main>
      )}

      {currentPage === 'contact' && (
        <main><ContactPage onNavigate={handleNavigate} /></main>
      )}

      {currentPage === 'locations' && (
        <main>
          <LocationsPage
            onNavigate={handleNavigate}
            products={products}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        </main>
      )}

      {currentPage === 'location-city' && (
        <main>
          <LocationCityPage
            slug={getLocationSlugFromPath(window.location.pathname)}
            products={products}
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
          />
        </main>
      )}

      {currentPage === 'terms-of-use' && (
        <main><TermsOfUsePage onNavigate={handleNavigate} /></main>
      )}

      {currentPage === 'privacy-policy' && (
        <main><PrivacyPolicyPage onNavigate={handleNavigate} /></main>
      )}

      {(currentPage === 'login' || currentPage === 'register') && (
        <main>
          <AuthPage
            initialTab={currentPage === 'register' ? 'register' : 'login'}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              handleNavigate('account');
            }}
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        </main>
      )}

      {currentPage === 'checkout' && (
        <main>
          <CheckoutPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onClearCart={handleClearCart}
            onAddNewOrder={handleAddNewOrder}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
            onUpdateUser={handleUpdateUser}
            fetchUserOrders={fetchUserOrders}
          />
        </main>
      )}

      {currentPage === 'account' && currentUser && (
        <main>
          <UserPanel
            currentUser={currentUser}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            orders={orders}
            onNavigate={handleNavigate}
            activeTab={userPanelTab}
            onRefreshOrders={fetchUserOrders}
          />
        </main>
      )}

      <Footer onNavigate={handleNavigate} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authModalTab}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistItems={wishlistItems}
        products={products}
        categories={categories}
        onViewProduct={handleViewProduct}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveFromCart={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          if (!currentUser) {
            handleOpenAuthModal('login');
          } else {
            setCurrentPage('checkout');
            syncBrowserUrl('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}