import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * LanguageSwitcher — compact ES | EN toggle for use in header and any screen.
 */
export function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Switch language"
      data-ocid="lang-switcher"
      className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={
          currentLanguage === "es"
            ? "text-primary font-bold"
            : "text-muted-foreground"
        }
      >
        ES
      </span>
      <span className="text-muted-foreground select-none">|</span>
      <span
        className={
          currentLanguage === "en"
            ? "text-primary font-bold"
            : "text-muted-foreground"
        }
      >
        EN
      </span>
    </button>
  );
}
