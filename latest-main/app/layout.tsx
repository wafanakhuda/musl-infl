import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "../components/navigation"
import { AuthProvider } from "../hooks/use-auth"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MuslimInfluencers.io - Award-Winning Halal Creator Marketplace",
  description:
    "Connect with authentic Muslim content creators. The premier marketplace for halal brand partnerships valued at 3 trillion dollars.",
  keywords: "Muslim influencers, halal marketing, Islamic content creators, Muslim marketplace",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCreatorRoute =
    pathname?.startsWith("/dashboard/creator") ||
    pathname?.startsWith("/messages") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/portfolio")

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/marketing/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/marketing/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <AuthProvider>
          {!isCreatorRoute && <Navigation />}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
