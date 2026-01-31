'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package, Users, Clock, AlertTriangle, Search, RefreshCw,
  CheckCircle, XCircle, Loader2, BarChart3, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsCard } from '@/components/StatsCard'
import { cn } from '@/lib/utils'

interface Container {
  id: string
  rfidTag: string
  status: string
  totalUses: number
  currentLocation: string
  lastWashDate: string | null
}

interface OverdueCheckout {
  id: string
  userId: string
  userName: string
  containerId: string
  pickupLocation: string
  expectedReturnDate: string
  hoursOverdue: number
}

interface LocationStats {
  name: string
  available: number
  checkedOut: number
  washing: number
  maintenance: number
}

interface DailyStats {
  totalCheckouts: number
  totalReturns: number
  onTimeReturns: number
  lateReturns: number
  activeContainers: number
  returnRate: number
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<DailyStats | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [overdueCheckouts, setOverdueCheckouts] = useState<OverdueCheckout[]>([])
  const [locationStats, setLocationStats] = useState<LocationStats[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if admin
        const sessionRes = await fetch('/api/auth/session')
        if (sessionRes.ok) {
          const session = await sessionRes.json()
          if (session?.user?.netId === 'admin') {
            setIsAdmin(true)
          }
        }

        // Fetch admin data
        const [statsRes, containersRes] = await Promise.all([
          fetch('/api/admin/stats/daily'),
          fetch('/api/containers'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (containersRes.ok) {
          const containersData = await containersRes.json()
          setContainers(containersData)
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      }

      // Set mock data for demo
      setIsAdmin(true)
      setStats({
        totalCheckouts: 156,
        totalReturns: 142,
        onTimeReturns: 127,
        lateReturns: 15,
        activeContainers: 67,
        returnRate: 89,
      })
      setContainers([
        { id: 'DU-2026-001', rfidTag: 'RFID0001', status: 'available', totalUses: 45, currentLocation: 'Broadhead', lastWashDate: new Date().toISOString() },
        { id: 'DU-2026-002', rfidTag: 'RFID0002', status: 'checked_out', totalUses: 52, currentLocation: 'Broadhead', lastWashDate: new Date().toISOString() },
        { id: 'DU-2026-003', rfidTag: 'RFID0003', status: 'washing', totalUses: 38, currentLocation: 'Broadhead', lastWashDate: null },
        { id: 'DU-2026-004', rfidTag: 'RFID0004', status: 'available', totalUses: 61, currentLocation: 'West Union', lastWashDate: new Date().toISOString() },
        { id: 'DU-2026-005', rfidTag: 'RFID0005', status: 'maintenance', totalUses: 95, currentLocation: 'Broadhead', lastWashDate: new Date().toISOString() },
      ])
      setOverdueCheckouts([
        { id: '1', userId: 'user1', userName: 'Sarah Johnson', containerId: 'DU-2026-015', pickupLocation: 'Broadhead', expectedReturnDate: new Date(Date.now() - 7200000).toISOString(), hoursOverdue: 2 },
        { id: '2', userId: 'user2', userName: 'Michael Chen', containerId: 'DU-2026-023', pickupLocation: 'West Union', expectedReturnDate: new Date(Date.now() - 18000000).toISOString(), hoursOverdue: 5 },
      ])
      setLocationStats([
        { name: 'Broadhead', available: 67, checkedOut: 23, washing: 8, maintenance: 2 },
        { name: 'West Union', available: 45, checkedOut: 28, washing: 5, maintenance: 2 },
        { name: 'Marketplace', available: 32, checkedOut: 22, washing: 4, maintenance: 2 },
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleStatusChange = async (containerId: string, newStatus: string) => {
    try {
      await fetch(`/api/containers/${containerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      setContainers(containers.map(c =>
        c.id === containerId ? { ...c, status: newStatus } : c
      ))
    } catch (error) {
      console.error('Failed to update container status:', error)
    }
  }

  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.rfidTag.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || container.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'checked_out': return 'bg-blue-100 text-blue-800'
      case 'washing': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-duke-navy" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <a href="/api/auth/login?netId=admin">
              <Button className="w-full">
                Sign in as Admin (Demo)
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-duke-navy">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage the DukeReuse system</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Active Containers"
            value={stats?.activeContainers || 0}
            icon={<Package className="h-8 w-8" />}
            delay={0}
          />
          <StatsCard
            title="Return Rate"
            value={`${stats?.returnRate || 0}%`}
            icon={<TrendingUp className="h-8 w-8" />}
            delay={0.1}
          />
          <StatsCard
            title="Overdue"
            value={overdueCheckouts.length}
            icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
            delay={0.2}
          />
          <StatsCard
            title="Today's Checkouts"
            value={stats?.totalCheckouts || 0}
            icon={<BarChart3 className="h-8 w-8" />}
            delay={0.3}
          />
        </div>

        {/* Alerts */}
        {overdueCheckouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Containers ({overdueCheckouts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueCheckouts.map((checkout) => (
                    <div
                      key={checkout.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{checkout.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {checkout.containerId} - {checkout.pickupLocation}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {checkout.hoursOverdue}h overdue
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by container ID or RFID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['all', 'available', 'checked_out', 'washing', 'maintenance'].map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status === 'all' ? 'All' : status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Container Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Container ID</th>
                        <th className="text-left p-4 font-medium">RFID Tag</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Location</th>
                        <th className="text-left p-4 font-medium">Total Uses</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContainers.map((container) => (
                        <tr key={container.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-mono">{container.id}</td>
                          <td className="p-4 font-mono text-sm">{container.rfidTag}</td>
                          <td className="p-4">
                            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(container.status))}>
                              {container.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4">{container.currentLocation}</td>
                          <td className="p-4">{container.totalUses}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {container.status === 'washing' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(container.id, 'available')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark Clean
                                </Button>
                              )}
                              {container.status === 'available' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(container.id, 'maintenance')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Maintenance
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {locationStats.map((location) => (
                <Card key={location.name}>
                  <CardHeader>
                    <CardTitle>{location.name}</CardTitle>
                    <CardDescription>
                      {location.available + location.checkedOut + location.washing + location.maintenance} total containers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Available</span>
                        <Badge variant="success">{location.available}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Checked Out</span>
                        <Badge variant="secondary">{location.checkedOut}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Washing</span>
                        <Badge variant="warning">{location.washing}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Maintenance</span>
                        <Badge variant="destructive">{location.maintenance}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${(location.available / (location.available + location.checkedOut + location.washing + location.maintenance)) * 100}%` }}
                      />
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${(location.checkedOut / (location.available + location.checkedOut + location.washing + location.maintenance)) * 100}%` }}
                      />
                      <div
                        className="bg-yellow-500 h-full"
                        style={{ width: `${(location.washing / (location.available + location.checkedOut + location.washing + location.maintenance)) * 100}%` }}
                      />
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${(location.maintenance / (location.available + location.checkedOut + location.washing + location.maintenance)) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Checkouts</span>
                      <span className="font-bold">{stats?.totalCheckouts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Returns</span>
                      <span className="font-bold">{stats?.totalReturns}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>On-Time Returns</span>
                      <span className="font-bold text-green-600">{stats?.onTimeReturns}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Late Returns</span>
                      <span className="font-bold text-red-600">{stats?.lateReturns}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Disposables Saved</span>
                      <span className="font-bold text-green-600">{(stats?.totalCheckouts || 0) * 2}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>CO2 Saved</span>
                      <span className="font-bold text-green-600">{(((stats?.totalCheckouts || 0) * 50) / 1000).toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Water Saved</span>
                      <span className="font-bold text-green-600">{(stats?.totalCheckouts || 0) * 4} L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
