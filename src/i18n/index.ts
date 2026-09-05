import en from './en.json';
import ml from './ml.json';
import ta from './ta.json';
import hi from './hi.json';

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
  if (dictionaries[lang] && dictionaries[lang][key]) {
    return dictionaries[lang][key];
  }
  if (dictionaries.en && dictionaries.en[key]) {
    return dictionaries.en[key];
  }
  return key;
}
