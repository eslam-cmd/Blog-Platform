const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://binaa-server.vercel.app/api";

const SUPPORTED_LOCALES = new Set(["ar", "en", "de", "fa", "ru"]);

function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.has(locale) ? locale : "ar";
}

export function normalizePostSlug(value) {
  if (value === null || value === undefined) return "";

  let slug = String(value).trim();

  try {
    const decoded = decodeURIComponent(slug);
    if (decoded && decoded !== slug) {
      slug = decoded;
    }
  } catch {
    // إذا كان الـ slug لا يحتوي على ترميز URL، نترك القيمة كما هي
  }

  return slug.normalize("NFC").trim();
}

// جلب جميع المقالات من API
export async function getAllPosts(locale = "ar") {
  try {
    const query = new URLSearchParams({ lang: normalizeLocale(locale) });
    const res = await fetch(`${API_URL}/posts?${query}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("خطأ في جلب المقالات:", res.status);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data.posts)) {
      return [];
    }

    return data.posts.map((post) => ({
      ...post,
      slug: normalizePostSlug(post.slug),
    }));
  } catch (error) {
    console.error("خطأ في جلب المقالات:", error);
    return [];
  }
}

// جلب مقالة واحدة عن طريق الـ slug
export async function getPostBySlug(slug, locale = "ar") {
  try {
    const normalizedSlug = normalizePostSlug(slug);
    const query = new URLSearchParams({ lang: normalizeLocale(locale) });
    const res = await fetch(`${API_URL}/posts?${query}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const posts = Array.isArray(data.posts)
      ? data.posts.map((post) => ({
          ...post,
          slug: normalizePostSlug(post.slug),
        }))
      : [];

    return (
      posts.find((post) => normalizePostSlug(post.slug) === normalizedSlug) ||
      null
    );
  } catch (error) {
    console.error("خطأ في جلب المقالة:", error);
    return null;
  }
}

// جلب المقالات حسب التصنيف
export async function getPostsByCategory(category, locale = "ar") {
  try {
    const posts = await getAllPosts(locale);
    return posts.filter((post) => post.category === category);
  } catch (error) {
    console.error("خطأ في جلب المقالات حسب التصنيف:", error);
    return [];
  }
}

// جلب جميع التصنيفات
export async function getAllCategories(locale = "ar") {
  try {
    const posts = await getAllPosts(locale);
    return [...new Set(posts.map((post) => post.category).filter(Boolean))];
  } catch (error) {
    console.error("خطأ في جلب التصنيفات:", error);
    return [];
  }
}
