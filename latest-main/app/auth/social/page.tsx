"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { Loader2, AlertCircle, CheckCircle, UserPlus } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { FloatingElements } from "../../../components/ui/floating-elements"

export default function SocialRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const needsOnboarding = searchParams.get("needs_onboarding") === "true"
  const { loginWithToken } = useAuth()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needs_onboarding'>('loading')
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
          console.log('🔐 Processing OAuth token, needs onboarding:', needsOnboarding)
          localStorage.setItem("access_token", token)
          await loginWithToken(token)
          
          if (needsOnboarding) {
            setStatus('needs_onboarding')
            setMessage('Welcome! Let\'s complete your profile to get started.')
          } else {
            setStatus('success')
            setMessage('Login successful! Redirecting to dashboard...')
            setTimeout(() => {
              router.replace("/dashboard/creator")
            }, 1500)
          }
          
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
  }, [token, error, needsOnboarding, loginWithToken, router])

  const handleStartOnboarding = () => {
    // ✅ Redirect to onboarding with a special flag
    router.push('/auth/complete-profile?from_oauth=true')
  }

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
              <h2 className="text-xl font-semibold mb-2">Welcome Back!</h2>
              <p className="text-slate-400">{message}</p>
            </>
          )}

          {status === 'needs_onboarding' && (
            <>
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              
              <div className="space-y-3">
                <Button onClick={handleStartOnboarding} className="w-full bg-gradient-to-r from-blue-500 to-teal-500">
                  Complete Profile Setup
                </Button>
                <p className="text-xs text-slate-500">
                  This will only take 2-3 minutes and helps brands find you!
                </p>
              </div>
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
