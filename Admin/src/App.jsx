import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import AdminLoginPage from './pages/Auth/AdminLoginPage';

import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductsPage from './pages/Products/ProductsPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import OrdersPage from './pages/Orders/OrdersPage';
import PaymentsPage from './pages/Payments/PaymentsPage';
import CustomersPage from './pages/Customers/CustomersPage';
import SettingsPage from './pages/Settings/SettingsPage';
import BlogsPage from './pages/Blogs/BlogsPage';
import InquiriesPage from './pages/Inquiries/InquiriesPage';

import api from './services/api';

export default function App() {
  // Restore active session across page reloads (F5/refresh) while keeping fresh domain visits protected
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const sessionSaved = sessionStorage.getItem('missnous_admin_user');
      if (sessionSaved) {
        const user = JSON.parse(sessionSaved);
        if (user && user.role === 'admin' && user.token) return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = sessionStorage.getItem('missnous_admin_active_tab');
      if (savedTab) return savedTab;
    } catch (e) {}
    return 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Preserve active tab across page reloads
  useEffect(() => {
    try {
      if (activeTab) {
        sessionStorage.setItem('missnous_admin_active_tab', activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

  // Performance: Stale-While-Revalidate initial state from localStorage for 0ms Instant Load
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_admin_products');
      const parsed = cached ? JSON.parse(cached) : [];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      const clientCached = localStorage.getItem('missnous_cached_products');
      if (clientCached) {
        const cp = JSON.parse(clientCached);
        if (Array.isArray(cp) && cp.length > 0) return cp;
      }
      return [];
    } catch (e) { return []; }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_admin_categories');
      const parsed = cached ? JSON.parse(cached) : [];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      const clientCached = localStorage.getItem('missnous_cached_categories');
      if (clientCached) {
        const cc = JSON.parse(clientCached);
        if (Array.isArray(cc) && cc.length > 0) return cc;
      }
      return [];
    } catch (e) { return []; }
  });

  const [allOrders, setAllOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_admin_orders');
      return cached ? JSON.parse(cached) : [];
    } catch (e) { return []; }
  });

  const [usersList, setUsersList] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_admin_users');
      return cached ? JSON.parse(cached) : [];
    } catch (e) { return []; }
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_admin_inquiries');
      return cached ? JSON.parse(cached) : [];
    } catch (e) { return []; }
  });

  const [blogs, setBlogs] = useState(() => {
    try {
      const local = localStorage.getItem('missnous_published_blogs');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const knownOrderIdsRef = useRef(new Set());
  const initialLoadCompletedRef = useRef(false);

  // Audio chime synthesizer for real-time order alert
  const playNewOrderChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }, []);

  const checkForNewOrders = useCallback((latestOrders) => {
    if (!latestOrders || !Array.isArray(latestOrders)) return;

    if (!initialLoadCompletedRef.current) {
      latestOrders.forEach(o => {
        const id = o.orderId || o._id;
        if (id) knownOrderIdsRef.current.add(id.toString());
      });
      initialLoadCompletedRef.current = true;
      return;
    }

    const newOrders = latestOrders.filter(o => {
      const id = o.orderId || o._id;
      return id && !knownOrderIdsRef.current.has(id.toString());
    });

    if (newOrders.length > 0) {
      playNewOrderChime();
      newOrders.forEach(o => {
        const id = (o.orderId || o._id).toString();
        knownOrderIdsRef.current.add(id);

        const customerName = o.shippingAddress?.name || o.userName || o.userEmail || 'Customer';
        const notifItem = {
          id: `notif-${id}-${Date.now()}`,
          orderId: o.orderId || id,
          customerName,
          total: o.total,
          timeAgo: 'Just now',
          isRead: false
        };

        setNotifications(prev => [notifItem, ...prev]);
        setToastMessage(`🛒 NEW ORDER RECEIVED! #${o.orderId || id} from ${customerName} ($${o.total})`);
        setTimeout(() => setToastMessage(null), 5000);
      });
    }
  }, [playNewOrderChime]);

  // Fetch all data from API - single ultra-fast aggregated bootstrap round-trip
  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);

      // Single ultra-fast bootstrap request: queries all 6 collections via .lean() in 1 round trip
      const data = await api.get('/admin/bootstrap').catch(err => {
        console.warn('Admin bootstrap fast fetch failed, falling back:', err.message);
        return null;
      });

      if (data && typeof data === 'object') {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          try { localStorage.setItem('missnous_admin_products', JSON.stringify(data.products)); } catch (e) {}
        }
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
          try { localStorage.setItem('missnous_admin_categories', JSON.stringify(data.categories)); } catch (e) {}
        }
        if (Array.isArray(data.orders)) {
          setAllOrders(data.orders);
          checkForNewOrders(data.orders);
          try { localStorage.setItem('missnous_admin_orders', JSON.stringify(data.orders)); } catch (e) {}
        }
        if (Array.isArray(data.users)) {
          setUsersList(data.users);
          try { localStorage.setItem('missnous_admin_users', JSON.stringify(data.users)); } catch (e) {}
        }
        if (Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
          try { localStorage.setItem('missnous_admin_inquiries', JSON.stringify(data.inquiries)); } catch (e) {}
        }
        if (Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogs(data.blogs);
          try { localStorage.setItem('missnous_published_blogs', JSON.stringify(data.blogs)); } catch (e) {}
        }
        return;
      }

      // Fallback: Parallel individual endpoints if bootstrap endpoint is unavailable
      const fetchProducts = api.get('/products')
        .then(prods => {
          const list = Array.isArray(prods) ? prods : (prods?.products || prods?.data || []);
          if (Array.isArray(list)) setProducts(list);
        })
        .catch(() => {});

      const fetchCategories = api.get('/categories')
        .then(cats => {
          const list = Array.isArray(cats) ? cats : (cats?.categories || cats?.data || []);
          if (Array.isArray(list)) setCategories(list);
        })
        .catch(() => {});

      const fetchOrders = api.get('/orders')
        .then(orders => {
          if (Array.isArray(orders)) {
            setAllOrders(orders);
            checkForNewOrders(orders);
          }
        })
        .catch(() => {});

      const fetchUsers = api.get('/users')
        .then(users => { if (Array.isArray(users)) setUsersList(users); })
        .catch(() => {});

      const fetchInquiries = api.get('/inquiries')
        .then(inqs => { if (Array.isArray(inqs)) setInquiries(inqs); })
        .catch(() => {});

      await Promise.allSettled([fetchProducts, fetchCategories, fetchOrders, fetchUsers, fetchInquiries]);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, checkForNewOrders]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Real-time order, user, & inquiry auto-polling (every 10 seconds)
  useEffect(() => {
    if (!currentUser) return;

    const pollInterval = setInterval(async () => {
      try {
        const [latestOrders, latestUsers, latestInquiries] = await Promise.all([
          api.get('/orders').catch(() => null),
          api.get('/users').catch(() => null),
          api.get('/inquiries').catch(() => null)
        ]);

        if (Array.isArray(latestOrders)) {
          setAllOrders(latestOrders);
          checkForNewOrders(latestOrders);
          try { localStorage.setItem('missnous_admin_orders', JSON.stringify(latestOrders)); } catch (e) {}
        }
        if (Array.isArray(latestUsers)) {
          setUsersList(latestUsers);
          try { localStorage.setItem('missnous_admin_users', JSON.stringify(latestUsers)); } catch (e) {}
        }
        if (Array.isArray(latestInquiries)) {
          setInquiries(latestInquiries);
          try { localStorage.setItem('missnous_admin_inquiries', JSON.stringify(latestInquiries)); } catch (e) {}
        }
      } catch (err) {}
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [currentUser, checkForNewOrders]);

  // Listen for immediate cross-tab order and user signup events
  useEffect(() => {
    const handleStorageEvent = async (e) => {
      if ((e.key === 'missnous_new_order_event' || e.key === 'missnous_new_user_event') && currentUser) {
        try {
          const [latestOrders, latestUsers, latestInquiries] = await Promise.all([
            api.get('/orders').catch(() => null),
            api.get('/users').catch(() => null),
            api.get('/inquiries').catch(() => null)
          ]);
          if (Array.isArray(latestOrders)) {
            setAllOrders(latestOrders);
            checkForNewOrders(latestOrders);
            try { localStorage.setItem('missnous_admin_orders', JSON.stringify(latestOrders)); } catch (e) {}
          }
          if (Array.isArray(latestUsers)) {
            setUsersList(latestUsers);
            try { localStorage.setItem('missnous_admin_users', JSON.stringify(latestUsers)); } catch (e) {}
          }
          if (Array.isArray(latestInquiries)) {
            setInquiries(latestInquiries);
            try { localStorage.setItem('missnous_admin_inquiries', JSON.stringify(latestInquiries)); } catch (e) {}
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [currentUser, checkForNewOrders]);

  // Handle unauthorized/expired token events automatically
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setProducts([]);
      setCategories([]);
      setAllOrders([]);
      setUsersList([]);
      setInquiries([]);
      showToast('Session expired. Please log in again.');
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      sessionStorage.setItem('missnous_admin_token', userData.token);
      sessionStorage.setItem('missnous_admin_user', JSON.stringify(userData));
    } catch (e) {}
    showToast(`Welcome back, ${userData.name || 'Admin'}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProducts([]);
    setCategories([]);
    setAllOrders([]);
    setUsersList([]);
    setInquiries([]);
    try { 
      sessionStorage.removeItem('missnous_admin_token');
      sessionStorage.removeItem('missnous_admin_user');
      sessionStorage.removeItem('missnous_admin_active_tab');
      localStorage.removeItem('missnous_current_user'); 
      localStorage.removeItem('missnous_admin_products');
      localStorage.removeItem('missnous_admin_categories');
      localStorage.removeItem('missnous_admin_orders');
      localStorage.removeItem('missnous_admin_users');
      localStorage.removeItem('missnous_admin_inquiries');
    } catch (e) {}
    setActiveTab('dashboard');
  };

  // ─── Product CRUD ───────────────────────────────────────
  const handleAddProduct = async (newProd) => {
    try {
      const created = await api.post('/products', newProd);
      setProducts(prev => [created, ...prev]);
      showToast('Product added successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to add product.');
    }
  };

  const handleUpdateProduct = async (updatedProd) => {
    try {
      const { _id, ...rest } = updatedProd;
      const updated = await api.put(`/products/${_id}`, rest);
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
      showToast('Product updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update product.');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    try {
      await api.delete(`/products/${prodId}`);
      setProducts(prev => prev.filter(p => p._id !== prodId));
      showToast('Product deleted.');
    } catch (err) {
      showToast(err.message || 'Failed to delete product.');
    }
  };

  // ─── Category CRUD ──────────────────────────────────────
  const handleAddCategory = async (newCat) => {
    try {
      const created = await api.post('/categories', newCat);
      setCategories(prev => [...prev, created]);
      showToast(`Category "${created.name}" added successfully!`);
    } catch (err) {
      showToast(err.message || 'Failed to add category.');
    }
  };

  const handleUpdateCategory = async (updatedCat) => {
    try {
      const { _id, ...rest } = updatedCat;
      const updated = await api.put(`/categories/${_id}`, rest);
      setCategories(prev => prev.map(c => c._id === updated._id ? updated : c));
      showToast(`Category "${updated.name}" updated successfully!`);
    } catch (err) {
      showToast(err.message || 'Failed to update category.');
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await api.delete(`/categories/${catId}`);
      setCategories(prev => prev.filter(c => c._id !== catId));
      showToast('Category deleted successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to delete category.');
    }
  };

  // ─── Order Status Update ────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setAllOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update order status.');
    }
  };

  // ─── Payment Status Update ──────────────────────────────
  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const updated = await api.put(`/orders/${orderId}/payment`, { paymentStatus: newPaymentStatus });
      setAllOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      showToast(`Payment status updated to ${newPaymentStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update payment status.');
    }
  };

  // ─── Admin Profile & Credentials Update ──────────────────
  const handleUpdateAdminProfile = async (profileData) => {
    try {
      const updated = await api.put('/users/me', profileData);
      setCurrentUser(prev => {
        const next = { ...prev, ...updated };
        try {
          sessionStorage.setItem('missnous_admin_user', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setUsersList(prev => prev.map(u => (u._id === updated._id || u.id === updated._id) ? { ...u, ...updated } : u));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateAdminPassword = async (currentPassword, newPass) => {
    try {
      const res = await api.put('/users/me/password', { currentPassword, newPassword: newPass });
      if (res && res.token) {
        try {
          sessionStorage.setItem('missnous_admin_token', res.token);
          setCurrentUser(prev => prev ? ({ ...prev, token: res.token }) : prev);
        } catch (e) {}
      }
    } catch (err) {
      throw err;
    }
  };

  // ─── Blog CRUD ──────────────────────────────────────────
  const syncBlogsToStorageAndChannel = (updatedList) => {
    try {
      localStorage.setItem('missnous_published_blogs', JSON.stringify(updatedList));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('missnous_channel');
        bc.postMessage({ type: 'SYNC_BLOGS', blogs: updatedList });
        bc.close();
      }
    } catch (e) {}
  };

  const handleAddBlog = async (newBlogData) => {
    try {
      const created = await api.post('/blogs', newBlogData);
      setBlogs(prev => {
        const updated = [created, ...prev];
        syncBlogsToStorageAndChannel(updated);
        return updated;
      });
      showToast(`Article "${created.title}" published!`);
    } catch (err) {
      // Fallback local save if offline
      const localBlog = {
        _id: `blog-${Date.now()}`,
        id: `blog-${Date.now()}`,
        ...newBlogData,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      setBlogs(prev => {
        const updated = [localBlog, ...prev];
        syncBlogsToStorageAndChannel(updated);
        return updated;
      });
      showToast(`Article "${localBlog.title}" published!`);
    }
  };

  const handleUpdateBlog = async (updatedBlogData) => {
    const { _id, ...rest } = updatedBlogData;
    try {
      const updated = await api.put(`/blogs/${_id}`, rest);
      setBlogs(prev => {
        const updatedList = prev.map(b => (b._id === _id || b.id === _id) ? updated : b);
        syncBlogsToStorageAndChannel(updatedList);
        return updatedList;
      });
      showToast(`Article "${updated.title}" updated!`);
    } catch (err) {
      setBlogs(prev => {
        const updatedList = prev.map(b => (b._id === _id || b.id === _id) ? { ...b, ...rest } : b);
        syncBlogsToStorageAndChannel(updatedList);
        return updatedList;
      });
      showToast('Article updated!');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      setBlogs(prev => {
        const updatedList = prev.filter(b => b._id !== blogId && b.id !== blogId);
        syncBlogsToStorageAndChannel(updatedList);
        return updatedList;
      });
      showToast('Article deleted successfully.');
    } catch (err) {
      setBlogs(prev => {
        const updatedList = prev.filter(b => b._id !== blogId && b.id !== blogId);
        syncBlogsToStorageAndChannel(updatedList);
        return updatedList;
      });
      showToast('Article deleted.');
    }
  };

  // ─── Contact Queries (Inquiries) ────────────────────────
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const updated = await api.put(`/inquiries/${inquiryId}/status`, { status: newStatus });
      setInquiries(prev => {
        const next = prev.map(item => item._id === inquiryId ? updated : item);
        try { localStorage.setItem('missnous_admin_inquiries', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      showToast(`Query marked as ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update query status.');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    try {
      await api.delete(`/inquiries/${inquiryId}`);
      setInquiries(prev => {
        const next = prev.filter(item => item._id !== inquiryId);
        try { localStorage.setItem('missnous_admin_inquiries', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      showToast('Query deleted successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to delete query.');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingOrdersCount = allOrders.filter(o => o.status === 'Pending').length;
  const registeredCustomersCount = usersList.filter(u => u.role !== 'admin').length;
  const unreadInquiriesCount = inquiries.filter(i => i.status === 'Unread').length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF2F5] text-[#2B2225] flex font-sans relative">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#2B2225] text-white text-xs font-bold shadow-2xl animate-fade-in border border-[#F7D6DF]">
          {toastMessage}
        </div>
      )}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productsCount={products.length}
        categoriesCount={categories.length}
        pendingOrdersCount={pendingOrdersCount}
        customersCount={registeredCustomersCount}
        paymentsCount={allOrders.length}
        blogsCount={blogs.length}
        inquiriesCount={inquiries.length}
        unreadInquiriesCount={unreadInquiriesCount}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        currentUser={currentUser}
      />

      <div id="admin-main-scroll" className="flex-1 flex flex-col h-full min-w-0 bg-[#FDF2F5] overflow-y-auto custom-scrollbar">

        <AdminNavbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
          notifications={notifications}
          onMarkNotificationRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
          }}
          onClearNotifications={() => setNotifications([])}
          onNavigateToOrders={() => setActiveTab('orders')}
          onNavigateToSettings={() => setActiveTab('settings')}
        />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              allOrders={allOrders}
              users={usersList}
              products={products}
              setActiveTab={setActiveTab}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              showToast={showToast}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              products={products}
              categories={categories}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              showToast={showToast}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesPage
              categories={categories}
              products={products}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              showToast={showToast}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersPage
              allOrders={allOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              showToast={showToast}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsPage
              allOrders={allOrders}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              showToast={showToast}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersPage
              users={usersList}
              allOrders={allOrders}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesPage
              inquiries={inquiries}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
              showToast={showToast}
            />
          )}

          {activeTab === 'blogs' && (
            <BlogsPage
              blogs={blogs}
              onAddBlog={handleAddBlog}
              onUpdateBlog={handleUpdateBlog}
              onDeleteBlog={handleDeleteBlog}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onUpdateAdminProfile={handleUpdateAdminProfile}
              onUpdateAdminPassword={handleUpdateAdminPassword}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
