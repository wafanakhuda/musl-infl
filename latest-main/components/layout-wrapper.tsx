"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"

interface Props {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: Props) {
  const pathname = usePathname()

  const isCreatorRoute =
    pathname?.startsWith("/dashboard/creator") ||
    pathname?.startsWith("/messages") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/portfolio")

  return (
    <>
      {!isCreatorRoute && <Navigation />}
      {children}
    </>
  )
}