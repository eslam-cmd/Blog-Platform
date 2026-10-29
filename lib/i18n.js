const messages = {
  ar: {
    siteTitle: "مدونة إسلام هداية",
    siteDescription: "مقالات تقنية في تطوير الويب و Next.js و React والبرمجة بشكل عام.",
    postNotFound: "المقالة غير موجودة",
    backToBlog: "العودة للمدونة",
    articlePrompt: "هل أعجبك المقال؟ شاركه مع أصدقائك!",
    moreArticles: "مقالات أخرى",
    articleCount: "مقالة",
    categoryCount: "تصنيف",
    welcome: "مرحباً بك في",
    myBlog: "مدونتي",
    blogAuthor: "إسلام هدايا",
    introduction:
      "مساحة أشارك فيها رحلتي في عالم البرمجة، التجارب العملية، والدروس المستفادة من بناء تطبيقات الويب الحديثة.",
    by: "بقلم",
    featured: "مقالات مختارة",
    newest: "الأحدث",
    readMore: "اقرأ المزيد",
    noExcerpt: "لا يوجد ملخص لهذا المقال",
    general: "عام",
    newPost: "جديد",
    categories: "التصنيفات",
    allPosts: "جميع المقالات",
    read: "اقرأ",
    noPosts: "لا توجد مقالات حالياً",
    comingSoon: "ترقبوا المقالات القادمة قريباً",
    wantMore: "هل تريد المزيد؟",
    browseCategories:
      "تصفح جميع المقالات حسب التصنيف، أو تابعني على الشبكات الاجتماعية للحصول على آخر التحديثات.",
    footer: "مدونة إسلام هدايا — صُنعت بشغف",
    back: "العودة للمدونة",
    articlesInCategory: "مقالة في هذا التصنيف",
    minutes: "دقائق",
    translationUnavailable:
      "النسخة الإنجليزية لبعض المقالات غير متاحة بعد. يجري عرض النص العربي الأصلي حتى تُضاف النسخة الإنجليزية.",
    copyCode: "نسخ",
    copied: "تم النسخ",
    copyFailed: "تعذر النسخ",
    share: "مشاركة المقال",
    shareLinkedIn: "مشاركة المقال على LinkedIn",
    shareX: "مشاركة المقال على X",
    copyLink: "نسخ الرابط",
    copyFailedLink: "تعذر نسخ الرابط",
  },
  en: {
    siteTitle: "Islam Hadaya's Blog",
    siteDescription: "Technical articles about web development, Next.js, React, and programming.",
    postNotFound: "Article not found",
    backToBlog: "Back to the blog",
    articlePrompt: "Enjoyed this article? Share it with your friends!",
    moreArticles: "More articles",
    articleCount: "articles",
    categoryCount: "categories",
    welcome: "Welcome to",
    myBlog: "my blog",
    blogAuthor: "Islam Hadaya",
    introduction:
      "A place where I share my journey in programming, practical experiences, and lessons learned building modern web applications.",
    by: "By",
    featured: "Featured articles",
    newest: "Latest",
    readMore: "Read more",
    noExcerpt: "No summary available",
    general: "General",
    newPost: "New",
    categories: "Categories",
    allPosts: "All articles",
    read: "Read",
    noPosts: "No articles yet",
    comingSoon: "Stay tuned for new articles",
    wantMore: "Want more?",
    browseCategories:
      "Browse articles by category or follow me on social media for the latest updates.",
    footer: "Islam Hadaya's Blog — Made with passion",
    back: "Back to the blog",
    articlesInCategory: "articles in this category",
    minutes: "minutes",
    translationUnavailable:
      "Some articles are not available in English yet. Their original Arabic text is shown until an English version is added.",
    copyCode: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    share: "Share article",
    shareLinkedIn: "Share article on LinkedIn",
    shareX: "Share article on X",
    copyLink: "Copy link",
    copyFailedLink: "Could not copy link",
  },



};

const dateLocales = {
  ar: "ar-EG",
  en: "en-US",
};

export function normalizeLocale(locale) {
  return locale === "en" ? "en" : "ar";
}

export function getBlogMessages(locale) {
  return messages[normalizeLocale(locale)];
}

export function formatBlogDate(date, locale, options) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(
    dateLocales[normalizeLocale(locale)],
    options,
  );
}
