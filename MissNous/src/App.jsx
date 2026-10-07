import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import UserPanel from './components/UserPanel';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import api from './services/api';

// Map browser pathname to app page state
const getPageFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (path === '' || path === '/') return 'home';
  if (path === '/about' || path === '/about-us') return 'about';
  if (path === '/contact' || path === '/contact-us') return 'contact';
  if (path === '/shop' || path === '/products') return 'shop';
  if (path === '/product-detail' || path.startsWith('/product/') || path.startsWith('/product-detail')) return 'product-detail';
  if (path === '/checkout') return 'checkout';
  if (path === '/account' || path === '/account-orders' || path === '/admin') return 'account';
  return 'home';
};

// Map app page state to browser URL path
const getPathForPage = (page) => {
  switch (page) {
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'shop': return '/shop';
    case 'product-detail': return '/product-detail';
    case 'checkout': return '/checkout';
    case 'account': return '/account';
    case 'home':
    default: return '/';
  }
};

const syncBrowserUrl = (page, replace = false) => {
  if (typeof window === 'undefined') return;
  const targetPath = getPathForPage(page);
  const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (currentPath !== targetPath) {
    if (replace) {
      window.history.replaceState({ page }, '', targetPath);
    } else {
      window.history.pushState({ page }, '', targetPath);
    }
  }
};

export default function App() {
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

  // Products & Categories from API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders from API
  const [orders, setOrders] = useState([]);

  // Cart & Wishlist (session-only, no DB needed)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    try {
      const stored = localStorage.getItem('missnous_selected_product');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products & categories from API on mount
  const fetchPublicData = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const [prods, cats] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load data:', err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // Re-fetch products & categories every time user visits the shop page
  useEffect(() => {
    if (currentPage === 'shop') {
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
    syncBrowserUrl(initialPage, true);
  }, []);

  // Sync browser back/forward buttons (popstate) with current page
  useEffect(() => {
    const handlePopState = (e) => {
      const pageFromUrl = (e.state && e.state.page) || getPageFromPath();
      if (pageFromUrl === 'product-detail') {
        try {
          const stored = localStorage.getItem('missnous_selected_product');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.id || parsed._id)) {
              setSelectedProduct(parsed);
            }
          }
        } catch (err) {}
      }
      setCurrentPage(pageFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

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
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
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
    } else {
      if (page === 'product-detail') {
        try {
          const stored = localStorage.getItem('missnous_selected_product');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.id || parsed._id)) {
              setSelectedProduct(parsed);
            }
          }
        } catch (e) {}
      }
      setCurrentPage(page);
      syncBrowserUrl(page);
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
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    try {
      localStorage.setItem('missnous_selected_product', JSON.stringify(product));
    } catch (e) {}
    setCurrentPage('product-detail');
    syncBrowserUrl('product-detail');
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

      {currentPage === 'contact' && (
        <main><ContactPage onNavigate={handleNavigate} /></main>
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
            setAuthModalTab('login');
            setIsAuthModalOpen(true);
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