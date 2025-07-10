"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Badge } from "../../components/ui/badge"
import { Globe, Check } from "lucide-react"
import { useI18n } from "../../hooks/use-i18n"
import type { Locale } from "../../lib/i18n/config"


interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "flag-only"
  showLabel?: boolean
  className?: string
}

export function LanguageSwitcher({ variant = "default", showLabel = true, className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale, availableLocales, localeConfig, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLocaleConfig = localeConfig[locale]

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  if (variant === "flag-only") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
            aria-label={t("navigation.changeLanguage")}
          >
            <span className="text-lg">{currentLocaleConfig.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableLocales.map((loc) => {
            const config = localeConfig[loc]
            return (
              <DropdownMenuItem
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{config.flag}</span>
                  <span className={config.rtl ? "font-arabic" : ""}>{config.nativeName}</span>
                </div>
                {locale === loc && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`h-8 px-2 ${className}`}>
            <span className="text-sm">{currentLocaleConfig.flag}</span>
            <span className="ml-1 text-xs font-medium">{locale.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableLocales.map((loc) => {
            const config = localeConfig[loc]
            return (
              <DropdownMenuItem
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span>{config.flag}</span>
                  <span className={config.rtl ? "font-arabic" : ""}>{config.nativeName}</span>
                </div>
                {locale === loc && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center space-x-2 ${className}`}>
          <Globe className="h-4 w-4" />
          {showLabel && (
            <>
              <span className="text-sm">{currentLocaleConfig.flag}</span>
              <span className={`text-sm ${currentLocaleConfig.rtl ? "font-arabic" : ""}`}>
                {currentLocaleConfig.nativeName}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("navigation.selectLanguage")}</h4>
          <div className="space-y-1">
            {availableLocales.map((loc) => {
              const config = localeConfig[loc]
              const isSelected = locale === loc

              return (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`flex items-center justify-between cursor-pointer p-2 rounded-md ${
                    isSelected ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{config.flag}</span>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${config.rtl ? "font-arabic" : ""}`}>
                        {config.nativeName}
                      </span>
                      <span className="text-xs text-muted-foreground">{config.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {config.rtl && (
                      <Badge variant="secondary" className="text-xs">
                        RTL
                      </Badge>
                    )}
                    {isSelected && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
