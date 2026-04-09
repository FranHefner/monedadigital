import { useTranslation } from "react-i18next";

const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * useLanguage — provides current language and toggle function.
 * Language is persisted to localStorage via i18n config.
 */
export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = (
    SUPPORTED_LANGUAGES.includes(i18n.language as Language)
      ? i18n.language
      : "es"
  ) as Language;

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const toggleLanguage = () => {
    setLanguage(currentLanguage === "es" ? "en" : "es");
  };

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
