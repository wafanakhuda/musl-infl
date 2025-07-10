// ===== 1. Fixed Social Auth Callback Page =====
// File: /app/auth/social/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { FloatingElements } from "../../../components/ui/floating-elements"

export default function SocialRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const { loginWithToken } = useAuth()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      if (error) {
        setStatus('error')
        setMessage(error === 'OAuthFailed' ? 'Authentication failed. Please try again.' : error)
        return
      }

      if (token) {
        try {
          console.log('🔐 Processing OAuth token')
          localStorage.setItem("access_token", token)
          await loginWithToken(token)
          
          setStatus('success')
          setMessage('Login successful! Redirecting to dashboard...')
          
          // Give user feedback before redirect
          setTimeout(() => {
            router.replace("/dashboard/creator")
          }, 1500)
          
        } catch (err: any) {
          console.error('OAuth login error:', err)
          setStatus('error')
          setMessage('Failed to complete login. Please try again.')
        }
      } else {
        setStatus('error')
        setMessage('No authentication token received.')
      }
    }

    handleAuth()
  }, [token, error, loginWithToken, router])

  const handleRetry = () => {
    router.push('/auth/login/creator')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-lg border-white/10 rounded-2xl p-8 text-center">
          
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-teal-400" />
              <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
              <p className="text-slate-400">Please wait while we log you in...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-slate-400">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleHome} variant="outline" className="w-full">
                  Go to Home
                </Button>
              </div>
            </>
          )}
          
        </div>
      </div>
    </main>
  )
}
