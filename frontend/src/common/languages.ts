import usFlag from "../assets/images/flags/us.jpg";
import poland from "../assets/images/flags/pl.jpg";
import translationsPl from 'src/locales/pl/translation.json'
import translationsEn from 'src/locales/en/translation.json'

export interface LanguageEntry {
  label: string;
  flag: string;
  translation: any;
}

export interface LanguagesConfig {
  [key: string]: LanguageEntry;
}

const languages: LanguagesConfig = {
  pl: {
    label: "Polski",
    flag: poland,
    translation: translationsPl
  },
  en: {
    label: "English",
    flag: usFlag,
    translation: translationsEn
  },
};

export default languages;
