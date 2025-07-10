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
  login: (email: string, password: string) => Promise<boolean> // ✅ Updated return type
  loginWithToken: (token: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      localStorage.setItem("access_token", data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithToken = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch user")

      setUser(data)
      setIsAuthenticated(true)
      localStorage.setItem("auth_user", JSON.stringify(data))

      toast.success(`Welcome, ${data.full_name}!`)
    } catch (error: any) {
      toast.error("Auth Error", { description: error.message })
      logout()
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      toast.success("Registration successful!")
      router.push("/auth/verify-otp")
    } catch (error: any) {
      toast.error("Registration Failed", { description: error.message || "Please try again" })
      throw error
    } finally {
      setLoading(false)
    }
  }

 const logout = () => {
  console.log('🚪 Logging out user')
  
  // Clear all auth data
  setUser(null)
  setIsAuthenticated(false)
  localStorage.removeItem("access_token")
  localStorage.removeItem("auth_user")
  localStorage.removeItem("creator_registration_data") // Clear any registration data
  
  // Clear any OAuth-related storage
  localStorage.removeItem("oauth_provider")
  localStorage.removeItem("pending_email")
  
  // Always redirect to home page to avoid 404s
  router.push("/")
  
  // Show success message
  toast?.success?.("Logged out successfully") || console.log("Logged out successfully")
}
  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("auth_user", JSON.stringify(updatedUser))
        toast.success("Profile updated successfully.")
      }
    } catch (error: any) {
      toast.error("Update Failed", { description: error.message })
    }
  }

  const updateUser = (updated: User) => {
    setUser(updated)
    localStorage.setItem("auth_user", JSON.stringify(updated))
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token")
    if (token) {
      await loginWithToken(token)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithToken,
    register,
    logout,
    updateProfile,
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
