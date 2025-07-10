"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name: string
  user_type: "creator" | "brand" | "admin"
  avatar_url?: string
  bio?: string
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  loginWithToken: (token: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  user_type: "creator" | "brand"
  company_name?: string
  niche?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      localStorage.setItem("access_token", data.token)
      await loginWithToken(data.token)

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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error("Register error response:", data)
      throw new Error(data.error || "Registration failed")
    }

    if (!data.token) {
      console.error("Missing token in register response:", data)
      throw new Error("No token returned after registration")
    }

    localStorage.setItem("access_token", data.token)
    await loginWithToken(data.token)

    router.push("/dashboard")
  } catch (error: any) {
    console.error("Registration failed:", error)
    alert(error.message || "Something went wrong") // optionally replace with toast
    throw error
  } finally {
    setLoading(false)
  }
}

  const loginWithToken = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch user")

      setUser(data)
      localStorage.setItem("auth_user", JSON.stringify(data))
    } catch (error: any) {
      console.error("Token auth failed:", error)
      logout()
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("access_token")
    router.push("/auth/login")
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("auth_user", JSON.stringify(updatedUser))
      }
    } catch (error: any) {
      console.error("Update failed:", error)
      throw error
    }
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token")
    if (token) {
      await loginWithToken(token)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!user && token) {
      loginWithToken(token)
    }
  }, [user])

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    loginWithToken,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
