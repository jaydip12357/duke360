'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      {/* Welcome - Desktop shows notification bell inline */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 lg:p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm lg:text-base">Welcome back,</p>
            <h1 className="text-2xl lg:text-3xl font-bold">{userData.name} {userData.classYear}</h1>
            <p className="text-blue-200 text-sm lg:text-base mt-1">{userData.dorm}</p>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 lg:p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <span className="text-xl lg:text-2xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: Two column layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
        {/* Kit Status */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span className="text-lg">🎒</span> Your Kit Status
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 lg:p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl lg:text-3xl">☕</span>
                <div>
                  <p className="font-medium text-gray-800">Personal Cup</p>
                  <p className="text-sm text-green-600">At home (clean)</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 lg:p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl lg:text-3xl">🍱</span>
                <div>
                  <p className="font-medium text-gray-800">Personal Container</p>
                  <p className="text-sm text-amber-600">Checked out (Day {userData.container.daysOut})</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-amber-100 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-sm lg:text-base text-amber-800">Return container by Friday to avoid fees</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 text-lg">
            <span>⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button className="bg-blue-600 text-white p-4 lg:p-5 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-700 transition active:scale-95">
              <span className="text-2xl lg:text-3xl">📱</span>
              <span className="font-medium">Mobile Order</span>
            </button>
            <button className="bg-gray-100 text-gray-800 p-4 lg:p-5 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-200 transition active:scale-95">
              <span className="text-2xl lg:text-3xl">📍</span>
              <span className="font-medium">Find Return Bin</span>
            </button>
            <button
              onClick={simulateReturn}
              className="bg-green-600 text-white p-4 lg:p-5 rounded-xl flex flex-col items-center gap-2 hover:bg-green-700 transition active:scale-95"
            >
              <span className="text-2xl lg:text-3xl">✅</span>
              <span className="font-medium">Scan Return</span>
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className="bg-gray-100 text-gray-800 p-4 lg:p-5 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-200 transition active:scale-95"
            >
              <span className="text-2xl lg:text-3xl">📊</span>
              <span className="font-medium">My Impact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Tip - Full width */}
      <div className="bg-blue-50 rounded-2xl p-4 lg:p-6 border border-blue-100">
        <p className="text-sm lg:text-base text-blue-600 font-medium mb-1">💡 Today&apos;s Tip</p>
        <p className="text-gray-700 lg:text-lg">Try asking for a smaller rice portion — you&apos;ve wasted rice in 3 of your last 5 meals!</p>
      </div>

      {/* Quick Stats - Desktop only */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 text-center">
          <p className="text-3xl font-bold text-blue-600">{userData.stats.containersUsed}</p>
          <p className="text-sm text-gray-600">Containers Used</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 text-center">
          <p className="text-3xl font-bold text-blue-600">{userData.stats.cupsUsed}</p>
          <p className="text-sm text-gray-600">Cups Used</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{userData.stats.co2Prevented} kg</p>
          <p className="text-sm text-gray-600">CO₂ Prevented</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 text-center">
          <p className="text-3xl font-bold text-amber-600">#{userData.stats.rank}</p>
          <p className="text-sm text-gray-600">Campus Rank</p>
        </div>
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

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-blue-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold">DukeReuse 360</h1>
        <p className="text-blue-300 text-sm mt-1">Smart Reusable System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id
              ? 'bg-blue-800 text-white'
              : 'text-blue-200 hover:bg-blue-800/50'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            👤
          </div>
          <div>
            <p className="font-medium">{userData.name}</p>
            <p className="text-blue-300 text-sm">{userData.dorm}</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Mobile Status Bar */}
        <div className="lg:hidden bg-blue-900 text-white px-4 py-2 flex justify-between text-sm sticky top-0 z-40">
          <span>9:41</span>
          <span className="font-semibold">DukeReuse 360</span>
          <span>🔋 89%</span>
        </div>

        {/* Desktop Header */}
        <header className="hidden lg:flex lg:items-center lg:justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">👤</div>
              <span className="font-medium">{userData.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 pb-24 lg:pb-8">
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
    </div>
  )
}
