// app/auth/layout.tsx

export const dynamic = "force-dynamic"

import { ReactNode } from "react"
import { FloatingElements } from "../../components/ui/floating-elements"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Floating animated background */}
      <FloatingElements />

      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  )
}