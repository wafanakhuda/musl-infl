"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { useAuth } from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

interface BrandDashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { name: "Dashboard", href: "/dashboard/brand", icon: LayoutDashboard },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Creators", href: "/creators", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function BrandDashboardLayout({ children }: BrandDashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-white/10">
        <div className="p-6 font-bold text-2xl border-b border-white/10">
          Brand Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" onClick={logout} className="w-full flex justify-start text-red-400 hover:text-red-600">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-4 py-3">
        <div className="text-lg font-bold">Brand Panel</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-14 left-0 w-full bg-zinc-900 border-b border-white/10 z-40">
          <nav className="flex flex-col space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              onClick={logout}
              className="text-red-400 hover:text-red-600 mt-2 flex items-center justify-start"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-14 lg:mt-0 bg-zinc-950">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user?.full_name}</span>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
