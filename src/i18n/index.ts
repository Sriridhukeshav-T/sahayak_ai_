import en from './en.json';
import ml from './ml.json';
import ta from './ta.json';
import hi from './hi.json';
import { PHRASE_TRANSLATIONS } from './phraseTranslations';

export type LanguageCode = 'en' | 'ml' | 'ta' | 'hi';

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

const dictionaries: Record<LanguageCode, Record<string, string>> = {
  en,
  ml,
  ta,
  hi
};

export function getTranslation(key: string, lang: LanguageCode = 'en'): string {
  if (!key) return '';

  // 1. Direct key match in target language dictionary
  if (dictionaries[lang] && dictionaries[lang][key]) {
    return dictionaries[lang][key];
  }

  // 2. Direct phrase match in PHRASE_TRANSLATIONS for target language
  if (lang !== 'en' && PHRASE_TRANSLATIONS[lang]) {
    if (PHRASE_TRANSLATIONS[lang][key]) {
      return PHRASE_TRANSLATIONS[lang][key];
    }
    const trimmed = key.trim();
    if (PHRASE_TRANSLATIONS[lang][trimmed]) {
      return PHRASE_TRANSLATIONS[lang][trimmed];
    }
  }

  // 3. Reverse lookup: Check if 'key' is an English translation value in dictionaries.en
  if (lang !== 'en') {
    const enEntries = Object.entries(dictionaries.en);
    const matchedKey = enEntries.find(([_, val]) => val.toLowerCase() === key.toLowerCase());
    if (matchedKey && dictionaries[lang] && dictionaries[lang][matchedKey[0]]) {
      return dictionaries[lang][matchedKey[0]];
    }
  }

  // 4. Default to English dictionary if key exists
  if (dictionaries.en && dictionaries.en[key]) {
    return dictionaries.en[key];
  }

  return key;
}
