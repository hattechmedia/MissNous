import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Eye, 
  CreditCard, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Clock,
  ShieldCheck,
  Building2,
  Wallet
} from 'lucide-react';

export default function PaymentsPage({ 
  allOrders = [], 
  onUpdatePaymentStatus, 
  showToast 
}) {
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [refundConfirm, setRefundConfirm] = useState(null);

  // Lock outer page scroll when modal is open
  React.useEffect(() => {
    if (selectedPaymentDetails || refundConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedPaymentDetails, refundConfirm]);

  // Derive Payments 1-to-1 directly from Orders
  const paymentsList = allOrders.map(order => {
    const oid = order.orderId || order._id || '';
    const payId = `PAY-${oid.toString().replace(/[^a-zA-Z0-9]/g, '').slice(-6)}`;
    
    let pStatus = order.paymentStatus;
    if (!pStatus) {
      if (order.status === 'Cancelled') pStatus = 'Refunded';
      else if (order.status === 'Delivered' || order.status === 'Shipped') pStatus = 'Paid';
      else pStatus = 'Pending';
    }

    const txnRef = order.txnRef || `TXN-${oid.toString().replace(/[^0-9a-zA-Z]/g, '').slice(-6) || Date.now().toString().slice(-6)}`;

    return {
      paymentId: payId,
      orderId: oid,
      _id: order._id,
      customerName: order.shippingAddress?.name || order.userEmail || 'Valued Customer',
      customerEmail: order.shippingAddress?.email || order.userEmail || 'N/A',
      customerPhone: order.shippingAddress?.phone || order.phone || 'N/A',
      amount: Number(order.total || 0),
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      paymentStatus: pStatus,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
      txnRef: txnRef,
      originalOrder: order
    };
  });

  const paymentStatusColorMap = {
    Paid: 'bg-[#FDF2F5] text-[#9E3F5C] border-[#F7D6DF]',
    Pending: 'bg-[#FFF9F5] text-[#B88A3B] border-[#E8D3A5]',
    Failed: 'bg-[#2B2225] text-white border-[#2B2225]',
    Refunded: 'bg-[#FDF2F5] text-[#7C2F47] border-[#9E3F5C]'
  };

  const paymentMethodIconMap = {
    'Cash on Delivery': Wallet,
    'Bank Transfer': Building2,
    'Online Payment': CreditCard,
    'Credit Card': CreditCard
  };

  const filteredPayments = paymentsList.filter(p => {
    const matchesStatus = paymentStatusFilter === 'all' || p.paymentStatus === paymentStatusFilter;
    const matchesMethod = paymentMethodFilter === 'all' || p.paymentMethod === paymentMethodFilter;
    const q = paymentSearch.toLowerCase().trim();
    const matchesQuery = !q || 
      p.paymentId.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q) ||
      p.txnRef.toLowerCase().includes(q);

    return matchesStatus && matchesMethod && matchesQuery;
  });

  // Calculate summary metrics
  const totalPaidAmount = paymentsList
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsAmount = paymentsList
    .filter(p => p.paymentStatus === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = paymentsList
    .filter(p => p.paymentStatus === 'Refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleUpdateStatus = (mongoId, newStatus) => {
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(mongoId, newStatus);
    }
    if (selectedPaymentDetails && selectedPaymentDetails._id === mongoId) {
      setSelectedPaymentDetails(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
    }
    if (showToast) {
      showToast(`Payment status updated to ${newStatus}`);
    }
  };

  const handleExecuteRefund = () => {
    if (refundConfirm) {
      handleUpdateStatus(refundConfirm._id, 'Refunded');
      if (showToast) {
        showToast(`Payment ${refundConfirm.paymentId} refunded successfully.`);
      }
    }
    setRefundConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#2B2225] tracking-tight">Payments</h2>
            <p className="text-xs text-[#5A4B50]">Manage payment transactions connected to customer orders.</p>
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-white border border-[#F7D6DF] text-xs font-bold text-[#9E3F5C] shadow-xs self-start sm:self-auto">
          Total Transactions: {paymentsList.length}
        </span>
      </div>

      {/* 3 Payment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white border border-[#F7D6DF] p-5 rounded-2xl shadow-luxury space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A09095] uppercase tracking-wider">Total Paid</span>
            <div className="w-8 h-8 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center border border-[#F7D6DF]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-2xl font-bold text-[#9E3F5C]">${totalPaidAmount}</h3>
          <p className="text-[11px] text-[#5A4B50]">Completed payments received</p>
        </div>

        <div className="bg-white border border-[#F7D6DF] p-5 rounded-2xl shadow-luxury space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A09095] uppercase tracking-wider">Pending Payments</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF9F5] text-[#D4AF6A] flex items-center justify-center border border-[#E8D3A5]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-2xl font-bold text-[#D4AF6A]">${pendingPaymentsAmount}</h3>
          <p className="text-[11px] text-[#5A4B50]">Awaiting payment confirmation</p>
        </div>

        <div className="bg-white border border-[#F7D6DF] p-5 rounded-2xl shadow-luxury space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A09095] uppercase tracking-wider">Refunded Amount</span>
            <div className="w-8 h-8 rounded-full bg-[#FDF2F5] text-[#7C2F47] flex items-center justify-center border border-[#F7D6DF]">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sans text-2xl font-bold text-[#7C2F47]">${refundedAmount}</h3>
          <p className="text-[11px] text-[#5A4B50]">Total refunded to customers</p>
        </div>

      </div>

      {/* Toolbar: Search, Status Filter, Method Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by Payment ID, Order ID, customer, or Ref ID..."
            value={paymentSearch}
            onChange={(e) => setPaymentSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] cursor-pointer shadow-xs"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] cursor-pointer shadow-xs"
          >
            <option value="all">All Payment Methods</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>
      </div>

      {/* Showing Count Label */}
      <div className="text-xs text-[#5A4B50] font-medium">
        Showing {filteredPayments.length} of {paymentsList.length} payment records
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#F7D6DF] rounded-2xl shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[#F7D6DF] bg-[#FFF9F5] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                <th className="py-3.5 px-4">PAYMENT ID</th>
                <th className="py-3.5 px-4">ORDER ID</th>
                <th className="py-3.5 px-4">CUSTOMER NAME</th>
                <th className="py-3.5 px-4">AMOUNT</th>
                <th className="py-3.5 px-4">PAYMENT METHOD</th>
                <th className="py-3.5 px-4">PAYMENT STATUS</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7D6DF]/50 text-xs text-[#2B2225]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map(pay => {
                  const MethodIcon = paymentMethodIconMap[pay.paymentMethod] || CreditCard;

                  return (
                    <tr key={pay.paymentId} className="hover:bg-[#FFF9F5] transition-colors">
                      
                      {/* Payment ID */}
                      <td className="py-4 px-4 font-bold text-[#9E3F5C]">
                        {pay.paymentId}
                      </td>

                      {/* Order ID */}
                      <td className="py-4 px-4 font-semibold text-[#2B2225]">
                        {pay.orderId}
                      </td>

                      {/* Customer Name */}
                      <td className="py-4 px-4 font-medium">
                        <div>
                          <p className="font-bold text-[#2B2225]">{pay.customerName}</p>
                          <p className="text-[11px] text-[#5A4B50]">{pay.customerEmail}</p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-bold text-[#D4AF6A]">
                        ${pay.amount}
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4B50]">
                          <MethodIcon className="w-4 h-4 text-[#9E3F5C]" />
                          <span>{pay.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Payment Status Selector Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={pay.paymentStatus}
                          onChange={(e) => handleUpdateStatus(pay.orderId, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${paymentStatusColorMap[pay.paymentStatus] || 'bg-[#FDF2F5]'}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-[#5A4B50]">
                        {pay.date}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedPaymentDetails(pay)}
                          className="px-3.5 py-1.5 rounded-full bg-[#9E3F5C] text-white hover:bg-[#7C2F47] text-xs font-semibold shadow-pink-glow transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#5A4B50]">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT DETAILS MODAL (Rendered at document.body level via Portal for 100% full screen backdrop) */}
      {selectedPaymentDetails && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-[#FFF9F5] border-0 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPaymentDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F7D6DF] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Payment Transaction Record</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">{selectedPaymentDetails.paymentId}</h2>
              <p className="text-xs text-[#5A4B50]">Connected to Order #{selectedPaymentDetails.orderId}</p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#A09095]">Payment Status</span>
                <div className="pt-1">
                  <select
                    value={selectedPaymentDetails.paymentStatus}
                    onChange={(e) => handleUpdateStatus(selectedPaymentDetails.orderId, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${paymentStatusColorMap[selectedPaymentDetails.paymentStatus]}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F7D6DF] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#A09095]">Total Amount</span>
                <p className="font-sans text-lg font-bold text-[#D4AF6A]">${selectedPaymentDetails.amount}</p>
              </div>
            </div>

            {/* Transaction & Customer Details */}
            <div className="bg-white rounded-2xl border border-[#F7D6DF] p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2225]">Transaction Information</h4>
              <div className="space-y-2 text-xs divide-y divide-[#F7D6DF]/60">
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[#5A4B50]">Transaction Reference ID:</span>
                  <span className="font-mono font-bold text-[#2B2225]">{selectedPaymentDetails.txnRef}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#5A4B50]">Payment Method:</span>
                  <span className="font-bold text-[#2B2225]">{selectedPaymentDetails.paymentMethod}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#5A4B50]">Payment Date:</span>
                  <span className="font-medium text-[#2B2225]">{selectedPaymentDetails.date}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#5A4B50]">Customer Name:</span>
                  <span className="font-bold text-[#2B2225]">{selectedPaymentDetails.customerName}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#5A4B50]">Customer Email:</span>
                  <span className="font-medium text-[#2B2225]">{selectedPaymentDetails.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Refund Action Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {selectedPaymentDetails.paymentStatus !== 'Refunded' ? (
                <button
                  type="button"
                  onClick={() => setRefundConfirm(selectedPaymentDetails)}
                  className="px-5 py-2.5 rounded-full bg-[#FDF2F5] text-[#7C2F47] text-xs font-bold border border-[#F7D6DF] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refund Payment</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-[#7C2F47] bg-[#FDF2F5] px-3 py-1.5 rounded-full border border-[#F7D6DF]">
                  Payment Refunded
                </span>
              )}

              <button
                onClick={() => setSelectedPaymentDetails(null)}
                className="px-6 py-2.5 rounded-full bg-[#9E3F5C] text-white text-xs font-bold shadow-pink-glow hover:bg-[#7C2F47] transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* REFUND CONFIRMATION DIALOG */}
      {refundConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FFF9F5] border-0 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Refund Payment?</h3>
            <p className="text-xs text-[#5A4B50]">
              Are you sure you want to refund <strong>${refundConfirm.amount}</strong> for Payment <strong>{refundConfirm.paymentId}</strong> (Order #{refundConfirm.orderId})?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setRefundConfirm(null)}
                className="px-5 py-2 rounded-full bg-gray-200 text-[#2B2225] text-xs font-semibold hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRefund}
                className="px-5 py-2 rounded-full bg-[#9E3F5C] text-white text-xs font-bold hover:bg-[#7C2F47] shadow-pink-glow cursor-pointer"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
