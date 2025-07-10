"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Mock user type
export interface User {
  id: string
  email: string
  full_name: string
  user_type: "creator" | "brand" | "admin"
  bio?: string
  profile?: {
    niche?: string
    industry?: string
  }
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  user_type: "creator" | "brand"
  company_name?: string
  niche?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        email: email,
        full_name: email.includes("creator") ? "Test Creator" : "Test Brand",
        user_type: email.includes("creator") ? "creator" : "brand",
      }

      setUser(mockUser)
      localStorage.setItem("auth_user", JSON.stringify(mockUser))

      // Show success message
      console.log("Login successful!")

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      console.log("Registration successful!")

      // Redirect to login
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
    router.push("/")
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("auth_user", JSON.stringify(updatedUser))
      }
    } catch (error: any) {
      throw error
    }
  }

  // Check for existing auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("auth_user")
      }
    }
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
