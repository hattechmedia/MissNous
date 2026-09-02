import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';

export default function OrdersPage({ 
  allOrders = [], 
  onUpdateOrderStatus, 
  showToast 
}) {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Lock outer page scroll when modal is open
  React.useEffect(() => {
    if (selectedOrderDetails) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedOrderDetails]);

  const statusColorMap = {
    Pending: 'bg-[#FFF9F5] text-[#B88A3B] border-[#E8D3A5]',
    Confirmed: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Processing: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Shipped: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Delivered: 'bg-[#9E3F5C] text-white border-[#9E3F5C]',
    Cancelled: 'bg-[#2B2225] text-white border-[#2B2225]'
  };

  const statuses = ['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrdersList = allOrders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    const oid = (o.orderId || o._id || '').toString().toLowerCase();
    const matchesQuery = !q || 
      oid.includes(q) || 
      (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(q)) ||
      (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase().includes(q)) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order Management</h2>
          <p className="text-xs text-[#5A4B50]">View & update customer order status in real-time</p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C] self-start sm:self-auto">
          Total Orders: {allOrders.length}
        </span>
      </div>

      {/* Search Bar & Status Filter Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search orders by Order ID (ORD-2026-XXXX), customer name, or email..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full md:w-auto">
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C] focus:outline-none focus:border-[#9E3F5C] cursor-pointer shadow-xs"
          >
            {statuses.map(st => {
              const count = st === 'all' ? allOrders.length : allOrders.filter(o => o.status === st).length;
              const labelName = st === 'all' ? 'All Orders' : st;
              return (
                <option key={st} value={st}>
                  {labelName} ({count})
                </option>
              );
            })}
          </select>
        </div>
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
              <tr key={order._id} className="hover:bg-[#FFF9F5] transition-colors">
                <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">{order.orderId || order._id}</td>
                <td className="py-3.5 px-3 font-medium">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-bold flex items-center justify-center text-xs border border-[#F7D6DF]">
                      {(order.shippingAddress?.name || order.userEmail || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#2B2225]">{order.shippingAddress?.name || order.userEmail}</p>
                      <p className="text-[11px] text-[#5A4B50]">{order.shippingAddress?.email || order.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#5A4B50]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                <td className="py-3.5 px-3 font-bold text-[#D4AF6A]">${order.total}</td>
                <td className="py-3.5 px-3">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (onUpdateOrderStatus) onUpdateOrderStatus(order._id, newStatus);
                      if (showToast) showToast(`Order ${order.orderId} status updated to ${newStatus}`);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${statusColorMap[order.status] || 'bg-[#FDF2F5]'}`}
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
                    className="px-3.5 py-1.5 rounded-full bg-[#9E3F5C] text-white hover:bg-[#7C2F47] text-xs font-semibold shadow-pink-glow transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS INVOICE MODAL (Rendered at document.body level via Portal for 100% full screen backdrop) */}
      {selectedOrderDetails && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#FFF9F5] border-0 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Admin Order Breakdown</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order #{selectedOrderDetails.orderId || selectedOrderDetails._id}</h2>
              <p className="text-xs text-[#5A4B50]">Placed on {selectedOrderDetails.createdAt ? new Date(selectedOrderDetails.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</p>
            </div>

            {/* Quick Status Updater */}
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
                    if (onUpdateOrderStatus) onUpdateOrderStatus(selectedOrderDetails._id, newStatus);
                    setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
                    if (showToast) showToast(`Order status updated to ${newStatus}`);
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
                <div className="absolute top-3.5 sm:top-4 left-[10%] right-[10%] h-0.5 bg-[#F7D6DF] -translate-y-1/2 z-0">
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
                          isDone ? 'bg-[#9E3F5C] text-white shadow-pink-glow scale-105' : 'bg-[#FDF2F5] text-[#A09095]'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                        </div>
                        <span className={isDone ? 'text-[#9E3F5C]' : 'text-[#A09095]'}>{step}</span>
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
                      <img src={item.image} alt={item.name || item.title} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF]" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#2B2225]">{item.name || item.title}</p>
                        <p className="text-xs text-[#5A4B50]">Quantity: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#D4AF6A]">${item.price * item.quantity}</p>
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
                <p className="text-xs font-medium text-[#2B2225]">{selectedOrderDetails.paymentMethod || 'Cash on Delivery'}</p>
                <p className="text-xs text-[#9E3F5C] font-bold">Total: ${selectedOrderDetails.total}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-3 rounded-full bg-[#9E3F5C] text-white text-xs font-bold shadow-pink-glow hover:bg-[#7C2F47] transition-colors cursor-pointer"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
