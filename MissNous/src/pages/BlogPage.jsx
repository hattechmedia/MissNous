import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, User, ChevronLeft, Calendar, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import NewsletterSection from '../components/NewsletterSection';
import api from '../services/api';
import DOMPurify from 'dompurify';

export default function BlogPage({ blogs = [], onNavigate }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Local blogs list synchronized with props, API & storage
  const [blogList, setBlogList] = useState(() => {
    try {
      const cached = localStorage.getItem('missnous_published_blogs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return Array.isArray(blogs) && blogs.length > 0 ? blogs : BLOG_POSTS;
  });

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Sync when blogs prop updates
  useEffect(() => {
    if (Array.isArray(blogs) && blogs.length > 0) {
      setBlogList(blogs);
    }
  }, [blogs]);

  // Fetch blogs on mount & listen to BroadcastChannel + localStorage
  useEffect(() => {
    const fetchBlogsFromApi = async () => {
      try {
        const data = await api.get('/blogs');
        if (Array.isArray(data) && data.length > 0) {
          setBlogList(data);
          localStorage.setItem('missnous_published_blogs', JSON.stringify(data));
        }
      } catch (err) {
        // Fallback to localStorage
        try {
          const cached = localStorage.getItem('missnous_published_blogs');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) setBlogList(parsed);
          }
        } catch (e) {}
      }
    };

    fetchBlogsFromApi();

    // BroadcastChannel sync from Admin Panel in real time
    let bc;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('missnous_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_BLOGS' && Array.isArray(event.data.blogs)) {
          setBlogList(event.data.blogs.filter(b => b.status !== 'Draft'));
        }
      };
    }

    const handleStorageChange = (e) => {
      if (e.key === 'missnous_published_blogs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBlogList(parsed.filter(b => b.status !== 'Draft'));
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter only Published posts
  const publishedPosts = blogList.filter(p => p.status !== 'Draft');

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ────────────────────────────────────────────────────
  //   SINGLE POST DETAIL VIEW
  // ────────────────────────────────────────────────────
  if (selectedPost) {
    return (
      <article className="min-h-screen bg-[#FDF2F5]">
        {/* Post Hero */}
        <div className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[520px] flex items-end overflow-hidden bg-[#2B2225]">
          <img
            src={selectedPost.coverImage || '/gpt-8.jpeg'}
            alt={selectedPost.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/95 via-[#2B2225]/50 to-[#2B2225]/30"></div>
          <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-8 pb-10 sm:pb-14 pt-32 space-y-4">
            <button
              onClick={() => { setSelectedPost(null); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold hover:bg-white transition-all shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Articles
            </button>
            <div className="flex flex-wrap items-center gap-3 text-[#FFF9F5]/80 text-xs font-sans font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(selectedPost.date || selectedPost.createdAt)}
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl lg:text-5xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
              {selectedPost.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#E8D3A5] font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {selectedPost.author || 'Miss Nous Team'}
            </p>
          </div>
        </div>

        {/* Post Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-8">
          {selectedPost.excerpt && (
            <p className="font-sans text-[18px] text-[#5A4B50] leading-relaxed font-medium italic border-l-4 border-[#D4AF6A] pl-5 py-2 bg-[#FFF9F5] rounded-r-2xl">
              {selectedPost.excerpt}
            </p>
          )}

          {/* Post Content: Supports Rich HTML as well as Paragraph Arrays */}
          {Array.isArray(selectedPost.content) ? (
            <div className="space-y-6">
              {selectedPost.content.map((paragraph, i) => (
                <p key={i} className="font-sans text-[18px] text-[#2B2225] leading-[1.85] font-normal">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div
              className="font-sans text-[18px] text-[#2B2225] leading-[1.85] space-y-4
                [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-bold [&>h2]:text-[#2B2225] [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:leading-snug
                [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-[#9E3F5C] [&>h3]:mt-6 [&>h3]:mb-2
                [&>p]:text-[#2B2225] [&>p]:leading-[1.85]
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:my-4
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:my-4
                [&>li]:text-[#2B2225]
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#D4AF6A] [&>blockquote]:pl-5 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:text-[#5A4B50] [&>blockquote]:bg-[#FFF9F5] [&>blockquote]:rounded-r-xl [&>blockquote]:my-6
                [&>img]:rounded-2xl [&>img]:shadow-luxury [&>img]:max-w-full [&>img]:w-full [&>img]:object-cover [&>img]:my-6
                [&>a]:text-[#9E3F5C] [&>a]:underline [&>a]:font-semibold hover:[&>a]:text-[#7C2F47]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
            />
          )}

          {/* Author Card */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FFF9F5] border border-[#F7D6DF] shadow-luxury flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center text-xl font-bold font-sans shadow-pink-glow flex-shrink-0">
              {(selectedPost.author || 'M').charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-sans text-sm font-bold text-[#2B2225]">{selectedPost.author || 'Miss Nous Team'}</p>
              <p className="font-sans text-xs text-[#A09095] mt-0.5">
                Contributing writer at Miss Nous — passionate about clean beauty, intimate wellness, and empowering self-care conversations.
              </p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ────────────────────────────────────────────────────
  //   BLOG LISTING VIEW
  // ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF2F5]">

      {/* ──── HERO SECTION (Height, gpt-8.jpeg image & overlay matching About Us page) ──── */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 text-center overflow-hidden border-b border-[#F7D6DF]/60 bg-[#2B2225] flex items-center justify-center">

        {/* Background Image /gpt-8.jpeg with About Us page opacity overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gpt-8.jpeg"
            alt="Miss Nous Journal"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/60 via-[#2B2225]/25 to-[#2B2225]/40"></div>
        </div>

        {/* Text Overlay */}
        <div className={`relative z-10 max-w-4xl mx-auto space-y-4 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Eyebrow Badge (matching About Us page style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F7D6DF] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3F5C] animate-pulse" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9E3F5C]">
              Our Journal
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium text-[#FFF9F5] tracking-tight leading-[1.15] drop-shadow-md">
            Stories of Wellness & Care
          </h1>

          {/* Description */}
          <p className="font-sans text-[18px] text-[#F7D6DF] max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            Discover expert insights, ingredient deep-dives, and self-care rituals crafted to elevate your intimate wellness journey.
          </p>
        </div>
      </section>


      {/* ──── ARTICLES SECTION ──── */}
      <section id="blog-posts" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-14 sm:py-20">
        {publishedPosts.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 sm:py-20 px-6 sm:px-10 bg-white rounded-[2.5rem] border border-[#F7D6DF] shadow-luxury space-y-4 reveal-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF2F5] border border-[#F7D6DF] flex items-center justify-center text-[#9E3F5C] shadow-sm">
              <BookOpen className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#2B2225]">
              Articles Coming Soon
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A09095] leading-relaxed max-w-md mx-auto">
              We are currently preparing thoughtful stories, guides, and expert wellness insights. Check back soon for our latest publications!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section Header */}
            <div className="space-y-3 reveal-up text-center">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF6A]">Our Journal</span>
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2225] tracking-tight">
                Latest Articles & Insights
              </h2>
            </div>

            {/* Posts Grid: Uniform Card Heights and Consistent Aspect Ratios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {publishedPosts.map((post, index) => (
                <button
                  key={post._id || post.id || post.slug}
                  onClick={() => { setSelectedPost(post); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                  className="group text-left rounded-3xl overflow-hidden bg-white border border-[#F7D6DF]/80 shadow-luxury hover:shadow-pink-glow transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full cursor-pointer"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {/* Top: Card Cover Image with Consistent Aspect Ratio */}
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B2225]">
                      <img
                        src={post.coverImage || '/gpt-8.jpeg'}
                        alt={post.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2B2225]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[#A09095] text-[11px] font-sans font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.date || post.createdAt)}</span>
                      </div>

                      <h3 className="font-sans text-base sm:text-lg font-bold text-[#2B2225] leading-snug group-hover:text-[#9E3F5C] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-[#5A4B50] leading-relaxed line-clamp-2">
                        {post.excerpt || (typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) : '')}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Card Footer */}
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-[#F7D6DF]/60">
                      <p className="font-sans text-[11px] text-[#A09095] font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author || 'Miss Nous Team'}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[#9E3F5C] font-sans text-[11px] font-bold group-hover:gap-2 transition-all">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ──── NEWSLETTER CTA (Exact same CTA from Homepage) ──── */}
      <NewsletterSection />

    </div>
  );
}
