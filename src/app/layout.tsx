import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Fighter Arena",
    default: "Fighter Arena",
  },
  description:
    "Turn-based combat between Robots, Archers, and Clerics. A 2026 web rebuild of a 2019 BYU CS 235 C++ class lab.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 antialiased">
        <header className="bg-stone-900 text-stone-50">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              ⚔ Fighter Arena
            </Link>
            <Link
              href="/about"
              className="text-sm text-stone-300 hover:text-amber-300"
            >
              About
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
          <a
            href="https://github.com/matthewtannyhill/fighter-arena"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900"
          >
            github.com/matthewtannyhill/fighter-arena
          </a>
        </footer>
      </body>
    </html>
  );
}
