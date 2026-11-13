import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  Upload,
  X,
  Sparkles,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Layers,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import RichEditor from '../../components/RichEditor';
import { compressImage } from '../../utils/imageCompressor';
import DOMPurify from 'dompurify';

// Helper to auto-generate URL slug
const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function BlogsPage({
  blogs = [],
  blogCategories = [],
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  onAddBlogCategory,
  onDeleteBlogCategory,
  showToast
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor' | 'preview'
  const [editingBlog, setEditingBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' or category slug
  const [saving, setSaving] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', slug: '', description: '' });
  const [categorySlugManual, setCategorySlugManual] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '/gpt-8.jpeg',
    category: blogCategories[0]?.name || '',
    categorySlug: blogCategories[0]?.slug || '',
    tags: [],
    author: 'Miss Nous Team',
    readTime: '5 min read',
    status: 'Published',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  const [newTagInput, setNewTagInput] = useState('');
  const fileInputRef = useRef(null);

  // Open Create Mode - Automatically defaults to active Category Tab
  const handleOpenCreate = () => {
    setEditingBlog(null);

    let defaultCatName = blogCategories[0]?.name || '';
    let defaultCatSlug = blogCategories[0]?.slug || '';

    if (selectedCategory !== 'all') {
      const match = blogCategories.find(
        c => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (match) {
        defaultCatName = match.name;
        defaultCatSlug = match.slug;
      }
    }

    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '/gpt-8.jpeg',
      category: defaultCatName,
      categorySlug: defaultCatSlug,
      tags: [],
      author: 'Miss Nous Team',
      readTime: '5 min read',
      status: 'Published',
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    });
    setViewMode('editor');
  };

  // Open Edit Mode
  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    const catName = blog.category || 'Wellness';
    const catSlug = blog.categorySlug || slugify(catName);

    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '/gpt-8.jpeg',
      category: catName,
      categorySlug: catSlug,
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      author: blog.author || 'Miss Nous Team',
      readTime: blog.readTime || '5 min read',
      status: blog.status || 'Published',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      keywords: blog.keywords || ''
    });
    setViewMode('editor');
  };

  // Handle category name typing in modal (auto-slugifies unless user edited slug manually)
  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    setNewCategoryData(prev => ({
      ...prev,
      name,
      slug: categorySlugManual ? prev.slug : slugify(name)
    }));
  };

  // Handle category slug manual typing in modal
  const handleCategorySlugChange = (e) => {
    setCategorySlugManual(true);
    setNewCategoryData(prev => ({
      ...prev,
      slug: slugify(e.target.value)
    }));
  };

  // Save new category (URL slug is optional, auto-generated from name)
  const handleSaveCategory = async (e) => {
    e?.preventDefault();
    if (!newCategoryData.name.trim()) {
      showToast?.('Please enter a category name.');
      return;
    }
    const finalSlug = slugify(newCategoryData.slug || newCategoryData.name);
    if (!finalSlug) {
      showToast?.('Please enter a valid category name.');
      return;
    }

    setAddingCategory(true);
    try {
      await onAddBlogCategory?.({
        name: newCategoryData.name.trim(),
        slug: finalSlug,
        description: (newCategoryData.description || '').trim()
      });
      setNewCategoryData({ name: '', slug: '', description: '' });
      setCategorySlugManual(false);
      // Auto-switch to newly created category tab
      setSelectedCategory(finalSlug);
    } catch (err) {
      showToast?.(err.message || 'Failed to create category.');
    } finally {
      setAddingCategory(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Delete category "${category.name}"? Articles in this category will keep their content.`)) {
      try {
        await onDeleteBlogCategory?.(category._id || category.slug || category.id);
        if (selectedCategory === category.slug) {
          setSelectedCategory('all');
        }
      } catch (err) {
        showToast?.('Failed to delete category.');
      }
    }
  };

  // Title change with auto-slug generator
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, title: val };
      if (!editingBlog) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  // Auto calculate read time based on word count
  useEffect(() => {
    if (formData.content) {
      const words = formData.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.ceil(words / 200));
      setFormData(prev => ({ ...prev, readTime: `${mins} min read` }));
    }
  }, [formData.content]);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 1400, 1000, 0.8);
      setFormData(prev => ({ ...prev, coverImage: base64 }));
    } catch (err) {
      showToast?.('Failed to compress image.');
    } finally {
      e.target.value = '';
    }
  };

  // Tag Add / Remove
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!formData.tags.includes(newTagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTagInput.trim()] }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };



  // Handle Save
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      showToast?.('Please enter an article title.');
      return;
    }
    if (!formData.content.trim()) {
      showToast?.('Please enter article content.');
      return;
    }

    setSaving(true);
    try {
      if (editingBlog) {
        await onUpdateBlog?.({
          _id: editingBlog._id || editingBlog.id,
          ...formData
        });
      } else {
        await onAddBlog?.(formData);
      }
      setViewMode('list');
    } catch (err) {
      showToast?.(err.message || 'Failed to save blog.');
    } finally {
      setSaving(false);
    }
  };

  // Filter Blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && b.status === 'Published') ||
      (statusFilter === 'draft' && b.status === 'Draft');

    const matchesCategory =
      selectedCategory === 'all' ||
      b.categorySlug === selectedCategory ||
      (b.category && b.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (blogCategories.some(c => c.slug === selectedCategory && b.category?.toLowerCase() === c.name.toLowerCase()));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ────────────────────────────────────────────────────
  //   1. PREVIEW MODAL
  // ────────────────────────────────────────────────────
  if (viewMode === 'preview' && previewBlog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F7D6DF]">
          <button
            onClick={() => setViewMode('list')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F7D6DF] text-[#2B2225] font-semibold text-xs hover:border-[#9E3F5C] hover:text-[#9E3F5C] transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles List
          </button>
          <span className="text-xs text-[#A09095] font-medium">Article Live Preview</span>
        </div>

        <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#F7D6DF] overflow-hidden shadow-luxury">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#2B2225]">
            <img
              src={previewBlog.coverImage || '/gpt-8.jpeg'}
              alt={previewBlog.title}
              className="w-full h-full object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/85 via-[#2B2225]/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
              <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-[#FFF9F5]">
                {previewBlog.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-[#FFF9F5]/80">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{previewBlog.author}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{previewBlog.readTime}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {previewBlog.excerpt && (
              <p className="text-base sm:text-lg text-[#5A4B50] italic font-medium leading-relaxed border-l-4 border-[#D4AF6A] pl-4 py-1 bg-[#FDF2F5] rounded-r-xl">
                {previewBlog.excerpt}
              </p>
            )}

            <div
              className="prose prose-rose max-w-none text-[#2B2225] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewBlog.content) }}
            />
          </div>
        </article>
      </div>
    );
  }

  // ────────────────────────────────────────────────────
  //   2. EDITOR VIEW (Create / Edit)
  // ────────────────────────────────────────────────────
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6">
        {/* Top Sticky Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-[#F7D6DF] shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded-xl bg-[#FDF2F5] text-[#2B2225] hover:text-[#9E3F5C] hover:bg-[#F7D6DF] transition-all cursor-pointer"
              title="Cancel and return"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2B2225] font-sans">
                {editingBlog ? 'Edit Story' : 'Create New Story'}
              </h2>
              <p className="text-xs text-[#A09095]">
                {editingBlog ? `Modifying "${editingBlog.title}"` : 'Write and format a new article for the website'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                formData.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              <option value="Published">● Published</option>
              <option value="Draft">○ Draft</option>
            </select>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] text-xs sm:text-sm font-bold shadow-pink-glow transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Publishing...' : editingBlog ? 'Update Article' : 'Publish to Website'}
            </button>
          </div>
        </div>

        {/* Form Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Content Column (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Slug Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E3F5C] mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why Organic Intimate Wellness Matters More Than Ever"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-base font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A09095] mb-1">
                  URL Slug
                </label>
                <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-500">
                  <span className="text-gray-400">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-transparent border-none p-0 text-xs font-mono text-[#2B2225] focus:outline-none ml-1"
                    placeholder="article-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225] mb-1.5">
                  Short Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A concise 1-2 sentence preview shown on article cards and search results..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-sm text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/15 transition-all"
                />
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E3F5C]">
                  Article Content *
                </label>
                <span className="text-xs text-[#A09095]">Estimated: {formData.readTime}</span>
              </div>

              <RichEditor
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Write your article story here... You can add headings, bold/italic text, lists, quotes, and inline images."
                minHeight="380px"
              />
            </div>

            {/* SEO Meta Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#2B2225] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF6A]" />
                SEO Search Engine Optimization
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A4B50] mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title (defaults to article title)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A4B50] mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Short SEO snippet for Google..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A4B50] mb-1">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="e.g. intimate care, organic wellness, clean beauty"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Settings Column (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Featured Image Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-xs space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9E3F5C]">
                Featured Image
              </label>

              {/* Image Preview Box */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-2 border-dashed border-[#F7D6DF] bg-[#FDF2F5] group flex items-center justify-center">
                {formData.coverImage ? (
                  <>
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-bold text-[#2B2225] hover:bg-white transition-all shadow-md"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 text-center cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <ImageIcon className="w-10 h-10 text-[#A09095] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#9E3F5C]">Click to upload cover photo</p>
                    <p className="text-[10px] text-[#A09095] mt-1">JPEG, PNG, WebP (auto-compressed)</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </div>

            {/* Publishing Metadata Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#F7D6DF] shadow-xs space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9E3F5C]">
                Publishing Details
              </label>

              {/* Category Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#2B2225] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#9E3F5C]" />
                    Article Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-[#9E3F5C] hover:text-[#7C2F47] hover:underline cursor-pointer"
                  >
                    + Manage Categories
                  </button>
                </div>
                {blogCategories.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#FFF9F5] border border-dashed border-[#F7D6DF] text-center space-y-2">
                    <p className="text-[11px] text-[#A09095]">No categories created yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#9E3F5C] text-white text-[11px] font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Category
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const match = blogCategories.find(c => c.name === selectedName);
                      setFormData(prev => ({
                        ...prev,
                        category: selectedName,
                        categorySlug: match ? match.slug : slugify(selectedName)
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C] cursor-pointer"
                  >
                    <option value="">Select Category...</option>
                    {blogCategories.map((cat) => (
                      <option key={cat._id || cat.slug || cat.name} value={cat.name}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                    {!blogCategories.some(c => c.name === formData.category) && formData.category && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                  </select>
                )}
                <p className="text-[10px] text-[#A09095] mt-1 font-mono">
                  Slug: <span className="text-[#9E3F5C]">/{formData.categorySlug || slugify(formData.category)}</span>
                </p>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2225] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9E3F5C]" />
                  Author Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="e.g. Miss Nous Team, Dr. Jane Smith"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
                <p className="text-[10px] text-[#A09095] mt-1">
                  Displayed on the article hero, byline, and card footer.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2225] mb-1">Tags</label>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. organic)"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#FFF9F5] border border-[#F7D6DF] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-[#2B2225] text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-[11px] font-semibold border border-[#F7D6DF]"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────
  //   3. LIST VIEW (Default Articles Management Hub)
  // ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#F7D6DF] shadow-luxury">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Journal & Blog Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2B2225] font-sans">
            Blog Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#A09095] max-w-xl">
            Publish articles, organize categories, and manage author stories that sync directly to the live website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#F7D6DF] hover:border-[#9E3F5C] hover:text-[#9E3F5C] text-[#2B2225] font-sans text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            title="Manage Blog Categories"
          >
            <Tag className="w-4 h-4 text-[#9E3F5C]" />
            Manage Categories
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm font-bold shadow-pink-glow transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Create New Article
          </button>
        </div>
      </div>

      {/* ──── Category Tabs Bar (Dynamic Tabs with Counts) ──── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* All Tab */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-[#9E3F5C] text-white shadow-pink-glow'
              : 'bg-white text-[#2B2225] border border-[#F7D6DF] hover:border-[#9E3F5C] hover:text-[#9E3F5C]'
          }`}
        >
          <span>All Articles</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              selectedCategory === 'all'
                ? 'bg-white/25 text-white'
                : 'bg-[#FDF2F5] text-[#9E3F5C]'
            }`}
          >
            {blogs.length}
          </span>
        </button>

        {/* Dynamic Category Tabs */}
        {blogCategories.map((cat) => {
          const count = blogs.filter(
            b => b.categorySlug === cat.slug || b.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;
          const isActive = selectedCategory === cat.slug || selectedCategory === cat.name.toLowerCase();

          return (
            <button
              key={cat._id || cat.slug || cat.name}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-[#9E3F5C] text-white shadow-pink-glow'
                  : 'bg-white text-[#2B2225] border border-[#F7D6DF] hover:border-[#9E3F5C] hover:text-[#9E3F5C]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-[#FDF2F5] text-[#9E3F5C]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Quick Add Category Pill */}
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#9E3F5C] bg-[#FDF2F5] border border-dashed border-[#F7D6DF] hover:bg-[#F7D6DF]/60 transition-all whitespace-nowrap cursor-pointer"
          title="Add New Category"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#F7D6DF] shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#9E3F5C] text-white shadow-xs'
                  : 'bg-[#FDF2F5] text-[#2B2225] hover:bg-[#F7D6DF]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table / Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#F7D6DF] text-center space-y-4 shadow-luxury">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C]">
            <FileText className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-[#2B2225]">No Articles Found</h3>
          <p className="text-xs sm:text-sm text-[#A09095] max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' || selectedCategory !== 'all'
              ? 'No articles match your current filter. Try selecting a different category or adjusting your search.'
              : 'You have not created any blog posts yet. Click the button below to publish your first article!'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3F5C] text-white text-xs font-bold shadow-pink-glow hover:bg-[#7C2F47] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {selectedCategory !== 'all' ? `Write Article in ${blogCategories.find(c => c.slug === selectedCategory)?.name || 'Category'}` : 'Write First Story'}
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-[#F7D6DF] overflow-hidden shadow-luxury">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F7D6DF] bg-[#FFF9F5] text-[11px] font-bold text-[#A09095] uppercase tracking-wider">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7D6DF]/60 text-xs text-[#2B2225]">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id || blog.id || blog.slug} className="hover:bg-[#FDF2F5]/50 transition-colors">
                    {/* Title + Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#F7D6DF]">
                          <img
                            src={blog.coverImage || '/gpt-8.jpeg'}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-bold text-[#2B2225] line-clamp-1 hover:text-[#9E3F5C] transition-colors">
                            {blog.title}
                          </p>
                          <p className="text-[10px] text-[#A09095] font-mono truncate">
                            /blog/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F5] text-[#9E3F5C] text-[11px] font-bold border border-[#F7D6DF]">
                        <Tag className="w-3 h-3" />
                        {blog.category || 'Wellness'}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-[#2B2225] font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#9E3F5C]/10 text-[#9E3F5C] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {(blog.author || 'M').charAt(0)}
                        </div>
                        <span className="truncate max-w-[140px]">{blog.author || 'Miss Nous Team'}</span>
                      </div>
                    </td>

                    {/* Read Time */}
                    <td className="px-6 py-4 text-[#A09095] font-medium">
                      {blog.readTime || '5 min read'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          blog.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'Published' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                        {blog.status || 'Published'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setPreviewBlog(blog); setViewMode('preview'); }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#9E3F5C] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
                          title="Preview article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                              onDeleteBlog?.(blog._id || blog.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────
          4. CATEGORY MANAGEMENT MODAL
          ──────────────────────────────────────────────────── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#F7D6DF] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F7D6DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2B2225] font-sans">
                    Blog Categories
                  </h3>
                  <p className="text-xs text-[#A09095]">
                    Organize your articles into dedicated category tabs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 rounded-xl text-[#A09095] hover:text-[#2B2225] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form: Add New Category */}
            <form onSubmit={handleSaveCategory} className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E3F5C] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Create New Category
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2225] mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategoryData.name}
                    onChange={handleCategoryNameChange}
                    placeholder="e.g. Sensual Wellness"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>

                {/* URL Slug */}
                {/* URL Slug (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#2B2225]">
                      URL Slug <span className="text-[#A09095] font-normal">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-[#A09095]">Auto-generated</span>
                  </div>
                  <input
                    type="text"
                    value={newCategoryData.slug}
                    onChange={handleCategorySlugChange}
                    placeholder={slugify(newCategoryData.name) || "auto-generated-from-name"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs font-mono text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2225] mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Short tagline explaining this category topic..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#A09095]">
                  Tab URL: <span className="text-[#9E3F5C] font-mono font-semibold">/blog?category={slugify(newCategoryData.slug || newCategoryData.name) || 'auto-generated'}</span>
                </span>
                <button
                  type="submit"
                  disabled={addingCategory}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-bold shadow-pink-glow transition-all cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {addingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>

            {/* List: Existing Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A09095]">
                Existing Categories ({blogCategories.length})
              </h4>

              <div className="divide-y divide-[#F7D6DF]/60 border border-[#F7D6DF] rounded-2xl overflow-hidden bg-white">
                {blogCategories.map((cat) => {
                  const articleCount = blogs.filter(
                    b => b.categorySlug === cat.slug || b.category?.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat._id || cat.slug || cat.name}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FDF2F5]/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#2B2225]">
                            {cat.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FDF2F5] text-[#9E3F5C] text-[10px] font-mono font-semibold border border-[#F7D6DF]">
                            /{cat.slug}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-[#A09095] mt-0.5 truncate max-w-sm">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#5A4B50] text-[11px] font-bold">
                          {articleCount} {articleCount === 1 ? 'story' : 'stories'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={`Delete category "${cat.name}"`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#2B2225] hover:bg-[#43353A] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
