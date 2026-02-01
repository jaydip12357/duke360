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
    // Initial notifications
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

    // Simulate periodic reminder
    const reminderInterval = setInterval(() => {
      if (userData.container.status === 'checked_out' && userData.container.dueIn <= 3) {
        addNotification({
          type: 'warning',
          title: 'Urgent: Return Soon!',
          message: `Only ${userData.container.dueIn} days left to return your container!`
        })
      }
    }, 60000) // Check every minute

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

  // Home Screen
  const HomeScreen = () => (
    <div className="p-4 space-y-4">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold">{userData.name} {userData.classYear}</h1>
            <p className="text-blue-200 text-sm mt-1">{userData.dorm}</p>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 bg-white/20 rounded-full"
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

      {/* Kit Status */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">🎒</span> Your Kit Status
        </h2>

        <div className="space-y-3">
          {/* Cup Status */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☕</span>
              <div>
                <p className="font-medium text-gray-800">Personal Cup</p>
                <p className="text-sm text-green-600">At home (clean)</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          {/* Container Status */}
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍱</span>
              <div>
                <p className="font-medium text-gray-800">Personal Container</p>
                <p className="text-sm text-amber-600">Checked out (Day {userData.container.daysOut})</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-3 p-3 bg-amber-100 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <p className="text-sm text-amber-800">Return container by Friday to avoid fees</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-blue-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-700 transition active:scale-95">
          <span className="text-2xl">📱</span>
          <span className="font-medium">Mobile Order</span>
        </button>
        <button className="bg-gray-100 text-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-200 transition active:scale-95">
          <span className="text-2xl">📍</span>
          <span className="font-medium">Find Return Bin</span>
        </button>
        <button
          onClick={simulateReturn}
          className="bg-green-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-green-700 transition active:scale-95"
        >
          <span className="text-2xl">✅</span>
          <span className="font-medium">Scan Return</span>
        </button>
        <button
          onClick={() => setActiveTab('impact')}
          className="bg-gray-100 text-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-200 transition active:scale-95"
        >
          <span className="text-2xl">📊</span>
          <span className="font-medium">My Impact</span>
        </button>
      </div>

      {/* Today's Tip */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <p className="text-sm text-blue-600 font-medium mb-1">💡 Today&apos;s Tip</p>
        <p className="text-gray-700">Try asking for a smaller rice portion — you&apos;ve wasted rice in 3 of your last 5 meals!</p>
      </div>
    </div>
  )

  // Impact Dashboard
  const ImpactScreen = () => (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">📊 Your Impact</h1>
      <p className="text-gray-500">Fall 2026 Semester</p>

      {/* Packaging Impact */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">📦</span> Packaging Saved
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">{userData.stats.containersUsed}</p>
            <p className="text-sm text-gray-600">Containers</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">{userData.stats.cupsUsed}</p>
            <p className="text-sm text-gray-600">Cups</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{userData.stats.wasteAvoided}</p>
            <p className="text-sm text-gray-600">lbs waste avoided</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{userData.stats.co2Prevented}</p>
            <p className="text-sm text-gray-600">kg CO₂ prevented</p>
          </div>
        </div>
      </div>

      {/* Food Waste Impact */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">🍽️</span> Food Waste (EcoTrack)
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average per meal:</span>
            <span className="font-bold text-green-600">{userData.stats.avgFoodWaste}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Improvement:</span>
            <span className="font-bold text-green-600">↓ {userData.stats.foodWasteImprovement}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 rounded-full h-3 transition-all"
              style={{ width: `${100 - userData.stats.foodWasteImprovement}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">🥇 Better than 78% of Duke students!</p>
        </div>

        <div className="mt-3 p-3 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-800">
            💡 <strong>Most wasted:</strong> Rice — try asking for smaller portions
          </p>
        </div>
      </div>

      {/* Combined Score */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 text-white">
        <h2 className="font-semibold mb-3">🏆 Combined Score</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-4xl font-bold">{userData.stats.points}</p>
            <p className="text-blue-200">total points</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#{userData.stats.rank}</p>
            <p className="text-blue-200">of {userData.stats.totalStudents.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Equivalents */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">🌍 That&apos;s equivalent to...</h2>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <span>🌳</span> 0.4 trees saved
          </p>
          <p className="flex items-center gap-2">
            <span>🚗</span> 36 miles not driven
          </p>
          <p className="flex items-center gap-2">
            <span>💡</span> 48 hours of LED bulb powered
          </p>
        </div>
      </div>
    </div>
  )

  // Challenges & Gamification Screen
  const ChallengesScreen = () => (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">🎯 Challenges</h1>

      {/* Active Challenges */}
      <div className="space-y-3">
        {challenges.map((challenge, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{challenge.name}</h3>
                <p className="text-sm text-gray-500">{challenge.desc}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
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
      </div>

      {/* Dorm Leaderboard */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🏠</span> November Dorm Competition
        </h2>
        <p className="text-sm text-gray-500 mb-3">Prize: Pizza party for winning dorm!</p>

        <div className="space-y-2">
          {dormLeaderboard.map((dorm, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-3 rounded-xl ${dorm.isUser ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <span className={`font-medium ${dorm.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                  {dorm.name}
                </span>
                {dorm.isUser && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">YOU</span>}
              </div>
              <span className="font-semibold">{dorm.points.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">🎖️ Your Badges</h2>
        <div className="flex gap-3 flex-wrap">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌱</div>
            <p className="text-xs mt-1 text-gray-600">First Reuse</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">💯</div>
            <p className="text-xs mt-1 text-gray-600">100 Uses</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-2xl">🔥</div>
            <p className="text-xs mt-1 text-gray-600">7-Day Streak</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl border-2 border-dashed border-gray-300">?</div>
            <p className="text-xs mt-1 text-gray-400">Locked</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Profile Screen
  const ProfileScreen = () => (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">👤 Profile</h1>

      {/* User Info */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
            <p className="text-gray-500">Duke Class of {userData.classYear}</p>
            <p className="text-gray-500">{userData.dorm}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{userData.stats.points}</p>
          <p className="text-xs text-gray-600">Points</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-600">#{userData.stats.rank}</p>
          <p className="text-xs text-gray-600">Rank</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">7</p>
          <p className="text-xs text-gray-600">Day Streak</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button className="w-full p-4 flex items-center justify-between border-b border-gray-100">
          <span className="flex items-center gap-3">
            <span>🔔</span>
            <span>Notification Settings</span>
          </span>
          <span className="text-gray-400">→</span>
        </button>
        <button className="w-full p-4 flex items-center justify-between border-b border-gray-100">
          <span className="flex items-center gap-3">
            <span>🎨</span>
            <span>Customize Cup/Container</span>
          </span>
          <span className="text-gray-400">→</span>
        </button>
        <button className="w-full p-4 flex items-center justify-between border-b border-gray-100">
          <span className="flex items-center gap-3">
            <span>📜</span>
            <span>Checkout History</span>
          </span>
          <span className="text-gray-400">→</span>
        </button>
        <button className="w-full p-4 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <span>❓</span>
            <span>Help & Support</span>
          </span>
          <span className="text-gray-400">→</span>
        </button>
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
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="flex gap-2">
                <button
                  onClick={markAllRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-4xl mb-2">🔔</p>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl">
                        {notification.type === 'reminder' ? '⏰' :
                          notification.type === 'achievement' ? '🏆' : '⚠️'}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-800">{notification.title}</p>
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
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
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Container Returned!</h2>
            <p className="text-gray-600 mb-4">Great job, {userData.name}!</p>

            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <p className="text-green-800 font-medium">+10 points earned</p>
              <p className="text-sm text-green-600">You&apos;ve now saved 90 containers this semester!</p>
            </div>

            <button
              onClick={() => setShowReturnConfirmation(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Status Bar Mockup */}
      <div className="bg-blue-900 text-white px-4 py-2 flex justify-between text-sm sticky top-0 z-40">
        <span>9:41</span>
        <span className="font-semibold">DukeReuse 360</span>
        <span>🔋 89%</span>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'impact' && <ImpactScreen />}
        {activeTab === 'challenges' && <ChallengesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-40">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'impact', icon: '📊', label: 'Impact' },
            { id: 'challenges', icon: '🎯', label: 'Challenges' },
            { id: 'profile', icon: '👤', label: 'Profile' }
          ].map(tab => (
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

      {/* Notifications Panel */}
      <NotificationsPanel />

      {/* Return Confirmation Modal */}
      <ReturnConfirmation />
    </div>
  )
}
