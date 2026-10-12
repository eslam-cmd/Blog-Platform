"use client";

import { useState } from "react";
import { FiCheck, FiCopy, FiShare2 } from "react-icons/fi";

export default function ArticleShare({
  url,
  title,
  labels,
  className = "",
}) {
  const [status, setStatus] = useState("idle");
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function shareArticle() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    await copyArticleLink();
  }

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const copyLabel =
    status === "copied"
      ? labels.copied
      : status === "failed"
        ? labels.copyFailedLink
        : labels.copyLink;
  const CopyIcon = status === "copied" ? FiCheck : FiCopy;

  return (
    <section
      className={`rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-4 sm:p-5 ${className}`}
      aria-label={labels.share}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <FiShare2 className="text-[var(--primary)]" size={17} />
          {labels.share}
        </div>
        <div className="flex flex-wrap gap-2" dir="ltr">
     
          <button
            type="button"
            onClick={shareArticle}
            className="share-button"
            aria-label={labels.share}
          >
            <FiShare2 size={14} />
            {labels.share}
          </button>
          <button
            type="button"
            onClick={copyArticleLink}
            className="share-button"
            aria-live="polite"
          >
            <CopyIcon size={14} />
            {copyLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
