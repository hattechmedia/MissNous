import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowLeft, Truck, Sparkles } from 'lucide-react';

export default function CheckoutPage({ cartItems, onNavigate, onClearCart, onAddNewOrder, currentUser, onOpenAuthModal }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [formData, setFormData] = useState({
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : 'Sophia',
    lastName: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') : 'Lauren',
    email: currentUser?.email || 'sophia.lauren@example.com',
    address: currentUser?.address || '15 Rue de la Paix',
    city: currentUser?.city || 'Paris',
    postalCode: '75002',
    country: currentUser?.country || 'France'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (!currentUser) {
    return (
      <div className="bg-[#FDF2F5] min-h-screen py-24 px-4 sm:px-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-8 sm:p-12 max-w-xl text-center space-y-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto shadow-inner border border-[#F7D6DF]">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl font-medium text-[#2B2225]">
            Please Log In to Place Your Order
          </h2>

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newId = `MN-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlacedOrderId(newId);

    if (onAddNewOrder) {
      onAddNewOrder({
        id: newId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: Math.round(total),
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Confirmed',
        items: cartItems.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      });
    }

    setOrderPlaced(true);
    if (onClearCart) onClearCart();
  };

  if (orderPlaced) {
    return (
      <div className="bg-[#FDF2F5] min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] shadow-luxury p-8 sm:p-12 max-w-xl text-center space-y-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-[#F7D6DF] text-[#9E3F5C] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF6A] block">
            Order Confirmed #MN-88492
          </span>

          <h1 className="font-sans text-3xl sm:text-4xl font-medium text-[#2B2225]">
            Thank You for Your Order!
          </h1>

          <p className="font-sans text-sm text-[#5A4B50] leading-relaxed">
            Your luxury intimate wellness ritual is being prepared with discreet packaging in our Paris Atelier. A tracking link has been sent to <strong>{formData.email}</strong>.
          </p>

          <div className="p-4 bg-[#FFF9F5] border border-[#E8D3A5] rounded-2xl text-xs text-[#5A4B50] space-y-1">
            <p className="font-semibold text-[#9E3F5C]">Estimated Delivery: 2-3 Business Days</p>
            <p>Discreet, unbranded outer box for complete privacy.</p>
          </div>

          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF2F5] text-[#2B2225] min-h-screen font-sans pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F7D6DF] pb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#9E3F5C] hover:text-[#7C2F47] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4AF6A]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#5A4B50]">
              256-Bit Encrypted Secure Checkout
            </span>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F7D6DF] shadow-sm space-y-4">
              <h3 className="font-sans text-lg font-medium text-[#2B2225] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#9E3F5C] text-white text-xs font-bold flex items-center justify-center">1</span>
                Contact & Shipping Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">First Name *</label>
                  <input 
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">Last Name *</label>
                  <input 
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">Email Address *</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">Shipping Street Address *</label>
                  <input 
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">City *</label>
                  <input 
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#2B2225] mb-1">Postal Code *</label>
                  <input 
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-[#FFF9F5] border border-[#F7D6DF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F7D6DF] shadow-sm space-y-4">
              <h3 className="font-sans text-lg font-medium text-[#2B2225] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#9E3F5C] text-white text-xs font-bold flex items-center justify-center">2</span>
                Payment Method
              </h3>

              <div className="p-5 rounded-2xl border-2 border-[#9E3F5C] bg-[#FFF9F5] flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center flex-shrink-0 border border-[#F7D6DF]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#9E3F5C]">Cash on Delivery (COD)</h4>
                  <p className="font-sans text-xs text-[#5A4B50]">Pay with cash when your luxury parcel arrives at your doorstep.</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury space-y-6 sticky top-28">
              
              <h3 className="font-sans text-xl font-medium text-[#2B2225] border-b border-[#F7D6DF] pb-4">
                Order Summary ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-contain rounded-xl bg-[#FDF2F5] p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-[#2B2225] truncate">{item.name}</h5>
                      <span className="text-[11px] text-[#A09095]">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-xs font-bold text-[#9E3F5C]">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-4 border-t border-[#F7D6DF] text-xs font-sans text-[#5A4B50]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2B2225]">${subtotal}</span>
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
                  <span className="text-[#9E3F5C]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Place Order (${total.toFixed(2)})
              </button>

              <div className="text-center text-[11px] text-[#A09095] space-y-1">
                <p>30-Day Money-Back Guarantee • Free Returns</p>
                <p>Shipped in plain, unbranded luxury box for absolute privacy.</p>
              </div>

            </div>
          </div>

        </form>

      </div>

    </div>
  );
}
