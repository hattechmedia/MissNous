import React, { useState, useRef } from 'react';
import { 
  User, 
  Package, 
  LayoutDashboard, 
  Lock, 
  LogOut, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  ArrowRight, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  ShoppingBag,
  Trash2
} from 'lucide-react';

export default function UserPanel({ 
  currentUser, 
  onLogout, 
  onUpdateUser, 
  orders = [], 
  onNavigate,
  activeTab: propActiveTab = 'dashboard'
}) {
  const [activeTab, setActiveTab] = useState(propActiveTab);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+92 300 1234567',
    address: currentUser?.address || 'House 42, Block 5, Gulberg III',
    city: currentUser?.city || 'Lahore',
    country: currentUser?.country || 'Pakistan'
  });

  // Password Form State
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

  // Profile Photo Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      onUpdateUser({ ...currentUser, avatar: imageUrl });
      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdateUser({ ...currentUser, avatar: null });
    showToast('Profile photo removed.');
  };

  // Profile Save Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      country: profileData.country
    });
    showToast('Profile information saved successfully!');
  };

  // Password Update Handler
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
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

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password updated successfully!');
  };

  // Status Step Helper
  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  // Calculate Order Statistics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Shipped').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const recentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen pt-28 pb-20 px-4 sm:px-8 lg:px-16 font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#9E3F5C] text-[#FFF9F5] px-6 py-3.5 rounded-2xl shadow-luxury font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-up border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-[#E8D3A5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User Account Page Header */}
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] p-6 sm:p-8 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7D6DF]/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-5 z-10 text-center sm:text-left">
            {/* User Avatar Circle */}
            <div className="relative group">
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#F7D6DF] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center border-4 border-[#F7D6DF] shadow-md">
                  <User className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#9E3F5C] text-[#FFF9F5] flex items-center justify-center border-2 border-white shadow-xs hover:bg-[#7C2F47] transition-all cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#F7D6DF]">
                <Sparkles className="w-3 h-3 text-[#9E3F5C]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E3F5C]">Customer Portal</span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225] tracking-tight">
                {currentUser?.name || 'Valued Guest'}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#5A4B50] font-normal">
                {currentUser?.email || 'guest@missnous.com'} • {currentUser?.phone || '+92 300 1234567'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => onNavigate && onNavigate('shop')}
              className="px-5 py-2.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-sans text-xs font-semibold hover:bg-[#F7D6DF] transition-colors border border-[#F7D6DF] flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Shop</span>
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

        {/* Main Content Layout: Sidebar Navigation + Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 bg-white border border-[#F7D6DF] rounded-[2rem] p-3 shadow-luxury space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              {orders.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-white text-[#9E3F5C]' : 'bg-[#F7D6DF] text-[#9E3F5C]'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full px-4 py-3 rounded-2xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all duration-300 ${
                activeTab === 'password'
                  ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-pink-glow'
                  : 'text-[#2B2225] hover:bg-[#FDF2F5] hover:text-[#9E3F5C]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
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

          {/* Right Tab Content Area */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: DASHBOARD / OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 3 Quick Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  
                  {/* Card 1: Total Orders */}
                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-[#FFF9F5] text-[#D4AF6A] border border-[#E8D3A5] flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Total Orders</p>
                    <h3 className="font-sans text-3xl font-bold text-[#2B2225]">{totalOrdersCount}</h3>
                  </div>

                  {/* Card 2: Active / Pending Orders */}
                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Active / Pending</p>
                    <h3 className="font-sans text-3xl font-bold text-[#9E3F5C]">{pendingOrdersCount}</h3>
                  </div>

                  {/* Card 3: Delivered Orders */}
                  <div className="bg-white border border-[#F7D6DF] p-6 rounded-[2rem] shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-xs text-[#5A4B50] font-semibold uppercase tracking-wider">Delivered</p>
                    <h3 className="font-sans text-3xl font-bold text-emerald-600">{deliveredOrdersCount}</h3>
                  </div>

                </div>

                {/* Recent Order Summary Widget */}
                {recentOrder ? (
                  <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F7D6DF]/60 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#9E3F5C]">Recent Order Status</span>
                        <h3 className="font-sans text-lg font-bold text-[#2B2225]">Order #{recentOrder.id}</h3>
                        <p className="text-xs text-[#5A4B50]">Placed on {recentOrder.date}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] text-xs font-bold">
                          Status: {recentOrder.status}
                        </span>
                        <button
                          onClick={() => setSelectedOrderDetails(recentOrder)}
                          className="px-4 py-1.5 rounded-full bg-[#2B2225] text-[#FFF9F5] text-xs font-semibold hover:bg-[#9E3F5C] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Simple Progress Bar Timeline */}
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4B50]">Order Tracking Status</p>
                      <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs font-bold text-[#5A4B50]">
                        {statusSteps.map((step, idx) => {
                          const currentIdx = getStatusStepIndex(recentOrder.status);
                          const isDone = idx <= currentIdx;
                          return (
                            <div key={step} className="flex flex-col items-center gap-1.5">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                                isDone ? 'bg-[#9E3F5C] text-[#FFF9F5] shadow-xs' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                              </div>
                              <span className={isDone ? 'text-[#9E3F5C]' : 'text-gray-400'}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Products in recent order */}
                    <div className="divide-y divide-[#F7D6DF]/40 pt-2">
                      {recentOrder.items.map((item, i) => (
                        <div key={i} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF]" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-[#2B2225]">{item.title}</p>
                              <p className="text-xs text-[#5A4B50]">Qty: {item.quantity} • ${item.price}</p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-[#9E3F5C]">${item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-8 text-center space-y-4">
                    <Package className="w-12 h-12 text-[#9E3F5C] mx-auto opacity-50" />
                    <h3 className="font-sans text-lg font-bold text-[#2B2225]">No Orders Placed Yet</h3>
                    <p className="text-xs text-[#5A4B50] max-w-sm mx-auto">Browse our 100% organic intimate care collection and place your first order.</p>
                    <button
                      onClick={() => onNavigate && onNavigate('shop')}
                      className="px-6 py-2.5 rounded-full bg-[#9E3F5C] text-[#FFF9F5] text-xs font-semibold hover:bg-[#7C2F47] shadow-pink-glow"
                    >
                      Browse Products
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: MY ORDERS LIST & TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-sans text-2xl font-bold text-[#2B2225]">My Orders</h2>
                    <p className="text-xs text-[#5A4B50]">Track your orders & view order details</p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C]">
                    Total Orders: {orders.length}
                  </span>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const currentIdx = getStatusStepIndex(order.status);
                      return (
                        <div key={order.id} className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-luxury transition-all">
                          
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F7D6DF]/60 pb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-base font-bold text-[#2B2225]">Order #{order.id}</span>
                                <span className="px-3 py-0.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-[11px] font-bold border border-[#F7D6DF]">
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#5A4B50]">Date: {order.date} • Payment: {order.paymentMethod || 'Credit Card'}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[11px] text-[#A09095] block uppercase font-bold">Total Amount</span>
                                <span className="font-sans text-base font-bold text-[#9E3F5C]">${order.total}</span>
                              </div>
                              <button
                                onClick={() => setSelectedOrderDetails(order)}
                                className="px-4 py-2 rounded-full bg-[#2B2225] hover:bg-[#9E3F5C] text-[#FFF9F5] text-xs font-semibold transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Visual Status Indicator Bar */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between text-xs font-bold text-[#5A4B50]">
                              <span>Order Status Timeline</span>
                              <span className="text-[#9E3F5C]">Step {currentIdx + 1} of 5</span>
                            </div>

                            {/* Progress Line Bar */}
                            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#D4AF6A] to-[#9E3F5C] transition-all duration-500 rounded-full"
                                style={{ width: `${((currentIdx + 1) / statusSteps.length) * 100}%` }}
                              ></div>
                            </div>

                            <div className="grid grid-cols-5 gap-1 text-center text-[10px] sm:text-xs font-semibold text-[#5A4B50] pt-1">
                              {statusSteps.map((step, idx) => (
                                <span 
                                  key={step} 
                                  className={idx <= currentIdx ? 'text-[#9E3F5C] font-bold' : 'text-gray-400'}
                                >
                                  {step}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Items Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-[#FFF9F5] rounded-2xl border border-[#F7D6DF]/60">
                                <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF]" />
                                <div>
                                  <h4 className="font-sans text-xs font-bold text-[#2B2225]">{item.title}</h4>
                                  <p className="font-sans text-xs text-[#5A4B50]">Qty: {item.quantity} × ${item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-12 text-center space-y-4">
                    <Package className="w-12 h-12 text-[#9E3F5C] mx-auto opacity-50" />
                    <h3 className="font-sans text-lg font-bold text-[#2B2225]">No Orders Found</h3>
                    <p className="text-xs text-[#5A4B50]">You haven't placed any orders yet.</p>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: PROFILE SETTINGS & AVATAR UPLOAD */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-8 animate-fade-in">
                <div>
                  <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Profile Settings</h2>
                  <p className="text-xs text-[#5A4B50]">Manage your personal information & profile picture</p>
                </div>

                {/* Profile Picture Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl">
                  <div className="relative">
                    {currentUser?.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt="Profile Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#F7D6DF] shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white text-[#9E3F5C] flex items-center justify-center border-4 border-[#F7D6DF] shadow-md">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-center sm:text-left">
                    <h4 className="font-sans text-sm font-bold text-[#2B2225]">Profile Picture</h4>
                    <p className="text-xs text-[#5A4B50]">Upload a PNG, JPG, or JPEG image. It will appear on your navbar header avatar.</p>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Upload Photo
                      </button>
                      {currentUser?.avatar && (
                        <button
                          onClick={handleRemoveImage}
                          className="px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Edit Form */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                        Full Name
                      </label>
                      <input 
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                        Email Address
                      </label>
                      <input 
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                        Phone Number
                      </label>
                      <input 
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                        City
                      </label>
                      <input 
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                      />
                    </div>

                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#2B2225]">
                      Shipping Address
                    </label>
                    <textarea 
                      rows={3}
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FDF2F5]/50 border border-[#F7D6DF] font-sans text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="py-3 px-8 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold shadow-pink-glow transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB 4: CHANGE PASSWORD */}
            {activeTab === 'password' && (
              <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in max-w-xl">
                <div>
                  <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Change Password</h2>
                  <p className="text-xs text-[#5A4B50]">Update your account password for enhanced security</p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl text-center">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
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

                  <button
                    type="submit"
                    className="py-3 px-8 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold shadow-pink-glow transition-all cursor-pointer mt-2"
                  >
                    Update Password
                  </button>
                </form>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#FFF9F5] border border-[#F7D6DF] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Order Invoice Breakdown</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order #{selectedOrderDetails.id}</h2>
              <p className="text-xs text-[#5A4B50]">Placed on {selectedOrderDetails.date}</p>
            </div>

            {/* Order Progress Timeline */}
            <div className="bg-white p-5 rounded-3xl border border-[#F7D6DF] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#2B2225]">
                <span>Status Tracker</span>
                <span className="text-[#9E3F5C]">{selectedOrderDetails.status}</span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-center text-[10px] sm:text-xs font-bold">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStatusStepIndex(selectedOrderDetails.status);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isDone ? 'bg-[#9E3F5C] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                      </div>
                      <span className={isDone ? 'text-[#9E3F5C]' : 'text-gray-400'}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Itemized Products List */}
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

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-1">
                <h5 className="text-xs font-bold uppercase text-[#D4AF6A]">Shipping Destination</h5>
                <p className="text-xs font-medium text-[#2B2225]">{currentUser?.name}</p>
                <p className="text-xs text-[#5A4B50]">{currentUser?.address || 'House 42, Block 5, Gulberg III, Lahore'}</p>
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

    </div>
  );
}
