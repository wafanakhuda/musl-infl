"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../../../components/ui/input"
import { Button } from "../../../../components/ui/button"
import { FloatingElements } from "../../../../components/ui/floating-elements"
import { useAuth } from "../../../../hooks/use-auth"

export default function BrandLoginPage() {
  const router = useRouter()
  const { loginWithToken } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      localStorage.setItem("access_token", data.token)
      await loginWithToken(data.token)

      if (data.user?.user_type === "brand") {
        router.replace("/dashboard/brand")
      } else {
        throw new Error("Invalid account type")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Connect with your real Google OAuth route
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  const handleAppleLogin = () => {
    // TODO: Connect with your real Apple OAuth route
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10">
          <Link href="/" className="text-sm text-slate-400 block mb-6">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold mb-2">Login to your Brand Account</h1>
          <p className="text-sm text-slate-400 mb-6">Continue with your email or social login</p>

          <Button
            onClick={handleGoogleLogin}
            className="w-full mb-3 bg-white text-black hover:bg-gray-100"
          >
            Continue with Google
          </Button>

          <Button
            onClick={handleAppleLogin}
            className="w-full mb-6 bg-black text-white hover:bg-gray-800"
          >
            Continue with Apple
          </Button>

          <div className="border-t border-white/10 mb-6" />

          <Input
            type="email"
            placeholder="Email address"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-center mt-4 text-slate-400">
            Don’t have an account?{' '}
            <Link href="/auth/register/brand" className="text-blue-400 hover:underline">
              Join as a Brand
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
