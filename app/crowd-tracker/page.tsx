'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Clock, TrendingUp, TrendingDown, Minus, RefreshCw, Bell, ChevronRight } from 'lucide-react'

interface DiningLocation {
  id: string
  name: string
  shortName: string
  currentCrowd: number // 0-100
  trend: 'up' | 'down' | 'stable'
  waitTime: number // minutes
  lastUpdated: string
  hours: string
  isOpen: boolean
  peakHours: string[]
  bestTimes: string[]
  capacity: number
  currentCount: number
}

interface HourlyData {
  hour: string
  crowd: number
}

export default function CrowdTrackerPage() {
  const [locations, setLocations] = useState<DiningLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<DiningLocation | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState<string[]>([])

  const hourlyData: HourlyData[] = [
    { hour: '7am', crowd: 15 },
    { hour: '8am', crowd: 35 },
    { hour: '9am', crowd: 25 },
    { hour: '10am', crowd: 20 },
    { hour: '11am', crowd: 55 },
    { hour: '12pm', crowd: 85 },
    { hour: '1pm', crowd: 75 },
    { hour: '2pm', crowd: 45 },
    { hour: '3pm', crowd: 30 },
    { hour: '4pm', crowd: 25 },
    { hour: '5pm', crowd: 60 },
    { hour: '6pm', crowd: 90 },
    { hour: '7pm', crowd: 70 },
    { hour: '8pm', crowd: 40 },
    { hour: '9pm', crowd: 20 },
  ]

  useEffect(() => {
    const mockLocations: DiningLocation[] = [
      {
        id: '1',
        name: 'Marketplace',
        shortName: 'MP',
        currentCrowd: 72,
        trend: 'up',
        waitTime: 8,
        lastUpdated: '2 min ago',
        hours: '7:00 AM - 9:00 PM',
        isOpen: true,
        peakHours: ['12:00 PM - 1:00 PM', '6:00 PM - 7:00 PM'],
        bestTimes: ['2:00 PM - 4:00 PM', '8:00 PM - 9:00 PM'],
        capacity: 400,
        currentCount: 288
      },
      {
        id: '2',
        name: 'The Brodhead Center',
        shortName: 'BC',
        currentCrowd: 45,
        trend: 'stable',
        waitTime: 4,
        lastUpdated: '1 min ago',
        hours: '7:30 AM - 10:00 PM',
        isOpen: true,
        peakHours: ['11:30 AM - 1:00 PM', '5:30 PM - 7:00 PM'],
        bestTimes: ['3:00 PM - 5:00 PM', '8:00 PM - 10:00 PM'],
        capacity: 600,
        currentCount: 270
      },
      {
        id: '3',
        name: 'Divinity Cafe',
        shortName: 'DC',
        currentCrowd: 28,
        trend: 'down',
        waitTime: 2,
        lastUpdated: '3 min ago',
        hours: '8:00 AM - 3:00 PM',
        isOpen: true,
        peakHours: ['11:00 AM - 12:00 PM'],
        bestTimes: ['8:00 AM - 9:00 AM', '2:00 PM - 3:00 PM'],
        capacity: 100,
        currentCount: 28
      },
      {
        id: '4',
        name: 'Freeman Center',
        shortName: 'FC',
        currentCrowd: 55,
        trend: 'up',
        waitTime: 5,
        lastUpdated: '2 min ago',
        hours: '11:00 AM - 8:00 PM',
        isOpen: true,
        peakHours: ['12:00 PM - 1:30 PM', '6:00 PM - 7:00 PM'],
        bestTimes: ['3:00 PM - 5:00 PM', '7:30 PM - 8:00 PM'],
        capacity: 200,
        currentCount: 110
      },
      {
        id: '5',
        name: 'Twinnies',
        shortName: 'TW',
        currentCrowd: 88,
        trend: 'up',
        waitTime: 12,
        lastUpdated: '1 min ago',
        hours: '11:00 AM - 2:00 AM',
        isOpen: true,
        peakHours: ['12:00 PM - 2:00 PM', '8:00 PM - 11:00 PM'],
        bestTimes: ['3:00 PM - 5:00 PM', '6:00 PM - 7:00 PM'],
        capacity: 150,
        currentCount: 132
      },
      {
        id: '6',
        name: 'Pitchforks',
        shortName: 'PF',
        currentCrowd: 0,
        trend: 'stable',
        waitTime: 0,
        lastUpdated: '5 min ago',
        hours: '5:00 PM - 10:00 PM',
        isOpen: false,
        peakHours: ['6:00 PM - 8:00 PM'],
        bestTimes: ['5:00 PM - 6:00 PM', '9:00 PM - 10:00 PM'],
        capacity: 250,
        currentCount: 0
      }
    ]

    setTimeout(() => {
      setLocations(mockLocations)
      setLoading(false)
    }, 500)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const toggleNotification = (locationId: string) => {
    if (notificationsEnabled.includes(locationId)) {
      setNotificationsEnabled(notificationsEnabled.filter(id => id !== locationId))
    } else {
      setNotificationsEnabled([...notificationsEnabled, locationId])
    }
  }

  const getCrowdColor = (crowd: number) => {
    if (crowd >= 75) return 'text-red-600'
    if (crowd >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getCrowdBgColor = (crowd: number) => {
    if (crowd >= 75) return 'bg-red-100'
    if (crowd >= 50) return 'bg-yellow-100'
    return 'bg-green-100'
  }

  const getCrowdLabel = (crowd: number) => {
    if (crowd >= 75) return 'Very Busy'
    if (crowd >= 50) return 'Moderate'
    if (crowd >= 25) return 'Light'
    return 'Empty'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const LocationDetail = ({ location }: { location: DiningLocation }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">{location.name}</h2>
          <button onClick={() => setSelectedLocation(null)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Current Status */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getCrowdBgColor(location.currentCrowd)}`}>
              <Users className={`w-5 h-5 ${getCrowdColor(location.currentCrowd)}`} />
              <span className={`font-semibold ${getCrowdColor(location.currentCrowd)}`}>
                {getCrowdLabel(location.currentCrowd)}
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-3">{location.currentCrowd}%</p>
            <p className="text-gray-500">capacity</p>
            <p className="text-sm text-gray-400 mt-1">Updated {location.lastUpdated}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-gray-900">{location.currentCount}</p>
              <p className="text-xs text-gray-500">People</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-gray-900">{location.waitTime}</p>
              <p className="text-xs text-gray-500">Min Wait</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-gray-900">{location.capacity}</p>
              <p className="text-xs text-gray-500">Capacity</p>
            </div>
          </div>

          {/* Hourly Chart */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Today&apos;s Crowd Pattern</h3>
            <div className="flex items-end gap-1 h-32">
              {hourlyData.map((data, i) => {
                const isCurrentHour = data.hour === '12pm' // Simulated current hour
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isCurrentHour ? 'bg-[#001A57]' : data.crowd >= 75 ? 'bg-red-400' : data.crowd >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ height: `${data.crowd}%` }}
                    />
                    {i % 3 === 0 && (
                      <span className="text-xs text-gray-400 mt-1">{data.hour}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span className="text-gray-500">Light</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-400" />
                <span className="text-gray-500">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-400" />
                <span className="text-gray-500">Busy</span>
              </div>
            </div>
          </div>

          {/* Best Times */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Best Times to Visit</h3>
            <div className="space-y-2">
              {location.bestTimes.map((time, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Peak Hours (Avoid)</h3>
            <div className="space-y-2">
              {location.peakHours.map((time, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Toggle */}
          <button
            onClick={() => toggleNotification(location.id)}
            className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              notificationsEnabled.includes(location.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bell className="w-5 h-5" />
            {notificationsEnabled.includes(location.id)
              ? 'Notifications On'
              : 'Notify when less busy'}
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001A57]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#001A57] text-white px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 hover:bg-white/10 rounded">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-lg">Dining Crowd Tracker</h1>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-white/10 rounded transition ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Quick Overview */}
        <div className="bg-white rounded-xl p-4 border mb-4">
          <h2 className="font-medium text-gray-900 mb-3">Right Now</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {locations.filter(l => l.isOpen && l.currentCrowd < 50).length}
              </p>
              <p className="text-xs text-gray-500">Not Busy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {locations.filter(l => l.isOpen && l.currentCrowd >= 50 && l.currentCrowd < 75).length}
              </p>
              <p className="text-xs text-gray-500">Moderate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {locations.filter(l => l.isOpen && l.currentCrowd >= 75).length}
              </p>
              <p className="text-xs text-gray-500">Very Busy</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {(() => {
          const bestOption = locations
            .filter(l => l.isOpen)
            .sort((a, b) => a.currentCrowd - b.currentCrowd)[0]
          if (!bestOption) return null

          return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-green-700 font-medium mb-1">Best Option Right Now</p>
              <p className="text-green-900 font-semibold">{bestOption.name}</p>
              <p className="text-sm text-green-600">
                {bestOption.currentCrowd}% capacity • ~{bestOption.waitTime} min wait
              </p>
            </div>
          )
        })()}

        {/* Locations List */}
        <div className="space-y-3">
          {locations.map(location => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className="w-full bg-white rounded-xl border p-4 text-left hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold ${
                    !location.isOpen ? 'bg-gray-100 text-gray-400' : getCrowdBgColor(location.currentCrowd) + ' ' + getCrowdColor(location.currentCrowd)
                  }`}>
                    {location.shortName}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{location.name}</h3>
                    <p className="text-sm text-gray-500">{location.hours}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              {location.isOpen ? (
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Capacity</span>
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${getCrowdColor(location.currentCrowd)}`}>
                          {location.currentCrowd}%
                        </span>
                        {getTrendIcon(location.trend)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          location.currentCrowd >= 75 ? 'bg-red-500' :
                          location.currentCrowd >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${location.currentCrowd}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">~{location.waitTime} min</p>
                    <p className="text-xs text-gray-400">wait time</p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-center py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Currently Closed</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-medium text-blue-900 mb-2">Tips for Avoiding Crowds</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Eat slightly before or after peak hours</li>
            <li>• Check the tracker before heading out</li>
            <li>• Set notifications for your favorite spots</li>
            <li>• Consider trying less popular locations</li>
          </ul>
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && <LocationDetail location={selectedLocation} />}
    </div>
  )
}
