import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowLeft, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

export default function CheckoutPage({
  cartItems = [],
  onNavigate,
  onClearCart,
  onAddNewOrder,
  currentUser,
  onOpenAuthModal,
  onUpdateUser,
  fetchUserOrders
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('missnous_pending_shipping_address');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      firstName: currentUser?.name ? currentUser.name.split(' ')[0] : '',
      lastName: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') : '',
      email: currentUser?.email || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      postalCode: '',
      country: currentUser?.country || 'United States'
    };
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Check for return from Stripe Checkout (?session_id=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const canceled = query.get('canceled');

    if (canceled) {
      setError('Stripe checkout was canceled. You can try again when you are ready.');
      // Clean query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (sessionId) {
      setVerifyingSession(true);

      const verifyPayment = async () => {
        try {
          const token = currentUser?.token;
          let savedItems = cartItems;
          let savedAddress = formData;

          try {
            const raw = localStorage.getItem('missnous_pending_checkout');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.items) savedItems = parsed.items;
              if (parsed.shippingAddress) savedAddress = parsed.shippingAddress;
            }
          } catch (e) {}

          const res = await fetch(`${BASE_URL}/payments/verify-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              sessionId,
              cartItems: savedItems,
              shippingAddress: savedAddress
            })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Payment verification failed.');

          const order = data.order;
          setPlacedOrder(order);
          setOrderPlaced(true);

          if (onAddNewOrder) onAddNewOrder(order);
          try {
            localStorage.setItem('missnous_new_order_event', JSON.stringify({ time: Date.now(), order }));
            localStorage.removeItem('missnous_pending_checkout');
          } catch (e) {}

          if (onClearCart) onClearCart();
          if (fetchUserOrders) fetchUserOrders();

          // Clean URL parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Session verify error:', err);
          setError(err.message || 'Could not verify payment session.');
        } finally {
          setVerifyingSession(false);
        }
      };

      verifyPayment();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    try {
      localStorage.setItem('missnous_pending_shipping_address', JSON.stringify(updated));
    } catch (err) {}
  };

  const handleProceedToStripe = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    try {
      setLoading(true);

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const shippingAddress = {
        name: fullName || currentUser?.name || 'Valued Customer',
        email: formData.email || currentUser?.email || '',
        address: formData.address || '',
        city: formData.city || '',
        postalCode: formData.postalCode || '',
        country: formData.country || 'United States'
      };

      // Save pending checkout in localStorage so we can reconstruct order if state resets
      try {
        localStorage.setItem('missnous_pending_checkout', JSON.stringify({
          items: cartItems,
          shippingAddress,
          time: Date.now()
        }));
      } catch (e) {}

      // Auto-update user profile
      if (currentUser && onUpdateUser) {
        onUpdateUser({
          ...currentUser,
          name: currentUser.name || fullName,
          address: currentUser.address || formData.address,
          city: currentUser.city || formData.city,
          country: currentUser.country || formData.country
        });
      }

      const token = currentUser?.token;
      const res = await fetch(`${BASE_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item._id || item.id,
            name: item.name,
            subtitle: item.subtitle || '',
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingAddress,
          subtotal: Math.round(subtotal),
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          origin: window.location.origin
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to initialize Stripe redirect.');

      if (!data.url) throw new Error('Stripe Checkout URL not received.');

      // Redirect user directly to Stripe's hosted checkout page!
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Unable to connect to Stripe. Please try again.');
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#FDF2F5] min-h-screen py-24 px-4 sm:px-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-8 sm:p-12 max-w-xl text-center space-y-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto shadow-inner border border-[#F7D6DF]">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225]">Please Log In to Place Your Order</h2>
          <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
            You must be logged in to your Miss Nous account to complete your checkout and track your order.
          </p>
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <span>Log In / Sign Up Now</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  // Verifying Stripe session spinner
  if (verifyingSession) {
    return (
      <div className="bg-[#FDF2F5] min-h-screen py-24 px-4 sm:px-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-10 max-w-md text-center space-y-5 animate-fade-up">
          <div className="w-16 h-16 border-4 border-[#9E3F5C]/20 border-t-[#9E3F5C] rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-[#2B2225]">Verifying Your Payment</h2>
          <p className="text-xs sm:text-sm text-[#5A4B50] leading-relaxed">
            Securing your order confirmation with Stripe. Please do not close this window...
          </p>
        </div>
      </div>
    );
  }

  // Order Confirmed Success Screen
  if (orderPlaced && placedOrder) {
    return (
      <div className="bg-[#FDF2F5] min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-8 sm:p-12 max-w-xl text-center space-y-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF6A] block">
              Payment Completed • Order Confirmed
            </span>
            <span className="font-mono text-sm font-bold text-[#9E3F5C] bg-[#FFF9F5] px-3 py-1 rounded-full border border-[#F7D6DF] inline-block">
              #{placedOrder.orderId}
            </span>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225]">Thank You for Your Order!</h1>
          <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
            Your payment was processed successfully on Stripe. Your luxury intimate care package is being prepared with discreet packaging. A confirmation receipt has been sent to <strong>{formData.email || currentUser?.email}</strong>.
          </p>

          <div className="p-4 bg-[#FFF9F5] border border-[#E8D3A5] rounded-2xl text-xs text-[#5A4B50] space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-[#A09095]">Payment Status:</span>
              <span className="font-bold text-emerald-600">Paid (Stripe)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A09095]">Total Paid:</span>
              <span className="font-bold text-[#9E3F5C]">${Number(placedOrder.total || total).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A09095]">Estimated Delivery:</span>
              <span className="font-semibold text-[#2B2225]">2-3 Business Days</span>
            </div>
            <div className="pt-1 border-t border-[#F7D6DF]/60 text-[11px] text-[#A09095]">
              Shipped in a plain, unbranded box for 100% discretion.
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF2F5] min-h-screen py-12 sm:py-20 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E3F5C] hover:text-[#7C2F47] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Boutique
          </button>
          <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225]">Secure Checkout</h1>
          <p className="font-sans text-xs sm:text-sm text-[#5A4B50] mt-1">
            Complete your order with Stripe hosted payment and complimentary discreet shipping.
          </p>
        </div>

        <form onSubmit={handleProceedToStripe} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 text-left">
          {/* LEFT: Checkout Inputs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-fade-in shadow-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Notice</p>
                  <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* 1. Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F7D6DF] shadow-sm space-y-4">
              <h3 className="font-sans text-lg font-medium text-[#2B2225] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#9E3F5C] text-white text-xs font-bold flex items-center justify-center">1</span>
                Shipping & Customer Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">Email Address * (For order confirmation)</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.doe@example.com"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">Shipping Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Avenue, Apt 4B"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4B50] mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F7D6DF] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-lg font-medium text-[#2B2225] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#9E3F5C] text-white text-xs font-bold flex items-center justify-center">2</span>
                  Payment Method
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#5A4B50]">
                  <Lock className="w-3.5 h-3.5 text-[#9E3F5C]" />
                  <span className="font-medium text-[11px] uppercase tracking-wider text-[#9E3F5C]">Stripe 256-Bit SSL</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-[#9E3F5C] bg-[#FFF9F5] space-y-3.5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF] shadow-xs">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-[#2B2225]">Credit / Debit Card & Digital Wallets</h4>
                      <p className="font-sans text-xs text-[#5A4B50]">Pay securely with Visa, Mastercard, Amex, Apple Pay, or Google Pay.</p>
                    </div>
                  </div>

                  {/* Supported Payment Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">VISA</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">MC</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">AMEX</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">DISCOVER</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">APPLE PAY</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8D3A5] text-[10px] font-bold text-[#5A4B50]">GOOGLE PAY</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#A09095] pt-2 border-t border-[#F7D6DF]/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Guaranteed 100% safe & encrypted payment powered by Stripe.</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury space-y-6 sticky top-28">
              <h3 className="font-sans text-xl font-medium text-[#2B2225] border-b border-[#F7D6DF] pb-4">
                Order Summary ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h3>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item._id || item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-[#FDF2F5] p-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-[#2B2225] truncate">{item.name}</h5>
                      <span className="text-[11px] text-[#A09095]">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-xs font-bold text-[#9E3F5C]">${Number(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#F7D6DF] text-xs font-sans text-[#5A4B50]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2B2225]">${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#9E3F5C]">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-[#2B2225]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2B2225] pt-3 border-t border-[#F7D6DF]">
                  <span>Total Amount</span>
                  <span className="text-[#9E3F5C]">${total.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] disabled:opacity-60 text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Redirecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay with Stripe (${total.toFixed(2)})</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-[#A09095] space-y-1">
                <p className="flex items-center justify-center gap-1.5 font-medium text-[#5A4B50]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Stripe Official Hosted Checkout
                </p>
                <p>Shipped in plain, unbranded luxury box for absolute privacy.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
