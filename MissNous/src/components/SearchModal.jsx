import React, { useState, useEffect } from 'react';
import { X, Search, ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistItems = [],
  products = PRODUCTS,
  categories = []
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          if (selectedProduct) {
            setSelectedProduct(null);
          } else {
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, selectedProduct, onClose]);

  if (!isOpen) return null;

  const categoryList = ['all', ...categories.map(c => typeof c === 'string' ? c : c.name)];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory || product.categoryKey === activeCategory;
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || (
      product.name.toLowerCase().includes(q) ||
      (product.subtitle && product.subtitle.toLowerCase().includes(q)) ||
      (product.category && product.category.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q))
    );
    return matchesCategory && matchesQuery;
  });

  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto pb-10"
    >
      
      {/* Search Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFF9F5] border border-[#F7D6DF] w-full max-w-3xl rounded-3xl shadow-luxury overflow-hidden flex flex-col max-h-[85vh] relative"
      >
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-6 border-b border-[#F7D6DF] bg-white space-y-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#9E3F5C] flex-shrink-0" />
            <input 
              type="text"
              autoFocus
              placeholder="Search products (e.g. Strawberry, Serum, Lubricant)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-base text-[#2B2225] placeholder-[#A09095] focus:outline-none font-sans"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="text-xs text-[#9E3F5C] hover:underline font-semibold px-2"
              >
                Clear
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FDF2F5] text-[#2B2225] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoryList.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#9E3F5C] text-white shadow-xs'
                    : 'bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] hover:bg-[#F7D6DF]/40'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#5A4B50] space-y-2">
              <p className="text-base font-medium">No products found matching "{query}"</p>
              <p className="text-xs text-[#A09095]">Try searching for "Serum", "Strawberry", or "Lubricant"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => {
                const wishlisted = isWishlisted(product.id);
                return (
                  <div 
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuantity(1);
                    }}
                    className="bg-white p-4 rounded-2xl border border-[#F7D6DF] shadow-sm hover:shadow-pink-glow transition-all flex gap-4 items-center relative group cursor-pointer"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-20 object-contain rounded-xl bg-[#FDF2F5] p-1.5 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[10px] font-bold uppercase tracking-wider text-[#9E3F5C]">
                        {product.category}
                      </span>

                      <h4 className="font-sans text-sm font-semibold text-[#2B2225] truncate mt-1">
                        {product.name}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#9E3F5C]">${product.price}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                            onClose();
                          }}
                          className="px-3 py-1 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] text-xs font-semibold rounded-full flex items-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setQuantity(1);
                          }}
                          className="p-1.5 rounded-full border border-[#F7D6DF] bg-white text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* QUICK VIEW PRODUCT DETAIL MODAL INSIDE SEARCH */}
      {selectedProduct && (
        <div 
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF9F5] border border-[#F7D6DF] w-full max-w-2xl rounded-3xl shadow-luxury p-6 sm:p-8 relative overflow-y-auto my-auto max-h-[90vh] space-y-6"
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FDF2F5] text-[#2B2225] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 bg-[#FDF2F5] rounded-2xl p-5 flex items-center justify-center">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="max-h-56 w-auto object-contain drop-shadow-md rounded-lg"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9E3F5C]">
                    {selectedProduct.category}
                  </span>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[#2B2225]">
                  {selectedProduct.name}
                </h3>
                
                {selectedProduct.subtitle && (
                  <p className="font-sans text-xs text-[#D4AF6A] font-medium">
                    {selectedProduct.subtitle}
                  </p>
                )}

                <div className="text-xl font-bold text-[#9E3F5C] pt-1">
                  ${selectedProduct.price}
                </div>

                <p className="font-sans text-xs text-[#5A4B50] leading-relaxed pt-2 border-t border-[#F7D6DF]/60">
                  {selectedProduct.description}
                </p>

                {/* Quantity & Action CTA Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <div className="flex items-center border border-[#F7D6DF] rounded-full bg-white px-3 py-1.5">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-sm font-bold text-[#9E3F5C] px-2 hover:opacity-70"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold text-[#2B2225] px-2">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-sm font-bold text-[#9E3F5C] px-2 hover:opacity-70"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        onAddToCart(selectedProduct);
                      }
                      setSelectedProduct(null);
                      onClose();
                    }}
                    className="flex-1 px-5 py-3 bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-pink-glow"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
