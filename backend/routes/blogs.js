const express = require('express');
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Helper to auto-generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// GET /api/blogs - Public: get all blogs (optionally filter by status or admin)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.all !== 'true') {
      filter.status = 'Published';
    }
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Fetch blogs error:', err);
    res.status(500).json({ message: 'Failed to fetch blogs.' });
  }
});

// GET /api/blogs/:slugOrId - Public: get single blog by slug or ID
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let blog = null;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: slugOrId.toLowerCase() });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found.' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Get single blog error:', err);
    res.status(500).json({ message: 'Failed to fetch blog article.' });
  }
});

// POST /api/blogs - Admin only: create a new blog
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      readTime,
      date,
      status,
      featured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    let finalReadTime = readTime;
    if (!finalReadTime) {
      const words = (content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.ceil(words / 200));
      finalReadTime = `${mins} min read`;
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: (excerpt || '').trim(),
      content: content.trim(),
      coverImage: coverImage || '/gpt-8.jpeg',
      category: category || 'Wellness',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      author: author || 'Miss Nous Team',
      readTime: finalReadTime,
      date: date || new Date().toISOString(),
      status: status || 'Published',
      featured: !!featured,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      keywords: keywords || ''
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ message: err.message || 'Failed to create blog.' });
  }
});

// PUT /api/blogs/:id - Admin only: update a blog
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      readTime,
      date,
      status,
      featured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (author !== undefined) updateData.author = author.trim();
    if (readTime !== undefined) updateData.readTime = readTime;
    if (date !== undefined) updateData.date = date;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = !!featured;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (keywords !== undefined) updateData.keywords = keywords;

    if (slug) {
      updateData.slug = slugify(slug);
    } else if (title) {
      updateData.slug = slugify(title);
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found.' });
    }

    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err.message);
    res.status(500).json({ message: 'Failed to update blog.' });
  }
});

// DELETE /api/blogs/:id - Admin only: delete a blog
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found.' });
    }
    res.json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Failed to delete blog.' });
  }
});

module.exports = router;
