"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { defaultLocale, localeConfig, locales as availableLocales } from "../lib/i18n/config"
import type { Locale, LocaleConfigMap } from "../lib/i18n/config"


export interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  availableLocales: Locale[]
  localeConfig: LocaleConfigMap
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Simple translations
const translations = {
  en: {
    "nav.home": "Home",
    "nav.creators": "Creators",
    "nav.campaigns": "Campaigns",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.creators": "المؤثرون",
    "nav.campaigns": "الحملات",
    "nav.dashboard": "لوحة التحكم",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "auth.login": "تسجيل الدخول",
    "auth.register": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  const t = (key: string): string => {
    return translations[locale as keyof typeof translations]?.[key as keyof typeof translations.en] || key
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        availableLocales: availableLocales.slice(), // ✅ Add this
        localeConfig       // ✅ Add this
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
