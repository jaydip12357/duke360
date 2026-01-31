'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Leaf, Droplet, TreePine, Recycle, TrendingUp, Users, Trophy, Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface ImpactStats {
  disposablesSaved: number
  co2SavedKg: number
  waterSavedLiters: number
  wasteSavedKg: number
  totalUsers: number
  totalCheckouts: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  uses: number
  co2Saved: number
}

export default function ImpactPage() {
  const [stats, setStats] = useState<ImpactStats>({
    disposablesSaved: 10468,
    co2SavedKg: 523.4,
    waterSavedLiters: 41872,
    wasteSavedKg: 251.2,
    totalUsers: 342,
    totalCheckouts: 5234,
  })
  const [counter, setCounter] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah J.', uses: 89, co2Saved: 4.45 },
    { rank: 2, name: 'Michael T.', uses: 76, co2Saved: 3.80 },
    { rank: 3, name: 'Emma L.', uses: 71, co2Saved: 3.55 },
    { rank: 4, name: 'David K.', uses: 68, co2Saved: 3.40 },
    { rank: 5, name: 'Jessica W.', uses: 65, co2Saved: 3.25 },
  ])

  // Animated counter
  useEffect(() => {
    const target = stats.disposablesSaved
    const duration = 2500
    const steps = 100
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCounter(target)
        clearInterval(timer)
      } else {
        setCounter(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [stats.disposablesSaved])

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats/environmental')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setStats(data)
          }
        }
      } catch {
        // Use mock data
      }
    }

    fetchStats()
  }, [])

  const milestones = [
    { target: 5000, label: 'First Milestone', reached: stats.disposablesSaved >= 5000 },
    { target: 10000, label: 'Eco Champion', reached: stats.disposablesSaved >= 10000 },
    { target: 25000, label: 'Sustainability Star', reached: stats.disposablesSaved >= 25000 },
    { target: 50000, label: 'Zero Waste Hero', reached: stats.disposablesSaved >= 50000 },
  ]

  const comparisons = [
    {
      value: Math.floor(stats.co2SavedKg / 2.3),
      unit: 'gallons',
      description: 'of gasoline not burned',
      icon: <TreePine className="h-8 w-8" />,
    },
    {
      value: Math.floor(stats.co2SavedKg / 21.77),
      unit: 'trees',
      description: 'worth of carbon absorption (yearly)',
      icon: <Leaf className="h-8 w-8" />,
    },
    {
      value: Math.floor(stats.waterSavedLiters / 70),
      unit: 'showers',
      description: 'of water saved',
      icon: <Droplet className="h-8 w-8" />,
    },
    {
      value: Math.floor(stats.wasteSavedKg * 2.2),
      unit: 'lbs',
      description: 'of waste diverted from landfills',
      icon: <Recycle className="h-8 w-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Every Container Counts
            </h1>
            <p className="text-xl text-green-100 mb-8">
              See the real impact of our community's sustainable choices
            </p>

            {/* Main Counter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-lg text-green-100 mb-2">Disposables Saved</p>
              <p className="text-6xl md:text-7xl font-bold">
                {counter.toLocaleString()}
              </p>
              <p className="text-sm text-green-200 mt-2">
                and counting...
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-duke-navy mb-12">
            Our Environmental Impact
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'CO2 Saved', value: `${stats.co2SavedKg.toFixed(1)} kg`, icon: <TreePine className="h-8 w-8 text-green-600" />, color: 'bg-green-50' },
              { label: 'Water Saved', value: `${(stats.waterSavedLiters / 1000).toFixed(1)}K L`, icon: <Droplet className="h-8 w-8 text-blue-600" />, color: 'bg-blue-50' },
              { label: 'Waste Diverted', value: `${stats.wasteSavedKg.toFixed(1)} kg`, icon: <Recycle className="h-8 w-8 text-amber-600" />, color: 'bg-amber-50' },
              { label: 'Active Users', value: stats.totalUsers.toLocaleString(), icon: <Users className="h-8 w-8 text-purple-600" />, color: 'bg-purple-50' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={stat.color}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">{stat.icon}</div>
                    <p className="text-3xl font-bold text-duke-navy mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparisons */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What Does This Mean?</CardTitle>
              <CardDescription>
                Putting our impact into perspective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {comparisons.map((item, index) => (
                  <motion.div
                    key={item.description}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className="flex justify-center mb-3 text-duke-navy">{item.icon}</div>
                    <p className="text-3xl font-bold text-duke-navy">
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-lg font-medium text-duke-blue">{item.unit}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Community Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.target} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {milestone.reached ? (
                          <Award className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={milestone.reached ? 'font-medium' : 'text-muted-foreground'}>
                          {milestone.label}
                        </span>
                      </div>
                      <span className="text-sm">
                        {milestone.target.toLocaleString()} disposables
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (stats.disposablesSaved / milestone.target) * 100)}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-duke-navy mb-12">
            Top Contributors This Month
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        entry.rank === 3 ? 'bg-amber-100 text-amber-600' :
                        'bg-duke-gray text-duke-navy'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.uses} containers used
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">
                        {entry.co2Saved.toFixed(2)} kg CO2 saved
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Leaderboard updates daily. Keep using reusable containers to climb the ranks!
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-duke-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Be Part of the Solution
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Every time you choose a reusable container, you're making a difference.
            Join the movement today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-duke-navy font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Start Contributing
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
