import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  Bell,
  CheckCheck,
  ChevronRight,
  Sparkles,
  X,
  Clock
} from 'lucide-react';

export default function AdminNavbar({ 
  currentUser, 
  onLogout, 
  onOpenMobileMenu, 
  pendingOrdersCount = 0,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  onNavigateToOrders
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (onMarkNotificationRead) onMarkNotificationRead(notification.id);
    setShowDropdown(false);
    if (onNavigateToOrders) onNavigateToOrders();
  };

  return (
    <header className="bg-white border-b border-[#F7D6DF] px-6 py-4 shadow-sm flex items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Left Title Area */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] cursor-pointer hover:bg-[#9E3F5C] hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-sans text-2xl font-bold text-[#2B2225] tracking-tight">
            Miss Nous
          </h1>
          <p className="text-xs text-[#5A4B50] hidden sm:block">Skincare Admin Management Portal</p>
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-all cursor-pointer relative shadow-xs"
            title="Order Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9E3F5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#F7D6DF] rounded-3xl shadow-2xl z-50 overflow-hidden animate-fade-in space-y-0">
              
              {/* Dropdown Header */}
              <div className="p-4 bg-[#FFF9F5] border-b border-[#F7D6DF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-bold text-[#2B2225] uppercase tracking-wider">Order Notifications</h3>
                    <p className="text-[10px] text-[#5A4B50]">{unreadCount} unread order alert{unreadCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      if (onClearNotifications) onClearNotifications();
                    }}
                    className="text-[11px] font-semibold text-[#9E3F5C] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Notifications Scroll List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#F7D6DF]/40">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 transition-colors cursor-pointer flex items-start gap-3 hover:bg-[#FFF9F5] ${
                        !n.isRead ? 'bg-[#FDF2F5]/50' : 'bg-white'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-pink-glow">
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#2B2225] truncate">
                            New Order #{n.orderId}
                          </h4>
                          <span className="text-[10px] text-[#A09095] font-medium flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {n.timeAgo || 'Just now'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A4B50] line-clamp-1">
                          From <strong>{n.customerName || 'Customer'}</strong> • <span className="text-[#9E3F5C] font-bold">${n.total}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A09095] flex-shrink-0 self-center" />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-[#A09095] flex items-center justify-center mx-auto">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#2B2225]">No New Notifications</p>
                    <p className="text-[11px] text-[#5A4B50]">New order alerts will appear here in real-time when placed by customers.</p>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-3 bg-[#FFF9F5] border-t border-[#F7D6DF] text-center">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    if (onNavigateToOrders) onNavigateToOrders();
                  }}
                  className="w-full py-2 rounded-xl bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Go to Orders Management</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Far Right Logo Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2B2225] text-[#D4AF6A] flex items-center justify-center font-serif font-bold text-sm border-2 border-[#D4AF6A] shadow-md flex-shrink-0">
          MN
        </div>
      </div>

    </header>
  );
}
