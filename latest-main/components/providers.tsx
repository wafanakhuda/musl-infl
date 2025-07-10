"use client"

import { AuthProvider as OriginalAuthProvider } from "../hooks/use-auth"
import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  return <OriginalAuthProvider>{children}</OriginalAuthProvider>
}
