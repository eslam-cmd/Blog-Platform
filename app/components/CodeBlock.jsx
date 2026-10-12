"use client";

import { useState } from "react";
import { FiCheck, FiCopy, FiAlertCircle } from "react-icons/fi";

export default function CodeBlock({
  children,
  copyLabel,
  copiedLabel,
  copyFailedLabel,
  className = "",
}) {
  const [copyState, setCopyState] = useState("idle");
  const code = getTextContent(children).replace(/\n$/, "");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  const buttonLabel =
    copyState === "copied"
      ? copiedLabel
      : copyState === "failed"
        ? copyFailedLabel
        : copyLabel;
  const Icon =
    copyState === "copied"
      ? FiCheck
      : copyState === "failed"
        ? FiAlertCircle
        : FiCopy;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--nav-border)] bg-[#111827] ${className}`}
      dir="ltr"
    >
      <div className="flex items-center justify-end border-b border-white/10 px-3 py-2">
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          aria-live="polite"
        >
          <Icon size={14} />
          {buttonLabel}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function getTextContent(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent(node.props.children);
  }
  return "";
}
