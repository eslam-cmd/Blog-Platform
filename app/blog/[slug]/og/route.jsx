import { ImageResponse } from "next/og";
import { getPostBySlug, normalizePostSlug } from "@/lib/posts";
import { getBlogMessages, normalizeLocale } from "@/lib/i18n";

export async function GET(request, { params }) {
  const { slug } = await params;
  const locale = normalizeLocale(
    new URL(request.url).searchParams.get("lang"),
  );
  const post = await getPostBySlug(normalizePostSlug(slug), locale);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const messages = getBlogMessages(locale);
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 4) : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#f8fafc",
          background:
            "linear-gradient(135deg, #07111f 0%, #10233f 58%, #123c55 100%)",
          direction: locale === "ar" ? "rtl" : "ltr",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#93c5fd",
            fontSize: 24,
          }}
        >
          <span>{messages.siteTitle}</span>
          <span style={{ color: "#6ee7b7", fontSize: 20 }}>
            {post.category || " "}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.25,
              maxHeight: 230,
              overflow: "hidden",
            }}
          >
            {String(post.title || "").slice(0, 120)}
          </div>
          <div style={{ display: "flex", color: "#cbd5e1", fontSize: 24 }}>
            {post.author || messages.blogAuthor}
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "flex",
                    borderRadius: 999,
                    border: "1px solid #475569",
                    padding: "8px 16px",
                    color: "#bfdbfe",
                    fontSize: 18,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            width: 72,
            height: 6,
            borderRadius: 999,
            background: "#34d399",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
