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

import api from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('missnous_current_user');
      const user = saved ? JSON.parse(saved) : null;
      if (user && user.role === 'admin') return user;
      return null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Data from API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
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

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [prods, cats, orders, users] = await Promise.all([
        api.get('/products').catch(err => { console.error('Products fetch failed:', err); return []; }),
        api.get('/categories').catch(err => { console.error('Categories fetch failed:', err); return []; }),
        api.get('/orders').catch(err => { console.error('Orders fetch failed:', err); return []; }),
        api.get('/users').catch(err => { console.error('Users fetch failed:', err); return []; })
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      const fetchedOrders = orders || [];
      setAllOrders(fetchedOrders);
      checkForNewOrders(fetchedOrders);
      setUsersList(users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, checkForNewOrders]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Real-time order & user auto-polling (every 5 seconds)
  useEffect(() => {
    if (!currentUser) return;

    const pollInterval = setInterval(async () => {
      try {
        const [latestOrders, latestUsers] = await Promise.all([
          api.get('/orders').catch(() => null),
          api.get('/users').catch(() => null)
        ]);

        if (Array.isArray(latestOrders)) {
          setAllOrders(latestOrders);
          checkForNewOrders(latestOrders);
        }
        if (Array.isArray(latestUsers)) {
          setUsersList(latestUsers);
        }
      } catch (err) {}
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [currentUser, checkForNewOrders]);

  // Listen for immediate cross-tab order and user signup events
  useEffect(() => {
    const handleStorageEvent = async (e) => {
      if ((e.key === 'missnous_new_order_event' || e.key === 'missnous_new_user_event') && currentUser) {
        try {
          const [latestOrders, latestUsers] = await Promise.all([
            api.get('/orders').catch(() => null),
            api.get('/users').catch(() => null)
          ]);
          if (Array.isArray(latestOrders)) {
            setAllOrders(latestOrders);
            checkForNewOrders(latestOrders);
          }
          if (Array.isArray(latestUsers)) {
            setUsersList(latestUsers);
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
    showToast(`Welcome back, ${userData.name || 'Admin'}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProducts([]);
    setCategories([]);
    setAllOrders([]);
    setUsersList([]);
    try { localStorage.removeItem('missnous_current_user'); } catch (e) {}
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

  // ─── Admin Change Password ──────────────────────────────
  const handleUpdateAdminPassword = async (currentPassword, newPass) => {
    try {
      const token = currentUser?.token;
      const res = await fetch('http://localhost:5000/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ currentPassword, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Password updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update password.');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingOrdersCount = allOrders.filter(o => o.status === 'Pending').length;
  const registeredCustomersCount = usersList.filter(u => u.role !== 'admin').length;

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

          {activeTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onUpdateAdminPassword={handleUpdateAdminPassword}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
