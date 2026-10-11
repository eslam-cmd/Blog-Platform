import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug, normalizePostSlug } from "@/lib/posts";
import {
  FiArrowRight,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { formatBlogDate, getBlogMessages, normalizeLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: String(post.slug || "").trim(),
  }));
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const messages = getBlogMessages(locale);
  const normalizedSlug = normalizePostSlug(slug);
  const post = await getPostBySlug(normalizedSlug, locale);
  if (!post) return { title: messages.postNotFound };

  return {
    title: `${post.title} | ${messages.siteTitle}`,
    description: post.excerpt,
  };
}

export default function PostPage({ params, searchParams }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <LocalizedPostPage params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function LocalizedPostPage({ params, searchParams }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const messages = getBlogMessages(locale);
  const langSuffix = locale === "ar" ? "" : `?lang=${locale}`;
  const normalizedSlug = normalizePostSlug(slug);
  const post = await getPostBySlug(normalizedSlug, locale);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 sm:py-20">
      <article className="max-w-3xl mx-auto px-5 sm:px-8">
        {locale !== "ar" && post.translationAvailable !== true && (
          <p
            className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-[var(--text-muted)]"
            role="status"
          >
            {messages.translationUnavailable}
          </p>
        )}
        {/* رجوع */}
        <Link
          href={`/${langSuffix}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors mb-6"
        >
          <FiArrowRight size={18} />
          {messages.backToBlog}
        </Link>

        {/* معلومات المقالة */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              {post.category}
            </span>
            {post.tags &&
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full text-[10px] font-medium border border-[var(--nav-border)] text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiCalendar size={16} />
              {formatBlogDate(post.created_at || post.date, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser size={16} />
              {post.author}
            </span>
          </div>
        </div>

        {/* صورة الغلاف */}
        {(post.coverImage || post.cover_image) && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-[var(--nav-bg)] aspect-video flex items-center justify-center">
            <span className="text-6xl">📝</span>
          </div>
        )}

        {/* المحتوى */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-[var(--foreground)] mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-[var(--foreground)] mt-5 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 text-[var(--text-muted)] mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-[var(--text-muted)]">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-[var(--primary)] pl-4 py-2 my-4 bg-[var(--nav-bg)] rounded-l-none rounded-r-xl">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="px-2 py-0.5 rounded bg-[var(--nav-bg)] text-[var(--primary)] text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="p-4 rounded-xl bg-[var(--nav-bg)] overflow-x-auto my-4">
                  {children}
                </pre>
              ),
              hr: () => <hr className="border-[var(--nav-border)] my-8" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* قسم التفاعل */}
        <div className="mt-10 pt-8 border-t border-[var(--nav-border)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              💡 {messages.articlePrompt}
            </p>
            <Link
              href={`/${langSuffix}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              {messages.moreArticles}
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
