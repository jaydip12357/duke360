'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Menu, X, User, LogOut, LayoutDashboard, BookOpen, Leaf, Settings, Compass, ChevronDown, MapPin, Users, Gift, Camera, Trophy, ChefHat, Sprout } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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
  const [exploreOpen, setExploreOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Close explore dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Package },
    { name: 'Book Container', href: '/book', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Impact', href: '/impact', icon: Leaf },
  ]

  const exploreLinks = [
    { name: 'Food Rescue', href: '/food-rescue', icon: Gift, desc: 'Free food nearby' },
    { name: 'Crowd Tracker', href: '/crowd-tracker', icon: Users, desc: 'Dining hall busyness' },
    { name: 'Swipe Exchange', href: '/meal-swipe', icon: Gift, desc: 'Share meal swipes' },
    { name: 'Campus Map', href: '/campus-map', icon: MapPin, desc: 'Sustainability spots' },
    { name: 'Waste Log', href: '/waste-log', icon: Camera, desc: 'Track food waste' },
    { name: 'Challenges', href: '/challenges', icon: Trophy, desc: 'Team competitions' },
    { name: 'Recipes', href: '/recipes', icon: ChefHat, desc: 'Use your leftovers' },
    { name: 'Garden Hub', href: '/garden', icon: Sprout, desc: 'Grow & compost' },
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

            {/* Explore Dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  exploreOpen ? 'bg-duke-blue text-white' : 'text-gray-200 hover:bg-duke-blue/50'
                )}
              >
                <Compass className="h-4 w-4" />
                Explore
                <ChevronDown className={cn('h-4 w-4 transition-transform', exploreOpen && 'rotate-180')} />
              </button>

              {exploreOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  {exploreLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setExploreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-duke-navy" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

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

            {/* Explore Section - Mobile */}
            <div className="pt-2 border-t border-white/20 mt-2">
              <p className="px-3 py-2 text-sm text-gray-400 font-medium flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Explore
              </p>
              <div className="grid grid-cols-2 gap-1">
                {exploreLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-duke-blue/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

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
