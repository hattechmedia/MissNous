import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Upload, 
  AlertTriangle, 
  X,
  Filter,
  ArrowUpDown,
  Star,
  Package
} from 'lucide-react';

export default function ProductsPage({ 
  products = [], 
  categories = [], 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  showToast 
}) {
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Modals & Forms
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    subtitle: '',
    category: '',
    categoryKey: '',
    price: '',
    stock: 10,
    image: '',
    description: ''
  });
  const [productFormError, setProductFormError] = useState('');
  const [deleteProductConfirm, setDeleteProductConfirm] = useState(null);

  const productImageInputRef = useRef(null);

  // Lock outer page scroll when modal is open
  React.useEffect(() => {
    if (isProductModalOpen || deleteProductConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isProductModalOpen, deleteProductConfirm]);

  const handleProductImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProductFormError('Selected image file is too large. Please upload an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => ({ ...prev, image: reader.result }));
        setProductFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter & Sort Logic
  const filteredProductsList = products.filter(p => {
    const stockQty = p.stock !== undefined ? p.stock : 10;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && stockQty > 0) ||
      (statusFilter === 'draft' && stockQty === 0);

    const q = productSearch.toLowerCase().trim();
    const skuCode = `mn-${p._id || p.id}`.toLowerCase();
    const matchesQuery = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q)) ||
      skuCode.includes(q);

    return matchesStatus && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'stock') return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      subtitle: '',
      category: categories.length > 0 ? categories[0].name : 'Intimate Lubricants',
      categoryKey: categories.length > 0 ? categories[0].key : 'lubricants',
      price: '',
      stock: 15,
      image: '',
      description: ''
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name || '',
      subtitle: prod.subtitle || '',
      category: prod.category || '',
      categoryKey: prod.categoryKey || '',
      price: prod.price || '',
      stock: prod.stock !== undefined ? prod.stock : 10,
      image: prod.image || '',
      description: prod.description || ''
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    setProductFormError('');

    if (!productFormData.name.trim() || !productFormData.price || !productFormData.category) {
      setProductFormError('Please fill in all required fields (Name, Price, Category).');
      return;
    }

    if (Number(productFormData.price) <= 0) {
      setProductFormError('Price must be a positive number.');
      return;
    }

    const matchedCat = categories.find(c => c.name === productFormData.category || c.key === productFormData.categoryKey);
    const finalCategoryName = matchedCat ? matchedCat.name : productFormData.category;
    const finalCategoryKey = matchedCat ? matchedCat.key : productFormData.category.toLowerCase().replace(/\s+/g, '-');

    const productPayload = {
      ...(editingProduct ? { _id: editingProduct._id } : {}),
      name: productFormData.name.trim(),
      subtitle: productFormData.subtitle.trim(),
      category: finalCategoryName,
      categoryKey: finalCategoryKey,
      price: Number(productFormData.price),
      stock: Number(productFormData.stock || 0),
      image: productFormData.image.trim() || '/product-1-rm.png',
      description: productFormData.description.trim() || 'Premium botanical skincare formulation designed for natural daily radiance.',
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 12,
      features: editingProduct?.features || [
        '100% Organic Botanical Formula',
        'Dermatologist Tested',
        'pH Balanced'
      ]
    };

    if (editingProduct) {
      if (onUpdateProduct) onUpdateProduct(productPayload);
      if (showToast) showToast(`Product "${productPayload.name}" updated successfully!`);
    } else {
      if (onAddProduct) onAddProduct(productPayload);
      if (showToast) showToast(`New product "${productPayload.name}" added to catalog!`);
    }

    setIsProductModalOpen(false);
  };

  const handleExecuteDeleteProduct = () => {
    if (deleteProductConfirm && onDeleteProduct) {
      onDeleteProduct(deleteProductConfirm._id || deleteProductConfirm.id);
      if (showToast) showToast(`Product "${deleteProductConfirm.name}" removed.`);
    }
    setDeleteProductConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header Bar matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#E8D3A5] text-[#D4AF6A] flex items-center justify-center shadow-xs flex-shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#2B2225] tracking-tight">Products</h2>
            <p className="text-xs text-[#5A4B50]">Manage your skincare products.</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="px-5 py-2.5 rounded-xl bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-bold shadow-pink-glow flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Toolbar: Search, Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative flex-1 md:flex-initial">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF6A]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] cursor-pointer shadow-xs appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft / Out of Stock</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:flex-initial">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF6A]">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] cursor-pointer shadow-xs appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Sort by Price (Low to High)</option>
              <option value="price-high">Sort by Price (High to Low)</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Showing Count Label */}
      <div className="text-xs text-[#5A4B50] font-medium">
        Showing 1 to {filteredProductsList.length} of {products.length} products
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#F7D6DF] rounded-2xl shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#F7D6DF] bg-[#FFF9F5] text-[11px] font-bold uppercase tracking-wider text-[#A09095]">
                <th className="py-3.5 px-4 whitespace-nowrap">PRODUCT</th>
                <th className="py-3.5 px-4 whitespace-nowrap">COLLECTION</th>
                <th className="py-3.5 px-4 whitespace-nowrap">PRICE</th>
                <th className="py-3.5 px-4 whitespace-nowrap">STOCK</th>
                <th className="py-3.5 px-4 whitespace-nowrap">STATUS</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7D6DF]/50 text-xs text-[#2B2225]">
              {filteredProductsList.length > 0 ? (
                filteredProductsList.map((prod, idx) => {
                  const stockQty = prod.stock !== undefined ? prod.stock : 10;
                  const isStocked = stockQty > 0;

                  return (
                    <tr key={prod._id || prod.id || idx} className="hover:bg-[#FFF9F5] transition-colors">
                      
                      {/* PRODUCT Name & Thumbnail */}
                      <td className="py-4 px-4 font-bold whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1608248597263-00079e9603f2?w=500&auto=format&fit=crop&q=80';
                            }}
                            className="w-11 h-11 rounded-xl object-cover border border-[#F7D6DF] bg-[#FDF2F5] p-1 flex-shrink-0" 
                          />
                          <span className="font-bold text-[#2B2225] whitespace-nowrap">{prod.name}</span>
                        </div>
                      </td>

                      {/* COLLECTION (Category) */}
                      <td className="py-4 px-4 italic text-[#5A4B50] whitespace-nowrap">
                        {prod.category}
                      </td>

                      {/* PRICE */}
                      <td className="py-4 px-4 font-bold text-[#D4AF6A] whitespace-nowrap">
                        ${prod.price}
                      </td>

                      {/* STOCK Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center ${
                          stockQty > 5 ? 'bg-[#FDF2F5] text-[#9E3F5C]' : stockQty > 0 ? 'bg-[#FFF9F5] text-[#B88A3B] border border-[#E8D3A5]' : 'bg-[#2B2225] text-white'
                        }`}>
                          {stockQty}
                        </span>
                      </td>

                      {/* STATUS Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isStocked ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] whitespace-nowrap inline-block">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#2B2225] text-white whitespace-nowrap inline-block">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* ACTIONS Outline Buttons */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-2 rounded-lg bg-white border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteProductConfirm(prod)}
                            className="p-2 rounded-lg bg-white border border-[#F7D6DF] text-[#2B2225] hover:bg-[#2B2225] hover:text-white transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#5A4B50]">
                    No skincare products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL (Rendered at document.body level via Portal for 100% full screen backdrop) */}
      {isProductModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-[#FFF9F5] border-0 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Product Catalog</span>
                <h2 className="font-sans text-2xl font-bold text-[#2B2225]">
                  {editingProduct ? 'Edit Skincare Product' : 'Add New Skincare Product'}
                </h2>
              </div>

              {productFormError && (
                <div className="p-3 bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold rounded-2xl text-center">
                  {productFormError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Product Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Damask Rose Hydrating Serum"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Subtitle / Spec</label>
                  <input 
                    type="text"
                    placeholder="e.g. Scented Intimate Lubricant (100ml)"
                    value={productFormData.subtitle}
                    onChange={(e) => setProductFormData({ ...productFormData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 text-left sm:col-span-1">
                    <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category *</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => {
                        const selectedCatName = e.target.value;
                        const matched = categories.find(c => c.name === selectedCatName);
                        setProductFormData({
                          ...productFormData,
                          category: selectedCatName,
                          categoryKey: matched ? matched.key : selectedCatName.toLowerCase().replace(/\s+/g, '-')
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 text-left sm:col-span-1">
                    <label className="block text-xs font-semibold uppercase text-[#2B2225]">Price ($) *</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      placeholder="1850"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>

                  <div className="space-y-1 text-left sm:col-span-1">
                    <label className="block text-xs font-semibold uppercase text-[#2B2225]">Stock Qty *</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                    />
                  </div>
                </div>

                {/* Product Image File Upload */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Product Image *</label>
                  
                  <input 
                    type="file" 
                    ref={productImageInputRef}
                    accept="image/*"
                    onChange={handleProductImageFileChange}
                    className="hidden"
                  />

                  {productFormData.image ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-[#F7D6DF] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img 
                          src={productFormData.image} 
                          alt="Product Preview" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1608248597263-00079e9603f2?w=500&auto=format&fit=crop&q=80';
                          }}
                          className="w-14 h-14 rounded-xl object-cover border border-[#F7D6DF] bg-[#FDF2F5] p-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#2B2225]">Image Selected</p>
                          <p className="text-[11px] text-[#9E3F5C] font-semibold">Ready for product listing</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => productImageInputRef.current && productImageInputRef.current.click()}
                          className="px-3 py-1.5 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-xs font-bold border border-[#F7D6DF] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormData(prev => ({ ...prev, image: '' }))}
                          className="px-3 py-1.5 rounded-full bg-[#FFF9F5] text-[#2B2225] text-xs font-bold border border-[#F7D6DF] hover:bg-[#2B2225] hover:text-white transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => productImageInputRef.current && productImageInputRef.current.click()}
                      className="border-2 border-dashed border-[#F7D6DF] hover:border-[#9E3F5C] bg-white hover:bg-[#FDF2F5]/50 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF] group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2B2225]">Click to choose image file</p>
                        <p className="text-[11px] text-[#A09095]">PNG, JPG, WEBP, GIF (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold uppercase text-[#2B2225]">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Product description and formulation benefits..."
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-gray-100 text-[#5A4B50] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-semibold shadow-pink-glow cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {deleteProductConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FFF9F5] border-0 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Delete Product?</h3>
            <p className="text-xs text-[#5A4B50]">
              Are you sure you want to delete <strong>"{deleteProductConfirm.name}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteProductConfirm(null)}
                className="px-5 py-2 rounded-full bg-gray-200 text-[#2B2225] text-xs font-semibold hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeleteProduct}
                className="px-5 py-2 rounded-full bg-[#9E3F5C] text-white text-xs font-bold hover:bg-[#7C2F47] shadow-pink-glow cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
