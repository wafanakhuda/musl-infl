// File: /app/auth/social/brand/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../../hooks/use-auth"
import { Loader2, AlertCircle, CheckCircle, Building2 } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { FloatingElements } from "../../../../components/ui/floating-elements"
import { toast } from "sonner"

export default function BrandSocialRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const needsOnboarding = searchParams.get("needs_onboarding") === "true"
  const userType = searchParams.get("user_type")
  const isNew = searchParams.get("is_new") === "true"
  const { loginWithToken } = useAuth()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needs_onboarding'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      if (error) {
        setStatus('error')
        let errorMessage = 'Authentication failed. Please try again.'
        
        switch (error) {
          case 'authentication_failed':
            errorMessage = 'Google authentication failed. Please try again.'
            break
          case 'user_not_found':
            errorMessage = 'Account not found. Please sign up first.'
            break
          case 'token_generation_failed':
            errorMessage = 'Failed to generate authentication token. Please try again.'
            break
          case 'user_data_missing':
            errorMessage = 'Unable to retrieve user information. Please try again.'
            break
          default:
            errorMessage = error.replace(/_/g, ' ')
        }
        
        setMessage(errorMessage)
        toast.error(errorMessage)
        return
      }

      if (token) {
        try {
          console.log('🔐 Processing Brand OAuth token:', { needsOnboarding, userType, isNew })
          localStorage.setItem("access_token", token)
          await loginWithToken(token)
          
          if (userType !== 'brand') {
            setStatus('error')
            setMessage('This account is not registered as a brand. Please use the correct login.')
            toast.error('Account type mismatch. Please use the brand login.')
            return
          }

          if (needsOnboarding || isNew) {
            setStatus('needs_onboarding')
            setMessage('Welcome! Let\'s complete your brand profile to get started.')
            toast.success('Account connected successfully! Please complete your profile.')
          } else {
            setStatus('success')
            setMessage('Login successful! Redirecting to brand dashboard...')
            toast.success('Welcome back!')
            setTimeout(() => {
              router.replace("/dashboard/brand")
            }, 1500)
          }
          
        } catch (err: any) {
          console.error('Brand OAuth login error:', err)
          setStatus('error')
          setMessage('Failed to complete login. Please try again.')
          toast.error('Login failed. Please try again.')
        }
      } else {
        setStatus('error')
        setMessage('No authentication token received.')
        toast.error('Authentication failed. No token received.')
      }
    }

    handleAuth()
  }, [token, error, needsOnboarding, userType, isNew, loginWithToken, router])

  const handleContinueOnboarding = () => {
    router.push('/auth/register/brand?step=2&oauth=true')
  }

  const handleRetryLogin = () => {
    router.push('/auth/login/brand')
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-400" />
              <h2 className="text-xl font-semibold">Authenticating...</h2>
              <p className="text-slate-400">Please wait while we sign you in</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
              <h2 className="text-xl font-semibold text-green-400">Success!</h2>
              <p className="text-slate-400">{message}</p>
              <div className="flex justify-center">
                <div className="animate-pulse text-sm text-slate-500">Redirecting...</div>
              </div>
            </div>
          )}

          {status === 'needs_onboarding' && (
            <div className="space-y-6">
              <Building2 className="w-12 h-12 mx-auto text-purple-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-purple-400">Welcome to the platform!</h2>
                <p className="text-slate-400">{message}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleContinueOnboarding}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Complete Brand Profile
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/brand')}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-red-400">Authentication Failed</h2>
                <p className="text-slate-400">{message}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleRetryLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/auth/register/brand')}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Sign Up Instead
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}