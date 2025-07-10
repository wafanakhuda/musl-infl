import { type Locale, localeConfig, defaultLocale } from "./config"

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, locale: Locale = defaultLocale as Locale, currency?: string): string {
  const config = localeConfig[locale]
  const currencyCode = currency || config.currency

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number based on locale
 */
export function formatNumber(
  number: number,
  locale: Locale = defaultLocale as Locale,
  options?: Intl.NumberFormatOptions,
): string {
  const config = localeConfig[locale]
  return new Intl.NumberFormat(locale, {
    ...config.numberFormat,
    ...options,
  }).format(number)
}

/**
 * Format date based on locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale = defaultLocale as Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale: Locale = defaultLocale as Locale): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute")
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour")
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day")
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month")
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year")
  }
}

/**
 * Get Islamic date (Hijri calendar)
 */
export function formatIslamicDate(date: Date | string, locale: Locale = defaultLocale as Locale): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  try {
    return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj)
  } catch {
    // Fallback to regular date if Islamic calendar not supported
    return formatDate(dateObj, locale)
  }
}

/**
 * Pluralization helper
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  locale: Locale = defaultLocale as Locale,
): string {
  const pluralForm = plural || `${singular}s`

  const pr = new Intl.PluralRules(locale)
  const rule = pr.select(count)

  switch (rule) {
    case "one":
      return singular
    default:
      return pluralForm
  }
}

/**
 * Get text direction for locale
 */
export function getTextDirection(locale: Locale): "ltr" | "rtl" {
  return localeConfig[locale]?.rtl ? "rtl" : "ltr"
}

/**
 * Get locale from URL or browser
 */
export function getLocaleFromUrl(pathname: string): Locale | null {
  const segments = pathname.split("/")
  const potentialLocale = segments[1]

  if (potentialLocale && Object.keys(localeConfig).includes(potentialLocale)) {
    return potentialLocale as Locale
  }

  return null
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string, locale: Locale): string {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(`/${locale}`.length) || "/"
  }
  return pathname
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`
}
