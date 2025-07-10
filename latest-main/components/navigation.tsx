"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../hooks/use-auth"
import { useRouter } from "next/navigation"
import {
  Home,
  Building2,
  Users,
  Search,
  Menu,
  X,
  BookOpenCheck,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  DollarSign, // ✅ Added icon for Pricing
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="MuslimInfluencers.io"
                className="h-6 w-auto"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            )}
            <span className="hidden sm:inline-block font-bold text-base sm:text-lg text-white">
              MuslimInfluencers.io
            </span>
          </Link>

          {/* Center nav links (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/" icon={Home} label="Home" />
            <NavLink href="/campaigns" icon={Building2} label="Campaigns" />
            <NavLink href="/creators" icon={Users} label="Creators" />
            <NavLink href="/search" icon={Search} label="Search" />
            <NavLink href="/#how-it-works" icon={BookOpenCheck} label="How It Works" />
            <NavLink href="/pricing" icon={DollarSign} label="Pricing" /> {/* ✅ Added */}
          </div>

          {/* Right side: Avatar or Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
                    <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border border-slate-700 text-white">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login/creator" className="text-sm font-medium text-white hover:underline">
                  Login
                </Link>
                <Link href="/auth/register/creator" className="text-sm font-medium text-white hover:underline">
                  Join as a Creator
                </Link>
                <Link
                  href="/brand"
                  className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Join as a Brand
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-4 border-t border-slate-800">
            <div className="flex flex-col space-y-4">
              <NavLink href="/" icon={Home} label="Home" />
              <NavLink href="/campaigns" icon={Building2} label="Campaigns" />
              <NavLink href="/creators" icon={Users} label="Creators" />
              <NavLink href="/search" icon={Search} label="Search" />
              <NavLink href="/#how-it-works" icon={BookOpenCheck} label="How It Works" />
              <NavLink href="/pricing" icon={DollarSign} label="Pricing" /> {/* ✅ Added */}

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
                        <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-white font-medium">{user.full_name}</div>
                    </div>
                    <Link href="/dashboard" className="text-white hover:underline">Dashboard</Link>
                    <Link href="/profile" className="text-white hover:underline">Profile</Link>
                    <Link href="/settings" className="text-white hover:underline">Settings</Link>
                    <button onClick={handleLogout} className="text-white text-left hover:underline">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login/creator" className="text-white hover:underline">
                      Login
                    </Link>
                    <Link href="/auth/register/creator" className="text-white hover:underline">
                      Join as a Creator
                    </Link>
                    <Link
                      href="/brand"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                    >
                      Join as a Brand
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-sm sm:text-base text-slate-300 hover:text-white font-medium"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}
