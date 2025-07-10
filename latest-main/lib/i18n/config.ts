export const defaultLocale = "en"

export const locales = [
  "en", // English
  "ar", // Arabic
  "ur", // Urdu
  "tr", // Turkish
  "ms", // Malay
  "id", // Indonesian
  "fr", // French
  "de", // German
  "es", // Spanish
  "hi", // Hindi
  "bn", // Bengali
  "fa", // Persian/Farsi
] as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ur: "اردو",
  tr: "Türkçe",
  ms: "Bahasa Melayu",
  id: "Bahasa Indonesia",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  hi: "हिन्दी",
  bn: "বাংলা",
  fa: "فارسی",
}

export const rtlLocales: Locale[] = ["ar", "ur", "fa"]

export const localeConfig: Record<
  Locale,
  {
    name: string
    nativeName: string
    flag: string
    currency: string
    dateFormat: string
    numberFormat: Intl.NumberFormatOptions
    rtl: boolean
    region: string
  }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    currency: "USD",
    dateFormat: "MM/dd/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "US",
  },
  ar: {
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    currency: "SAR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: true,
    region: "SA",
  },
  ur: {
    name: "Urdu",
    nativeName: "اردو",
    flag: "🇵🇰",
    currency: "PKR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: true,
    region: "PK",
  },
  tr: {
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    currency: "TRY",
    dateFormat: "dd.MM.yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "TR",
  },
  ms: {
    name: "Malay",
    nativeName: "Bahasa Melayu",
    flag: "🇲🇾",
    currency: "MYR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "MY",
  },
  id: {
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    currency: "IDR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "ID",
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    currency: "EUR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "FR",
  },
  de: {
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    currency: "EUR",
    dateFormat: "dd.MM.yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "DE",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    currency: "EUR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "ES",
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    currency: "INR",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "IN",
  },
  bn: {
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇧🇩",
    currency: "BDT",
    dateFormat: "dd/MM/yyyy",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: false,
    region: "BD",
  },
  fa: {
    name: "Persian",
    nativeName: "فارسی",
    flag: "🇮🇷",
    currency: "IRR",
    dateFormat: "yyyy/MM/dd",
    numberFormat: { style: "decimal", minimumFractionDigits: 0 },
    rtl: true,
    region: "IR",
  },
}

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale)
}

export function getLocaleConfig(locale: string) {
  return localeConfig[locale as Locale] || localeConfig[defaultLocale]
}

export const availableLocales = locales
export type LocaleConfigMap = typeof localeConfig

