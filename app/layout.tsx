import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider } from "@/lib/auth-context";
import { HeaderUser } from "@/components/layout/header-user";
import { BookMarked } from "lucide-react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RefCheck — Validador de Referencias",
  description: "Extrae y valida referencias bibliográficas de PDFs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>

            {/* ── Header ─────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
              <div className="mx-auto flex max-w-4xl items-center justify-between px-4 h-12">
                <div className="flex items-center gap-2.5">
                  <BookMarked className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm tracking-tight">RefCheck</span>
                  <span className="hidden sm:block text-xs text-muted">
                    · Validador de referencias bibliográficas
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <HeaderUser />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* ── Contenido ──────────────────────────────────────── */}
            <main>{children}</main>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
