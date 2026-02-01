'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Recycle, Droplets, Leaf, Trash2, Navigation, Filter, Search, X, ChevronRight } from 'lucide-react'

interface MapLocation {
  id: string
  name: string
  type: 'return-bin' | 'water-station' | 'compost' | 'dining' | 'vegan'
  building: string
  floor?: string
  description: string
  hours?: string
  features: string[]
  coordinates: { x: number; y: number }
  isOpen?: boolean
}

type FilterType = 'all' | 'return-bin' | 'water-station' | 'compost' | 'dining' | 'vegan'

export default function CampusMapPage() {
  const [locations, setLocations] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const mockLocations: MapLocation[] = [
      // Return Bins
      {
        id: 'rb1',
        name: 'Marketplace Return Station',
        type: 'return-bin',
        building: 'Bryan Center',
        floor: '1st Floor',
        description: 'Main return station near entrance. RFID enabled.',
        hours: '7am - 10pm',
        features: ['RFID Scanner', 'Large Capacity', 'Staff Monitored'],
        coordinates: { x: 45, y: 35 },
        isOpen: true
      },
      {
        id: 'rb2',
        name: 'Brodhead Return Bin',
        type: 'return-bin',
        building: 'Brodhead Center',
        floor: 'Ground Floor',
        description: 'Located near main food court exit.',
        hours: '7:30am - 11pm',
        features: ['RFID Scanner', 'Well Lit'],
        coordinates: { x: 55, y: 45 },
        isOpen: true
      },
      {
        id: 'rb3',
        name: 'Perkins Return Station',
        type: 'return-bin',
        building: 'Perkins Library',
        floor: '1st Floor',
        description: 'Near the cafe entrance.',
        hours: '24/7',
        features: ['RFID Scanner', '24/7 Access'],
        coordinates: { x: 40, y: 55 },
        isOpen: true
      },
      // Water Stations
      {
        id: 'ws1',
        name: 'LSRC Water Fountain',
        type: 'water-station',
        building: 'LSRC',
        floor: 'All Floors',
        description: 'Bottle filling stations on each floor.',
        features: ['Filtered', 'Bottle Counter', 'Cold Water'],
        coordinates: { x: 30, y: 40 }
      },
      {
        id: 'ws2',
        name: 'Wellness Center Hydration',
        type: 'water-station',
        building: 'Wilson Gym',
        floor: '1st Floor',
        description: 'Multiple stations near gym entrance.',
        features: ['Filtered', 'Electrolyte Option', 'Cold Water'],
        coordinates: { x: 65, y: 30 }
      },
      {
        id: 'ws3',
        name: 'Gross Hall Refill',
        type: 'water-station',
        building: 'Gross Hall',
        floor: '1st & 2nd Floor',
        description: 'Elkay bottle filling stations.',
        features: ['Filtered', 'Bottle Counter'],
        coordinates: { x: 50, y: 60 }
      },
      // Composting
      {
        id: 'c1',
        name: 'Marketplace Compost Station',
        type: 'compost',
        building: 'Bryan Center',
        description: 'Full sorting station with compost, recycling, and landfill.',
        features: ['Staff Assisted', 'Clear Signage', 'Food Scraps'],
        coordinates: { x: 46, y: 36 }
      },
      {
        id: 'c2',
        name: 'Brodhead Composting',
        type: 'compost',
        building: 'Brodhead Center',
        description: 'Self-service composting bins.',
        features: ['Clear Signage', 'Food Scraps', 'Napkins'],
        coordinates: { x: 56, y: 46 }
      },
      {
        id: 'c3',
        name: 'East Campus Compost',
        type: 'compost',
        building: 'East Campus Union',
        description: 'Located near Marketplace East.',
        features: ['Food Scraps', 'Yard Waste'],
        coordinates: { x: 75, y: 50 }
      },
      // Dining Locations with Vegan Options
      {
        id: 'd1',
        name: 'Marketplace',
        type: 'dining',
        building: 'Bryan Center',
        description: 'Main dining hall with diverse options.',
        hours: '7am - 9pm',
        features: ['Vegan Station', 'Allergen Info', 'Sustainable Seafood'],
        coordinates: { x: 45, y: 35 },
        isOpen: true
      },
      {
        id: 'd2',
        name: 'Freeman Center',
        type: 'dining',
        building: 'Freeman Center',
        description: 'Sports venue dining.',
        hours: '11am - 8pm',
        features: ['Vegetarian Options', 'Grab & Go'],
        coordinates: { x: 25, y: 70 },
        isOpen: true
      },
      // Vegan-Specific
      {
        id: 'v1',
        name: 'Sprout at Marketplace',
        type: 'vegan',
        building: 'Bryan Center',
        description: 'Dedicated plant-based station.',
        hours: '11am - 8pm',
        features: ['100% Vegan', 'Organic Options', 'Locally Sourced'],
        coordinates: { x: 44, y: 34 },
        isOpen: true
      },
      {
        id: 'v2',
        name: "Loop Pizza (Vegan Options)",
        type: 'vegan',
        building: 'Brodhead Center',
        description: 'Vegan pizza and salads available.',
        hours: '11am - 10pm',
        features: ['Vegan Cheese', 'GF Crust Available'],
        coordinates: { x: 54, y: 44 },
        isOpen: true
      }
    ]

    setTimeout(() => {
      setLocations(mockLocations)
      setLoading(false)
    }, 500)
  }, [])

  const filters = [
    { id: 'all' as FilterType, label: 'All', icon: MapPin, color: 'bg-gray-100 text-gray-700' },
    { id: 'return-bin' as FilterType, label: 'Return Bins', icon: Recycle, color: 'bg-blue-100 text-blue-700' },
    { id: 'water-station' as FilterType, label: 'Water', icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'compost' as FilterType, label: 'Compost', icon: Trash2, color: 'bg-green-100 text-green-700' },
    { id: 'vegan' as FilterType, label: 'Vegan', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'return-bin': return 'bg-blue-500'
      case 'water-station': return 'bg-cyan-500'
      case 'compost': return 'bg-green-600'
      case 'dining': return 'bg-orange-500'
      case 'vegan': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'return-bin': return <Recycle className="w-4 h-4" />
      case 'water-station': return <Droplets className="w-4 h-4" />
      case 'compost': return <Trash2 className="w-4 h-4" />
      case 'dining': return <MapPin className="w-4 h-4" />
      case 'vegan': return <Leaf className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const filteredLocations = locations.filter(loc => {
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loc.building.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const LocationDetail = ({ location }: { location: MapLocation }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${getTypeColor(location.type)} text-white flex items-center justify-center`}>
              {getTypeIcon(location.type)}
            </div>
            <h2 className="font-semibold">{location.name}</h2>
          </div>
          <button onClick={() => setSelectedLocation(null)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{location.building}</span>
              {location.floor && <span className="text-gray-400">• {location.floor}</span>}
            </div>
            <p className="text-gray-600">{location.description}</p>
          </div>

          {location.hours && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Hours:</span>
              <span className="text-sm font-medium">{location.hours}</span>
              {location.isOpen !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {location.isOpen ? 'Open' : 'Closed'}
                </span>
              )}
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {location.features.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Get Directions
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 hover:bg-white/10 rounded">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-semibold text-lg">Campus Food Map</h1>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className={`p-2 rounded-lg transition ${showList ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Filter Pills */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter.id
                  ? 'bg-[#001A57] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Map View */}
        <div className="px-4">
          <div className="bg-white rounded-xl border overflow-hidden">
            {/* Simulated Map */}
            <div className="relative h-80 sm:h-96 bg-gradient-to-br from-green-100 to-blue-50">
              {/* Grid overlay to simulate map */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#001A57" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Building outlines */}
              <div className="absolute top-[30%] left-[40%] w-16 h-12 bg-gray-300/50 rounded border border-gray-400/50 flex items-center justify-center text-xs text-gray-600">
                Bryan
              </div>
              <div className="absolute top-[40%] left-[50%] w-20 h-10 bg-gray-300/50 rounded border border-gray-400/50 flex items-center justify-center text-xs text-gray-600">
                Brodhead
              </div>
              <div className="absolute top-[50%] left-[35%] w-14 h-14 bg-gray-300/50 rounded border border-gray-400/50 flex items-center justify-center text-xs text-gray-600">
                Perkins
              </div>
              <div className="absolute top-[35%] left-[25%] w-12 h-16 bg-gray-300/50 rounded border border-gray-400/50 flex items-center justify-center text-xs text-gray-600">
                LSRC
              </div>

              {/* Location markers */}
              {filteredLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`absolute w-8 h-8 rounded-full ${getTypeColor(location.type)} text-white flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition z-10`}
                  style={{
                    left: `${location.coordinates.x}%`,
                    top: `${location.coordinates.y}%`
                  }}
                >
                  {getTypeIcon(location.type)}
                </button>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur rounded-lg p-2 text-xs">
                <p className="font-medium text-gray-700 mb-1">Legend</p>
                <div className="grid grid-cols-2 gap-1">
                  {filters.slice(1).map(filter => (
                    <div key={filter.id} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(filter.id)}`} />
                      <span className="text-gray-600">{filter.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 divide-x border-t">
              {[
                { label: 'Return Bins', count: locations.filter(l => l.type === 'return-bin').length, color: 'text-blue-600' },
                { label: 'Water', count: locations.filter(l => l.type === 'water-station').length, color: 'text-cyan-600' },
                { label: 'Compost', count: locations.filter(l => l.type === 'compost').length, color: 'text-green-600' },
                { label: 'Vegan', count: locations.filter(l => l.type === 'vegan').length, color: 'text-emerald-600' }
              ].map((stat, i) => (
                <div key={i} className="p-3 text-center">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* List View */}
        {showList && (
          <div className="p-4">
            <h2 className="font-medium text-gray-900 mb-3">
              {activeFilter === 'all' ? 'All Locations' : filters.find(f => f.id === activeFilter)?.label}
              <span className="text-gray-400 ml-2">({filteredLocations.length})</span>
            </h2>
            <div className="space-y-2">
              {filteredLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className="w-full bg-white rounded-xl border p-4 text-left hover:border-gray-300 transition flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-lg ${getTypeColor(location.type)} text-white flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(location.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{location.name}</h3>
                    <p className="text-sm text-gray-500">{location.building}</p>
                  </div>
                  {location.isOpen !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {location.isOpen ? 'Open' : 'Closed'}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Section */}
        <div className="p-4">
          <h2 className="font-medium text-gray-900 mb-3">Nearest to You</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredLocations.slice(0, 4).map(location => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="bg-white rounded-xl border p-4 text-left hover:border-gray-300 transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded ${getTypeColor(location.type)} text-white flex items-center justify-center`}>
                    {getTypeIcon(location.type)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{location.name}</span>
                </div>
                <p className="text-sm text-gray-500">{location.building}</p>
                <p className="text-xs text-blue-600 mt-1">~2 min walk</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 pb-8">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-medium text-green-900 mb-2">Sustainability Tip</h3>
            <p className="text-sm text-green-700">
              Refilling a reusable water bottle just once a day saves 365 plastic bottles per year!
              Use the map to find your nearest refill station.
            </p>
          </div>
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && <LocationDetail location={selectedLocation} />}
    </div>
  )
}
