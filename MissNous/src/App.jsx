import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustBanner from './components/TrustBanner';
import NaturalTouchSection from './components/NaturalTouchSection';
import SkinRitualSection from './components/SkinRitualSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import VideoSection from './components/VideoSection';
import PureComfortSection from './components/PureComfortSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import FaqSection from './components/FaqSection';
import ProductBenefitsSection from './components/ProductBenefitsSection';
import ParallaxBanner from './components/ParallaxBanner';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import UserPanel from './components/UserPanel';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import api from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Navigation Handler with Route Protection
  const handleNavigate = (page, tab = 'dashboard') => {
    if (page === 'account' || page === 'account-orders' || page === 'admin') {
      if (!currentUser) {
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
        return;
      }
      setCurrentPage('account');
      setUserPanelTab(page === 'account-orders' ? 'orders' : tab);
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleOpenAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
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
    } else {
      setCurrentPage('account');
      setUserPanelTab('dashboard');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    try { localStorage.removeItem('missnous_current_user'); } catch (e) {}
    setCurrentPage('home');
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
  const handleAddToCart = (product, quantityToAdd = 1, openCart = true) => {
    setCartItems(prev => {
      const pId = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === pId);
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === pId ? { ...item, quantity: item.quantity + (quantityToAdd || 1) } : item
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
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
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
        <main>
          <HeroSection onNavigate={handleNavigate} />
          <TrustBanner />
          <NaturalTouchSection onNavigate={handleNavigate} />
          <FeaturedProductsSection
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
            onNavigate={handleNavigate}
            products={products}
            onViewProduct={handleViewProduct}
          />
          <VideoSection />
          <ProductBenefitsSection onNavigate={handleNavigate} />
          <ParallaxBanner onNavigate={handleNavigate} />
          <SkinRitualSection onNavigate={handleNavigate} />
          <PureComfortSection onNavigate={handleNavigate} />
          <FaqSection />
          <TestimonialsSection />
          <NewsletterSection />
        </main>
      )}

      {currentPage === 'about' && (
        <main><AboutPage onNavigate={handleNavigate} /></main>
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
        <main><ContactPage /></main>
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}