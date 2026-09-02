import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck,
  X,
  Sparkles,
  CreditCard,
  ChevronUp
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  productsCount = 0, 
  categoriesCount = 0, 
  pendingOrdersCount = 0, 
  customersCount = 0, 
  paymentsCount = 0,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
  currentUser
}) {
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: productsCount },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: categoriesCount },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : null },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: paymentsCount },
    { id: 'customers', label: 'Customers', icon: Users, count: customersCount }
  ];

  const sidebarContent = (
    <div className="w-64 h-full bg-[#2B2225] text-white flex flex-col justify-between p-4 sm:p-5 select-none relative overflow-y-auto no-scrollbar">
      
      <div className="space-y-6">
        
        {/* Top Brand Logo Section */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF6A] to-[#B88A3B] text-[#2B2225] flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#D4AF6A] leading-tight tracking-wide">Miss Nous</h2>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>

          {setMobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List matching reference structure */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#9E3F5C] text-white shadow-pink-glow border-l-4 border-[#D4AF6A]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#D4AF6A]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Admin User Widget with Interactive Dropdown Popup */}
      <div className="pt-4 border-t border-white/10 px-2 relative">
        {/* Profile Card Button */}
        <button
          type="button"
          onClick={() => setShowAdminMenu(!showAdminMenu)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-left border border-white/10 group"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF6A] to-[#B88A3B] text-[#2B2225] font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Super Admin'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">ADMIN</span>
              </div>
            </div>
          </div>

          <ChevronUp className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Popup Menu */}
        {showAdminMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-2 bg-[#2B2225] border border-white/15 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-fade-in">
            <button
              onClick={() => {
                setActiveTab('settings');
                setShowAdminMenu(false);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="w-full px-3 py-2.5 rounded-xl font-sans text-xs font-semibold flex items-center gap-2.5 text-gray-200 hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#D4AF6A]" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => {
                setShowAdminMenu(false);
                onLogout();
              }}
              className="w-full px-3 py-2.5 rounded-xl font-sans text-xs font-semibold flex items-center gap-2.5 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Full Height) */}
      <aside className="hidden lg:block w-64 h-full flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs lg:hidden flex justify-start animate-fade-in">
          <div className="w-64 max-w-full h-full" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
