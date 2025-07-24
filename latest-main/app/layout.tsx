// File: latest-main/app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../hooks/use-auth"
import { CartProvider } from "../hooks/use-cart"  // ADD THIS IMPORT
import { LayoutWrapper } from "../components/layout-wrapper"
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema, pageMetadata } from "../lib/seo"
import { Toaster } from "sonner"  // ADD THIS IMPORT

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = generateMetadata(pageMetadata.home)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/marketing/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/marketing/favicon.ico" type="image/x-icon" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional meta tags */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}