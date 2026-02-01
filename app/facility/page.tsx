'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2, Package, ArrowLeft, RefreshCw, CheckCircle,
  Clock, AlertTriangle, Loader2, MapPin, TrendingUp,
  Droplets, Wrench, ArrowRight, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LocationData {
  id: string
  name: string
  shortName: string
  available: number
  checkedOut: number
  washing: number
  maintenance: number
  total: number
  todayCheckouts: number
  todayReturns: number
  pendingPickups: number
}

interface WashingQueueItem {
  id: string
  containerId: string
  location: string
  returnedAt: string
  status: 'queued' | 'washing' | 'drying' | 'ready'
  estimatedReady: string
}

interface ContainerAlert {
  id: string
  type: 'low_stock' | 'high_demand' | 'maintenance_needed'
  location: string
  message: string
  severity: 'warning' | 'critical'
  timestamp: string
}

export default function FacilityDashboard() {
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState<LocationData[]>([])
  const [washingQueue, setWashingQueue] = useState<WashingQueueItem[]>([])
  const [alerts, setAlerts] = useState<ContainerAlert[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock location data
      setLocations([
        {
          id: '1',
          name: 'Broadhead Center',
          shortName: 'BH',
          available: 145,
          checkedOut: 82,
          washing: 23,
          maintenance: 5,
          total: 255,
          todayCheckouts: 67,
          todayReturns: 54,
          pendingPickups: 12,
        },
        {
          id: '2',
          name: 'West Union',
          shortName: 'WU',
          available: 98,
          checkedOut: 127,
          washing: 31,
          maintenance: 4,
          total: 260,
          todayCheckouts: 89,
          todayReturns: 72,
          pendingPickups: 18,
        },
        {
          id: '3',
          name: 'Marketplace',
          shortName: 'MP',
          available: 76,
          checkedOut: 94,
          washing: 18,
          maintenance: 2,
          total: 190,
          todayCheckouts: 52,
          todayReturns: 45,
          pendingPickups: 8,
        },
      ])

      // Mock washing queue
      setWashingQueue([
        { id: '1', containerId: 'DU-2026-089', location: 'West Union', returnedAt: '10:15 AM', status: 'washing', estimatedReady: '10:45 AM' },
        { id: '2', containerId: 'DU-2026-156', location: 'Broadhead', returnedAt: '10:20 AM', status: 'queued', estimatedReady: '11:00 AM' },
        { id: '3', containerId: 'DU-2026-234', location: 'Marketplace', returnedAt: '10:25 AM', status: 'drying', estimatedReady: '10:35 AM' },
        { id: '4', containerId: 'DU-2026-078', location: 'West Union', returnedAt: '10:30 AM', status: 'ready', estimatedReady: 'Ready' },
        { id: '5', containerId: 'DU-2026-445', location: 'Broadhead', returnedAt: '10:32 AM', status: 'queued', estimatedReady: '11:15 AM' },
      ])

      // Mock alerts
      setAlerts([
        { id: '1', type: 'low_stock', location: 'Marketplace', message: 'Available containers below 40% threshold', severity: 'warning', timestamp: '10 min ago' },
        { id: '2', type: 'high_demand', location: 'West Union', message: 'High checkout rate - consider redistributing', severity: 'warning', timestamp: '25 min ago' },
        { id: '3', type: 'maintenance_needed', location: 'Broadhead', message: '5 containers flagged for maintenance', severity: 'critical', timestamp: '1 hour ago' },
      ])

      setLoading(false)
    }

    loadData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const getStatusColor = (status: WashingQueueItem['status']) => {
    switch (status) {
      case 'queued': return 'bg-gray-100 text-gray-700'
      case 'washing': return 'bg-blue-100 text-blue-700'
      case 'drying': return 'bg-yellow-100 text-yellow-700'
      case 'ready': return 'bg-green-100 text-green-700'
    }
  }

  const totalStats = {
    available: locations.reduce((sum, l) => sum + l.available, 0),
    checkedOut: locations.reduce((sum, l) => sum + l.checkedOut, 0),
    washing: locations.reduce((sum, l) => sum + l.washing, 0),
    maintenance: locations.reduce((sum, l) => sum + l.maintenance, 0),
    todayCheckouts: locations.reduce((sum, l) => sum + l.todayCheckouts, 0),
    todayReturns: locations.reduce((sum, l) => sum + l.todayReturns, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading facility dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="font-bold text-[#001A57]">Facility Dashboard</h1>
                  <p className="text-xs text-gray-500">Container Operations</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#001A57]">{totalStats.available}</p>
                    <p className="text-sm text-gray-500">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#001A57]">{totalStats.checkedOut}</p>
                    <p className="text-sm text-gray-500">Checked Out</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#001A57]">{totalStats.washing}</p>
                    <p className="text-sm text-gray-500">Washing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#001A57]">{totalStats.maintenance}</p>
                    <p className="text-sm text-gray-500">Maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Active Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.severity === 'critical' ? 'bg-red-100' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.location}
                        </Badge>
                        <span className="text-sm text-gray-700">{alert.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="washing">Washing Queue</TabsTrigger>
            <TabsTrigger value="daily">Daily Stats</TabsTrigger>
          </TabsList>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <div className="grid md:grid-cols-3 gap-6">
              {locations.map((location, i) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-orange-600" />
                          {location.name}
                        </CardTitle>
                        <Badge variant="outline">{location.shortName}</Badge>
                      </div>
                      <CardDescription>
                        {location.total} total containers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Status Breakdown */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Available</span>
                            <span className="font-medium text-green-600">{location.available}</span>
                          </div>
                          <Progress
                            value={(location.available / location.total) * 100}
                            className="h-2 bg-gray-100"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="font-bold text-blue-600">{location.checkedOut}</p>
                            <p className="text-xs text-gray-500">Out</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-2">
                            <p className="font-bold text-yellow-600">{location.washing}</p>
                            <p className="text-xs text-gray-500">Washing</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-2">
                            <p className="font-bold text-red-600">{location.maintenance}</p>
                            <p className="text-xs text-gray-500">Maint.</p>
                          </div>
                        </div>

                        {/* Today's Activity */}
                        <div className="border-t pt-4">
                          <p className="text-xs text-gray-500 mb-2">Today&apos;s Activity</p>
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span>{location.todayCheckouts} checkouts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowRight className="w-4 h-4 text-blue-500" />
                              <span>{location.todayReturns} returns</span>
                            </div>
                          </div>
                        </div>

                        {/* Pending Pickups */}
                        {location.pendingPickups > 0 && (
                          <div className="bg-orange-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-orange-700">Pending Pickups</span>
                              <Badge className="bg-orange-600">{location.pendingPickups}</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Washing Queue Tab */}
          <TabsContent value="washing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  Washing Queue
                </CardTitle>
                <CardDescription>
                  Track containers through the cleaning process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {washingQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#001A57]">{item.containerId}</p>
                          <p className="text-sm text-gray-500">
                            Returned at {item.returnedAt} from {item.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Est. Ready</p>
                          <p className="font-medium">{item.estimatedReady}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Queue Summary */}
                <div className="mt-6 grid grid-cols-4 gap-4">
                  {['queued', 'washing', 'drying', 'ready'].map((status) => {
                    const count = washingQueue.filter(item => item.status === status).length
                    return (
                      <div key={status} className="text-center p-3 bg-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-[#001A57]">{count}</p>
                        <p className="text-sm text-gray-500 capitalize">{status}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Stats Tab */}
          <TabsContent value="daily">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Today&apos;s Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Checkouts</span>
                        <span className="font-bold text-[#001A57]">{totalStats.todayCheckouts}</span>
                      </div>
                      <Progress value={75} className="h-3 bg-blue-100" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Returns</span>
                        <span className="font-bold text-[#001A57]">{totalStats.todayReturns}</span>
                      </div>
                      <Progress value={68} className="h-3 bg-green-100" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Net Flow</span>
                        <span className={`font-bold ${totalStats.todayCheckouts > totalStats.todayReturns ? 'text-orange-600' : 'text-green-600'}`}>
                          {totalStats.todayCheckouts > totalStats.todayReturns ? '-' : '+'}
                          {Math.abs(totalStats.todayCheckouts - totalStats.todayReturns)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Peak Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: '11:30 AM - 12:30 PM', checkouts: 45, label: 'Lunch Rush' },
                      { time: '5:30 PM - 6:30 PM', checkouts: 52, label: 'Dinner Rush' },
                      { time: '12:30 PM - 1:30 PM', checkouts: 38, label: 'Late Lunch' },
                    ].map((peak, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#001A57]">{peak.label}</p>
                          <p className="text-sm text-gray-500">{peak.time}</p>
                        </div>
                        <Badge variant="outline">{peak.checkouts} checkouts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
