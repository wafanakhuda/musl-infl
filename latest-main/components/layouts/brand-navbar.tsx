"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, User } from "lucide-react"
import { useAuth } from "../../hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { CartDrawer } from "../cart/cart-drawer"  // NEW: Import cart drawer

export default function BrandNavigation() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login/brand")
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <Image src="/logo.png" alt="Logo" width={24} height={24} />
          <span className="font-bold text-lg text-gray-800">collabstr</span>
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex items-center space-x-6 text-sm text-gray-700 font-medium">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/search" className="hover:text-black">Search</Link>
          <Link href="/campaigns" className="hover:text-black">Campaigns</Link>
          <Link href="/track" className="hover:text-black">Track</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/campaigns/create"
            className="hidden sm:inline-block bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Post a Campaign
          </Link>

          {/* UPDATED: Cart Drawer instead of static button */}
          <CartDrawer />

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center"
                aria-label="User Menu"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name} />
                  <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white text-black border">
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle with ARIA Label */}
          <button
            aria-label="Toggle Mobile Menu"
            className="text-black md:hidden ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          <div className="flex flex-col space-y-3 text-sm text-gray-700 font-medium">
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/search" className="hover:text-black">Search</Link>
            <Link href="/campaigns" className="hover:text-black">Campaigns</Link>
            <Link href="/track" className="hover:text-black">Track</Link>
            <Link href="/campaigns/create" className="text-pink-500 font-semibold">Post a Campaign</Link>
            <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
          </div>
        </div>
      )}
    </nav>
  )
}