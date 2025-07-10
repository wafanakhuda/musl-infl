"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { LogOut, Home, User, FileText, Mail, Settings } from "lucide-react"

import { useAuth } from "../../hooks/use-auth"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"

interface LayoutProps {
  children: ReactNode
}

export default function CreatorDashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { href: "/dashboard/creator", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { href: "/portfolio", label: "Portfolio", icon: <FileText className="w-5 h-5" /> },
    { href: "/messages", label: "Messages", icon: <Mail className="w-5 h-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 p-6 space-y-6">
        <div className="text-2xl font-bold mb-6">Creator Panel</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition",
                pathname === item.href && "bg-slate-800"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full flex items-center gap-2 justify-start mt-4 text-red-500 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
