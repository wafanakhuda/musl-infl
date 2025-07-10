"use client"

import { Button } from "../../components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

interface SocialRedirectProps {
  provider: "google"
  text?: string
}

export function SocialRedirect({ provider, text = "Continue with Google" }: SocialRedirectProps) {
  const router = useRouter()

  const handleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="w-full border px-4 py-2 flex items-center justify-center gap-2"
    >
      <FcGoogle className="text-xl" />
      {text}
    </Button>
  )
}
