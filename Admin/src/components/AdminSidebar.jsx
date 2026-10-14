import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  X,
  CreditCard,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import logoIcon from '../assets/logo-icon.png';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  productsCount = 0, 
  categoriesCount = 0, 
  pendingOrdersCount = 0, 
  customersCount = 0, 
  paymentsCount = 0,
  blogsCount = 0,
  inquiriesCount = 0,
  unreadInquiriesCount = 0,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
  currentUser
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: productsCount },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: categoriesCount },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : null },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: paymentsCount },
    { id: 'customers', label: 'Customers', icon: Users, count: customersCount },
    { id: 'inquiries', label: 'Contact Queries', icon: MessageSquare, badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} New` : null, count: unreadInquiriesCount === 0 && inquiriesCount > 0 ? inquiriesCount : null },
    { id: 'blogs', label: 'Blog Manager', icon: BookOpen, count: blogsCount }
  ];

  const sidebarContent = (
    <div className="w-64 h-full bg-[#2B2225] text-white flex flex-col justify-between p-4 sm:p-5 select-none relative overflow-y-auto no-scrollbar">
      
      <div className="space-y-6">
        
        {/* Top Brand Logo Section */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-md">
              <img src={logoIcon} alt="Miss Nous" className="w-full h-full object-contain" />
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
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9E3F5C] text-white border border-[#D4AF6A]/30">
                    {item.badge}
                  </span>
                )}
                {!item.badge && item.count !== undefined && item.count !== null && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
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
