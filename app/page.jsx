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
    <main className="min-h-screen bg-[var(--background)] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* ============================================================ */}
        {/* شريط التنقل */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--nav-border)]">


          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiBookOpen size={14} />
              <span className="font-semibold text-[var(--foreground)]">
                {posts.length}
              </span>
              {messages.articleCount}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
            <span className="flex items-center gap-1.5">
              <FiTag size={14} />
              <span className="font-semibold text-[var(--foreground)]">
                {categories.length}
              </span>
              {messages.categoryCount}
            </span>
          </div>
          {locale !== "ar" &&
            posts.some((post) => post.translationAvailable !== true) && (
              <p
                className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-[var(--text-muted)]"
                role="status"
              >
                {messages.translationUnavailable}
              </p>
            )}
        </div>

        {/* ============================================================ */}
        {/* Hero Section — ترحيبي ومتوازن */}
        {/* ============================================================ */}
        <div className="text-center mb-16">
          {/* Avatar */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--primary)]/20 mb-5 relative">
            <FiFeather className="text-[var(--primary)]" size={32} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--nav-bg)] border-2 border-[var(--background)] flex items-center justify-center">
              <span className="text-[10px]">✨</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-4">
            {messages.welcome}{" "}
            <span className="text-[var(--primary)]">{messages.myBlog}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {messages.introduction}
          </p>

          {/* Author Tag */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-[var(--nav-bg)] border border-[var(--nav-border)]">
            <FiUser className="text-[var(--primary)]" size={14} />
            <span className="text-sm text-[var(--text-muted)]">
              {messages.by}{" "}
              <span className="text-[var(--foreground)] font-medium">
                {messages.blogAuthor}
              </span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Featured Posts */}
        {/* ============================================================ */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FiStar className="text-amber-400" size={20} />
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {messages.featured}
              </h2>
              <div className="flex-1 h-px bg-[var(--nav-border)]" />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Main Featured */}
              {featuredPosts[0] && (
                <Link
                  href={`/blog/${encodeURIComponent(featuredPosts[0].slug)}${langSuffix}`}
                  className="group md:row-span-2 relative overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-7 hover:border-[var(--primary)] transition-colors"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)]/5 rounded-full blur-3xl" />

                  <div className="relative h-full flex flex-col">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                        <FiStar size={10} />
                        {messages.newest}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                        {featuredPosts[0].category || messages.general}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-3">
                      {featuredPosts[0].title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-5 flex-1">
                      {featuredPosts[0].excerpt || messages.noExcerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--nav-border)]">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={13} />
                        {featuredPosts[0].created_at
                          ? formatBlogDate(featuredPosts[0].created_at, locale, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : messages.newPost}
                      </span>
                      <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                        <span>{messages.readMore}</span>
                        <FiArrowLeft
                          className="group-hover:-translate-x-0.5 transition-transform"
                          size={13}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Side Featured */}
              <div className="space-y-5">
                {featuredPosts.slice(1, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${encodeURIComponent(post.slug)}${langSuffix}`}
                    className="group block relative overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-5 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                        {post.category || messages.general}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                      {post.excerpt || messages.noExcerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--nav-border)]">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={12} />
                        {post.created_at
                          ? formatBlogDate(post.created_at, locale, {
                              month: "short",
                              day: "numeric",
                            })
                          : messages.newPost}
                      </span>
                      <FiArrowLeft
                        className="text-[var(--primary)] group-hover:-translate-x-0.5 transition-transform"
                        size={12}
                      />
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
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <FiTag className="text-[var(--primary)]" size={18} />
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {messages.categories}
              </h2>
              <div className="flex-1 h-px bg-[var(--nav-border)]" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${encodeURIComponent(category)}${langSuffix}`}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                >
                  <FaHashtag size={11} />
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
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FiTrendingUp className="text-[var(--primary)]" size={18} />
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {messages.allPosts}
              </h2>
              <div className="flex-1 h-px bg-[var(--nav-border)]" />
              <span className="text-xs text-[var(--text-muted)]">
                {latestPosts.length} {messages.articleCount}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${encodeURIComponent(post.slug)}${langSuffix}`}
                  className="group block p-5 rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] hover:border-[var(--primary)] transition-colors"
                >
                  {/* Category + Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                      {post.category || messages.general}
                    </span>
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5"
                        >
                          <FaHashtag size={8} />
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt || messages.noExcerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)] pt-3 border-t border-[var(--nav-border)]">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={12} />
                      {post.created_at
                        ? formatBlogDate(post.created_at, locale, {
                            month: "short",
                            day: "numeric",
                          })
                        : messages.newPost}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={12} />
                      {post.reading_time || 3} {messages.minutes}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium mr-auto">
                      {messages.read}
                      <FiArrowLeft
                        className="group-hover:-translate-x-0.5 transition-transform"
                        size={11}
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
          <div className="text-center py-24 px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--nav-bg)] border border-[var(--nav-border)] mb-5">
              <FiFeather className="text-[var(--text-muted)]" size={24} />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
              {messages.noPosts}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {messages.comingSoon}
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* Newsletter CTA */}
        {/* ============================================================ */}
        <section className="mt-16 mb-10">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-8 sm:p-10 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <FiMail className="text-[var(--primary)]" size={20} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
                {messages.wantMore}
              </h3>
              <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-5 leading-relaxed">
                {messages.browseCategories}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://github.com/eslam-cmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/islam-hadaya-60a056357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--nav-border)] bg-[var(--background)] text-[var(--foreground)] text-sm font-medium hover:border-[var(--primary)] transition-colors"
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
        <footer className="pt-8 border-t border-[var(--nav-border)] text-center">
          <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <FiFeather size={12} />
            {messages.footer}
          </p>
        </footer>
      </div>
    </main>
  );
}
