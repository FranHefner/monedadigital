import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * LoginPage — Internet Identity login screen.
 * Full-screen, mobile-first, logo-first visual hierarchy.
 */
export default function LoginPage() {
  const { t } = useTranslation("auth");
  const { login, isLoggingIn, isInitializing } = useAuth();

  const isLoading = isLoggingIn || isInitializing;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="login-page"
    >
      {/* Top bar — language switcher */}
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>

      {/* Centered card */}
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-card rounded-2xl border border-border shadow-md p-8 flex flex-col items-center gap-7">
            {/* Logo — prominent, logo-first hierarchy */}
            <div className="flex flex-col items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="monedaDigital"
                className="h-20 w-auto object-contain"
                data-ocid="login-logo"
              />
              <h1 className="font-display text-2xl font-bold text-primary tracking-tight">
                monedaDigital
              </h1>
              <p className="text-sm text-muted-foreground text-center leading-snug">
                {t("login.subtitle")}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-border" />

            {/* Login button — green CTA (#86CCA4 = accent) */}
            <div className="w-full space-y-4">
              <Button
                onClick={login}
                disabled={isLoading}
                size="lg"
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm gap-2 rounded-xl transition-smooth active:scale-95"
                data-ocid="login-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t("login.loading")}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {t("login.button")}
                  </>
                )}
              </Button>

              {/* Description */}
              <p className="text-center text-xs text-muted-foreground leading-relaxed px-2">
                {t("login.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
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
