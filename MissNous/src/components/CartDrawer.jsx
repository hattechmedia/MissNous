import React, { useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, onProceedToCheckout }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F5] shadow-luxury border-l border-[#F7D6DF] flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 bg-white border-b border-[#F7D6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#9E3F5C]" />
              <h3 className="font-sans text-lg font-medium text-[#2B2225]">
                Your Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FDF2F5] text-[#2B2225] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4 text-[#5A4B50]">
                <ShoppingBag className="w-12 h-12 text-[#D4AF6A] mx-auto opacity-50 stroke-[1.5]" />
                <p className="font-sans text-base font-medium">Your Shopping Cart is empty</p>
                <p className="font-sans text-xs text-[#A09095]">
                  Explore our luxury skincare rituals and add items to your cart.
                </p>
              </div>
            ) : (
              cartItems.map(item => (
                <div 
                  key={item.id || item._id}
                  className="bg-white p-4 rounded-2xl border border-[#F7D6DF] shadow-sm flex items-center gap-4"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-contain rounded-xl bg-[#FDF2F5] p-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-sans text-sm font-medium text-[#2B2225] truncate">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveFromCart(item.id || item._id)}
                        className="p-1 text-[#A09095] hover:text-[#9E3F5C] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs text-[#5A4B50] block truncate">
                      {item.selectedSize ? `Size: ${item.selectedSize}` : (item.subtitle || item.category)}
                    </span>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#F7D6DF] rounded-full px-2 py-0.5 bg-[#FFF9F5]">
                        <button 
                          onClick={() => onUpdateQuantity(item.id || item._id, -1)}
                          className="p-1 text-[#2B2225] hover:text-[#9E3F5C]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#2B2225]">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id || item._id, 1)}
                          className="p-1 text-[#2B2225] hover:text-[#9E3F5C]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#9E3F5C]">
                        ${Number(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#F7D6DF] space-y-4">
              
              <div className="space-y-2 font-sans">
                <div className="flex justify-between text-sm text-[#5A4B50]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2B2225]">${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A4B50]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#9E3F5C]">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2B2225] pt-2 border-t border-[#F7D6DF]">
                  <span>Total</span>
                  <span className="text-[#9E3F5C]">${Number(subtotal).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-sm font-semibold rounded-full shadow-pink-glow flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#A09095] font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF6A]" />
                <span>30-Day Guarantee • Discreet Luxury Packaging</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
