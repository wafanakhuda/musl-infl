"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://latestbackend-3psc.onrender.com"

export interface User {
  id: string
  email: string
  full_name: string
  user_type: string
  avatar_url?: string
  bio?: string
  location?: string
  niche?: string
  followers?: number
  price_min?: number
  price_max?: number
  platforms?: string[]
  verified?: boolean
  email_verified?: boolean
}

interface RegisterPayload {
  email: string
  password: string
  full_name: string
  user_type: "creator" | "brand"
  avatar_url?: string
  location?: string
  bio?: string
  company_name?: string
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithToken: (token: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: (redirectTo?: string) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  checkProfileCompletion: () => Promise<boolean>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

// In your use-auth.tsx file, update the login function:

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setLoading(true)
    console.log('🔐 Attempting login for:', email)
    
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Login failed")

    // Store both token and user data
    localStorage.setItem("access_token", data.token)
    localStorage.setItem("auth_user", JSON.stringify(data.user))
    
    setUser(data.user)
    setIsAuthenticated(true)
    
    console.log('✅ Login successful for:', data.user.email)
    toast.success(`Welcome back, ${data.user.full_name}!`)
    
    // ✅ FIXED: Redirect based on user type
    if (data.user.user_type === "brand") {
      router.push("/dashboard/brand")
    } else {
      router.push("/dashboard/creator")
    }
    
    return true
  } catch (error: any) {
    console.error("Login error:", error)
    toast.error(error.message || "Login failed")
    return false
  } finally {
    setLoading(false)
  }
}

  const loginWithToken = async (token: string) => {
    try {
      setLoading(true)
      console.log('🔐 Logging in with token')
      
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch user")

      // Store both token and user data
      localStorage.setItem("access_token", token)
      localStorage.setItem("auth_user", JSON.stringify(data))
      
      setUser(data)
      setIsAuthenticated(true)

      console.log('✅ Token login successful for:', data.email)
      toast.success(`Welcome, ${data.full_name}!`)
    } catch (error: any) {
      console.error("Token auth failed:", error)
      toast.error("Authentication failed")
      await logout() // Use the enhanced logout
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true)
      console.log('📝 Registering user:', payload.email)
      
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      console.log('✅ Registration successful')
      toast.success("Registration successful!")
      
      // Store email for OTP verification
      localStorage.setItem("pending_email", payload.email)
      router.push("/auth/verify-otp")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ✅ ENHANCED UNIVERSAL LOGOUT FUNCTION
  const logout = async (redirectTo?: string) => {
    try {
      setLoading(true)
      console.log('🚪 Starting universal logout process...')
      
      const token = localStorage.getItem("access_token")
      
      // 1. Call backend logout to clear server sessions (both OAuth and regular)
      if (token) {
        try {
          console.log('🔐 Clearing backend session...')
          await Promise.race([
            fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            }),
            // Timeout after 3 seconds to prevent hanging
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ])
          console.log('✅ Backend session cleared')
        } catch (error) {
          console.warn('⚠️ Backend logout failed (continuing with local logout):', error)
          // Continue with local logout even if backend fails
        }
      }

      // 2. Clear user state immediately
      setUser(null)
      setIsAuthenticated(false)
      
      // 3. Clear all auth-related localStorage items (comprehensive cleanup)
      const authKeys = [
        "access_token",
        "auth_user", 
        "creator_registration_data",
        "brand_registration_data",
        "pending_email",
        "oauth_provider",
        "temp_token",
        "user_preferences",
        "session_data",
        "refresh_token"
      ]
      
      authKeys.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.warn(`Failed to remove ${key} from localStorage:`, error)
        }
      })
      
      // 4. Clear sessionStorage completely
      try {
        sessionStorage.clear()
        console.log('✅ Session storage cleared')
      } catch (error) {
        console.warn('⚠️ Failed to clear session storage:', error)
      }

      // 5. Clear cookies (for OAuth and other session cookies)
      if (typeof window !== 'undefined') {
        try {
          // Get all cookies and clear them
          document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
            
            // Clear for current domain and common paths
            const clearCookie = (domain = "", path = "") => {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`
            }
            
            clearCookie("", "/")
            clearCookie("", "/auth")
            clearCookie("", "/dashboard")
            clearCookie(window.location.hostname, "/")
            clearCookie(`.${window.location.hostname}`, "/")
          })
          console.log('✅ Cookies cleared')
        } catch (error) {
          console.warn('⚠️ Failed to clear cookies:', error)
        }
      }

      // 6. Clear any cached API responses (if using any caching)
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          )
          console.log('✅ Cache storage cleared')
        } catch (error) {
          console.warn('⚠️ Failed to clear cache storage:', error)
        }
      }

      console.log('✅ Universal logout completed successfully')
      
      // 7. Redirect based on user preference or default to home
      const destination = redirectTo || "/"
      console.log(`🏠 Redirecting to: ${destination}`)
      router.push(destination)
      
      // 8. Show success message
      toast.success("Logged out successfully")
      
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Even if logout fails, still clear local state and redirect
      setUser(null)
      setIsAuthenticated(false)
      localStorage.clear()
      router.push("/")
      toast.error("Logout completed with some errors")
    } finally {
      setLoading(false)
    }
  }

  // Enhanced updateProfile function for OAuth onboarding
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true)
      console.log('📝 Updating profile:', userData)
      
      const token = localStorage.getItem("access_token")
      if (!token) throw new Error("No authentication token")

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")

      // Update local user state
      const updatedUser = data.user
      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))
      
      console.log('✅ Profile updated successfully')
      toast.success("Profile updated successfully")
      
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast.error(error.message || "Failed to update profile")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Check profile completion status
  const checkProfileCompletion = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) return false

      const res = await fetch(`${API_URL}/users/profile-status`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) return false

      return data.profile_complete
    } catch (error) {
      console.error("Profile completion check error:", error)
      return false
    }
  }

  const updateUser = (updated: User) => {
    setUser(updated)
    setIsAuthenticated(true)
    localStorage.setItem("auth_user", JSON.stringify(updated))
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token")
    if (token && !user) {
      await loginWithToken(token)
    }
  }

  // ENHANCED INITIALIZATION - This is the key fix for auth persistence
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth state...')
        
        const savedUser = localStorage.getItem("auth_user")
        const token = localStorage.getItem("access_token")
        
        if (savedUser && token) {
          try {
            const userData = JSON.parse(savedUser)
            console.log('🔄 Found saved user data:', userData.email)
            
            // Verify token is still valid
            const res = await fetch(`${API_URL}/users/me`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            
            if (res.ok) {
              const freshUserData = await res.json()
              setUser(freshUserData)
              setIsAuthenticated(true)
              // Update localStorage with fresh data
              localStorage.setItem("auth_user", JSON.stringify(freshUserData))
              console.log('✅ Auth state restored successfully')
            } else {
              console.warn('⚠️ Saved token invalid, clearing session')
              await logout()
            }
          } catch (parseError) {
            console.error('❌ Error parsing saved user data:', parseError)
            await logout()
          }
        } else if (token) {
          // Have token but no user data, fetch user
          console.log('🔄 Token found, fetching user data')
          await loginWithToken(token)
        } else {
          console.log('ℹ️ No saved auth data found')
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        await logout() // Clear potentially corrupted data
      } finally {
        setLoading(false)
        setIsInitialized(true)
        console.log('✅ Auth initialization complete')
      }
    }
    
    // Only initialize once
    if (!isInitialized) {
      initAuth()
    }
  }, [isInitialized])

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithToken,
    register,
    logout,
    updateProfile,
    checkProfileCompletion,
    refreshUser,
    isAuthenticated,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export function useAuthUser() {
  const { user, loading, isAuthenticated } = useAuth()
  return { user, loading, isAuthenticated }
}