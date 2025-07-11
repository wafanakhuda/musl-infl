"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"

interface Props {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: Props) {
  const pathname = usePathname()

  // ✅ Only exclude navigation from auth pages
  const hideNavigation = pathname?.startsWith("/auth/")

  return (
    <>
      {!hideNavigation && <Navigation />}
      {children}
    </>
  )
}
