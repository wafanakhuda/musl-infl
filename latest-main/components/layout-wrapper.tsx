"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"

interface Props {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: Props) {
  const pathname = usePathname()

  const isMinimalRoute =
    pathname?.startsWith("/dashboard/creator") ||
    pathname?.startsWith("/messages") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/portfolio") ||
    pathname === "/brand" // ✅ Exclude navigation on brand landing

  return (
    <>
      {!isMinimalRoute && <Navigation />}
      {children}
    </>
  )
}
