'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'

// Types
interface UserData {
  name: string
  classYear: string
  dorm: string
  cup: { status: string; clean: boolean }
  container: { status: string; daysOut: number; dueIn: number }
  stats: {
    containersUsed: number
    cupsUsed: number
    wasteAvoided: number
    co2Prevented: number
    avgFoodWaste: number
    foodWasteImprovement: number
    rank: number
    totalStudents: number
    points: number
    dormRank: number
  }
}

interface Challenge {
  name: string
  desc: string
  progress: number
  goal: number
  reward: string
}

interface DormEntry {
  name: string
  points: number
  isUser: boolean
}

interface Notification {
  id: string
  type: 'reminder' | 'achievement' | 'warning'
  title: string
  message: string
  time: string
  read: boolean
}

export default function DukeReuseApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scanMode, setScanMode] = useState<'checkout' | 'return'>('return')
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Sample user data
  const [userData] = useState<UserData>({
    name: "Jaideep",
    classYear: "'28",
    dorm: "Randolph Hall",
    cup: { status: "home", clean: true },
    container: { status: "checked_out", daysOut: 2, dueIn: 5 },
    stats: {
      containersUsed: 89,
      cupsUsed: 134,
      wasteAvoided: 5.2,
      co2Prevented: 14.7,
      avgFoodWaste: 32,
      foodWasteImprovement: 18,
      rank: 203,
      totalStudents: 16000,
      points: 847,
      dormRank: 2
    }
  })

  const [challenges] = useState<Challenge[]>([
    {
      name: "Clean Plate Club",
      desc: "Waste <30g for 5 meals",
      progress: 4,
      goal: 5,
      reward: "50 dining points"
    },
    {
      name: "Reuse Streak",
      desc: "Use reusable 10 days straight",
      progress: 7,
      goal: 10,
      reward: "Limited edition cup color"
    }
  ])

  const [dormLeaderboard] = useState<DormEntry[]>([
    { name: "Bassett", points: 12450, isUser: false },
    { name: "Randolph", points: 11892, isUser: true },
    { name: "Trinity", points: 10234, isUser: false },
    { name: "Kilgo", points: 9876, isUser: false },
    { name: "Crowell", points: 9234, isUser: false }
  ])

  // Reminder notification system
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  // Simulate reminder notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'reminder',
        title: 'Container Return Reminder',
        message: 'Your container is due in 5 days. Return to any dining hall to avoid fees.',
        time: '9:00 AM',
        read: false
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Streak Alert!',
        message: "You're 3 days away from completing the Reuse Streak challenge!",
        time: '8:30 AM',
        read: true
      }
    ])

    const reminderInterval = setInterval(() => {
      if (userData.container.status === 'checked_out' && userData.container.dueIn <= 3) {
        addNotification({
          type: 'warning',
          title: 'Urgent: Return Soon!',
          message: `Only ${userData.container.dueIn} days left to return your container!`
        })
      }
    }, 60000)

    return () => clearInterval(reminderInterval)
  }, [userData.container.status, userData.container.dueIn, addNotification])

  const openScanner = (mode: 'checkout' | 'return') => {
    setScanMode(mode)
    setScanResult(null)
    setShowQRScanner(true)
  }

  const handleScanSuccess = (decodedText: string) => {
    // Simulate processing the QR code
    console.log('QR Code scanned:', decodedText)

    if (scanMode === 'return') {
      setScanResult({
        success: true,
        message: 'Container returned successfully! +10 points'
      })
      // Show return confirmation after a brief delay
      setTimeout(() => {
        setShowQRScanner(false)
        setScanResult(null)
        setShowReturnConfirmation(true)
        setTimeout(() => setShowReturnConfirmation(false), 3000)
      }, 1500)
    } else {
      setScanResult({
        success: true,
        message: 'Container checked out! Enjoy your meal.'
      })
      setTimeout(() => {
        setShowQRScanner(false)
        setScanResult(null)
        addNotification({
          type: 'achievement',
          title: 'Container Checked Out',
          message: 'Remember to return within 7 days!'
        })
      }, 1500)
    }
  }

  const simulateReturn = () => {
    setShowReturnConfirmation(true)
    setTimeout(() => setShowReturnConfirmation(false), 3000)
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'impact', icon: '📊', label: 'Impact' },
    { id: 'challenges', icon: '🎯', label: 'Challenges' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ]

  // Home Screen
  const HomeScreen = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Banner - Mobile only, desktop has header */}
      <div className="lg:hidden bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold">{userData.name} {userData.classYear}</h1>
            <p className="text-blue-200 text-sm mt-1">{userData.dorm}</p>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: Stats Overview Banner */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-200">Your Sustainability Dashboard</h2>
            <p className="text-3xl font-bold mt-1">Fall 2026 Semester</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold">{userData.stats.containersUsed + userData.stats.cupsUsed}</p>
              <p className="text-blue-200 text-sm">Total Uses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400">{userData.stats.co2Prevented}kg</p>
              <p className="text-blue-200 text-sm">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-400">#{userData.stats.rank}</p>
              <p className="text-blue-200 text-sm">Campus Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Three column layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
        {/* Kit Status */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow lg:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span className="text-lg">🎒</span> Your Kit Status
          </h2>

          <div className="lg:grid lg:grid-cols-2 space-y-3 lg:space-y-0 lg:gap-4">
            <div className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl lg:text-3xl">☕</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Personal Cup</p>
                  <p className="text-sm text-green-600 font-medium">At home (clean)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl lg:text-3xl">🍱</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Personal Container</p>
                  <p className="text-sm text-amber-600 font-medium">Checked out (Day {userData.container.daysOut})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">In Use</span>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center gap-3 border border-amber-200">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800">Return Reminder</p>
              <p className="text-sm text-amber-700">Return container by Friday to avoid fees ({userData.container.dueIn} days left)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Desktop: Sidebar style */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span>⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <button
              onClick={() => openScanner('checkout')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">📷</span>
              <span className="font-medium">Scan Checkout</span>
            </button>
            <button
              onClick={() => openScanner('return')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-3 hover:from-green-700 hover:to-emerald-700 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">✅</span>
              <span className="font-medium">Scan Return</span>
            </button>
            <button className="bg-gray-100 text-gray-800 p-4 rounded-xl flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95">
              <span className="text-2xl">📍</span>
              <span className="font-medium">Find Return Bin</span>
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className="bg-gray-100 text-gray-800 p-4 rounded-xl flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium">My Impact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Tip - Full width */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 lg:p-6 border border-blue-100 hover:border-blue-200 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <p className="text-blue-600 font-semibold mb-1">Today&apos;s Personalized Tip</p>
            <p className="text-gray-700 lg:text-lg">Try asking for a smaller rice portion — you&apos;ve wasted rice in 3 of your last 5 meals!</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Desktop only */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {[
          { value: userData.stats.containersUsed, label: 'Containers Used', color: 'blue', icon: '🍱' },
          { value: userData.stats.cupsUsed, label: 'Cups Used', color: 'indigo', icon: '☕' },
          { value: `${userData.stats.co2Prevented} kg`, label: 'CO₂ Prevented', color: 'green', icon: '🌱' },
          { value: `#${userData.stats.rank}`, label: 'Campus Rank', color: 'amber', icon: '🏆' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-700`}>This semester</span>
            </div>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )

  // Impact Dashboard
  const ImpactScreen = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">📊 Your Impact</h1>
          <p className="text-gray-500">Fall 2026 Semester</p>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
        {/* Packaging Impact */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span className="text-lg">📦</span> Packaging Saved
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl lg:text-4xl font-bold text-blue-600">{userData.stats.containersUsed}</p>
              <p className="text-sm lg:text-base text-gray-600">Containers</p>
            </div>
            <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl lg:text-4xl font-bold text-blue-600">{userData.stats.cupsUsed}</p>
              <p className="text-sm lg:text-base text-gray-600">Cups</p>
            </div>
            <div className="text-center p-3 lg:p-4 bg-green-50 rounded-xl">
              <p className="text-3xl lg:text-4xl font-bold text-green-600">{userData.stats.wasteAvoided}</p>
              <p className="text-sm lg:text-base text-gray-600">lbs waste avoided</p>
            </div>
            <div className="text-center p-3 lg:p-4 bg-green-50 rounded-xl">
              <p className="text-3xl lg:text-4xl font-bold text-green-600">{userData.stats.co2Prevented}</p>
              <p className="text-sm lg:text-base text-gray-600">kg CO₂ prevented</p>
            </div>
          </div>
        </div>

        {/* Food Waste Impact */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span className="text-lg">🍽️</span> Food Waste (EcoTrack)
          </h2>

          <div className="space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average per meal:</span>
              <span className="font-bold text-green-600 text-lg">{userData.stats.avgFoodWaste}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Improvement:</span>
              <span className="font-bold text-green-600 text-lg">↓ {userData.stats.foodWasteImprovement}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 lg:h-4">
              <div
                className="bg-green-500 rounded-full h-3 lg:h-4 transition-all"
                style={{ width: `${100 - userData.stats.foodWasteImprovement}%` }}
              ></div>
            </div>
            <p className="text-sm lg:text-base text-gray-500">🥇 Better than 78% of Duke students!</p>
          </div>

          <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-amber-50 rounded-xl">
            <p className="text-sm lg:text-base text-amber-800">
              💡 <strong>Most wasted:</strong> Rice — try asking for smaller portions
            </p>
          </div>
        </div>
      </div>

      {/* Combined Score */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 lg:p-6 text-white">
        <h2 className="font-semibold mb-3 lg:mb-4 text-lg">🏆 Combined Score</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-4xl lg:text-5xl font-bold">{userData.stats.points}</p>
            <p className="text-blue-200">total points</p>
          </div>
          <div className="text-right">
            <p className="text-2xl lg:text-3xl font-bold">#{userData.stats.rank}</p>
            <p className="text-blue-200">of {userData.stats.totalStudents.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Equivalents */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-lg">🌍 That&apos;s equivalent to...</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="flex lg:flex-col items-center gap-2 lg:gap-1 p-3 bg-green-50 rounded-xl">
            <span className="text-2xl lg:text-3xl">🌳</span>
            <span className="lg:text-xl font-semibold">0.4 trees saved</span>
          </div>
          <div className="flex lg:flex-col items-center gap-2 lg:gap-1 p-3 bg-blue-50 rounded-xl">
            <span className="text-2xl lg:text-3xl">🚗</span>
            <span className="lg:text-xl font-semibold">36 miles not driven</span>
          </div>
          <div className="flex lg:flex-col items-center gap-2 lg:gap-1 p-3 bg-amber-50 rounded-xl">
            <span className="text-2xl lg:text-3xl">💡</span>
            <span className="lg:text-xl font-semibold">48 hours LED powered</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Challenges & Gamification Screen
  const ChallengesScreen = () => (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">🎯 Challenges</h1>

      {/* Desktop: Grid layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
        {/* Active Challenges */}
        <div className="space-y-3 lg:space-y-4">
          <h2 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Active Challenges</h2>
          {challenges.map((challenge, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 lg:p-5 shadow-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{challenge.name}</h3>
                  <p className="text-sm lg:text-base text-gray-500">{challenge.desc}</p>
                </div>
                <span className="text-xs lg:text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                  {challenge.reward}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{challenge.progress}/{challenge.goal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3 transition-all"
                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* Badges */}
          <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-lg border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4">🎖️ Your Badges</h2>
            <div className="flex gap-3 lg:gap-4 flex-wrap">
              <div className="text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl lg:text-3xl">🌱</div>
                <p className="text-xs lg:text-sm mt-1 text-gray-600">First Reuse</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl lg:text-3xl">💯</div>
                <p className="text-xs lg:text-sm mt-1 text-gray-600">100 Uses</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl lg:text-3xl">🔥</div>
                <p className="text-xs lg:text-sm mt-1 text-gray-600">7-Day Streak</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl lg:text-3xl border-2 border-dashed border-gray-300">?</div>
                <p className="text-xs lg:text-sm mt-1 text-gray-400">Locked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dorm Leaderboard */}
        <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-lg border border-gray-100 h-fit">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span>🏠</span> November Dorm Competition
          </h2>
          <p className="text-sm lg:text-base text-gray-500 mb-3 lg:mb-4">Prize: Pizza party for winning dorm!</p>

          <div className="space-y-2 lg:space-y-3">
            {dormLeaderboard.map((dorm, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 lg:p-4 rounded-xl ${dorm.isUser ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg lg:text-xl font-bold text-gray-400 w-6">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <span className={`font-medium lg:text-lg ${dorm.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                    {dorm.name}
                  </span>
                  {dorm.isUser && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">YOU</span>}
                </div>
                <span className="font-semibold lg:text-lg">{dorm.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Profile Screen
  const ProfileScreen = () => (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">👤 Profile</h1>

      {/* Desktop: Grid layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl lg:text-4xl">
              👤
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{userData.name}</h2>
              <p className="text-gray-500">Duke Class of {userData.classYear}</p>
              <p className="text-gray-500">{userData.dorm}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3 lg:gap-4">
          <div className="bg-blue-50 rounded-xl p-3 lg:p-5 text-center">
            <p className="text-2xl lg:text-4xl font-bold text-blue-600">{userData.stats.points}</p>
            <p className="text-xs lg:text-sm text-gray-600">Points</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 lg:p-5 text-center">
            <p className="text-2xl lg:text-4xl font-bold text-green-600">#{userData.stats.rank}</p>
            <p className="text-xs lg:text-sm text-gray-600">Rank</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 lg:p-5 text-center">
            <p className="text-2xl lg:text-4xl font-bold text-amber-600">7</p>
            <p className="text-xs lg:text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 lg:max-w-2xl">
        <h2 className="font-semibold text-gray-800 p-4 lg:p-5 border-b border-gray-100">Settings</h2>
        {[
          { icon: '🔔', label: 'Notification Settings' },
          { icon: '🎨', label: 'Customize Cup/Container' },
          { icon: '📜', label: 'Checkout History' },
          { icon: '❓', label: 'Help & Support' }
        ].map((item, i) => (
          <button key={i} className="w-full p-4 lg:p-5 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
            <span className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="lg:text-lg">{item.label}</span>
            </span>
            <span className="text-gray-400">→</span>
          </button>
        ))}
      </div>
    </div>
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
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm lg:max-w-md bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 lg:p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg lg:text-xl font-semibold">Notifications</h2>
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={markAllRead}
                  className="text-sm lg:text-base text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 lg:p-2 hover:bg-gray-100 rounded text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-4xl lg:text-5xl mb-2">🔔</p>
                  <p className="lg:text-lg">No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 lg:p-5 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl lg:text-3xl">
                        {notification.type === 'reminder' ? '⏰' :
                          notification.type === 'achievement' ? '🏆' : '⚠️'}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-800 lg:text-lg">{notification.title}</p>
                          <span className="text-xs lg:text-sm text-gray-400">{notification.time}</span>
                        </div>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 lg:p-8 max-w-sm lg:max-w-md w-full text-center"
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl lg:text-5xl">✅</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Container Returned!</h2>
            <p className="text-gray-600 mb-4 lg:text-lg">Great job, {userData.name}!</p>

            <div className="bg-green-50 rounded-xl p-4 lg:p-5 mb-4">
              <p className="text-green-800 font-medium lg:text-lg">+10 points earned</p>
              <p className="text-sm lg:text-base text-green-600">You&apos;ve now saved 90 containers this semester!</p>
            </div>

            <button
              onClick={() => setShowReturnConfirmation(false)}
              className="w-full bg-blue-600 text-white py-3 lg:py-4 rounded-xl font-medium hover:bg-blue-700 transition text-lg"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // QR Scanner Modal
  const QRScannerModal = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)

    useEffect(() => {
      if (showQRScanner && !isScanning) {
        startScanning()
      }

      return () => {
        stopScanning()
      }
    }, [showQRScanner])

    const startScanning = async () => {
      try {
        setCameraError(null)
        const html5QrCode = new Html5Qrcode('qr-reader')
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            handleScanSuccess(decodedText)
            stopScanning()
          },
          () => {
            // Ignore scan errors (no QR found)
          }
        )
        setIsScanning(true)
      } catch (err) {
        console.error('Error starting scanner:', err)
        setCameraError('Unable to access camera. Please allow camera permissions or try the demo mode.')
      }
    }

    const stopScanning = async () => {
      if (scannerRef.current && isScanning) {
        try {
          await scannerRef.current.stop()
          scannerRef.current = null
          setIsScanning(false)
        } catch (err) {
          console.error('Error stopping scanner:', err)
        }
      }
    }

    const handleClose = () => {
      stopScanning()
      setShowQRScanner(false)
      setScanResult(null)
    }

    const simulateScan = () => {
      // Demo mode: simulate a successful scan
      handleScanSuccess('DUKE-CONTAINER-' + Math.random().toString(36).substr(2, 9).toUpperCase())
    }

    return (
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full">
                <span className="text-2xl">✕</span>
              </button>
              <h2 className="text-lg font-semibold">
                {scanMode === 'checkout' ? 'Scan to Checkout' : 'Scan to Return'}
              </h2>
              <div className="w-10"></div>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {scanResult ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${scanResult.success ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    <span className="text-5xl">{scanResult.success ? '✓' : '✕'}</span>
                  </div>
                  <p className="text-white text-xl font-medium">{scanResult.message}</p>
                </motion.div>
              ) : (
                <>
                  <div className="relative w-full max-w-sm aspect-square bg-black rounded-2xl overflow-hidden mb-4">
                    <div id="qr-reader" className="w-full h-full"></div>

                    {/* Scanner Frame Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                        </div>
                      </div>
                    </div>

                    {/* Camera error overlay */}
                    {cameraError && (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center p-4">
                        <div className="text-center">
                          <span className="text-4xl mb-4 block">📷</span>
                          <p className="text-white/70 text-sm">{cameraError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-white/70 text-center mb-4">
                    {scanMode === 'checkout'
                      ? 'Point camera at the container QR code at the dining hall kiosk'
                      : 'Point camera at the QR code on the return bin'}
                  </p>

                  {/* Demo/Manual Entry */}
                  <button
                    onClick={simulateScan}
                    className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition"
                  >
                    Demo: Simulate Scan
                  </button>
                </>
              )}
            </div>

            {/* Bottom Info */}
            <div className="p-4 pb-8 text-center">
              <p className="text-white/50 text-sm">
                {scanMode === 'checkout'
                  ? 'Container will be checked out to your account'
                  : 'Return your container to earn points'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 bg-gradient-to-b from-blue-900 via-blue-900 to-blue-950 text-white shadow-2xl z-50"
    >
      {/* Logo & Collapse Toggle */}
      <div className="p-4 border-b border-blue-800/50 flex items-center justify-between">
        <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
            D
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-lg font-bold whitespace-nowrap">DukeReuse 360</h1>
              <p className="text-blue-300 text-xs">Smart Reusable System</p>
            </motion.div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
            title="Collapse sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="mx-auto mt-2 p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
          title="Expand sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-1`}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-3 ${sidebarCollapsed ? 'px-2 py-3' : 'px-4 py-3'} rounded-xl transition-all duration-200 group relative ${activeTab === item.id
              ? 'bg-blue-700/80 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className={`${sidebarCollapsed ? 'text-2xl' : 'text-xl'} transition-transform group-hover:scale-110`}>{item.icon}</span>
            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-400 rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Quick Actions */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-blue-800/50">
          <p className="text-blue-300 text-xs uppercase tracking-wide mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openScanner('checkout')}
              className="p-3 bg-blue-800/50 hover:bg-blue-700 rounded-xl transition-all hover:scale-105 text-center"
            >
              <span className="text-lg block">📷</span>
              <span className="text-xs text-blue-200">Checkout</span>
            </button>
            <button
              onClick={() => openScanner('return')}
              className="p-3 bg-green-600/80 hover:bg-green-600 rounded-xl transition-all hover:scale-105 text-center"
            >
              <span className="text-lg block">✅</span>
              <span className="text-xs text-green-100">Return</span>
            </button>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-blue-800/50`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {userData.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="font-medium truncate">{userData.name}</p>
              <p className="text-blue-300 text-sm truncate">{userData.dorm}</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{ paddingLeft: sidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen lg:block hidden"
      >
        {/* Desktop Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-8 py-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize flex items-center gap-2">
                  {navItems.find(item => item.id === activeTab)?.icon}
                  {activeTab}
                </h2>
                <p className="text-gray-500 text-sm">Welcome back, {userData.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Notification Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 hover:bg-gray-100 rounded-xl transition-all hover:shadow-md"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Divider */}
              <div className="w-px h-8 bg-gray-200"></div>
              {/* User Menu */}
              <div className="flex items-center gap-3 pl-2 pr-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {userData.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.stats.points} points</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'impact' && <ImpactScreen />}
            {activeTab === 'challenges' && <ChallengesScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>
        </main>
      </motion.div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Status Bar */}
        <div className="bg-blue-900 text-white px-4 py-2 flex justify-between text-sm sticky top-0 z-40">
          <span>9:41</span>
          <span className="font-semibold">DukeReuse 360</span>
          <span>🔋 89%</span>
        </div>

        {/* Mobile Page Content */}
        <main className="p-4 pb-24">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'impact' && <ImpactScreen />}
            {activeTab === 'challenges' && <ChallengesScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-2">
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <NotificationsPanel />
      <ReturnConfirmation />
      <QRScannerModal />
    </div>
  )
}
