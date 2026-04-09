import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  /** When true, renders without the header (e.g. login page, public menu) */
  bare?: boolean;
}

/**
 * Layout — main app layout with sticky header and scrollable content area.
 * Wrap all authenticated pages with <Layout>.
 */
export function Layout({ children, bare = false }: LayoutProps) {
  if (bare) {
    return (
      <div className="min-h-screen bg-background flex flex-col">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6">{children}</main>
      <footer className="bg-muted/40 border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} monedaDigital.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
