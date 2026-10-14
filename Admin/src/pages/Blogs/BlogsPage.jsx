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
  Image as ImageIcon
} from 'lucide-react';
import RichEditor from '../../components/RichEditor';
import { compressImage } from '../../utils/imageCompressor';
import DOMPurify from 'dompurify';

export default function BlogsPage({
  blogs = [],
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  showToast
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor' | 'preview'
  const [editingBlog, setEditingBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '/gpt-8.jpeg',
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

  // Open Create Mode
  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '/gpt-8.jpeg',
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
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '/gpt-8.jpeg',
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

  // Title change with auto-slug generator
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, title: val };
      if (!editingBlog) {
        updated.slug = val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
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
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && b.status === 'Published') ||
      (statusFilter === 'draft' && b.status === 'Draft');
    return matchesSearch && matchesStatus;
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

              {/* Author */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2225] mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="e.g. Miss Nous Team"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-semibold text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
                />
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
            Publish articles, self-care guides, and wellness stories that sync directly to the live website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-[#FFF9F5] font-sans text-xs sm:text-sm font-bold shadow-pink-glow transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create New Article
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#F7D6DF] shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title or author..."
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
            {searchTerm || statusFilter !== 'all'
              ? 'No articles match your current filter. Try adjusting your search query.'
              : 'You have not created any blog posts yet. Click the button below to publish your first article!'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9E3F5C] text-white text-xs font-bold shadow-pink-glow hover:bg-[#7C2F47] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Write First Story
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-[#F7D6DF] overflow-hidden shadow-luxury">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F7D6DF] bg-[#FFF9F5] text-[11px] font-bold text-[#A09095] uppercase tracking-wider">
                  <th className="px-6 py-4">Article</th>
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



                    {/* Author */}
                    <td className="px-6 py-4 text-[#5A4B50] font-medium">
                      {blog.author || 'Miss Nous Team'}
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

    </div>
  );
}
