'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Menu, X, User, LogOut, LayoutDashboard, BookOpen, Leaf, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: {
    name: string
    netId: string
    isAdmin?: boolean
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Package },
    { name: 'Book Container', href: '/book', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Impact', href: '/impact', icon: Leaf },
  ]

  if (user?.isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings })
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <nav className="bg-duke-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8" />
              <span className="font-bold text-xl">DukeReuse 360</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-duke-blue text-white'
                    : 'text-gray-200 hover:bg-duke-blue/50'
                )}
              >
                {item.name}
              </Link>
            ))}

            {mounted && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4 ml-4 border-l border-white/20 pl-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-white hover:bg-duke-blue/50"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/api/auth/login?netId=js123">
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-duke-navy">
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-duke-blue/50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium',
                  pathname === item.href
                    ? 'bg-duke-blue text-white'
                    : 'text-gray-200 hover:bg-duke-blue/50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {mounted && (
              <div className="pt-4 border-t border-white/20">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-300">
                      Signed in as {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-gray-200 hover:bg-duke-blue/50 rounded-md"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/api/auth/login?netId=js123"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-200 hover:bg-duke-blue/50 rounded-md"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
