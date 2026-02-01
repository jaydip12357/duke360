'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import Image from 'next/image'

// Types
interface ContainerInfo {
  id: string
  status: string
}

interface ScanResultData {
  success: boolean
  message: string
  container?: {
    id: string
    status: string
    totalUses?: number
  }
  points?: number
}

interface Notification {
  id: string
  type: 'reminder' | 'achievement' | 'warning'
  title: string
  message: string
  time: string
  read: boolean
}

// SVG Icons
const Icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  trophy: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  qr: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  container: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  cup: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 2h8l1 2v3a4 4 0 01-4 4H11a4 4 0 01-4-4V4l1-2zM12 11v5m-3 4h6a2 2 0 002-2v-2H7v2a2 2 0 002 2z" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  gift: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
}

export default function DukeReuseApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false)
  const [returnedContainer, setReturnedContainer] = useState<ScanResultData | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scanMode, setScanMode] = useState<'checkout' | 'return'>('return')
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQRDisplay, setShowQRDisplay] = useState(false)
  const [displayQRCode, setDisplayQRCode] = useState<string | null>(null)

  // Demo container for testing - this would be assigned to the user
  const DEMO_CONTAINER_ID = 'DU-2026-042'

  // User data
  const userData = {
    name: "Jaideep",
    classYear: "'28",
    dorm: "Randolph Hall",
    userId: "demo-user",
    stats: {
      containersUsed: 89,
      cupsUsed: 134,
      co2Prevented: 14.7,
      rank: 203,
      totalStudents: 16000,
      points: 847,
    }
  }

  // Current container status
  const [currentContainer, setCurrentContainer] = useState<ContainerInfo | null>({
    id: DEMO_CONTAINER_ID,
    status: 'checked_out'
  })

  const challenges = [
    { name: "Clean Plate Club", desc: "Waste <30g for 5 meals", progress: 4, goal: 5, reward: "50 pts" },
    { name: "Reuse Streak", desc: "Use reusable 10 days straight", progress: 7, goal: 10, reward: "Badge" }
  ]

  const dormLeaderboard = [
    { name: "Bassett", points: 12450, isUser: false },
    { name: "Randolph", points: 11892, isUser: true },
    { name: "Trinity", points: 10234, isUser: false },
    { name: "Kilgo", points: 9876, isUser: false },
    { name: "Crowell", points: 9234, isUser: false }
  ]

  // Notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'reminder',
        title: 'Container Out',
        message: `You have 1 container to return (${DEMO_CONTAINER_ID})`,
        time: '9:00 AM',
        read: false
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Almost there!',
        message: "3 days away from Reuse Streak badge.",
        time: '8:30 AM',
        read: true
      }
    ])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Load QR code for display
  const loadQRCode = async (containerId: string) => {
    try {
      const res = await fetch(`/api/containers/${containerId}/qr`)
      const data = await res.json()
      if (data.qrCode) {
        setDisplayQRCode(data.qrCode)
        setShowQRDisplay(true)
      }
    } catch (err) {
      console.error('Failed to load QR code:', err)
    }
  }

  // Handle QR scan result
  const handleScanComplete = async (qrData: string) => {
    setIsLoading(true)

    // Parse QR data - format: DUKE-REUSE:{containerId}
    let containerId = qrData
    if (qrData.startsWith('DUKE-REUSE:')) {
      containerId = qrData.replace('DUKE-REUSE:', '')
    }

    try {
      const res = await fetch('/api/containers/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerId,
          action: scanMode,
          userId: userData.userId
        })
      })

      const data: ScanResultData = await res.json()
      setScanResult(data)

      if (data.success) {
        if (scanMode === 'return') {
          setReturnedContainer(data)
          setTimeout(() => {
            setShowQRScanner(false)
            setScanResult(null)
            setShowReturnConfirmation(true)
            setCurrentContainer(null)
          }, 1500)
        } else {
          // Checkout
          setCurrentContainer({
            id: containerId,
            status: 'checked_out'
          })
          setTimeout(() => {
            setShowQRScanner(false)
            setScanResult(null)
          }, 1500)
        }
      }
    } catch (err) {
      setScanResult({
        success: false,
        message: 'Network error. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openScanner = (mode: 'checkout' | 'return') => {
    setScanMode(mode)
    setScanResult(null)
    setShowQRScanner(true)
  }

  const navItems = [
    { id: 'home', icon: Icons.home, label: 'Home' },
    { id: 'rewards', icon: Icons.gift, label: 'Rewards' },
    { id: 'challenges', icon: Icons.trophy, label: 'Challenges' },
    { id: 'profile', icon: Icons.user, label: 'Profile' }
  ]

  // Home Screen
  const HomeScreen = () => (
    <div className="space-y-6">
      {/* Mobile Welcome */}
      <div className="lg:hidden bg-[#001A57] rounded-xl p-4 text-white">
        <p className="text-blue-200 text-sm">Welcome back,</p>
        <h1 className="text-xl font-semibold">{userData.name}</h1>
        <p className="text-blue-300 text-sm">{userData.dorm}</p>
      </div>

      {/* Desktop Welcome */}
      <div className="hidden lg:block bg-[#001A57] rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-blue-200">Fall 2026</h2>
            <p className="text-2xl font-semibold mt-1">Welcome back, {userData.name}</p>
          </div>
          <div className="flex gap-12 text-center">
            <div>
              <p className="text-3xl font-bold">{userData.stats.containersUsed + userData.stats.cupsUsed}</p>
              <p className="text-blue-200 text-sm">Total Uses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">{userData.stats.co2Prevented}kg</p>
              <p className="text-blue-200 text-sm">CO₂ Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold">#{userData.stats.rank}</p>
              <p className="text-blue-200 text-sm">Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Container Status + Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Container Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-900">Your Reusables</h2>
            {currentContainer && (
              <span className="text-sm text-gray-500">1 to return</span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Cup */}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
                {Icons.cup}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Reusable Cup</p>
                <p className="text-sm text-green-600">At home</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            {/* Container */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${currentContainer ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentContainer ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {Icons.container}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Reusable Container</p>
                {currentContainer ? (
                  <p className="text-sm text-blue-600">{currentContainer.id}</p>
                ) : (
                  <p className="text-sm text-gray-500">None checked out</p>
                )}
              </div>
              {currentContainer && (
                <button
                  onClick={() => loadQRCode(currentContainer.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  QR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => openScanner('checkout')}
              className="w-full flex items-center gap-3 p-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              {Icons.qr}
              <span>Checkout</span>
            </button>
            <button
              onClick={() => openScanner('return')}
              className="w-full flex items-center gap-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {Icons.check}
              <span>Return</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              {Icons.location}
              <span>Find Return Bin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Tip:</span> Ask for smaller rice portions — you&apos;ve wasted rice in 3 of your last 5 meals.
        </p>
      </div>

      {/* Stats Grid - Desktop */}
      <div className="hidden lg:block">
        <h2 className="font-medium text-gray-900 mb-3">This Semester</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Reusable Containers', value: userData.stats.containersUsed },
            { label: 'Reusable Cups', value: userData.stats.cupsUsed },
            { label: 'CO₂ Saved', value: `${userData.stats.co2Prevented}kg` },
            { label: 'Points', value: userData.stats.points },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Features */}
      <div>
        <h2 className="font-medium text-gray-900 mb-3">Explore</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/food-rescue', icon: '🍕', label: 'Food Rescue', desc: 'Free food nearby' },
            { href: '/crowd-tracker', icon: '👥', label: 'Crowd Tracker', desc: 'Dining hall busyness' },
            { href: '/meal-swipe', icon: '🎫', label: 'Swipe Exchange', desc: 'Share meal swipes' },
            { href: '/campus-map', icon: '🗺️', label: 'Campus Map', desc: 'Sustainability spots' },
            { href: '/waste-log', icon: '📊', label: 'Waste Log', desc: 'Track food waste' },
            { href: '/challenges', icon: '🏆', label: 'Challenges', desc: 'Team competitions' },
            { href: '/recipes', icon: '👨‍🍳', label: 'Recipes', desc: 'Use your leftovers' },
            { href: '/garden', icon: '🌱', label: 'Garden Hub', desc: 'Grow & compost' },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition text-center"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="font-medium text-gray-900 mt-2 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )

  // Impact Screen
  const ImpactScreen = () => (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">Your Impact</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Usage Stats */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Usage This Semester</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-semibold text-gray-900">{userData.stats.containersUsed}</p>
              <p className="text-sm text-gray-500">Reusable Containers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-semibold text-gray-900">{userData.stats.cupsUsed}</p>
              <p className="text-sm text-gray-500">Reusable Cups</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Environmental Impact</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CO₂ Prevented</span>
              <span className="font-semibold text-green-600">{userData.stats.co2Prevented} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Disposables Saved</span>
              <span className="font-semibold text-green-600">{userData.stats.containersUsed + userData.stats.cupsUsed}</span>
            </div>
            <p className="text-sm text-gray-500">Better than 78% of Duke students</p>
          </div>
        </div>
      </div>

      {/* Rank Card */}
      <div className="bg-[#001A57] rounded-xl p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-200 text-sm">Your Score</p>
            <p className="text-4xl font-bold">{userData.stats.points}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Campus Rank</p>
            <p className="text-3xl font-bold">#{userData.stats.rank}</p>
            <p className="text-blue-300 text-sm">of {userData.stats.totalStudents.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Challenges Screen
  const ChallengesScreen = () => (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">Challenges</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Challenges */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active</h2>
          {challenges.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.desc}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{c.reward}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{c.progress}/{c.goal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${(c.progress / c.goal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dorm Leaderboard */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-1">November Dorm Competition</h2>
          <p className="text-sm text-gray-500 mb-4">Prize: Pizza party</p>
          <div className="space-y-2">
            {dormLeaderboard.map((dorm, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg ${dorm.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-5">
                    {i + 1}.
                  </span>
                  <span className={`font-medium ${dorm.isUser ? 'text-blue-700' : 'text-gray-700'}`}>
                    {dorm.name}
                  </span>
                  {dorm.isUser && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">You</span>}
                </div>
                <span className="font-medium text-gray-900">{dorm.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Rewards Screen
  const RewardsScreen = () => {
    const rewards = [
      { name: 'Free Coffee', icon: '☕', current: 42, target: 50, description: 'At any campus cafe' },
      { name: 'Free Meal Swipe', icon: '🍽️', current: 89, target: 100, description: 'Use at any dining hall' },
      { name: 'Duke Store $10', icon: '🎁', current: 150, target: 200, description: 'Gift card credit' },
      { name: 'Priority Parking', icon: '🅿️', current: 300, target: 500, description: 'One month pass' },
    ]

    const monthlyWinners = [
      { name: 'Sarah Chen', dorm: 'Bassett', uses: 156, prize: 'Free Meal Plan Week' },
      { name: 'Marcus Johnson', dorm: 'Trinity', uses: 143, prize: '$25 Duke Store' },
      { name: 'Priya Patel', dorm: 'Randolph', uses: 138, prize: 'Coffee Month Pass' },
    ]

    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">Rewards</h1>

        {/* Progress Circles */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((reward, i) => {
              const percentage = Math.min((reward.current / reward.target) * 100, 100)
              const circumference = 2 * Math.PI * 40
              const strokeDashoffset = circumference - (percentage / 100) * circumference

              return (
                <div key={i} className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#001A57"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute text-2xl">{reward.icon}</span>
                  </div>
                  <p className="font-medium text-gray-900 mt-2">{reward.name}</p>
                  <p className="text-sm text-gray-500">{reward.current}/{reward.target} uses</p>
                  <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next Reward */}
        <div className="bg-[#001A57] rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Next reward in</p>
              <p className="text-3xl font-bold">8 uses</p>
              <p className="text-blue-200">Free Coffee at any campus cafe</p>
            </div>
            <span className="text-5xl">☕</span>
          </div>
        </div>

        {/* Monthly Winners */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-900">November Winners</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Most Uses</span>
          </div>
          <div className="space-y-3">
            {monthlyWinners.map((winner, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{winner.name}</p>
                    <p className="text-sm text-gray-500">{winner.dorm} · {winner.uses} uses</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">{winner.prize}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            You&apos;re currently #{userData.stats.rank} this month with {userData.stats.containersUsed + userData.stats.cupsUsed} uses
          </p>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Claim Rewards</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center gap-3">
                <span className="text-xl">☕</span>
                <div>
                  <p className="font-medium text-gray-900">Free Coffee</p>
                  <p className="text-sm text-gray-500">8 more uses needed</p>
                </div>
              </div>
              <button disabled className="px-3 py-1 bg-gray-200 text-gray-500 rounded text-sm">
                Locked
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎫</span>
                <div>
                  <p className="font-medium text-gray-900">5% Dining Discount</p>
                  <p className="text-sm text-green-600">Ready to claim!</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Profile Screen
  const ProfileScreen = () => (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">Profile</h1>

      {/* User Info */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#001A57] rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {userData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500">Duke {userData.classYear}</p>
            <p className="text-gray-500">{userData.dorm}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-semibold text-gray-900">{userData.stats.points}</p>
          <p className="text-sm text-gray-500">Points</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-semibold text-gray-900">#{userData.stats.rank}</p>
          <p className="text-sm text-gray-500">Rank</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-semibold text-gray-900">7</p>
          <p className="text-sm text-gray-500">Streak</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {['Notifications', 'Customize Container', 'History', 'Help'].map((item, i) => (
          <button key={i} className="w-full p-4 flex justify-between items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition text-left">
            <span className="text-gray-700">{item}</span>
            {Icons.chevronRight}
          </button>
        ))}
      </div>
    </div>
  )

  // QR Scanner Modal
  const QRScannerModal = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [scanning, setScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      if (showQRScanner && !scanning && !scanResult) {
        startScanning()
      }
      return () => { stopScanning() }
    }, [showQRScanner])

    const startScanning = async () => {
      try {
        setError(null)
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (text) => {
            stopScanning()
            handleScanComplete(text)
          },
          () => {}
        )
        setScanning(true)
      } catch (err) {
        setError('Camera access denied. Use demo button below.')
      }
    }

    const stopScanning = async () => {
      if (scannerRef.current && scanning) {
        try {
          await scannerRef.current.stop()
          scannerRef.current = null
          setScanning(false)
        } catch {}
      }
    }

    const handleClose = () => {
      stopScanning()
      setShowQRScanner(false)
      setScanResult(null)
    }

    // Demo scan with real container ID
    const demoScan = () => {
      const containerId = scanMode === 'return' ? DEMO_CONTAINER_ID : 'DU-2026-001'
      handleScanComplete(`DUKE-REUSE:${containerId}`)
    }

    return (
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={handleClose} className="p-2">{Icons.x}</button>
              <span className="font-medium">{scanMode === 'checkout' ? 'Scan to Checkout' : 'Scan to Return'}</span>
              <div className="w-9" />
            </div>

            {/* Scanner */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {scanResult ? (
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${scanResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
                    {scanResult.success ? (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <p className="text-white text-lg">{scanResult.message}</p>
                  {scanResult.container && (
                    <p className="text-gray-400 mt-2">Container: {scanResult.container.id}</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative w-full max-w-sm aspect-square bg-gray-900 rounded-xl overflow-hidden">
                    <div id="qr-reader" className="w-full h-full" />
                    {/* Frame overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-56 border-2 border-white/30 rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400" />
                      </div>
                    </div>
                    {error && (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center p-6">
                        <p className="text-gray-400 text-center">{error}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 text-center mt-4 text-sm">
                    {scanMode === 'checkout' ? 'Scan container QR at kiosk' : 'Scan QR on return bin'}
                  </p>

                  <button
                    onClick={demoScan}
                    disabled={isLoading}
                    className="mt-6 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Demo: Simulate Scan'}
                  </button>
                </>
              )}
            </div>

            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">
                {scanMode === 'checkout' ? 'Container will be linked to your account' : 'Earn 10 points for on-time return'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // QR Display Modal
  const QRDisplayModal = () => (
    <AnimatePresence>
      {showQRDisplay && displayQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQRDisplay(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 mb-4">Your Container QR Code</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <Image
                src={displayQRCode}
                alt="Container QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this at any return bin to return your container
            </p>
            <p className="text-xs text-gray-400 mb-4">
              ID: {currentContainer?.id}
            </p>
            <button
              onClick={() => setShowQRDisplay(false)}
              className="w-full py-2 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Return Confirmation Modal
  const ReturnConfirmation = () => (
    <AnimatePresence>
      {showReturnConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Container Returned!</h2>
            <p className="text-gray-600 mb-4">Thanks, {userData.name}!</p>
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <p className="text-green-700 font-medium">+10 points earned</p>
            </div>
            <button
              onClick={() => setShowReturnConfirmation(false)}
              className="w-full py-2 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Notifications Panel
  const NotificationsPanel = () => (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowNotifications(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)} className="p-1">{Icons.x}</button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 border-b ${!n.read ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{n.title}</p>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      className="hidden lg:flex flex-col fixed inset-y-0 left-0 bg-[#001A57] text-white z-50"
    >
      {/* Logo */}
      <div className="p-4 border-b border-blue-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#001A57] font-bold flex-shrink-0">
          D
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="font-semibold text-sm">DukeReuse 360</p>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-[#001A57] border border-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800"
      >
        {sidebarCollapsed ? Icons.chevronRight : Icons.chevronLeft}
      </button>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              activeTab === item.id ? 'bg-blue-800' : 'hover:bg-blue-800/50'
            } ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-blue-800 ${sidebarCollapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-sm">
            {userData.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div className="text-sm">
              <p className="font-medium">{userData.name}</p>
              <p className="text-blue-300 text-xs">{userData.stats.points} pts</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />

      {/* Desktop Content */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        className="hidden lg:block min-h-screen"
      >
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              {Icons.bell}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-8 h-8 bg-[#001A57] rounded-full flex items-center justify-center text-white text-sm">
                {userData.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{userData.name}</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'rewards' && <RewardsScreen />}
            {activeTab === 'challenges' && <ChallengesScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>
        </main>
      </motion.div>

      {/* Mobile */}
      <div className="lg:hidden">
        <header className="bg-[#001A57] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <span className="font-semibold">DukeReuse</span>
          <button onClick={() => setShowNotifications(true)} className="relative">
            {Icons.bell}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <main className="p-4 pb-24">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'rewards' && <RewardsScreen />}
          {activeTab === 'challenges' && <ChallengesScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
          <div className="flex justify-around py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-2 px-4 ${
                  activeTab === item.id ? 'text-[#001A57]' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Modals */}
      <NotificationsPanel />
      <ReturnConfirmation />
      <QRScannerModal />
      <QRDisplayModal />
    </div>
  )
}
