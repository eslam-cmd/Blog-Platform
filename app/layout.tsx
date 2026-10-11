import { Suspense } from "react";
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مدونة إسلام هداية",
  description:
    "مقالات تقنية في تطوير الويب و Next.js و React والبرمجة بشكل عام.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <LanguageSwitcher />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
