import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ isOpen, onClose, wishlistItems, onRemoveFromWishlist, onMoveToCart }) {
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
              <Heart className="w-5 h-5 text-[#9E3F5C] fill-[#9E3F5C]" />
              <h3 className="font-sans text-lg font-medium text-[#2B2225]">
                Your Wishlist ({wishlistItems.length})
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FDF2F5] text-[#2B2225] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 space-y-4 text-[#5A4B50]">
                <Heart className="w-12 h-12 text-[#D4AF6A] mx-auto opacity-50 stroke-[1.5]" />
                <p className="font-sans text-base font-medium">Your Wishlist is empty</p>
                <p className="font-sans text-xs text-[#A09095]">
                  Click the heart icon on any product to save it for later.
                </p>
              </div>
            ) : (
              wishlistItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-[#F7D6DF] shadow-sm flex items-center gap-4"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-contain rounded-xl bg-[#FDF2F5] p-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans text-sm font-medium text-[#2B2225] truncate">
                      {item.name}
                    </h4>
                    <span className="text-sm font-bold text-[#9E3F5C] block">
                      Rs. {item.price}
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => onMoveToCart(item)}
                        className="px-3 py-1 bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-semibold rounded-full flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>

                      <button 
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="p-1 text-[#A09095] hover:text-[#9E3F5C] transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
