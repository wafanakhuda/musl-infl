"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  User,
  Briefcase,
  Mail,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react"
import { useAuth } from "../hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

export default function CreatorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navItems = [
    { label: "Dashboard", href: "/dashboard/creator", icon: <LayoutDashboard /> },
    { label: "My Profile", href: "/profile", icon: <User /> },
    { label: "Campaigns", href: "/campaigns", icon: <Briefcase /> },
    { label: "Messages", href: "/messages", icon: <Mail /> },
    { label: "Earnings", href: "/earnings", icon: <Wallet /> },
    { label: "Settings", href: "/settings", icon: <Settings /> },
  ]

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800">
      {/* Logo at the top */}
      <div className="flex items-center justify-center p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-bold">MuslimInfluencers</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.full_name || "Creator"}</p>
            <p className="text-sm text-muted-foreground">Creator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md hover:bg-slate-800",
              pathname === item.href && "bg-slate-800"
            )}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 text-left"
          onClick={() => {
            logout()
            router.push("/auth/login/creator")
          }}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
