// components/ui/PageLayout.tsx

"use client"

import { FloatingElements } from "./floating-elements"

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}