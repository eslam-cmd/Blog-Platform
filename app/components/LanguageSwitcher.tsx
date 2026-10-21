"use client";

import { useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Languages, LoaderCircle } from "lucide-react";

const LOCALES = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
] as const;

type Locale = (typeof LOCALES)[number]["code"];

function isLocale(value: string | null): value is Locale {
  return LOCALES.some((language) => language.code === value);
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const requestedLocale = searchParams.get("lang");
  const locale = isLocale(requestedLocale) ? requestedLocale : "ar";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const selectLanguage = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    const params = new URLSearchParams(searchParams.toString());
    if (nextLocale === "ar") {
      params.delete("lang");
    } else {
      params.set("lang", nextLocale);
    }

    const targetPath = pathname.startsWith("/blog/category/")
      ? "/"
      : pathname;
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${targetPath}?${query}` : targetPath);
    });
  };

  return (
    <>
      {isPending && (
        <div
          aria-label="Loading translated content"
          className="fixed inset-x-0 top-0 z-[101] h-1 overflow-hidden bg-(--primary)/20"
          role="progressbar"
        >
          <div className="translation-progress h-full w-1/3 rounded-full bg-primary" />
        </div>
      )}
      <label
        className="fixed left-4 top-4 z-[100] inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--nav-border) bg-(--nav-bg) px-3 shadow-lg backdrop-blur-md"
        data-language-switcher
      >
        {isPending ? (
          <LoaderCircle
            aria-hidden="true"
            className="animate-spin text-primary"
            size={17}
          />
        ) : (
          <Languages aria-hidden="true" className="text-primary" size={17} />
        )}
        <span className="sr-only">Website language</span>
        <select
          aria-label="Website language"
          className="max-w-32 cursor-pointer bg-transparent py-2 text-sm font-semibold text-foreground outline-none"
          disabled={isPending}
          onChange={(event) => {
            const nextLocale = event.target.value;
            if (isLocale(nextLocale)) selectLanguage(nextLocale);
          }}
          value={locale}
        >
          {LOCALES.map((language) => (
            <option
              className="bg-[var(--nav-bg)] text-[var(--foreground)]"
              key={language.code}
              value={language.code}
            >
              {language.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
