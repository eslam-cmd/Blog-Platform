import { Suspense } from "react";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import {
  FiClock,
  FiCalendar,
  FiArrowLeft,
  FiBookOpen,
  FiUser,
  FiTag,
  FiFeather,
  FiStar,
  FiTrendingUp,
  FiMail,
} from "react-icons/fi";
import { FaHashtag } from "react-icons/fa";
import { formatBlogDate, getBlogMessages, normalizeLocale } from "@/lib/i18n";

export async function generateMetadata({ searchParams }) {
  const { lang } = await searchParams;
  const messages = getBlogMessages(normalizeLocale(lang));
  return { title: messages.siteTitle, description: messages.siteDescription };
}

export default function BlogPage({ searchParams }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <LocalizedBlogPage searchParams={searchParams} />
    </Suspense>
  );
}

async function LocalizedBlogPage({ searchParams }) {
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const messages = getBlogMessages(locale);
  const langSuffix = locale === "ar" ? "" : `?lang=${locale}`;
  const posts = await getAllPosts(locale);
  const categories = await getAllCategories(locale);

  // مقالات مميزة (آخر 3 مقالات)
  const featuredPosts = posts.slice(0, 3);
  const latestPosts = posts.slice(3);

  return (
    <main 
      className="min-h-screen bg-[var(--background)] py-12 sm:py-20 relative overflow-hidden"
      style={{
        // إضافة شبكة النقاط الناعمة (Dot Grid) في الخلفية
        backgroundImage: `radial-gradient(var(--nav-border) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundPosition: "center",
      }}
    >
      {/* توهج خلفي ناعم جداً لإضافة عمق للتصميم */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* حاوية المحتوى مع z-10 لضمان ظهوره فوق النقاط */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ============================================================ */}
        {/* شريط التنقل والإحصائيات */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 pb-5 border-b border-[var(--nav-border)] gap-4">
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] bg-[var(--background)] px-4 py-2 rounded-full border border-[var(--nav-border)] shadow-sm backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <FiBookOpen size={14} className="text-[var(--primary)]" />
              <span className="font-bold text-[var(--foreground)]">
                {posts.length}
              </span>
              {messages.articleCount}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--nav-border)]" />
            <span className="flex items-center gap-1.5">
              <FiTag size={14} className="text-[var(--primary)]" />
              <span className="font-bold text-[var(--foreground)]">
                {categories.length}
              </span>
              {messages.categoryCount}
            </span>
          </div>
          
          {locale !== "ar" &&
            posts.some((post) => post.translationAvailable !== true) && (
              <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-500/90 font-medium" role="status">
                {messages.translationUnavailable}
              </p>
            )}
        </div>

        {/* ============================================================ */}
        {/* Hero Section */}
        {/* ============================================================ */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--primary)]/20 mb-6 relative shadow-sm hover:shadow-[var(--primary)]/10 transition-shadow bg-[var(--background)]">
            <FiFeather className="text-[var(--primary)]" size={32} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border)] flex items-center justify-center shadow-sm">
              <span className="text-xs">✨</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] leading-tight mb-5 tracking-tight">
            {messages.welcome}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]">
              {messages.myBlog}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-8">
            {messages.introduction}
          </p>

          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[var(--background)] border border-[var(--nav-border)] shadow-sm backdrop-blur-sm">
            <FiUser className="text-[var(--primary)]" size={16} />
            <span className="text-sm text-[var(--text-muted)]">
              {messages.by}{" "}
              <span className="text-[var(--foreground)] font-semibold ml-1">
                {messages.blogAuthor}
              </span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Featured Posts */}
        {/* ============================================================ */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FiStar className="text-amber-500" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {messages.featured}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--nav-border)] to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Main Featured */}
              {featuredPosts[0] && (
                <Link
                  href={`/blog/${encodeURIComponent(featuredPosts[0].slug)}${langSuffix}`}
                  className="group md:row-span-2 relative overflow-hidden rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] p-8 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--primary)]/20 transition-colors" />

                  <div className="relative h-full flex flex-col z-10">
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
                        <FiStar size={12} />
                        {messages.newest}
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)]">
                        {featuredPosts[0].category || messages.general}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-4">
                      {featuredPosts[0].title}
                    </h3>

                    <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-6 flex-1">
                      {featuredPosts[0].excerpt || messages.noExcerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-5 border-t border-[var(--nav-border)]">
                      <span className="flex items-center gap-2">
                        <FiCalendar size={14} />
                        {featuredPosts[0].created_at
                          ? formatBlogDate(featuredPosts[0].created_at, locale, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : messages.newPost}
                      </span>
                      <span className="flex items-center gap-1.5 text-[var(--primary)] font-bold bg-[var(--primary)]/10 px-3 py-1.5 rounded-full group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                        {messages.readMore}
                        <FiArrowLeft
                          className="group-hover:-translate-x-1 transition-transform"
                          size={14}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Side Featured */}
              <div className="space-y-6">
                {featuredPosts.slice(1, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${encodeURIComponent(post.slug)}${langSuffix}`}
                    className="group block relative overflow-hidden rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] p-6 hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)]">
                        {post.category || messages.general}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-2.5 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt || messages.noExcerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--nav-border)]">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={13} />
                        {post.created_at
                          ? formatBlogDate(post.created_at, locale, {
                              month: "short",
                              day: "numeric",
                            })
                          : messages.newPost}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[var(--primary)]/5 flex items-center justify-center group-hover:bg-[var(--primary)]/15 transition-colors">
                        <FiArrowLeft
                          className="text-[var(--primary)] group-hover:-translate-x-0.5 transition-transform"
                          size={13}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* Categories */}
        {/* ============================================================ */}
        {categories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                <FiTag className="text-[var(--primary)]" size={18} />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {messages.categories}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--nav-border)] to-transparent" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${encodeURIComponent(category)}${langSuffix}`}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-[var(--nav-border)] bg-[var(--background)] text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:shadow-sm transition-all duration-300 backdrop-blur-sm"
                >
                  <FaHashtag size={12} className="text-[var(--primary)] opacity-70 group-hover:opacity-100" />
                  <span>{category}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* All Posts */}
        {/* ============================================================ */}
        {latestPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                <FiTrendingUp className="text-[var(--primary)]" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {messages.allPosts}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--nav-border)] to-transparent" />
              <span className="text-sm font-medium text-[var(--text-muted)] bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--nav-border)] backdrop-blur-sm">
                {latestPosts.length} {messages.articleCount}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${encodeURIComponent(post.slug)}${langSuffix}`}
                  className="group flex flex-col p-6 rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)]">
                      {post.category || messages.general}
                    </span>
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1 bg-[var(--nav-bg)] px-2 py-0.5 rounded-md border border-[var(--nav-border)]"
                        >
                          <FaHashtag size={9} className="opacity-50" />
                          {tag}
                        </span>
                      ))}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-2.5 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-5 flex-1">
                    {post.excerpt || messages.noExcerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)] pt-4 border-t border-[var(--nav-border)]">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={13} className="opacity-70" />
                      {post.created_at
                        ? formatBlogDate(post.created_at, locale, {
                            month: "short",
                            day: "numeric",
                          })
                        : messages.newPost}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} className="opacity-70" />
                      {post.reading_time || 3} {messages.minutes}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--primary)] ml-auto group-hover:gap-2 transition-all">
                      {messages.read}
                      <FiArrowLeft
                        className="group-hover:-translate-x-0.5 transition-transform"
                        size={12}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* Empty State */}
        {/* ============================================================ */}
        {posts.length === 0 && (
          <div className="text-center py-28 px-6 rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-6">
              <FiFeather className="text-[var(--primary)] opacity-50" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              {messages.noPosts}
            </h2>
            <p className="text-base text-[var(--text-muted)] max-w-md mx-auto">
              {messages.comingSoon}
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* Newsletter CTA */}
        {/* ============================================================ */}
        <section className="mt-20 mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] p-10 sm:p-14 text-center group hover:border-[var(--primary)]/30 transition-colors duration-500 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[var(--primary)]/10 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[var(--primary)]/10 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6 shadow-sm">
                <FiMail className="text-[var(--primary)]" size={24} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
                {messages.wantMore}
              </h3>
              <p className="text-base text-[var(--text-muted)] max-w-lg mx-auto mb-8 leading-relaxed">
                {messages.browseCategories}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://github.com/eslam-cmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-md shadow-[var(--primary)]/20 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/islam-hadaya-60a056357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--foreground)] text-sm font-bold hover:border-[var(--primary)]/50 hover:bg-[var(--background)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* Footer */}
        {/* ============================================================ */}
        <footer className="pt-10 border-t border-[var(--nav-border)] text-center">
          <p className="text-sm font-medium text-[var(--text-muted)] flex items-center justify-center gap-2">
            <FiFeather size={14} className="text-[var(--primary)]" />
            {messages.footer}
          </p>
        </footer>
      </div>
    </main>
  );
}