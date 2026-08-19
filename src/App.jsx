import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustBanner from './components/TrustBanner';
import NaturalTouchSection from './components/NaturalTouchSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import VideoSection from './components/VideoSection';
import PureComfortSection from './components/PureComfortSection';
import NewsletterSection from './components/NewsletterSection';
import FaqSection from './components/FaqSection';
import ProductBenefitsSection from './components/ProductBenefitsSection';
import ParallaxBanner from './components/ParallaxBanner';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ShopPage from './components/ShopPage';
import CheckoutPage from './components/CheckoutPage';
import UserPanel from './components/UserPanel';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';

import { PRODUCTS } from './data/products';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  // User Authentication State (Loads logged in session from localStorage if exists)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('missnous_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Auth Modal & User Panel Tab State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [userPanelTab, setUserPanelTab] = useState('dashboard');

  // Customer Orders State (Loaded from localStorage per user email, empty by default)
  const [orders, setOrders] = useState(() => {
    try {
      const savedUser = localStorage.getItem('missnous_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const emailKey = parsed.email ? parsed.email.trim().toLowerCase() : '';
        if (emailKey) {
          const savedOrders = localStorage.getItem(`missnous_orders_${emailKey}`);
          return savedOrders ? JSON.parse(savedOrders) : [];
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Interactive E-Commerce States (Empty by default)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Drawer Visibility States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Global Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const observeAll = () => {
      const elements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale');
      elements.forEach(el => observer.observe(el));
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPage]);

  // Navigation Handler with Route Protection
  const handleNavigate = (page, tab = 'dashboard') => {
    if (page === 'account' || page === 'account-orders') {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleOpenAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData, userOrders = []) => {
    setCurrentUser(userData);
    setOrders(userOrders);
    try {
      localStorage.setItem('missnous_current_user', JSON.stringify(userData));
    } catch (e) {}
    setIsAuthModalOpen(false);
    setCurrentPage('account');
    setUserPanelTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    try {
      localStorage.removeItem('missnous_current_user');
    } catch (e) {}
    setCurrentPage('home');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('missnous_current_user', JSON.stringify(updatedUser));
      const emailKey = updatedUser.email ? updatedUser.email.trim().toLowerCase() : '';
      if (emailKey) {
        const storedUsers = JSON.parse(localStorage.getItem('missnous_users') || '[]');
        const updatedUsers = storedUsers.map(u => u.email.toLowerCase() === emailKey ? updatedUser : u);
        localStorage.setItem('missnous_users', JSON.stringify(updatedUsers));
      }
    } catch (e) {}
  };

  const handleAddNewOrder = (newOrder) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (currentUser && currentUser.email) {
        const emailKey = currentUser.email.trim().toLowerCase();
        try {
          localStorage.setItem(`missnous_orders_${emailKey}`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  // Cart Operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product.id);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDF2F5] text-[#2B2225] font-sans antialiased selection:bg-[#F7D6DF] selection:text-[#9E3F5C]">
      
      {/* Navigation Header */}
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

      {/* Page Views */}
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
          />
          <VideoSection />
          <ProductBenefitsSection onNavigate={handleNavigate} />
          <ParallaxBanner onNavigate={handleNavigate} />
          <PureComfortSection onNavigate={handleNavigate} />
          <FaqSection />
          <NewsletterSection />
        </main>
      )}

      {currentPage === 'about' && (
        <main>
          <AboutPage onNavigate={handleNavigate} />
        </main>
      )}

      {currentPage === 'shop' && (
        <main>
          <ShopPage 
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
            onNavigate={handleNavigate}
          />
        </main>
      )}

      {currentPage === 'contact' && (
        <main>
          <ContactPage />
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
          />
        </main>
      )}

      {/* Graceful Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Auth Modal (Login / Sign Up) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authModalTab}
      />

      {/* Interactive Drawers & Modals */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistItems={wishlistItems}
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