'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Types
interface ContainerInfo {
  id: string
  status: 'active' | 'at_home' | 'returned' | 'lost'
  location?: string
  lastSeen?: string
  checkoutTime?: string
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
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  share: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  flag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  tree: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3L3 12h4v8h10v-8h4L12 3z" />
    </svg>
  ),
}

export default function DukeReuseApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false)
  const [returnedContainer, setReturnedContainer] = useState<ScanResultData | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showContainerTracking, setShowContainerTracking] = useState(false)
  const [showCleaningProcess, setShowCleaningProcess] = useState(false)
  const [showDepositInfo, setShowDepositInfo] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportLost, setShowReportLost] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null)
  const [showReturnBinMap, setShowReturnBinMap] = useState(false)

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
    status: 'active',
    location: 'West Union - Marketplace',
    lastSeen: '10 minutes ago',
    checkoutTime: '11:30 AM today'
  })

  // Cup status
  const [cupStatus, setCupStatus] = useState<ContainerInfo>({
    id: 'CUP-2026-018',
    status: 'at_home',
    location: 'Your Location',
    lastSeen: 'Yesterday'
  })

  const challenges = [
    {
      name: "Clean Plate Club",
      desc: "Waste <30g for 5 meals",
      progress: 4,
      goal: 5,
      reward: "50 pts",
      fullDescription: "Reduce food waste by finishing your meals! Weigh your plate before and after eating. If you waste less than 30g for 5 consecutive meals, you earn 50 bonus points. Tip: Take smaller portions and go back for seconds if hungry."
    },
    {
      name: "Reuse Streak",
      desc: "Use reusable 10 days straight",
      progress: 7,
      goal: 10,
      reward: "Badge",
      fullDescription: "Build a sustainable habit! Use a reusable container or cup for at least one meal every day for 10 consecutive days. Missing a day resets your streak. Complete this to earn the exclusive 'Eco Warrior' badge displayed on your profile."
    },
    {
      name: "Community Champion",
      desc: "Refer 3 friends to join",
      progress: 1,
      goal: 3,
      reward: "100 pts",
      fullDescription: "Spread the sustainability movement! Share your referral code with friends. When they sign up and complete their first reusable use, you both earn 25 points. Refer 3 friends to complete this challenge and earn a bonus 100 points."
    }
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

  // Helper to get status color and label
  const getStatusInfo = (status: ContainerInfo['status']) => {
    switch (status) {
      case 'active':
        return { color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', label: 'Active - In Use' }
      case 'at_home':
        return { color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700', label: 'At Home' }
      case 'returned':
        return { color: 'bg-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-600', label: 'Returned' }
      case 'lost':
        return { color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', label: 'Lost' }
      default:
        return { color: 'bg-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-600', label: 'Unknown' }
    }
  }

  // Calculate CO2 equivalents for visualization
  const co2Equivalents = {
    milesDriven: (userData.stats.co2Prevented / 0.404).toFixed(1), // ~0.404 kg CO2 per mile
    treeDays: Math.round(userData.stats.co2Prevented / 0.022), // Trees absorb ~22g CO2 per day
    phoneCharges: Math.round(userData.stats.co2Prevented / 0.008), // ~8g CO2 per phone charge
  }

  // Handle report lost container
  const handleReportLost = () => {
    if (currentContainer) {
      setCurrentContainer({ ...currentContainer, status: 'lost' })
      setShowReportLost(false)
    }
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

      {/* How It Works Button */}
      <button
        onClick={() => setShowHowItWorks(true)}
        className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-green-100 transition"
      >
        {Icons.info}
        <span className="font-medium text-gray-700">How It Works</span>
        <span className="text-sm text-gray-500">Learn about the reusable system</span>
      </button>

      {/* Container Status Alert */}
      {currentContainer && currentContainer.status === 'active' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍱</span>
            <div className="flex-1">
              <p className="font-medium text-amber-800">You have 1 container to return</p>
              <p className="text-sm text-amber-600 mt-1">Container {currentContainer.id} - Checked out at {currentContainer.checkoutTime}</p>
            </div>
            <button
              onClick={() => setShowContainerTracking(true)}
              className="text-sm text-amber-700 underline hover:text-amber-900"
            >
              Track
            </button>
          </div>
        </div>
      )}

      {/* Container Status + Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Container Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-900">Your Reusables</h2>
            <button
              onClick={() => setShowDepositInfo(true)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {Icons.info}
              <span>$5 Deposit Info</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Cup */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusInfo(cupStatus.status).bgColor} border-opacity-50`}>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl">☕</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Reusable Cup</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 ${getStatusInfo(cupStatus.status).color} rounded-full`}></div>
                  <p className={`text-sm ${getStatusInfo(cupStatus.status).textColor}`}>{getStatusInfo(cupStatus.status).label}</p>
                </div>
              </div>
            </div>

            {/* Container */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${currentContainer ? getStatusInfo(currentContainer.status).bgColor : 'bg-gray-50'} border-opacity-50`}>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl">🍱</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Reusable Container</p>
                {currentContainer ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 ${getStatusInfo(currentContainer.status).color} rounded-full animate-pulse`}></div>
                    <p className={`text-sm ${getStatusInfo(currentContainer.status).textColor}`}>{getStatusInfo(currentContainer.status).label}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">None checked out</p>
                )}
              </div>
              {currentContainer && (
                <button
                  onClick={() => setShowContainerTracking(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Track
                </button>
              )}
            </div>
          </div>

          {/* Report Lost Option */}
          {currentContainer && currentContainer.status !== 'lost' && (
            <button
              onClick={() => setShowReportLost(true)}
              className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
            >
              {Icons.flag}
              <span>Report container as lost</span>
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-2">RFID Auto-Detection at Kiosks</p>
            <button
              onClick={() => setShowReturnBinMap(true)}
              className="w-full flex items-center gap-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {Icons.location}
              <span>Find Return Bin</span>
            </button>
            <button
              onClick={() => setShowContainerTracking(true)}
              className="w-full flex items-center gap-3 p-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              {Icons.location}
              <span>Track My Container</span>
            </button>
            <button
              onClick={() => setShowCleaningProcess(true)}
              className="w-full flex items-center gap-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {Icons.sparkles}
              <span>Cleaning Process</span>
            </button>
          </div>
        </div>
      </div>

      {/* CO2 Impact Visualization */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900 flex items-center gap-2">
            🌱 Your Environmental Impact
          </h2>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
          >
            {Icons.share}
            <span>Share</span>
          </button>
        </div>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-green-600">{userData.stats.co2Prevented}kg</p>
          <p className="text-sm text-gray-600">CO₂ Prevented</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xl font-semibold text-gray-900">🚗</p>
            <p className="text-lg font-bold text-gray-800">{co2Equivalents.milesDriven}</p>
            <p className="text-xs text-gray-500">miles not driven</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xl font-semibold text-gray-900">🌳</p>
            <p className="text-lg font-bold text-gray-800">{co2Equivalents.treeDays}</p>
            <p className="text-xs text-gray-500">tree-days of absorption</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xl font-semibold text-gray-900">📱</p>
            <p className="text-lg font-bold text-gray-800">{co2Equivalents.phoneCharges}</p>
            <p className="text-xs text-gray-500">phone charges saved</p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm text-blue-900">
          <span className="font-medium">💡 Tip:</span> Ask for smaller rice portions — you&apos;ve wasted rice in 3 of your last 5 meals.
        </p>
      </div>

      {/* Stats Grid - Desktop */}
      <div className="hidden lg:block">
        <h2 className="font-medium text-gray-900 mb-3">This Semester</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Reusable Containers', value: userData.stats.containersUsed, icon: '🍱' },
            { label: 'Reusable Cups', value: userData.stats.cupsUsed, icon: '☕' },
            { label: 'CO₂ Saved', value: `${userData.stats.co2Prevented}kg`, icon: '🌱' },
            { label: 'Points', value: userData.stats.points, icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
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
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{c.name}</h3>
                      <button
                        onClick={() => setExpandedChallenge(expandedChallenge === i ? null : i)}
                        className="text-gray-400 hover:text-blue-600 transition"
                        title="Learn more"
                      >
                        {Icons.info}
                      </button>
                    </div>
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
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(c.progress / c.goal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {/* Expandable Description */}
              <AnimatePresence>
                {expandedChallenge === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-blue-50 border-t border-blue-100"
                  >
                    <div className="p-4">
                      <p className="text-sm text-blue-800">{c.fullDescription}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
    const userPoints = userData.stats.points
    const donationPointsRequired = 500

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

    const canDonate = userPoints >= donationPointsRequired

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

        {/* Donation Reward - Durham Food Pantry */}
        <div className={`rounded-xl p-5 border-2 ${canDonate ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${canDonate ? 'bg-orange-100' : 'bg-gray-200'}`}>
              <span className="text-3xl">{canDonate ? '🧡' : '🤍'}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${canDonate ? 'text-orange-800' : 'text-gray-500'}`}>
                  Donate to Durham Food Pantry
                </h3>
                {canDonate && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">NEW</span>
                )}
              </div>
              <p className={`text-sm mt-1 ${canDonate ? 'text-orange-700' : 'text-gray-400'}`}>
                Convert your points into a meal donation for those in need
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={canDonate ? 'text-orange-600' : 'text-gray-400'}>
                    {canDonate ? 'Ready to donate!' : `${donationPointsRequired - userPoints} more points needed`}
                  </span>
                  <span className={`font-medium ${canDonate ? 'text-orange-700' : 'text-gray-500'}`}>
                    {userPoints}/{donationPointsRequired} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all duration-500 ${canDonate ? 'bg-orange-500' : 'bg-gray-400'}`}
                    style={{ width: `${Math.min((userPoints / donationPointsRequired) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            disabled={!canDonate}
            className={`w-full mt-4 py-3 rounded-lg font-medium transition ${
              canDonate
                ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canDonate ? '🧡 Donate 500 Points = 5 Meals' : 'Earn More Points to Unlock'}
          </button>
          <p className="text-xs text-center mt-2 text-gray-500">
            Each 500 points = 5 meals for Durham families in need
          </p>
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

      {/* Container Customization Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-medium text-gray-900">Customize Your Container</h2>
            <p className="text-sm text-gray-500 mt-1">Make your reusable uniquely yours!</p>
          </div>
          <button
            onClick={() => setShowCustomization(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View Options
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏷️</span>
            </div>
            <p className="text-xs font-medium text-gray-700">Name Tag</p>
            <p className="text-xs text-gray-400">Laser engraved</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎨</span>
            </div>
            <p className="text-xs font-medium text-gray-700">Color Band</p>
            <p className="text-xs text-gray-400">12 colors</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <p className="text-xs font-medium text-gray-700">Stickers</p>
            <p className="text-xs text-gray-400">Duke themes</p>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-3">
          Customization unlocks at 100 uses (You: {userData.stats.containersUsed + userData.stats.cupsUsed})
        </p>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition text-left"
        >
          <span className="text-gray-700">Notifications</span>
          {Icons.chevronRight}
        </button>
        <button
          onClick={() => setShowCustomization(true)}
          className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Customize Container</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Preview</span>
          </div>
          {Icons.chevronRight}
        </button>
        <button
          className="w-full p-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition text-left"
        >
          <span className="text-gray-700">History</span>
          {Icons.chevronRight}
        </button>
        <button
          onClick={() => setShowHowItWorks(true)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition text-left"
        >
          <span className="text-gray-700">Help & How It Works</span>
          {Icons.chevronRight}
        </button>
      </div>
    </div>
  )

  // How It Works Modal
  const HowItWorksModal = () => (
    <AnimatePresence>
      {showHowItWorks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowHowItWorks(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">How DukeReuse Works</h2>
              <button onClick={() => setShowHowItWorks(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Get Your Container</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pick up a reusable container at any dining location. The RFID chip automatically links it to your account.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enjoy Your Meal</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Use your container for takeout meals. Keep it as long as you need - just remember to return it!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Return to Any Bin</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Drop your container at any return bin on campus. The RFID reader automatically registers the return.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Earn Rewards</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Get 10 points per return, unlock rewards, compete in challenges, and track your environmental impact!
                  </p>
                </div>
              </div>
            </div>

            {/* Deposit Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>💡 Deposit:</strong> A $5 deposit is charged at the start of each semester and refunded when all containers are returned.
              </p>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full mt-6 py-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Got It!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Container Tracking Modal
  const ContainerTrackingModal = () => (
    <AnimatePresence>
      {showContainerTracking && currentContainer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContainerTracking(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Track My Container</h2>
              <button onClick={() => setShowContainerTracking(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            {/* Container Visual */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-5xl">🍱</span>
              </div>
              <p className="font-medium text-gray-900">{currentContainer.id}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className={`w-2 h-2 ${getStatusInfo(currentContainer.status).color} rounded-full animate-pulse`}></div>
                <span className={`text-sm ${getStatusInfo(currentContainer.status).textColor}`}>
                  {getStatusInfo(currentContainer.status).label}
                </span>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {Icons.location}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Location</p>
                  <p className="font-medium text-gray-900">{currentContainer.location || 'With You'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  {Icons.check}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Activity</p>
                  <p className="font-medium text-gray-900">{currentContainer.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  ⏰
                </div>
                <div>
                  <p className="text-xs text-gray-500">Checked Out</p>
                  <p className="font-medium text-gray-900">{currentContainer.checkoutTime}</p>
                </div>
              </div>
            </div>

            {/* Status Legend */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-800 mb-2">Container Status Guide:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Active - In Use</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">At Home</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">Returned</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Lost</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setShowContainerTracking(false)
                  setShowReportLost(true)
                }}
                className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
              >
                Report Lost
              </button>
              <button
                onClick={() => setShowContainerTracking(false)}
                className="flex-1 py-2 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Cleaning Process Modal
  const CleaningProcessModal = () => (
    <AnimatePresence>
      {showCleaningProcess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCleaningProcess(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Cleaning Process</h2>
              <button onClick={() => setShowCleaningProcess(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-sm text-gray-600">Your containers are cleaned to the highest standards</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-xl">🧼</span>
                <div>
                  <p className="font-medium text-gray-900">Commercial Dishwasher</p>
                  <p className="text-sm text-gray-600">180°F high-temperature sanitization</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-xl">🔬</span>
                <div>
                  <p className="font-medium text-gray-900">FDA-Approved Sanitizers</p>
                  <p className="text-sm text-gray-600">Hospital-grade cleaning agents</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium text-gray-900">Quality Inspection</p>
                  <p className="text-sm text-gray-600">Visual and cleanliness check before reuse</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-amber-50 rounded-lg">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-medium text-gray-900">Health Certified</p>
                  <p className="text-sm text-gray-600">Durham County Health Department approved</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500">
                🏆 Duke Dining has maintained an A+ health rating for 15+ consecutive years
              </p>
            </div>

            <button
              onClick={() => setShowCleaningProcess(false)}
              className="w-full mt-4 py-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Deposit Info Modal
  const DepositInfoModal = () => (
    <AnimatePresence>
      {showDepositInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDepositInfo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Deposit & Fees</h2>
              <button onClick={() => setShowDepositInfo(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-4xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-green-600">$5</p>
              <p className="text-sm text-gray-600">Semester Deposit</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">✅ Full Refund</h3>
                <p className="text-sm text-green-700">
                  Return all containers by semester end to get your full $5 deposit back!
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2">⚠️ Lost Container</h3>
                <p className="text-sm text-amber-700">
                  Lost containers are charged against your deposit. Each container = $5 replacement fee.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">📅 Important Dates</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Deposit charged: First week of semester</li>
                  <li>• Return deadline: Last day of finals</li>
                  <li>• Refund processed: Within 2 weeks</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Questions? Contact dining@duke.edu
            </div>

            <button
              onClick={() => setShowDepositInfo(false)}
              className="w-full mt-4 py-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Got It
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Share Impact Modal
  const ShareImpactModal = () => (
    <AnimatePresence>
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Share Your Impact</h2>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white mb-6">
              <div className="text-center">
                <p className="text-sm opacity-90">🌱 My DukeReuse Impact</p>
                <p className="text-4xl font-bold my-2">{userData.stats.co2Prevented}kg</p>
                <p className="text-sm opacity-90">CO₂ Prevented</p>
                <div className="mt-4 flex justify-center gap-4 text-sm">
                  <div>
                    <p className="font-bold">{userData.stats.containersUsed + userData.stats.cupsUsed}</p>
                    <p className="opacity-75">Uses</p>
                  </div>
                  <div>
                    <p className="font-bold">#{userData.stats.rank}</p>
                    <p className="opacity-75">Rank</p>
                  </div>
                </div>
                <p className="mt-4 text-xs opacity-75">@DukeReuse #Sustainability</p>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-1 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-90 transition">
                <span className="text-xl">📸</span>
                <span className="text-xs">Instagram</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-blue-500 rounded-lg text-white hover:opacity-90 transition">
                <span className="text-xl">🐦</span>
                <span className="text-xs">Twitter</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded-lg text-white hover:opacity-90 transition">
                <span className="text-xl">📘</span>
                <span className="text-xs">Facebook</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition">
                <span className="text-xl">📋</span>
                <span className="text-xs">Copy</span>
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              Share your sustainability journey and inspire others!
            </p>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Report Lost Modal
  const ReportLostModal = () => (
    <AnimatePresence>
      {showReportLost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportLost(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Report Container as Lost?</h2>
              <p className="text-sm text-gray-600 mt-2">
                Container: {currentContainer?.id}
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> Reporting a container as lost will result in a $5 charge to your account. If you find your container later, contact dining@duke.edu for a refund.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportLost(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportLost}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Report Lost
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Customization Modal
  const CustomizationModal = () => (
    <AnimatePresence>
      {showCustomization && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCustomization(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Customize Your Container</h2>
              <button onClick={() => setShowCustomization(false)} className="p-1 hover:bg-gray-100 rounded">
                {Icons.x}
              </button>
            </div>

            {/* Container Preview */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-3 border-4 border-blue-200 relative">
                <span className="text-6xl">🍱</span>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  J
                </div>
              </div>
              <p className="text-sm text-gray-600">Preview of your customized container</p>
            </div>

            <div className="space-y-4">
              {/* Name Engraving */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏷️</span>
                    <h3 className="font-medium text-gray-900">Name Engraving</h3>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Laser engraved name or initials on the lid</p>
                <input
                  type="text"
                  placeholder="Enter name (max 15 chars)"
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                  maxLength={15}
                />
              </div>

              {/* Color Band */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <h3 className="font-medium text-gray-900">Color Band</h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">100+ uses</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Silicone band to identify your container</p>
                <div className="flex flex-wrap gap-2">
                  {['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-800'].map((color, i) => (
                    <button key={i} className={`w-8 h-8 ${color} rounded-full border-2 border-white shadow hover:scale-110 transition`} />
                  ))}
                </div>
              </div>

              {/* Stickers */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <h3 className="font-medium text-gray-900">Duke Stickers</h3>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">200+ uses</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Premium waterproof Duke-themed stickers</p>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-[#001A57] rounded-lg flex items-center justify-center text-white text-2xl">D</div>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl">🏀</div>
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-3xl">🌱</div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">+</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                You have <strong>{userData.stats.containersUsed + userData.stats.cupsUsed} uses</strong>.
                {userData.stats.containersUsed + userData.stats.cupsUsed >= 100
                  ? ' Color bands unlocked!'
                  : ` ${100 - (userData.stats.containersUsed + userData.stats.cupsUsed)} more uses to unlock color bands.`}
              </p>
            </div>

            <button
              onClick={() => setShowCustomization(false)}
              className="w-full mt-4 py-3 bg-[#001A57] text-white rounded-lg hover:bg-[#00296B] transition"
            >
              Save Customization
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Return Bin Map Modal
  const ReturnBinMapModal = () => {
    const returnBinLocations = [
      { id: 1, name: 'West Union', area: 'Marketplace', bins: 3, hours: '7am - 10pm', distance: '2 min', status: 'open' },
      { id: 2, name: 'Brodhead Center', area: 'Main Entrance', bins: 2, hours: '7am - 9pm', distance: '5 min', status: 'open' },
      { id: 3, name: 'Penn Pavilion', area: 'Food Court', bins: 2, hours: '11am - 8pm', distance: '7 min', status: 'open' },
      { id: 4, name: 'Marketplace', area: 'East Campus', bins: 2, hours: '7am - 10pm', distance: '12 min', status: 'open' },
      { id: 5, name: 'The Loop', area: 'Near Perkins', bins: 1, hours: '8am - 6pm', distance: '4 min', status: 'closing soon' },
      { id: 6, name: 'Twinnie\'s', area: 'Trent Hall', bins: 1, hours: '8am - 11pm', distance: '8 min', status: 'open' },
    ]

    return (
      <AnimatePresence>
        {showReturnBinMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowReturnBinMap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-2xl w-full my-8 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center bg-green-600 text-white">
                <h2 className="text-xl font-semibold">Find Return Bin</h2>
                <button onClick={() => setShowReturnBinMap(false)} className="p-1 hover:bg-green-700 rounded">
                  {Icons.x}
                </button>
              </div>

              {/* Mock Map */}
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 h-64 overflow-hidden">
                {/* Campus outline */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                  {/* Roads */}
                  <path d="M0 100 L400 100" stroke="#d1d5db" strokeWidth="8" fill="none" />
                  <path d="M200 0 L200 200" stroke="#d1d5db" strokeWidth="8" fill="none" />
                  <path d="M50 50 L350 50" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                  <path d="M50 150 L350 150" stroke="#e5e7eb" strokeWidth="4" fill="none" />

                  {/* Buildings */}
                  <rect x="80" y="60" width="60" height="40" fill="#001A57" rx="4" opacity="0.7" />
                  <rect x="260" y="60" width="50" height="35" fill="#001A57" rx="4" opacity="0.7" />
                  <rect x="160" y="110" width="80" height="50" fill="#001A57" rx="4" opacity="0.7" />
                  <rect x="300" y="120" width="45" height="40" fill="#001A57" rx="4" opacity="0.7" />
                  <rect x="40" y="130" width="55" height="35" fill="#001A57" rx="4" opacity="0.7" />

                  {/* Return bin markers */}
                  <g className="cursor-pointer">
                    <circle cx="110" cy="80" r="12" fill="#16a34a" stroke="white" strokeWidth="2" />
                    <text x="110" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="285" cy="77" r="12" fill="#16a34a" stroke="white" strokeWidth="2" />
                    <text x="285" y="81" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="200" cy="135" r="12" fill="#16a34a" stroke="white" strokeWidth="2" />
                    <text x="200" y="139" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="322" cy="140" r="12" fill="#16a34a" stroke="white" strokeWidth="2" />
                    <text x="322" y="144" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="67" cy="147" r="12" fill="#eab308" stroke="white" strokeWidth="2" />
                    <text x="67" y="151" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
                  </g>
                  <g className="cursor-pointer">
                    <circle cx="170" cy="60" r="12" fill="#16a34a" stroke="white" strokeWidth="2" />
                    <text x="170" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
                  </g>

                  {/* You are here marker */}
                  <circle cx="200" cy="100" r="8" fill="#3b82f6" stroke="white" strokeWidth="2">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="100" r="20" fill="#3b82f6" opacity="0.2">
                    <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>Return Bin</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Closing Soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>You</span>
                  </div>
                </div>

                {/* Nearest label */}
                <div className="absolute top-2 right-2 bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-medium">
                  Nearest: West Union (2 min)
                </div>
              </div>

              {/* Location List */}
              <div className="p-4 max-h-64 overflow-y-auto">
                <h3 className="font-medium text-gray-900 mb-3">All Return Locations</h3>
                <div className="space-y-2">
                  {returnBinLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        loc.status === 'closing soon' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          loc.status === 'closing soon' ? 'bg-yellow-500' : 'bg-green-600'
                        }`}>
                          {loc.bins}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{loc.name}</p>
                          <p className="text-sm text-gray-500">{loc.area} · {loc.hours}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{loc.distance}</p>
                        <p className={`text-xs ${loc.status === 'closing soon' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {loc.status === 'closing soon' ? 'Closing soon' : 'Open'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">11 bins</span> available across campus
                  </div>
                  <button
                    onClick={() => setShowReturnBinMap(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

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
      <HowItWorksModal />
      <ContainerTrackingModal />
      <CleaningProcessModal />
      <DepositInfoModal />
      <ShareImpactModal />
      <ReportLostModal />
      <CustomizationModal />
      <ReturnBinMapModal />
    </div>
  )
}
