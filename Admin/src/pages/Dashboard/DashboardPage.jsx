import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Truck, 
  Eye, 
  ChevronRight,
  TrendingUp,
  Package,
  CheckCircle2,
  X
} from 'lucide-react';

export default function DashboardPage({ 
  allOrders = [], 
  users = [], 
  products = [],
  setActiveTab,
  onUpdateOrderStatus,
  showToast
}) {
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

  const registeredCustomers = users.filter(u => u.role !== 'admin');
  const totalSalesAmount = allOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? Number(o.total || 0) : 0), 0);
  const totalOrdersCount = allOrders.length;
  const deliveredOrdersCount = allOrders.filter(o => o.status === 'Delivered').length;
  const totalCustomersCount = registeredCustomers.length;
  const recentOrdersList = allOrders.slice(0, 5);

  const statusColorMap = {
    Pending: 'bg-[#FFF9F5] text-[#B88A3B] border-[#E8D3A5]',
    Confirmed: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Processing: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Shipped: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Delivered: 'bg-[#9E3F5C] text-white border-[#9E3F5C]',
    Cancelled: 'bg-[#2B2225] text-white border-[#2B2225]'
  };

  // Compute Top Products ordered counts
  const productOrderCounts = {};
  allOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const title = item.title || item.name || 'Product';
        productOrderCounts[title] = (productOrderCounts[title] || 0) + (item.quantity || 1);
      });
    }
  });

  const topProductsList = Object.entries(productOrderCounts)
    .map(([title, qty]) => ({ title, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Default display top products if none ordered yet
  const displayTopProducts = topProductsList.length > 0 ? topProductsList : products.slice(0, 4).map(p => ({ title: p.name, qty: 1 }));

  // Compute Real-time Weekly Sales Breakdown from allOrders
  const weeklySales = [0, 0, 0, 0];
  allOrders.forEach(order => {
    if (order.status === 'Cancelled') return;
    const amount = Number(order.total || 0);
    const dateObj = order.createdAt ? new Date(order.createdAt) : new Date();
    const day = dateObj.getDate();

    if (day <= 7) weeklySales[0] += amount;
    else if (day <= 14) weeklySales[1] += amount;
    else if (day <= 21) weeklySales[2] += amount;
    else weeklySales[3] += amount;
  });

  const maxWeeklySales = Math.max(...weeklySales, 100);
  const chartMaxScale = Math.ceil(maxWeeklySales / 500) * 500 || 1000;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dashboard Overview Title */}
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-2xl font-bold text-[#2B2225] tracking-tight">Dashboard Overview</h2>
      </div>

      {/* New Orders Pending Alert Banner */}
      {allOrders.filter(o => o.status === 'Pending').length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FFF9F5] border-2 border-[#9E3F5C] shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9E3F5C] text-white flex items-center justify-center font-bold shadow-pink-glow flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-[#9E3F5C]">
                {allOrders.filter(o => o.status === 'Pending').length} New Order(s) Awaiting Confirmation!
              </h3>
              <p className="text-xs text-[#5A4B50]">
                Customer orders have been placed and require admin verification.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-bold shadow-pink-glow transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0"
          >
            <span>Review Orders Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Stat Cards in 1 Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* TOTAL ORDERS REVENUE */}
        <div className="bg-white border border-[#F7D6DF] p-6 rounded-2xl shadow-luxury flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <p className="font-sans text-[11px] text-[#A09095] font-bold uppercase tracking-wider">TOTAL ORDERS REVENUE</p>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#D4AF6A]">${totalSalesAmount}</h3>
            <p className="text-[11px] text-[#5A4B50] font-medium">0% from last month</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="bg-white border border-[#F7D6DF] p-6 rounded-2xl shadow-luxury flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <p className="font-sans text-[11px] text-[#A09095] font-bold uppercase tracking-wider">TOTAL ORDERS</p>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#2B2225]">{totalOrdersCount}</h3>
            <p className="text-[11px] text-[#5A4B50] font-medium">0% from last month</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* DELIVERED ORDERS */}
        <div className="bg-white border border-[#F7D6DF] p-6 rounded-2xl shadow-luxury flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <p className="font-sans text-[11px] text-[#A09095] font-bold uppercase tracking-wider">DELIVERED ORDERS</p>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#9E3F5C]">{deliveredOrdersCount}</h3>
            <p className="text-[11px] text-[#5A4B50] font-medium">0% from last month</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* CUSTOMERS */}
        <div className="bg-white border border-[#F7D6DF] p-6 rounded-2xl shadow-luxury flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="space-y-1">
            <p className="font-sans text-[11px] text-[#A09095] font-bold uppercase tracking-wider">CUSTOMERS</p>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#2B2225]">{totalCustomersCount}</h3>
            <p className="text-[11px] text-[#9E3F5C] font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +300% from last month
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Middle Grid Row: Monthly Orders Overview (Left) + Top Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Monthly Orders Overview Chart */}
        <div className="lg:col-span-8 bg-white border border-[#F7D6DF] rounded-2xl p-6 sm:p-7 shadow-luxury space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Monthly Orders Overview</h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A4B50]">
              <span className="w-3 h-3 bg-[#9E3F5C] rounded-sm"></span>
              <span>Sales ($)</span>
            </div>
          </div>

          {/* Visual Sales Analytics Chart Frame */}
          <div className="relative h-64 w-full bg-[#FFF9F5] rounded-xl border border-[#F7D6DF] p-4 flex flex-col justify-between">
            <div className="flex justify-between text-[11px] text-[#A09095] border-b border-[#F7D6DF]/60 pb-1 font-mono font-bold">
              <span>${chartMaxScale.toLocaleString()}</span>
              <span>${Math.round(chartMaxScale * 0.75).toLocaleString()}</span>
              <span>${Math.round(chartMaxScale * 0.5).toLocaleString()}</span>
              <span>${Math.round(chartMaxScale * 0.25).toLocaleString()}</span>
              <span>$0</span>
            </div>

            {/* Bars Visualization */}
            <div className="flex items-end justify-between h-40 pt-4 px-4 gap-3">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((wk, idx) => {
                const salesVal = weeklySales[idx];
                const heightPercent = chartMaxScale > 0 ? (salesVal / chartMaxScale) * 100 : 0;
                const barHeight = salesVal > 0 ? `${Math.max(heightPercent, 6)}%` : '4px';

                return (
                  <div key={wk} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    <div 
                      className={`w-full max-w-[56px] rounded-t-lg transition-all duration-500 shadow-xs relative flex flex-col justify-start items-center ${
                        salesVal > 0 
                          ? 'bg-gradient-to-t from-[#9E3F5C] to-[#D96B8A] group-hover:from-[#7C2F47] group-hover:to-[#9E3F5C]' 
                          : 'bg-[#F7D6DF]/60'
                      }`}
                      style={{ height: barHeight }}
                    >
                      {/* Tooltip & Value Badge */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2B2225] text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-md whitespace-nowrap z-20">
                        ${salesVal.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] font-bold text-[#2B2225] block">{wk}</span>
                      <span className="text-[10px] text-[#9E3F5C] font-extrabold">${salesVal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Top Products List */}
        <div className="lg:col-span-4 bg-white border border-[#F7D6DF] rounded-2xl p-6 sm:p-7 shadow-luxury space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Top Products</h3>
            <p className="text-xs text-[#5A4B50]">Highest ordered formulations</p>
          </div>

          <div className="divide-y divide-[#F7D6DF]/60 text-xs">
            {displayTopProducts.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-2">
                <span className="font-semibold text-[#2B2225] truncate">{item.title}</span>
                <span className="font-bold text-[#9E3F5C] flex-shrink-0">{item.qty} Orders</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="w-full py-2.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] font-sans text-xs font-bold border border-[#F7D6DF] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer text-center"
          >
            View All Products
          </button>
        </div>

      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white border border-[#F7D6DF] rounded-2xl p-6 sm:p-8 shadow-luxury space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans text-xl font-bold text-[#2B2225]">Recent Orders</h2>
            <p className="text-xs text-[#5A4B50]">Latest order submissions from customer checkouts</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#9E3F5C] hover:underline flex items-center gap-1 cursor-pointer"
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
                  <tr key={order._id || order.id || order.orderId} className="hover:bg-[#FFF9F5] transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#9E3F5C]">{order.orderId || order._id || order.id}</td>
                    <td className="py-3.5 px-3 font-medium">
                      {order.shippingAddress?.name || order.userEmail || 'Valued Customer'}
                    </td>
                    <td className="py-3.5 px-3 text-[#5A4B50]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : order.date || '-'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#D4AF6A]">${order.total}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColorMap[order.status] || 'bg-[#FDF2F5]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="p-1.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
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
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Order #{selectedOrderDetails.orderId || selectedOrderDetails._id || selectedOrderDetails.id}</h2>
              <p className="text-xs text-[#5A4B50]">Placed on {selectedOrderDetails.createdAt ? new Date(selectedOrderDetails.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : selectedOrderDetails.date || '-'}</p>
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
                    if (onUpdateOrderStatus) onUpdateOrderStatus(selectedOrderDetails._id || selectedOrderDetails.id, newStatus);
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
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#F7D6DF]" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#2B2225]">{item.title}</p>
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
                <p className="text-xs font-medium text-[#2B2225]">{selectedOrderDetails.paymentMethod || 'Credit Card'}</p>
                <p className="text-xs text-[#9E3F5C] font-bold">Total Paid: ${selectedOrderDetails.total}</p>
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
