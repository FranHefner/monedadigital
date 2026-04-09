import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Header — brand header with logo on left, lang switcher + optional auth on right.
 * Used on all authenticated pages.
 */
export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation("auth");

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-xs"
      data-ocid="main-header"
    >
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/logo.png"
            alt="monedaDigital"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              aria-label={t("logout.button")}
              data-ocid="logout-btn"
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline text-xs">
                {t("logout.button")}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
