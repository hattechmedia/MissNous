import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Eye, X } from 'lucide-react';

export default function CustomersPage({ users = [], allOrders = [] }) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);

  // Lock outer page scroll when modal is open
  React.useEffect(() => {
    if (selectedCustomerDetails) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedCustomerDetails]);

  const statusColorMap = {
    Pending: 'bg-[#FFF9F5] text-[#B88A3B] border-[#E8D3A5]',
    Confirmed: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Processing: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Shipped: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Delivered: 'bg-[#9E3F5C] text-white border-[#9E3F5C]',
    Cancelled: 'bg-[#2B2225] text-white border-[#2B2225]'
  };

  const registeredCustomers = users.filter(u => u.role !== 'admin');
  const filteredCustomersList = registeredCustomers.filter(c => {
    const q = customerSearch.toLowerCase().trim();
    return !q || 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q));
  });

  const getCustomerOrders = (customerEmail) => {
    if (!customerEmail) return [];
    return allOrders.filter(o => o.userEmail && o.userEmail.toLowerCase().trim() === customerEmail.toLowerCase().trim());
  };

  const getCustomerTotalSpent = (customerEmail) => {
    const orders = getCustomerOrders(customerEmail);
    return orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? Number(o.total || 0) : 0), 0);
  };

  return (
    <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Customer Directory</h2>
          <p className="text-xs text-[#5A4B50]">Registered client accounts & purchasing statistics</p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C] self-start sm:self-auto">
          Total Customers: {registeredCustomers.length}
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Search by customer name, email, phone number, or city..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
        />
      </div>

      {/* Customer Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Contact</th>
              <th className="py-3 px-3">City</th>
              <th className="py-3 px-3">Total Orders</th>
              <th className="py-3 px-3">Total Spent</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7D6DF]/40 text-xs text-[#2B2225]">
            {filteredCustomersList.map(customer => {
              const orders = getCustomerOrders(customer.email);
              const totalSpent = getCustomerTotalSpent(customer.email);

              return (
                <tr key={customer.email || customer.name} className="hover:bg-[#FFF9F5] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold flex items-center justify-center text-xs border border-[#F7D6DF]">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-[#2B2225]">{customer.name}</p>
                        <p className="text-[11px] text-[#5A4B50]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#5A4B50] font-medium">{customer.phone || 'N/A'}</td>
                  <td className="py-3.5 px-3 text-[#5A4B50]">{customer.city || 'Karachi'}</td>
                  <td className="py-3.5 px-3 font-semibold">{orders.length} orders</td>
                  <td className="py-3.5 px-3 font-bold text-[#D4AF6A]">${totalSpent}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedCustomerDetails({ customer, orders, totalSpent })}
                      className="px-3.5 py-1.5 rounded-full bg-[#9E3F5C] text-white hover:bg-[#7C2F47] text-xs font-semibold shadow-pink-glow transition-all cursor-pointer"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CUSTOMER HISTORY MODAL (Rendered at document.body level via Portal for 100% full screen backdrop) */}
      {selectedCustomerDetails && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#FFF9F5] border-0 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCustomerDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Customer Profile & Order History</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">{selectedCustomerDetails.customer.name}</h2>
              <p className="text-xs text-[#5A4B50]">
                {selectedCustomerDetails.customer.email} • {selectedCustomerDetails.customer.phone || 'No phone'}
              </p>
              
              {/* Customer Saved Address */}
              <div className="pt-1 text-xs text-[#5A4B50] flex items-center gap-1.5 font-medium">
                <span className="font-bold text-[#9E3F5C]">Default Address:</span>
                <span>
                  {(() => {
                    const c = selectedCustomerDetails.customer;
                    const parts = [c.address, c.city, c.country].filter(Boolean);
                    return parts.length > 0 ? parts.join(', ') : 'No default address recorded';
                  })()}
                </span>
              </div>
            </div>

            {/* Lifetime Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF]">
                <span className="text-[11px] font-bold text-[#A09095] uppercase">Total Orders</span>
                <p className="font-sans text-xl font-bold text-[#2B2225] mt-1">{selectedCustomerDetails.orders.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF]">
                <span className="text-[11px] font-bold text-[#A09095] uppercase">Lifetime Spend</span>
                <p className="font-sans text-xl font-bold text-[#D4AF6A] mt-1">${selectedCustomerDetails.totalSpent}</p>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2B2225]">Purchasing History</h4>
              
              {selectedCustomerDetails.orders.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedCustomerDetails.orders.map(order => {
                    const orderIdDisplay = order.orderId || order._id || order.id;
                    const dateDisplay = order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                      : order.date || '-';

                    const shippingAddr = order.shippingAddress;
                    const addressString = shippingAddr && (shippingAddr.address || shippingAddr.city)
                      ? [shippingAddr.address, shippingAddr.city, shippingAddr.postalCode, shippingAddr.country].filter(Boolean).join(', ')
                      : null;

                    return (
                      <div key={order._id || order.id || order.orderId} className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#9E3F5C]">Order #{orderIdDisplay}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${statusColorMap[order.status] || 'bg-[#FDF2F5]'}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5A4B50] gap-1">
                          <span><strong>Date:</strong> {dateDisplay}</span>
                          <span className="font-bold text-[#D4AF6A]">${order.total}</span>
                        </div>

                        {addressString && (
                          <div className="text-[11px] text-[#5A4B50] pt-1 border-t border-[#F7D6DF]/40">
                            <strong>Shipping Address:</strong> {addressString}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#5A4B50] italic py-2">No orders recorded for this customer yet.</p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="w-full py-3 rounded-full bg-[#9E3F5C] text-white text-xs font-bold shadow-pink-glow hover:bg-[#7C2F47] transition-colors cursor-pointer"
              >
                Close Customer Profile
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
