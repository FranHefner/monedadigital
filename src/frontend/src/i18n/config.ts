import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esAuth from "./locales/es/auth.json";
import esCommon from "./locales/es/common.json";
import esErrors from "./locales/es/errors.json";
import esModules from "./locales/es/modules.json";

import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enErrors from "./locales/en/errors.json";
import enModules from "./locales/en/modules.json";

const STORAGE_KEY = "monedaDigital_lang";

const savedLang = localStorage.getItem(STORAGE_KEY) ?? "es";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      common: esCommon,
      auth: esAuth,
      modules: esModules,
      errors: esErrors,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      modules: enModules,
      errors: enErrors,
    },
  },
  lng: savedLang,
  fallbackLng: "es",
  ns: ["common", "auth", "modules", "errors"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
});

export default i18n;
