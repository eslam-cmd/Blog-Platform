import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkAutoCodeBlocks from "@/lib/remark-auto-code-blocks";
import { getAllPosts, getPostBySlug, normalizePostSlug } from "@/lib/posts";
import { siteUrl } from "@/lib/site";
import CodeBlock from "@/app/components/CodeBlock";
import ArticleShare from "@/app/components/ArticleShare";
import {
  FiArrowRight,
  FiCalendar,
  FiUser,
  FiClock,
  FiArrowLeft,
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

  const title = `${post.title} | ${messages.siteTitle}`;
  const canonicalUrl = new URL(`/blog/${encodeURIComponent(normalizedSlug)}`, siteUrl);
  if (locale !== "ar") canonicalUrl.searchParams.set("lang", locale);
  const imageUrl = new URL(
    `/blog/${encodeURIComponent(normalizedSlug)}/og?lang=${locale}`,
    siteUrl,
  );

  return {
    title,
    description: post.excerpt || messages.siteDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title,
      description: post.excerpt || messages.siteDescription,
      url: canonicalUrl,
      siteName: messages.siteTitle,
      locale,
      publishedTime: post.created_at || post.date,
      modifiedTime: post.updated_at || post.created_at || post.date,
      authors: post.author ? [post.author] : undefined,
      tags: Array.isArray(post.tags) ? post.tags : undefined,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt || messages.siteDescription,
      images: [{ url: imageUrl, alt: post.title }],
    },
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

  // جلب المقال الحالي
  const post = await getPostBySlug(normalizedSlug, locale);
  if (!post) {
    notFound();
  }

  // جلب كل المقالات لاختيار مقالات أخرى
  const allPosts = await getAllPosts(locale);
  const relatedPosts = allPosts
    .filter((p) => String(p.slug).trim() !== String(normalizedSlug).trim())
    .slice(0, 3); // جلب 3 مقالات أخرى كحد أقصى

  const canonicalUrl = new URL(`/blog/${encodeURIComponent(normalizedSlug)}`, siteUrl);
  if (locale !== "ar") canonicalUrl.searchParams.set("lang", locale);
  const publishedAt = getIsoDate(post.created_at || post.date);
  const modifiedAt = getIsoDate(post.updated_at || post.created_at || post.date);
  const articleImage = post.coverImage || post.cover_image;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: articleImage ? new URL(articleImage, siteUrl).toString() : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      "@type": "Person",
      name: post.author || messages.blogAuthor,
      url: siteUrl.toString(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl.toString() },
    articleSection: post.category || undefined,
    keywords: Array.isArray(post.tags) ? post.tags : undefined,
    inLanguage: locale,
  };

  return (
    <main
      className="min-h-screen bg-[var(--background)] py-12 sm:py-20 relative"
      style={{
        backgroundImage: `radial-gradient(var(--nav-border) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundPosition: "center",
      }}
    >
      <article className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

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
        <header className="mb-8 rounded-3xl border border-[var(--nav-border)] bg-[var(--background)] p-5 sm:p-8 shadow-sm backdrop-blur-sm">
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiCalendar size={16} />
              {formatBlogDate(post.created_at || post.date, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser size={16} />
              {post.author}
            </span>
          </div>
        </header>

        {/* صورة الغلاف */}
        {articleImage && (
          <div
            className="mb-10 aspect-video overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)]"
            role="img"
            aria-label={post.title}
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.2), transparent), url("${articleImage.replaceAll('"', "%22")}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        )}

        {/* المحتوى */}
        <div className="article-content mx-auto max-w-[72ch] bg-[var(--background)] backdrop-blur-sm p-2 sm:p-4 rounded-3xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkAutoCodeBlocks]}
            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
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
                isPlainCode(children) ? (
                  <CodeBlock
                    copyLabel={messages.copyCode}
                    copiedLabel={messages.copied}
                    copyFailedLabel={messages.copyFailed}
                    className="my-5"
                  >
                    <code>{getPlainText(children)}</code>
                  </CodeBlock>
                ) : (
                  <p className="mb-5 text-[var(--text-muted)] leading-8 sm:text-lg">
                    {children}
                  </p>
                )
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
                <li className="text-[var(--text-muted)] leading-8">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-6 rounded-xl border-r-4 border-[var(--primary)] bg-[var(--nav-bg)] px-5 py-4 text-[var(--foreground)]">
                  {children}
                </blockquote>
              ),
              code: ({ children, className, ...props }) => (
                <code
                  className={`${className || ""} ${
                    className
                      ? "text-sm"
                      : "rounded bg-[var(--nav-bg)] px-2 py-0.5 text-sm text-[var(--primary)]"
                  }`}
                  {...props}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <CodeBlock
                  copyLabel={messages.copyCode}
                  copiedLabel={messages.copied}
                  copyFailedLabel={messages.copyFailed}
                  className="my-6"
                >
                  {children}
                </CodeBlock>
              ),
              hr: () => <hr className="border-[var(--nav-border)] my-8" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* ============================================================ */}
        {/* قسم التفاعل (المشاركة) */}
        {/* ============================================================ */}
        <div className="mt-12 pt-8 border-t border-[var(--nav-border)]">
          <div className="flex flex-col gap-5">
            <p className="text-center text-sm text-[var(--text-muted)] sm:text-base">
              {messages.articlePrompt}
            </p>
            <ArticleShare
              url={canonicalUrl.toString()}
              title={post.title}
              labels={messages}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* قسم اقرأ المزيد (مقالات أخرى) */}
        {/* ============================================================ */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[var(--nav-border)]">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {messages.readMore || "Read More"}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--nav-border)] to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${encodeURIComponent(related.slug)}${langSuffix}`}
                  className="group flex flex-col p-5 rounded-2xl border border-[var(--nav-border)] bg-[var(--background)] hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)]">
                      {related.category || messages.general}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug mb-2 line-clamp-2">
                    {related.title}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4 flex-1">
                    {related.excerpt || messages.noExcerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--nav-border)]">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={12} />
                      {related.created_at
                        ? formatBlogDate(related.created_at, locale, {
                            month: "short",
                            day: "numeric",
                          })
                        : messages.newPost}
                    </span>
                    <span className="flex items-center gap-1 text-[var(--primary)] font-medium">
                      {messages.read || "Read"}
                      <FiArrowLeft
                        className="group-hover:-translate-x-0.5 transition-transform"
                        size={12}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={`/${langSuffix}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--background)]"
              >
                {messages.moreArticles || "View All Articles"}
                <FiArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

function getIsoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getPlainText(children) {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(getPlainText).join("");
  return "";
}

function isPlainCode(children) {
  const text = getPlainText(children);
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || text.length > 4000) return false;

  const codeLine =
    /^(?:[$#]\s|(?:const|let|var|function|class|import|export|return|if|else|for|while|try|catch|async|await|npm|npx|yarn|pnpm|git|docker|curl|SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE)\b|<\/?[a-z][^>]*>|[\w$.[\]]+\s*(?:=>|=\s*(?:async\s*)?(?:\{|["'`]|[\w[(]))|[{}[\]]|.*[;{}]\s*$)/i;
  const matchedLines = lines.filter((line) => codeLine.test(line)).length;
  return matchedLines >= 2 && matchedLines / lines.length >= 0.6;
}
