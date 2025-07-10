"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../../../components/ui/input"
import { Button } from "../../../../components/ui/button"
import { useAuth } from "../../../../hooks/use-auth"
import { FloatingElements } from "../../../../components/ui/floating-elements"

export default function CreatorLoginPage() {
  const router = useRouter()
  const { loginWithToken } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Login failed")

      if (data.user?.user_type !== "creator") {
        throw new Error("Invalid user role.")
      }

      localStorage.setItem("access_token", data.token)
      await loginWithToken(data.token)
      router.replace("/dashboard/creator")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white relative">
      <FloatingElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-slate-800/60 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10">
          <h1 className="text-2xl font-bold mb-6">Login as Creator</h1>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full bg-white text-black">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full bg-white text-black">
              Continue with Apple
            </Button>
          </div>

          <div className="text-center text-sm text-slate-400 mb-4">or sign in with email</div>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            className="mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm mt-4 text-center text-slate-400">
            Don’t have an account?{" "}
            <Link href="/auth/register/creator" className="text-blue-400 hover:underline">
              Join as Creator
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
