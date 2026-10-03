import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  Sparkles, 
  Lock, 
  DollarSign, 
  AlertTriangle,
  Menu,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Upload
} from 'lucide-react';

export default function AdminPanel({ 
  currentUser, 
  onLogout, 
  onUpdateUser,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  categories = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  allOrders = [],
  onUpdateOrderStatus,
  users = [],
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Modals & Drawers
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  
  // Product Modal State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    subtitle: '',
    category: '',
    categoryKey: '',
    price: '',
    stock: 10,
    image: '',
    description: ''
  });
  const [productFormError, setProductFormError] = useState('');

  // Category Modal State (Add / Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', key: '' });
  const [categoryFormError, setCategoryFormError] = useState('');

  // Delete Confirmation Modals
  const [deleteProductConfirm, setDeleteProductConfirm] = useState(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

  // Lock body scroll whenever any admin popup/modal is active
  const isAnyModalOpen = Boolean(
    selectedOrderDetails || 
    selectedCustomerDetails || 
    isProductModalOpen || 
    isCategoryModalOpen || 
    deleteProductConfirm || 
    deleteCategoryConfirm
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedOrderDetails(null);
          setSelectedCustomerDetails(null);
          setIsProductModalOpen(false);
          setIsCategoryModalOpen(false);
          setDeleteProductConfirm(null);
          setDeleteCategoryConfirm(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isAnyModalOpen]);

  // Admin Settings State
  const [adminProfileData, setAdminProfileData] = useState({
    name: currentUser?.name || 'Admin Manager',
    email: currentUser?.email || 'admin@missnous.com'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status helper
  const statusColorMap = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  // Filtered Products
  const filteredProductsList = products.filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.categoryKey === productCategoryFilter || p.category === productCategoryFilter;
    const q = productSearch.toLowerCase().trim();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // Filtered Orders
  const filteredOrdersList = allOrders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchesQuery = !q || 
      o.id.toLowerCase().includes(q) || 
      (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(q)) ||
      (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase().includes(q)) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  // Filtered Customers (Only role === 'user' or non-admin)
  const registeredCustomers = users.filter(u => u.role !== 'admin');
  const filteredCustomersList = registeredCustomers.filter(c => {
    const q = customerSearch.toLowerCase().trim();
    return !q || 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q));
  });

  // Calculate Dashboard Statistics
  const totalSalesAmount = allOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? Number(o.total || 0) : 0), 0);
  const totalOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter(o => o.status === 'Pending').length;
  const totalCustomersCount = registeredCustomers.length;
  const recentOrdersList = allOrders.slice(0, 5);

  const productImageInputRef = useRef(null);

  const handleProductImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProductFormError('Selected image file is too large. Please upload an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => ({ ...prev, image: reader.result }));
        setProductFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // PRODUCT HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      subtitle: '',
      category: categories.length > 0 ? categories[0].name : 'Intimate Lubricants',
      categoryKey: categories.length > 0 ? categories[0].key : 'lubricants',
      price: '',
      stock: 15,
      image: '',
      description: ''
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name || '',
      subtitle: prod.subtitle || '',
      category: prod.category || '',
      categoryKey: prod.categoryKey || '',
      price: prod.price || '',
      stock: prod.stock !== undefined ? prod.stock : 10,
      image: prod.image || '',
      description: prod.description || ''
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    setProductFormError('');

    if (!productFormData.name.trim() || productFormData.price === '' || productFormData.price === null || !productFormData.category) {
      setProductFormError('Please fill in all required fields (Name, Price, Category).');
      return;
    }

    const priceNum = parseFloat(productFormData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setProductFormError('Price must be a valid positive number (e.g. 31.99).');
      return;
    }

    const matchedCat = categories.find(c => c.name === productFormData.category || c.key === productFormData.categoryKey);
    const finalCategoryName = matchedCat ? matchedCat.name : productFormData.category;
    const finalCategoryKey = matchedCat ? matchedCat.key : productFormData.category.toLowerCase().replace(/\s+/g, '-');

    const targetId = editingProduct ? (editingProduct._id || editingProduct.id) : `prod-${Date.now()}`;

    const productPayload = {
      id: targetId,
      _id: targetId,
      name: productFormData.name.trim(),
      subtitle: productFormData.subtitle.trim(),
      category: finalCategoryName,
      categoryKey: finalCategoryKey,
      price: priceNum,
      stock: Number(productFormData.stock || 0),
      image: productFormData.image.trim() || '/gpt-6.png',
      description: productFormData.description.trim() || 'Premium botanical skincare formulation designed for natural daily radiance.',
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 12
    };

    if (editingProduct) {
      if (onUpdateProduct) onUpdateProduct(productPayload);
      showToast(`Product "${productPayload.name}" updated successfully!`);
    } else {
      if (onAddProduct) onAddProduct(productPayload);
      showToast(`New product "${productPayload.name}" added to catalog!`);
    }

    setIsProductModalOpen(false);
  };

  const handleConfirmDeleteProduct = (prod) => {
    setDeleteProductConfirm(prod);
  };

  const handleExecuteDeleteProduct = () => {
    if (deleteProductConfirm && onDeleteProduct) {
      onDeleteProduct(deleteProductConfirm.id);
      showToast(`Product "${deleteProductConfirm.name}" removed.`);
    }
    setDeleteProductConfirm(null);
  };

  // CATEGORY HANDLERS
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '', key: '' });
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({ name: cat.name, key: cat.key });
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    setCategoryFormError('');

    if (!categoryFormData.name.trim()) {
      setCategoryFormError('Category name is required.');
      return;
    }

    const autoKey = categoryFormData.key.trim() || categoryFormData.name.trim().toLowerCase().replace(/\s+/g, '-');
    const categoryPayload = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: categoryFormData.name.trim(),
      key: autoKey
    };

    if (editingCategory) {
      if (onUpdateCategory) onUpdateCategory(categoryPayload);
      showToast(`Category "${categoryPayload.name}" updated!`);
    } else {
      if (onAddCategory) onAddCategory(categoryPayload);
      showToast(`Category "${categoryPayload.name}" created!`);
    }

    setIsCategoryModalOpen(false);
  };

  const handleConfirmDeleteCategory = (cat) => {
    const prodsInCat = products.filter(p => p.category === cat.name || p.categoryKey === cat.key);
    setDeleteCategoryConfirm({ category: cat, productCount: prodsInCat.length });
  };

  const handleExecuteDeleteCategory = () => {
    if (deleteCategoryConfirm && onDeleteCategory) {
      onDeleteCategory(deleteCategoryConfirm.category.id);
      showToast(`Category "${deleteCategoryConfirm.category.name}" removed.`);
    }
    setDeleteCategoryConfirm(null);
  };

  // ADMIN SETTINGS PASSWORD UPDATE
  const handleAdminPasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (currentUser?.password && passwordData.currentPassword !== currentUser.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name: adminProfileData.name,
        password: passwordData.newPassword
      });
    }

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Admin password updated successfully!');
  };

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 font-sans relative">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#9E3F5C] text-[#FFF9F5] px-6 py-3.5 rounded-2xl shadow-luxury font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-up border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-[#E8D3A5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header Banner */}
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] p-6 sm:p-8 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-5 z-10 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center border-4 border-[#F7D6DF] shadow-md">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#F7D6DF]">
                <Sparkles className="w-3 h-3 text-[#9E3F5C]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E3F5C]">Admin Management Portal</span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
                {currentUser?.name || 'Store Administrator'}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal">
                {currentUser?.email || 'admin@missnous.com'} • Role: Super Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => onNavigate && onNavigate('shop')}
              className="px-5 py-2.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-sans text-xs font-semibold hover:bg-[#F7D6DF] transition-colors border border-[#F7D6DF] flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Public Store</span>
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-full bg-[#2B2225] text-[#FFF9F5] font-sans text-xs font-semibold hover:bg-[#9E3F5C] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Navigation + Main View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 bg-white border border-[#F7D6DF] rounded-[2rem] p-3 shadow-luxury space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'products'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'products' ? 'bg-white text-[#9E3F5C]' : 'bg-[#F7D6DF] text-[#9E3F5C]'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'categories'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'categories' ? 'bg-white text-[#9E3F5C]' : 'bg-[#F7D6DF] text-[#9E3F5C]'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400 text-amber-950 animate-pulse">
                  {pendingOrdersCount} New
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'customers' ? 'bg-white text-[#9E3F5C]' : 'bg-[#F7D6DF] text-[#9E3F5C]'
              }`}>
                {registeredCustomers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="pt-3 border-t border-[#F7D6DF]/60">
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-9 space-y-6 min-w-0">

            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFF9F5] text-[#D4AF6A] border border-[#E8D3A5] flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Total Orders</p>
                    <h3 className="font-sans text-3xl font-bold text-[#2B2225]">{totalOrdersCount}</h3>
                  </div>

                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Total Sales</p>
                    <h3 className="font-sans text-3xl font-bold text-emerald-600">${totalSalesAmount}</h3>
                  </div>

                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Total Customers</p>
                    <h3 className="font-sans text-3xl font-bold text-[#9E3F5C]">{totalCustomersCount}</h3>
                  </div>

                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Pending Orders</p>
                    <h3 className="font-sans text-3xl font-bold text-amber-600">{pendingOrdersCount}</h3>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-sans text-xl font-bold text-[#2B2225]">Recent Orders</h2>
                      <p className="text-xs text-[#5A4B50]">Latest order submissions from customer checkouts</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#9E3F5C] hover:underline flex items-center gap-1"
                    >
                      <span>View All Orders</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {recentOrdersList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                            <th className="py-3 px-3">Order ID</th>
                            <th className="py-3 px-3">Customer</th>
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 px-3">Total</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F7D6DF]/40 text-xs text-[#2B2225]">
                          {recentOrdersList.map(order => (
                            <tr key={order.id} className="hover:bg-[#FFF9F5] transition-colors">
                              <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">{order.id}</td>
                              <td className="py-3.5 px-3 font-medium">
                                {order.shippingAddress?.name || order.userEmail || 'Valued Customer'}
                              </td>
                              <td className="py-3.5 px-3 text-[#5A4B50]">{order.date}</td>
                              <td className="py-3.5 px-3 font-bold">${order.total}</td>
                              <td className="py-3.5 px-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColorMap[order.status] || 'bg-gray-100'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors"
                                  title="View Order Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#5A4B50]">
                      No recent orders found.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: PRODUCTS MODULE */}
            {activeTab === 'products' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Product Management</h2>
                    <p className="text-xs text-[#5A4B50]">Add, edit, update prices & stock quantities</p>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="px-5 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-semibold shadow-pink-glow flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search products by name or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] w-full sm:w-auto"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.key}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                        <th className="py-3 px-3">Product</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Stock</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7D6DF]/40 text-xs text-[#2B2225]">
                      {filteredProductsList.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#FFF9F5] transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF] bg-[#FDF2F5] p-1 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-[#2B2225]">{prod.name}</p>
                                <p className="text-[11px] text-[#5A4B50] truncate max-w-xs">{prod.subtitle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[10px] font-bold text-[#9E3F5C]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">${prod.price}</td>
                          <td className="py-3.5 px-3 font-semibold">{prod.stock || 0} units</td>
                          <td className="py-3.5 px-3">
                            {(prod.stock || 0) > 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                In Stock
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-2 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleConfirmDeleteProduct(prod)}
                                className="p-2 rounded-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 3: CATEGORIES MODULE */}
            {activeTab === 'categories' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Category Management</h2>
                    <p className="text-xs text-[#5A4B50]">Manage product categories for store browsing</p>
                  </div>

                  <button
                    onClick={handleOpenAddCategory}
                    className="px-5 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-semibold shadow-pink-glow flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {categories.map(cat => {
                    const count = products.filter(p => p.category === cat.name || p.categoryKey === cat.key).length;
                    return (
                      <div key={cat.id} className="bg-[#FFF9F5] border border-[#F7D6DF] p-5 rounded-3xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center border border-[#F7D6DF]">
                            <FolderTree className="w-4 h-4" />
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1.5 rounded-full bg-white text-[#9E3F5C] border border-[#F7D6DF] hover:bg-[#9E3F5C] hover:text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleConfirmDeleteCategory(cat)}
                              className="p-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-sans text-base font-bold text-[#2B2225]">{cat.name}</h3>
                          <p className="text-[11px] text-[#A09095]">Key: {cat.key}</p>
                        </div>

                        <div className="pt-2 border-t border-[#F7D6DF]/60 flex items-center justify-between text-xs">
                          <span className="text-[#5A4B50]">Associated Products:</span>
                          <span className="font-bold text-[#9E3F5C]">{count} items</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 4: ORDERS MODULE */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order Management</h2>
                    <p className="text-xs text-[#5A4B50]">View & update customer order status in real-time</p>
                  </div>

                  <span className="px-4 py-1.5 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C]">
                    Total Orders: {allOrders.length}
                  </span>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search orders by Order ID (ORD-2026-XXXX), customer name, or email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] w-full sm:w-auto"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Orders List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status Dropdown</th>
                        <th className="py-3 px-3 text-right">Invoice Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7D6DF]/40 text-xs text-[#2B2225]">
                      {filteredOrdersList.map(order => (
                        <tr key={order.id} className="hover:bg-[#FFF9F5] transition-colors">
                          <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">{order.id}</td>
                          <td className="py-3.5 px-3 font-medium">
                            <p className="font-bold text-[#2B2225]">{order.shippingAddress?.name || order.userEmail}</p>
                            <p className="text-[11px] text-[#5A4B50]">{order.shippingAddress?.email || order.userEmail}</p>
                          </td>
                          <td className="py-3.5 px-3 text-[#5A4B50]">{order.date}</td>
                          <td className="py-3.5 px-3 font-bold">${order.total}</td>
                          <td className="py-3.5 px-3">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (onUpdateOrderStatus) onUpdateOrderStatus(order.id, newStatus);
                                showToast(`Order ${order.id} status updated to ${newStatus}`);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${statusColorMap[order.status] || 'bg-gray-100'}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-3.5 py-1.5 rounded-full bg-[#2B2225] text-white hover:bg-[#9E3F5C] text-xs font-semibold transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 5: CUSTOMERS MODULE */}
            {activeTab === 'customers' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Registered Customers</h2>
                    <p className="text-xs text-[#5A4B50]">View registered user accounts and order histories</p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                        <th className="py-3 px-3">Customer Name</th>
                        <th className="py-3 px-3">Email Address</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">City / Location</th>
                        <th className="py-3 px-3">Total Orders</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7D6DF]/40 text-xs text-[#2B2225]">
                      {filteredCustomersList.map(cust => {
                        const emailKey = cust.email ? cust.email.trim().toLowerCase() : '';
                        const customerOrders = allOrders.filter(o => (o.userEmail && o.userEmail.toLowerCase() === emailKey) || (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase() === emailKey));
                        return (
                          <tr key={cust.email} className="hover:bg-[#FFF9F5] transition-colors">
                            <td className="py-3.5 px-3 font-bold text-[#2B2225]">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold flex items-center justify-center text-xs border border-[#F7D6DF]">
                                  {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span>{cust.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-[#5A4B50]">{cust.email}</td>
                            <td className="py-3.5 px-3">{cust.phone || 'Not provided'}</td>
                            <td className="py-3.5 px-3">{cust.city || 'Not provided'}</td>
                            <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">{customerOrders.length}</td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={() => setSelectedCustomerDetails({ customer: cust, orders: customerOrders })}
                                className="p-2 rounded-full bg-[#FDF2F5] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors"
                                title="View Customer History"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 6: SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-8 animate-fade-in max-w-2xl">
                <div>
                  <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Admin Settings</h2>
                  <p className="text-xs text-[#5A4B50]">Manage store profile credentials & change security password</p>
                </div>

                {/* Profile Details */}
                <div className="space-y-4 p-5 bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl">
                  <h3 className="font-sans text-sm font-bold text-[#2B2225] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#9E3F5C]" />
                    <span>Admin Profile Info</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[#A09095] uppercase font-bold text-[10px]">Admin Name</label>
                      <input 
                        type="text"
                        value={adminProfileData.name}
                        onChange={(e) => setAdminProfileData({ ...adminProfileData, name: e.target.value })}
                        className="w-full px-3 py-2 mt-1 bg-white border border-[#F7D6DF] rounded-xl text-[#2B2225]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A09095] uppercase font-bold text-[10px]">Email Address</label>
                      <input 
                        type="email"
                        disabled
                        value={adminProfileData.email}
                        className="w-full px-3 py-2 mt-1 bg-gray-100 border border-[#F7D6DF] rounded-xl text-[#5A4B50] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change Form inside Settings */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-sans text-base font-bold text-[#2B2225] flex items-center gap-2 border-b border-[#F7D6DF] pb-2">
                    <Lock className="w-4 h-4 text-[#9E3F5C]" />
                    <span>Change Admin Password</span>
                  </h3>

                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl text-center">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handleAdminPasswordUpdate} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                        Current Password
                      </label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                          New Password
                        </label>
                        <input 
                          type="password"
                          required
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                          Confirm New Password
                        </label>
                        <input 
                          type="password"
                          required
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-8 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold shadow-pink-glow transition-all cursor-pointer mt-2"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ORDER DETAILS INVOICE MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Admin Order Breakdown</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order #{selectedOrderDetails.id}</h2>
              <p className="text-xs text-[#5A4B50]">Placed on {selectedOrderDetails.date}</p>
            </div>

            {/* Quick Status Updater inside Modal */}
            <div className="bg-white p-4 rounded-3xl border border-[#F7D6DF] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A09095]">Current Order Status</span>
                <p className="font-sans text-sm font-bold text-[#9E3F5C]">{selectedOrderDetails.status}</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[#2B2225]">Update Status:</label>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (onUpdateOrderStatus) onUpdateOrderStatus(selectedOrderDetails.id, newStatus);
                    setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
                    showToast(`Order status updated to ${newStatus}`);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border border-[#F7D6DF] bg-[#FFF9F5] text-[#9E3F5C] focus:outline-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Visual Stepper with Connecting Track Line */}
            <div className="bg-white p-5 rounded-3xl border border-[#F7D6DF] space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#2B2225]">
                <span>Status Tracker</span>
                <span className="text-[#9E3F5C] font-extrabold">{selectedOrderDetails.status}</span>
              </div>

              <div className="relative pt-1 pb-1">
                {/* Connecting Track Line */}
                <div className="absolute top-3.5 sm:top-4 left-[10%] right-[10%] h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                  <div 
                    className="h-full bg-[#9E3F5C] transition-all duration-500"
                    style={{ 
                      width: `${(Math.max(0, ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].indexOf(selectedOrderDetails.status)) / 4) * 100}%` 
                    }}
                  ></div>
                </div>

                <div className="relative z-10 grid grid-cols-5 gap-1 text-center text-[10px] sm:text-xs font-bold">
                  {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const currentIdx = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].indexOf(selectedOrderDetails.status);
                    const isDone = idx <= (currentIdx >= 0 ? currentIdx : 0);
                    return (
                      <div key={step} className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all border-2 border-white ${
                          isDone ? 'bg-[#9E3F5C] text-white shadow-xs scale-105' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                        </div>
                        <span className={isDone ? 'text-[#9E3F5C]' : 'text-gray-400'}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-3xl border border-[#F7D6DF] p-5 space-y-3">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2B2225]">Products Ordered</h4>
              <div className="divide-y divide-[#F7D6DF]/60">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF]" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#2B2225]">{item.title}</p>
                        <p className="text-xs text-[#5A4B50]">Quantity: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#9E3F5C]">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-1">
                <h5 className="text-xs font-bold uppercase text-[#D4AF6A]">Shipping Destination</h5>
                <p className="text-xs font-medium text-[#2B2225]">
                  {selectedOrderDetails.shippingAddress?.name || selectedOrderDetails.userEmail || 'Valued Customer'}
                </p>
                <p className="text-xs text-[#5A4B50]">
                  {(() => {
                    const sa = selectedOrderDetails.shippingAddress;
                    if (sa && (sa.address || sa.city)) {
                      const parts = [sa.address, sa.city, sa.postalCode, sa.country].filter(Boolean);
                      return parts.join(', ');
                    }
                    return 'No shipping address specified';
                  })()}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-1">
                <h5 className="text-xs font-bold uppercase text-[#D4AF6A]">Payment Method</h5>
                <p className="text-xs font-medium text-[#2B2225]">{selectedOrderDetails.paymentMethod || 'Credit Card'}</p>
                <p className="text-xs text-[#9E3F5C] font-bold">Total Paid: ${selectedOrderDetails.total}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-3 rounded-full bg-[#2B2225] text-[#FFF9F5] text-xs font-semibold hover:bg-[#9E3F5C] transition-colors"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER HISTORY MODAL */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCustomerDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Customer Profile & Order History</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">{selectedCustomerDetails.customer.name}</h2>
              <p className="text-xs text-[#5A4B50]">{selectedCustomerDetails.customer.email}</p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-3xl border border-[#F7D6DF] text-xs">
              <div>
                <span className="text-[#A09095] uppercase font-bold text-[10px]">Phone Number</span>
                <p className="font-semibold text-[#2B2225]">{selectedCustomerDetails.customer.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-[#A09095] uppercase font-bold text-[10px]">Location / City</span>
                <p className="font-semibold text-[#2B2225]">{selectedCustomerDetails.customer.city || 'Not provided'}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#A09095] uppercase font-bold text-[10px]">Shipping Address</span>
                <p className="font-semibold text-[#2B2225]">{selectedCustomerDetails.customer.address || 'Not provided'}</p>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="font-sans text-sm font-bold text-[#2B2225]">Order History ({selectedCustomerDetails.orders.length})</h4>
              {selectedCustomerDetails.orders.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedCustomerDetails.orders.map(ord => (
                    <div key={ord.id} className="bg-white p-4 rounded-2xl border border-[#F7D6DF] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#9E3F5C]">{ord.id}</p>
                        <p className="text-[#5A4B50]">{ord.date} • {ord.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2B2225] block">${ord.total}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColorMap[ord.status] || 'bg-gray-100'}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-2xl text-center text-xs text-[#5A4B50] border border-[#F7D6DF]">
                  This customer has not placed any orders yet.
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCustomerDetails(null)}
              className="w-full py-3 rounded-full bg-[#2B2225] text-[#FFF9F5] text-xs font-semibold hover:bg-[#9E3F5C] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Product Catalog</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">
                {editingProduct ? 'Edit Skincare Product' : 'Add New Skincare Product'}
              </h2>
            </div>

            {productFormError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl text-center">
                {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Product Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Damask Rose Hydrating Serum"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Subtitle / Spec</label>
                <input 
                  type="text"
                  placeholder="e.g. Scented Intimate Lubricant (100ml)"
                  value={productFormData.subtitle}
                  onChange={(e) => setProductFormData({ ...productFormData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 text-left sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category *</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => {
                      const selectedCatName = e.target.value;
                      const matched = categories.find(c => c.name === selectedCatName);
                      setProductFormData({
                        ...productFormData,
                        category: selectedCatName,
                        categoryKey: matched ? matched.key : selectedCatName.toLowerCase().replace(/\s+/g, '-')
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-left sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Price ($) *</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="31.99"
                    value={productFormData.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setProductFormData({ ...productFormData, price: val });
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>

                <div className="space-y-1 text-left sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Stock Qty *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
              </div>

              {/* Product Image File Upload */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Product Image *</label>
                
                <input 
                  type="file" 
                  ref={productImageInputRef}
                  accept="image/*"
                  onChange={handleProductImageFileChange}
                  className="hidden"
                />

                {productFormData.image ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-[#F7D6DF] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img 
                        src={productFormData.image} 
                        alt="Product Preview" 
                        className="w-14 h-14 rounded-xl object-cover border border-[#F7D6DF] bg-[#FDF2F5] p-1 flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#2B2225]">Image Selected</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">Ready for product listing</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => productImageInputRef.current && productImageInputRef.current.click()}
                        className="px-3 py-1.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-xs font-bold border border-[#F7D6DF] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductFormData(prev => ({ ...prev, image: '' }))}
                        className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => productImageInputRef.current && productImageInputRef.current.click()}
                    className="border-2 border-dashed border-[#F7D6DF] hover:border-[#9E3F5C] bg-white hover:bg-[#FDF2F5]/50 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF] group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B2225]">Click to choose image file</p>
                      <p className="text-[11px] text-[#A09095]">PNG, JPG, WEBP, GIF (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Product description and formulation benefits..."
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-gray-100 text-[#5A4B50] text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-semibold shadow-pink-glow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Category Taxonomy</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
            </div>

            {categoryFormError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl text-center">
                {categoryFormError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Moisturizers & Hydrators"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category Key (URL slug)</label>
                <input 
                  type="text"
                  placeholder="e.g. moisturizers"
                  value={categoryFormData.key}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, key: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-gray-100 text-[#5A4B50] text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-semibold shadow-pink-glow"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Delete Product?</h3>
            <p className="text-xs text-[#5A4B50]">
              Are you sure you want to delete <strong>"{deleteProductConfirm.name}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteProductConfirm(null)}
                className="px-5 py-2 rounded-full bg-gray-200 text-[#2B2225] text-xs font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeleteProduct}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteCategoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Delete Category?</h3>
            <p className="text-xs text-[#5A4B50]">
              Are you sure you want to delete <strong>"{deleteCategoryConfirm.category.name}"</strong>?
              {deleteCategoryConfirm.productCount > 0 && (
                <span className="block text-rose-700 font-semibold mt-1">
                  Warning: {deleteCategoryConfirm.productCount} product(s) currently belong to this category.
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
                className="px-5 py-2 rounded-full bg-gray-200 text-[#2B2225] text-xs font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeleteCategory}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
