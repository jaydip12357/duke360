'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package, Leaf, Flame, Star, Clock, ArrowRight, History,
  Trophy, AlertCircle, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ContainerCard } from '@/components/ContainerCard'
import { calculateImpact, formatDateTime } from '@/lib/utils'

interface UserStats {
  totalCheckouts: number
  totalReturns: number
  onTimeReturns: number
  currentStreak: number
  longestStreak: number
  points: number
}

interface Checkout {
  id: string
  containerId: string | null
  pickupLocation: string
  pickupZone: string
  pickupTimeSlot: string
  expectedReturnDate: string
  actualPickupTime: string | null
  actualReturnDate: string | null
  status: string
  isLate: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  badgeColor: string
  unlockedAt?: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [activeCheckout, setActiveCheckout] = useState<Checkout | null>(null)
  const [recentCheckouts, setRecentCheckouts] = useState<Checkout[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if logged in
        const sessionRes = await fetch('/api/auth/session')
        if (!sessionRes.ok) {
          setIsLoggedIn(false)
          setLoading(false)
          return
        }

        const session = await sessionRes.json()
        if (!session?.user) {
          setIsLoggedIn(false)
          setLoading(false)
          return
        }

        setIsLoggedIn(true)

        // Fetch user profile
        const profileRes = await fetch('/api/user/profile')
        if (profileRes.ok) {
          const profile = await profileRes.json()
          setUserStats(profile.stats)
          setActiveCheckout(profile.activeCheckout)
          setRecentCheckouts(profile.recentCheckouts || [])
          setAchievements(profile.achievements || [])
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Use mock data for demo
        setIsLoggedIn(true)
        setUserStats({
          totalCheckouts: 42,
          totalReturns: 40,
          onTimeReturns: 38,
          currentStreak: 12,
          longestStreak: 15,
          points: 420,
        })
        setActiveCheckout({
          id: 'demo-checkout',
          containerId: 'DU-2026-042',
          pickupLocation: 'Broadhead',
          pickupZone: 'B',
          pickupTimeSlot: new Date(Date.now() + 3600000).toISOString(),
          expectedReturnDate: new Date(Date.now() + 86400000 + 3600000).toISOString(),
          actualPickupTime: null,
          actualReturnDate: null,
          status: 'reserved',
          isLate: false,
        })
        setRecentCheckouts([
          {
            id: 'past-1',
            containerId: 'DU-2026-038',
            pickupLocation: 'Broadhead',
            pickupZone: 'A',
            pickupTimeSlot: new Date(Date.now() - 172800000).toISOString(),
            expectedReturnDate: new Date(Date.now() - 86400000).toISOString(),
            actualPickupTime: new Date(Date.now() - 172800000).toISOString(),
            actualReturnDate: new Date(Date.now() - 90000000).toISOString(),
            status: 'returned',
            isLate: false,
          },
        ])
        setAchievements([
          { id: '1', name: 'First Steps', description: 'Complete your first checkout', icon: 'seedling', points: 10, badgeColor: '#4CAF50' },
          { id: '2', name: 'Getting Started', description: '5 checkouts completed', icon: 'leaf', points: 25, badgeColor: '#8BC34A' },
          { id: '3', name: 'On a Roll', description: '5-day return streak', icon: 'fire', points: 50, badgeColor: '#FF9800' },
        ])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleCancelCheckout = async () => {
    if (!activeCheckout) return

    try {
      const response = await fetch(`/api/checkouts/${activeCheckout.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setActiveCheckout(null)
      }
    } catch (error) {
      console.error('Failed to cancel checkout:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duke-navy"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard and manage your containers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/api/auth/login?netId=js123">
              <Button className="w-full">
                Sign in with Duke NetID (Demo)
              </Button>
            </Link>
            <p className="text-sm text-center text-muted-foreground">
              Demo users: js123 (student), admin (administrator)
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const impact = calculateImpact(userStats?.totalCheckouts || 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-duke-navy">My Dashboard</h1>
            <p className="text-gray-600">Track your containers and environmental impact</p>
          </div>
          {!activeCheckout && (
            <Link href="/book">
              <Button size="lg">
                <Package className="mr-2 h-5 w-5" />
                Book Container
              </Button>
            </Link>
          )}
        </div>

        {/* Active Checkout */}
        {activeCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-duke-navy mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Active Checkout
            </h2>
            <ContainerCard
              checkout={activeCheckout}
              showQR={true}
              onCancel={handleCancelCheckout}
            />
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Containers Used</p>
                    <p className="text-3xl font-bold text-duke-navy">
                      {userStats?.totalCheckouts || 0}
                    </p>
                  </div>
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-3xl font-bold text-duke-navy">
                      {userStats?.currentStreak || 0}
                    </p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Points Earned</p>
                    <p className="text-3xl font-bold text-duke-navy">
                      {userStats?.points || 0}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CO2 Saved</p>
                    <p className="text-3xl font-bold text-duke-navy">
                      {impact.co2SavedKg.toFixed(1)} kg
                    </p>
                  </div>
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Your Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Your Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-duke-navy">{impact.disposablesSaved}</p>
                  <p className="text-sm text-muted-foreground">Disposables Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-duke-navy">{impact.co2SavedKg.toFixed(1)} kg</p>
                  <p className="text-sm text-muted-foreground">CO2 Avoided</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-duke-navy">{impact.waterSavedLiters} L</p>
                  <p className="text-sm text-muted-foreground">Water Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-duke-navy">{impact.wasteSavedKg.toFixed(1)} kg</p>
                  <p className="text-sm text-muted-foreground">Waste Diverted</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to next milestone (50 uses)</span>
                  <span>{userStats?.totalCheckouts || 0}/50</span>
                </div>
                <Progress value={((userStats?.totalCheckouts || 0) / 50) * 100} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2 text-2xl"
                      style={{ backgroundColor: achievement.badgeColor + '20' }}
                    >
                      {achievement.icon === 'seedling' && <span>🌱</span>}
                      {achievement.icon === 'leaf' && <span>🌿</span>}
                      {achievement.icon === 'fire' && <span>🔥</span>}
                      {achievement.icon === 'trophy' && <span>🏆</span>}
                      {!['seedling', 'leaf', 'fire', 'trophy'].includes(achievement.icon) && <span>⭐</span>}
                    </div>
                    <p className="font-medium text-center text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground text-center">{achievement.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCheckouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No checkout history yet.</p>
                  <Link href="/book" className="text-duke-blue hover:underline mt-2 inline-block">
                    Book your first container
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCheckouts.map((checkout) => (
                    <div
                      key={checkout.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {checkout.status === 'returned' ? (
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        ) : checkout.isLate ? (
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        ) : (
                          <Clock className="h-8 w-8 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-medium">{checkout.containerId || 'Container'}</p>
                          <p className="text-sm text-muted-foreground">
                            {checkout.pickupLocation} - Zone {checkout.pickupZone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            checkout.status === 'returned'
                              ? checkout.isLate
                                ? 'destructive'
                                : 'success'
                              : 'secondary'
                          }
                        >
                          {checkout.status === 'returned'
                            ? checkout.isLate
                              ? 'Late Return'
                              : 'On Time'
                            : checkout.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(checkout.pickupTimeSlot)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
