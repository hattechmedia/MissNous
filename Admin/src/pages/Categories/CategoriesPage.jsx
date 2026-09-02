import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderTree, 
  AlertTriangle, 
  X 
} from 'lucide-react';

export default function CategoriesPage({ 
  categories = [], 
  products = [], 
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory, 
  showToast 
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [categoryFormError, setCategoryFormError] = useState('');
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

  // Lock outer page scroll when modal is open
  React.useEffect(() => {
    if (isCategoryModalOpen || deleteCategoryConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isCategoryModalOpen, deleteCategoryConfirm]);

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '', description: '' });
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({ name: cat.name || '', description: cat.description || '' });
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    setCategoryFormError('');

    if (!categoryFormData.name.trim()) {
      setCategoryFormError('Category name is required.');
      return;
    }

    const keySlug = (editingCategory?.key || categoryFormData.name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const categoryPayload = {
      ...(editingCategory ? { _id: editingCategory._id } : {}),
      name: categoryFormData.name.trim(),
      description: categoryFormData.description.trim(),
      key: keySlug
    };

    if (editingCategory) {
      if (onUpdateCategory) onUpdateCategory(categoryPayload);
    } else {
      if (onAddCategory) onAddCategory(categoryPayload);
    }

    setIsCategoryModalOpen(false);
  };

  const handleExecuteDeleteCategory = () => {
    if (deleteCategoryConfirm && onDeleteCategory) {
      onDeleteCategory(deleteCategoryConfirm.category._id || deleteCategoryConfirm.category.id);
    }
    setDeleteCategoryConfirm(null);
  };

  const getProductCountForCategory = (catKey, catName) => {
    return products.filter(p => p.categoryKey === catKey || p.category === catName).length;
  };

  return (
    <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Category Taxonomy</h2>
          <p className="text-xs text-[#5A4B50]">Organize skincare formulations by functional collection</p>
        </div>

        <button
          onClick={handleOpenAddCategory}
          className="px-5 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-semibold shadow-pink-glow flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-[#F7D6DF] rounded-3xl bg-[#FFF9F5] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] flex items-center justify-center mx-auto font-bold">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#2B2225]">No Categories Available</h3>
          <p className="text-xs text-[#5A4B50] max-w-sm mx-auto">
            You haven't added any categories yet. Click "Add New Category" above to create your first product category.
          </p>
          <button
            onClick={handleOpenAddCategory}
            className="mt-2 px-4 py-2 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-semibold shadow-pink-glow inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        /* Category Grid Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {categories.map((cat) => {
            const count = getProductCountForCategory(cat.key, cat.name);
            return (
              <div 
                key={cat._id || cat.id}
                className="bg-[#FFF9F5] border border-[#F7D6DF] rounded-3xl p-6 space-y-4 shadow-luxury hover:shadow-pink-glow transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center font-bold flex-shrink-0">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-bold text-[#2B2225]">{cat.name}</h3>
                      <p className="text-xs text-[#5A4B50] font-medium line-clamp-1">{cat.description || `/${cat.key}`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-full bg-white border border-[#F7D6DF] text-[#9E3F5C] hover:bg-[#9E3F5C] hover:text-white transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCategoryConfirm({ category: cat, productCount: count })}
                      className="p-1.5 rounded-full bg-white border border-[#F7D6DF] text-[#2B2225] hover:bg-[#2B2225] hover:text-white transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F7D6DF]/60 flex items-center justify-between text-xs">
                  <span className="text-[#5A4B50]">Associated Products:</span>
                  <span className="font-bold text-[#9E3F5C]">{count} items</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL (Rendered at document.body level via Portal for 100% full screen backdrop) */}
      {isCategoryModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-[#FFF9F5] border-0 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#5A4B50] hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E3F5C]">Category Taxonomy</span>
              <h2 className="font-sans text-2xl font-bold text-[#2B2225]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
            </div>

            {categoryFormError && (
              <div className="p-3 bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold rounded-2xl text-center">
                {categoryFormError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Moisturizers & Hydrators"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase text-[#2B2225]">Category Description</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Botanical intimate formulations and daily hydrators designed for gentle daily skin comfort..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-gray-100 text-[#5A4B50] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-semibold shadow-pink-glow cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteCategoryConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FFF9F5] border-0 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#2B2225]">Delete Category?</h3>
            <p className="text-xs text-[#5A4B50]">
              Are you sure you want to delete <strong>"{deleteCategoryConfirm.category.name}"</strong>?
              {deleteCategoryConfirm.productCount > 0 && (
                <span className="block text-[#9E3F5C] font-semibold mt-1">
                  Warning: {deleteCategoryConfirm.productCount} product(s) currently belong to this category.
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
                className="px-5 py-2 rounded-full bg-gray-200 text-[#2B2225] text-xs font-semibold hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeleteCategory}
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
