'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Recycle, Users, Building2, ShieldCheck, ArrowRight,
  Leaf, Clock, Gift, CheckCircle, Sparkles, MapPin,
  Utensils, Trophy, Send, Info, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const DINING_LOCATIONS = [
  { value: 'broadhead', label: 'Broadhead Center' },
  { value: 'west-union', label: 'West Union' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'penn-pavilion', label: 'Penn Pavilion' },
  { value: 'divinity-cafe', label: 'Divinity Cafe' },
  { value: 'other', label: 'Other / Multiple Locations' },
]

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    netId: '',
    preferredDining: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    signupNumber: number
    rewardAmount: number
    rewardTier: string
  } | null>(null)
  const [error, setError] = useState('')
  const [signupStats, setSignupStats] = useState({
    totalSignups: 14,
    tier1Remaining: 6,
    tier2Remaining: 30,
  })

  // Fetch current signup stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/pilot')
        if (res.ok) {
          const data = await res.json()
          setSignupStats(data)
        }
      } catch {
        // Use default mock data
      }
    }
    fetchStats()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          netId: formData.netId,
          email: `${formData.netId}@duke.edu`,
          preferredDining: formData.preferredDining,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to sign up. Please try again.')
        return
      }

      setSubmitResult({
        signupNumber: data.signupNumber,
        rewardAmount: data.rewardAmount,
        rewardTier: data.rewardTier,
      })
      setSubmitted(true)
    } catch {
      setError('Failed to connect to server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Make-A-Thon Banner */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 z-50 text-center">
        <p className="text-sm md:text-base font-medium">
          <Leaf className="w-4 h-4 inline-block mr-2 -mt-0.5" />
          This is a project submission for <span className="font-bold">Duke Climate & Sustainability Make-A-Thon 2026</span> — Demo purposes only
        </p>
      </div>

      {/* Navigation */}
      <nav className="fixed top-10 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#001A57] rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-[#001A57]">DukeReuse 360</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-600 hover:text-[#001A57] transition">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-[#001A57] transition">Benefits</a>
              <a href="#pilot" className="text-gray-600 hover:text-[#001A57] transition">Join Pilot</a>
              <Link href="/about" className="text-gray-600 hover:text-[#001A57] transition">About Us</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Duke Climate & Sustainability Make-A-Thon 2026
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[#001A57] mb-6">
              Skip the Line,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Save the Planet
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              DukeReuse 360 is Duke University&apos;s smart reusable dining container system.
              Pre-book your container, skip the wait, and track your environmental impact in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="#pilot">
                <Button size="lg" className="bg-[#001A57] hover:bg-[#002D72] text-white px-8 py-6 text-lg">
                  <Gift className="w-5 h-5 mr-2" />
                  Join the Pilot Program
                </Button>
              </Link>
              <Link href="/student">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Try Student App Demo
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Projected Impact */}
          <motion.div
            className="mt-16"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <p className="text-center text-sm text-gray-500 mb-4">Projected Impact (First Semester)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Containers to Save', value: '10,000+', icon: Recycle },
                { label: 'CO2 to Prevent', value: '500 kg', icon: Leaf },
                { label: 'Target Students', value: '2,000', icon: Users },
                { label: 'Target Wait Time', value: '< 2 min', icon: Clock },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 shadow-lg border"
                >
                  <stat.icon className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-[#001A57]">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Container Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-xl">
                <Image
                  src="/images/360box.png"
                  alt="DukeReuse 360Box - Smart Reusable Container"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[#001A57] mb-4">
                Meet the 360Box
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our RFID-enabled reusable container designed specifically for Duke dining.
                Durable, dishwasher-safe, and smart enough to track itself.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">RFID Enabled</p>
                    <p className="text-sm text-gray-500">Automatic check-in/out at return stations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Durable Design</p>
                    <p className="text-sm text-gray-500">Built to last 1000+ uses, dishwasher safe</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Unique ID</p>
                    <p className="text-sm text-gray-500">Each container has a unique ID (DU-2026-XXX)</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#001A57] mb-4">The Problem We&apos;re Solving</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Single-use containers create waste and cost. Our reusable solution is better for the planet and your wallet.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/comparison.png"
              alt="Current Liability vs Proposed Asset - Single-use containers vs DukeReuse 360Box"
              width={1200}
              height={500}
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-bold text-red-800 mb-3">Current Problem</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Thousands of disposable containers used daily</li>
                <li>• Non-recyclable, ends up in landfills</li>
                <li>• Ongoing cost for Duke Dining</li>
                <li>• No tracking or accountability</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-green-800 mb-3">Our Solution</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Reusable containers last 1000+ uses</li>
                <li>• RFID tracking for accountability</li>
                <li>• Long-term cost savings</li>
                <li>• Gamified to encourage participation</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Dashboards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#001A57] mb-4">Demo Dashboards</h2>
            <p className="text-gray-600">Explore our platform from different perspectives</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Student Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/dashboard">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-[#001A57]">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-[#001A57]" />
                    </div>
                    <CardTitle className="text-xl">Student Dashboard</CardTitle>
                    <CardDescription>
                      Track your containers, view stats, and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Book containers in advance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Track environmental impact
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Earn points & achievements
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      View Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* Admin Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/admin">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-[#001A57]">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                    <CardDescription>
                      Monitor operations, inventory, and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Real-time inventory tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Usage analytics & reports
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Manage overdue containers
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      View Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* Facility Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/facility">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-[#001A57]">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">Facility Dashboard</CardTitle>
                    <CardDescription>
                      Manage dining locations and container flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Location inventory status
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Washing queue management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Daily operations view
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      View Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#001A57] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your reusable container in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Get Your 360Box',
                description: 'Book online to skip the line, or simply ask for a 360Box at any dining location when ordering your food!',
                icon: Clock,
                color: 'bg-blue-500'
              },
              {
                step: '2',
                title: 'Fill It Up',
                description: 'Get your favorite meal served in the reusable 360Box. Works at any participating campus dining spot!',
                icon: MapPin,
                color: 'bg-green-500'
              },
              {
                step: '3',
                title: 'Enjoy Your Meal',
                description: 'Fill up your container with delicious food. Use it anywhere on campus!',
                icon: Utensils,
                color: 'bg-orange-500'
              },
              {
                step: '4',
                title: 'Return & Earn',
                description: 'Drop it at any return bin within 24 hours. Earn points and track your environmental impact!',
                icon: Trophy,
                color: 'bg-purple-500'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                )}
                <div className="bg-white rounded-2xl p-6 shadow-lg border relative">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4`}>
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-gray-400 absolute top-6 right-6" />
                  <h3 className="text-xl font-bold text-[#001A57] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#001A57] mb-4">Why DukeReuse 360?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Good for you, great for the planet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Save Time',
                description: 'Pre-book your container and skip the dining hall lines. Average wait time under 2 minutes.',
                icon: Clock,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              {
                title: 'Reduce Waste',
                description: 'Every reusable use saves 2 disposable items from landfills. Track your personal impact.',
                icon: Recycle,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              },
              {
                title: 'Earn Rewards',
                description: 'Collect points for every use. Unlock achievements and compete on the leaderboard.',
                icon: Trophy,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100'
              },
              {
                title: 'RFID Technology',
                description: 'Automatic check-out and return tracking. No manual scanning needed at return bins.',
                icon: Sparkles,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
              },
              {
                title: 'Real-time Tracking',
                description: 'Know exactly where your container is. Get reminders before your 24-hour window ends.',
                icon: MapPin,
                color: 'text-red-600',
                bgColor: 'bg-red-100'
              },
              {
                title: 'Community Impact',
                description: 'Join thousands of Duke students making a difference. See collective environmental savings.',
                icon: Users,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-100'
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[#001A57] mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Program Sign-up */}
      <section id="pilot" className="py-20 px-4 bg-gradient-to-b from-[#001A57] to-[#002D72]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Pilot Program - Early Bird Rewards!
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Join the Pilot Program</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Be among the first to try DukeReuse 360 and get rewarded for helping us test!
            </p>
          </motion.div>

          {/* Incentive Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-2">$10</div>
              <div className="text-lg font-bold text-yellow-900">First 20 Students</div>
              <div className="text-yellow-800 text-sm mt-2">
                {signupStats.tier1Remaining > 0
                  ? `${signupStats.tier1Remaining} spots remaining!`
                  : 'All spots filled!'}
              </div>
              <div className="mt-4 bg-yellow-600/20 rounded-full h-2">
                <div
                  className="bg-yellow-900 rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(((20 - signupStats.tier1Remaining) / 20) * 100, 100)}%` }}
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-2">$5</div>
              <div className="text-lg font-bold text-green-900">Next 30 Students</div>
              <div className="text-green-800 text-sm mt-2">
                {signupStats.tier1Remaining > 0
                  ? '30 spots available after first 20'
                  : signupStats.tier2Remaining > 0
                    ? `${signupStats.tier2Remaining} spots remaining!`
                    : 'All spots filled!'}
              </div>
              <div className="mt-4 bg-green-600/20 rounded-full h-2">
                <div
                  className="bg-green-900 rounded-full h-2 transition-all"
                  style={{
                    width: signupStats.tier1Remaining === 0
                      ? `${Math.min(((30 - signupStats.tier2Remaining) / 30) * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Sign-up Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold text-[#001A57] mb-6 text-center">
                  Sign Up for the Pilot
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duke NetID *
                    </label>
                    <Input
                      type="text"
                      placeholder="js123"
                      value={formData.netId}
                      onChange={(e) => setFormData({ ...formData, netId: e.target.value.toLowerCase() })}
                      required
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your Duke email ({formData.netId || 'netid'}@duke.edu) will be used for communication
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Where do you usually eat on campus? *
                    </label>
                    <select
                      value={formData.preferredDining}
                      onChange={(e) => setFormData({ ...formData, preferredDining: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select your preferred dining location</option>
                      {DINING_LOCATIONS.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#001A57] hover:bg-[#002D72] py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Join the Pilot Program
                      </>
                    )}
                  </Button>
                </form>
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How rewards work:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Complete 5 container uses during the pilot</li>
                        <li>Provide feedback on your experience</li>
                        <li>Receive your reward via Duke Flex or Venmo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#001A57] mb-2">
                  You&apos;re In!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thanks for signing up for the DukeReuse 360 pilot program!
                  We&apos;ll send you an email with next steps soon.
                </p>
                {submitResult && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                      You&apos;re #{submitResult.signupNumber} to sign up
                      {submitResult.rewardAmount > 0
                        ? ` - You qualify for the $${submitResult.rewardAmount} reward!`
                        : ` - Thanks for your interest!`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-[#001A57]" />
              </div>
              <span className="font-bold text-xl">DukeReuse 360</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white transition">
                About the Team
              </Link>
              <span className="text-gray-400">Duke Climate & Sustainability Make-A-Thon 2026</span>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            Skip the line, save the planet.
          </div>
        </div>
      </footer>
    </div>
  )
}
