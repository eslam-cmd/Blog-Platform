import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import { FiCalendar, FiClock, FiArrowLeft } from "react-icons/fi";
import { formatBlogDate, getBlogMessages, normalizeLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const locales = ["ar", "en", "de", "fa", "ru"];
  const categoriesByLocale = await Promise.all(
    locales.map((locale) => getAllCategories(locale)),
  );
  const uniqueCategories = new Set(categoriesByLocale.flat());
  return [...uniqueCategories].map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params, searchParams }) {
  const { category } = await params;
  const { lang } = await searchParams;
  const messages = getBlogMessages(normalizeLocale(lang));
  const decodedCategory = decodeURIComponent(category);
  return {
    title: `${decodedCategory} | ${messages.siteTitle}`,
    description: `${messages.articlesInCategory}: ${decodedCategory}`,
  };
}

export default function CategoryPage({ params, searchParams }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <LocalizedCategoryPage params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function LocalizedCategoryPage({ params, searchParams }) {
  const { category } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const messages = getBlogMessages(locale);
  const langSuffix = locale === "ar" ? "" : `?lang=${locale}`;
  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory, locale);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <Link
            href={`/${langSuffix}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors mb-4"
          >
            <FiArrowLeft size={18} />
            {messages.backToBlog}
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            📂 {decodedCategory}
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">
            {posts.length} {messages.articlesInCategory}
          </p>
        </div>
        {locale !== "ar" &&
          posts.some((post) => post.translationAvailable !== true) && (
            <p
              className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-[var(--text-muted)]"
              role="status"
            >
              {messages.translationUnavailable}
            </p>
          )}

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${encodeURIComponent(post.slug)}${langSuffix}`}
              className="group block p-6 rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={14} />
                  {formatBlogDate(post.created_at || post.date, locale)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock size={14} />
                  {post.readingTime || post.reading_time || 3} {messages.minutes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
