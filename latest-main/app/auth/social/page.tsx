// File: /app/auth/social/page.tsx (Updated Universal Version)
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { Loader2, AlertCircle, CheckCircle, UserPlus, Building2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { FloatingElements } from "../../../components/ui/floating-elements"
import { toast } from "sonner"

export default function SocialRedirectPage() {
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
            errorMessage = 'Social authentication failed. Please try again.'
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
          console.log('🔐 Processing OAuth token:', { userType, needsOnboarding, isNew })
          localStorage.setItem("access_token", token)
          await loginWithToken(token)
          
          if (needsOnboarding || isNew) {
            setStatus('needs_onboarding')
            setMessage(`Welcome! Let's complete your ${userType} profile to get started.`)
            toast.success('Account connected successfully! Please complete your profile.')
          } else {
            setStatus('success')
            setMessage('Login successful! Redirecting to dashboard...')
            toast.success('Welcome back!')}
            
            // Redirect based on user type
           
          
        } catch (err: any) {
          console.error('OAuth login error:', err)
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
    const onboardingPath = userType === "brand" 
      ? '/auth/register/brand?step=2&oauth=true'
      : '/auth/register/creator?step=2&oauth=true'
    router.push(onboardingPath)
  }

  const handleSkipOnboarding = () => {
    const dashboardPath = userType === "brand" ? "/dashboard/brand" : "/dashboard/creator"
    router.push(dashboardPath)
  }

  const handleRetryLogin = () => {
    const loginPath = userType === "brand" ? '/auth/login/brand' : '/auth/login/creator'
    router.push(loginPath)
  }

  const handleSignupInstead = () => {
    const signupPath = userType === "brand" ? '/auth/register/brand' : '/auth/register/creator'
    router.push(signupPath)
  }

  const getUserTypeIcon = () => {
    return userType === "brand" ? Building2 : UserPlus
  }

  const getUserTypeColor = () => {
    return userType === "brand" ? "purple" : "teal"
  }

  const getUserTypeGradient = () => {
    return userType === "brand" 
      ? "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      : "from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
  }

  const IconComponent = getUserTypeIcon()
  const color = getUserTypeColor()

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className={`w-12 h-12 animate-spin mx-auto text-${color}-400`} />
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
              <IconComponent className={`w-12 h-12 mx-auto text-${color}-400`} />
              <div className="space-y-2">
                <h2 className={`text-xl font-semibold text-${color}-400`}>
                  Welcome to the platform!
                </h2>
                <p className="text-slate-400">{message}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleContinueOnboarding}
                  className={`w-full bg-gradient-to-r ${getUserTypeGradient()}`}
                >
                  Complete {userType === "brand" ? "Brand" : "Creator"} Profile
                </Button>
                <Button 
                  onClick={handleSkipOnboarding}
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
                  className={`w-full bg-gradient-to-r ${getUserTypeGradient()}`}
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleSignupInstead}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Sign Up Instead
                </Button>
              </div>
              
              {/* Additional help section */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3">
                  Need to try a different account type?
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => router.push('/auth/login/creator')}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                  >
                    Creator Login
                  </Button>
                  <Button 
                    onClick={() => router.push('/auth/login/brand')}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    Brand Login
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}