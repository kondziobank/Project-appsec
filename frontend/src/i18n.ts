import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from 'i18next-browser-languagedetector'
import languagesConfig, { LanguagesConfig } from 'src/common/languages';

function extractTranslations(languages: LanguagesConfig) {
  return Object.fromEntries(Object.entries(languages)
    .map(([key, { translation }]) => [key, { translation }]))
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: extractTranslations(languagesConfig),
    supportedLngs: Object.keys(languagesConfig),
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
  });

// Fix storing pl-PL in localStorage and causing error
if (i18n.language.indexOf('-') !== -1) {
  i18n.changeLanguage(i18n.language.split('-')[0]);
}

export default i18n;
