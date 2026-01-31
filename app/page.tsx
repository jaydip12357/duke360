'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Package, Clock, Leaf, Users, Recycle, Droplet, TreePine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/StatsCard'

interface Stats {
  totalCheckouts: number
  activeUsers: number
  disposablesSaved: number
  returnRate: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalCheckouts: 5234,
    activeUsers: 342,
    disposablesSaved: 10468,
    returnRate: 94,
  })
  const [counter, setCounter] = useState(0)

  // Animated counter for hero
  useEffect(() => {
    const target = stats.disposablesSaved
    const duration = 2000
    const steps = 60
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
        const response = await fetch('/api/admin/stats/daily')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setStats(data)
          }
        }
      } catch (error) {
        // Use default stats for demo
        console.log('Using demo stats')
      }
    }

    fetchStats()
  }, [])

  const howItWorks = [
    {
      step: 1,
      title: 'Book',
      description: 'Reserve your container online in seconds. Pick your dining hall and time slot.',
      icon: <Package className="h-8 w-8" />,
    },
    {
      step: 2,
      title: 'Pick Up',
      description: 'Show your QR code at the counter. Grab your clean container and fill it up.',
      icon: <Clock className="h-8 w-8" />,
    },
    {
      step: 3,
      title: 'Return',
      description: 'Drop off at any return station within 24 hours. Tap the RFID and you\'re done!',
      icon: <Recycle className="h-8 w-8" />,
    },
  ]

  const impactStats = [
    {
      value: `${(stats.disposablesSaved * 50 / 1000).toFixed(1)} kg`,
      label: 'CO2 Saved',
      icon: <TreePine className="h-6 w-6" />,
    },
    {
      value: `${(stats.disposablesSaved * 4).toLocaleString()}L`,
      label: 'Water Saved',
      icon: <Droplet className="h-6 w-6" />,
    },
    {
      value: `${Math.floor(stats.disposablesSaved * 24 / 1000)} kg`,
      label: 'Waste Diverted',
      icon: <Recycle className="h-6 w-6" />,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-duke text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Skip the Line,<br />Save the Planet
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Duke's smart reusable container system. Book, pick up, return.
              It's faster than disposables and better for Earth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="bg-white text-duke-navy hover:bg-gray-100 text-lg px-8">
                  Book Container Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/impact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  See Our Impact
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-lg text-gray-200 mb-2">Disposables Saved</p>
              <p className="text-5xl md:text-6xl font-bold animate-count-up">
                {counter.toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 mt-2">and counting...</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Checkouts"
              value={stats.totalCheckouts.toLocaleString()}
              icon={<Package className="h-8 w-8" />}
              delay={0}
            />
            <StatsCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              icon={<Users className="h-8 w-8" />}
              delay={0.1}
            />
            <StatsCard
              title="Disposables Saved"
              value={stats.disposablesSaved.toLocaleString()}
              icon={<Leaf className="h-8 w-8" />}
              delay={0.2}
            />
            <StatsCard
              title="Return Rate"
              value={`${stats.returnRate}%`}
              icon={<Recycle className="h-8 w-8" />}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-duke-navy mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-duke-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-duke-navy">{item.icon}</div>
                    </div>
                    <div className="w-8 h-8 bg-duke-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-duke-navy mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-duke-navy mb-4">
            Our Environmental Impact
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Every container you reuse helps Duke reach its sustainability goals.
            Here's what we've achieved together:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="text-green-600 mb-4 flex justify-center">{stat.icon}</div>
                    <p className="text-4xl font-bold text-duke-navy mb-2">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-duke text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join hundreds of Duke students who are choosing sustainability
            without sacrificing convenience.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-duke-navy hover:bg-gray-100 text-lg px-8">
              Book Your First Container
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
