'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Leaf, Calendar, MapPin, Users, Clock, ChevronRight, Heart, ExternalLink, Sprout, Recycle, Sun, Droplets } from 'lucide-react'

interface GardenPlot {
  id: string
  name: string
  location: string
  size: string
  status: 'available' | 'waitlist' | 'full'
  waitlistCount: number
  features: string[]
  image: string
}

interface CompostSite {
  id: string
  name: string
  location: string
  hours: string
  accepts: string[]
  isOpen: boolean
}

interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  spotsLeft: number
  totalSpots: number
  type: 'volunteer' | 'workshop' | 'harvest'
}

interface Initiative {
  id: string
  name: string
  description: string
  link: string
  icon: string
}

export default function GardenPage() {
  const [activeTab, setActiveTab] = useState<'garden' | 'compost' | 'events' | 'learn'>('garden')
  const [loading, setLoading] = useState(true)
  const [gardenPlots, setGardenPlots] = useState<GardenPlot[]>([])
  const [compostSites, setCompostSites] = useState<CompostSite[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedPlot, setSelectedPlot] = useState<GardenPlot | null>(null)

  useEffect(() => {
    const mockPlots: GardenPlot[] = [
      {
        id: '1',
        name: 'East Campus Garden',
        location: 'Behind Baldwin Auditorium',
        size: '4x4 ft plots',
        status: 'available',
        waitlistCount: 0,
        features: ['Water access', 'Tool shed', 'Compost bins', 'Mentor support'],
        image: '🌱'
      },
      {
        id: '2',
        name: 'Duke Campus Farm',
        location: 'Off Science Drive',
        size: 'Shared beds',
        status: 'available',
        waitlistCount: 0,
        features: ['Large plots', 'Irrigation', 'Greenhouse', 'Weekly workshops'],
        image: '🌻'
      },
      {
        id: '3',
        name: 'West Campus Beds',
        location: 'Near Chapel Drive',
        size: '3x3 ft plots',
        status: 'waitlist',
        waitlistCount: 8,
        features: ['Water access', 'Starter plants provided'],
        image: '🥕'
      }
    ]

    const mockCompost: CompostSite[] = [
      {
        id: '1',
        name: 'Marketplace Compost',
        location: 'Bryan Center, 1st Floor',
        hours: '7am - 10pm',
        accepts: ['Food scraps', 'Napkins', 'Paper plates'],
        isOpen: true
      },
      {
        id: '2',
        name: 'Brodhead Composting',
        location: 'Brodhead Center Main Level',
        hours: '7:30am - 11pm',
        accepts: ['Food scraps', 'Compostable containers'],
        isOpen: true
      },
      {
        id: '3',
        name: 'Campus Farm Drop-off',
        location: 'Duke Campus Farm',
        hours: 'Sat & Sun 10am - 2pm',
        accepts: ['All organic waste', 'Yard waste'],
        isOpen: false
      },
      {
        id: '4',
        name: 'East Campus Collection',
        location: 'East Campus Union',
        hours: '8am - 8pm',
        accepts: ['Food scraps', 'Coffee grounds'],
        isOpen: true
      }
    ]

    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Fall Harvest Festival',
        description: 'Help harvest fall vegetables and take some home!',
        date: 'Nov 15',
        time: '10am - 2pm',
        location: 'Duke Campus Farm',
        spotsLeft: 12,
        totalSpots: 30,
        type: 'harvest'
      },
      {
        id: '2',
        name: 'Composting 101 Workshop',
        description: 'Learn the basics of composting and start your own.',
        date: 'Nov 8',
        time: '4pm - 5pm',
        location: 'Bryan Center',
        spotsLeft: 8,
        totalSpots: 25,
        type: 'workshop'
      },
      {
        id: '3',
        name: 'Garden Volunteer Day',
        description: 'Help maintain the community gardens. All skill levels welcome!',
        date: 'Every Saturday',
        time: '9am - 12pm',
        location: 'East Campus Garden',
        spotsLeft: 15,
        totalSpots: 20,
        type: 'volunteer'
      },
      {
        id: '4',
        name: 'Seed Starting Workshop',
        description: 'Start seeds for spring planting. Take home your own starter!',
        date: 'Nov 20',
        time: '3pm - 4:30pm',
        location: 'Duke Campus Farm',
        spotsLeft: 5,
        totalSpots: 15,
        type: 'workshop'
      }
    ]

    setTimeout(() => {
      setGardenPlots(mockPlots)
      setCompostSites(mockCompost)
      setEvents(mockEvents)
      setLoading(false)
    }, 500)
  }, [])

  const initiatives: Initiative[] = [
    {
      id: '1',
      name: 'Duke Sustainability',
      description: 'Official sustainability initiatives and goals',
      link: 'https://sustainability.duke.edu',
      icon: '🌍'
    },
    {
      id: '2',
      name: 'Duke Campus Farm',
      description: 'Student-run organic farm on campus',
      link: 'https://campusfarm.duke.edu',
      icon: '🚜'
    },
    {
      id: '3',
      name: 'Zero Waste Duke',
      description: 'Campus-wide waste reduction efforts',
      link: 'https://sustainability.duke.edu/waste',
      icon: '♻️'
    },
    {
      id: '4',
      name: 'Food Recovery Network',
      description: 'Student organization fighting food waste',
      link: '#',
      icon: '🍎'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700'
      case 'waitlist': return 'bg-yellow-100 text-yellow-700'
      case 'full': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer': return 'bg-blue-100 text-blue-700'
      case 'workshop': return 'bg-purple-100 text-purple-700'
      case 'harvest': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const PlotDetail = ({ plot }: { plot: GardenPlot }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">{plot.name}</h2>
          <button onClick={() => setSelectedPlot(null)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center py-4">
            <span className="text-6xl">{plot.image}</span>
          </div>

          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plot.status)}`}>
              {plot.status === 'available' ? 'Plots Available' :
               plot.status === 'waitlist' ? `${plot.waitlistCount} on waitlist` : 'Currently Full'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{plot.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Sprout className="w-5 h-5" />
              <span>{plot.size}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {plot.features.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">What You&apos;ll Need</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• $25 semester fee (covers seeds, tools, water)</li>
              <li>• Commitment to tend plot weekly</li>
              <li>• Attend one orientation session</li>
            </ul>
          </div>

          <button
            className={`w-full py-3 rounded-lg font-medium transition ${
              plot.status === 'available'
                ? 'bg-[#001A57] text-white hover:bg-[#00296B]'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {plot.status === 'available' ? 'Apply for a Plot' : 'Join Waitlist'}
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
            <h1 className="font-semibold text-lg">Garden & Composting Hub</h1>
          </div>
          <Leaf className="w-5 h-5 text-green-400" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Hero Stats */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-4 text-white mb-4">
          <h2 className="font-medium mb-3">Duke Campus Sustainability</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold">2.5 tons</p>
              <p className="text-green-100 text-xs">Food composted/year</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">45</p>
              <p className="text-green-100 text-xs">Garden plots</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">200+</p>
              <p className="text-green-100 text-xs">Student gardeners</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[
            { id: 'garden', label: 'Gardens', icon: Sprout },
            { id: 'compost', label: 'Compost', icon: Recycle },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'learn', label: 'Learn', icon: Leaf }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#001A57] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Garden Tab */}
        {activeTab === 'garden' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border">
              <h2 className="font-medium text-gray-900 mb-2">Community Garden Plots</h2>
              <p className="text-sm text-gray-500 mb-4">
                Grow your own food on campus! Plots are available for individuals or groups.
              </p>

              <div className="space-y-3">
                {gardenPlots.map(plot => (
                  <button
                    key={plot.id}
                    onClick={() => setSelectedPlot(plot)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left"
                  >
                    <span className="text-3xl">{plot.image}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{plot.name}</h3>
                      <p className="text-sm text-gray-500">{plot.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plot.status)}`}>
                      {plot.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Garden Tips */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="font-medium text-green-900 mb-2">Getting Started</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Sun, label: 'Check sunlight needs' },
                  { icon: Droplets, label: 'Water regularly' },
                  { icon: Calendar, label: 'Plan your season' },
                  { icon: Users, label: 'Join garden community' }
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-green-700">
                    <tip.icon className="w-4 h-4" />
                    {tip.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compost Tab */}
        {activeTab === 'compost' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border">
              <h2 className="font-medium text-gray-900 mb-2">Composting Locations</h2>
              <p className="text-sm text-gray-500 mb-4">
                Find the nearest compost drop-off location for your food scraps.
              </p>

              <div className="space-y-3">
                {compostSites.map(site => (
                  <div key={site.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{site.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        site.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {site.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      {site.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4" />
                      {site.hours}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {site.accepts.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Compost */}
            <div className="bg-white rounded-xl p-4 border">
              <h3 className="font-medium text-gray-900 mb-3">What Can Be Composted?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">✓ Yes</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Fruit & vegetable scraps</li>
                    <li>• Coffee grounds & filters</li>
                    <li>• Tea bags</li>
                    <li>• Paper napkins</li>
                    <li>• Eggshells</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 mb-2">✗ No</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Meat or fish</li>
                    <li>• Dairy products</li>
                    <li>• Oils or fats</li>
                    <li>• Plastic items</li>
                    <li>• Cooked foods with oil</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <h2 className="font-medium text-gray-900">Upcoming Events</h2>

            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <h3 className="font-medium text-gray-900 mt-1">{event.name}</h3>
                    </div>
                    <Heart className="w-5 h-5 text-gray-300 hover:text-red-400 cursor-pointer" />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {event.spotsLeft} spots left
                    </span>
                    <button className="px-4 py-2 bg-[#001A57] text-white rounded-lg text-sm font-medium hover:bg-[#00296B] transition">
                      Sign Up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border">
              <h2 className="font-medium text-gray-900 mb-3">Duke Sustainability Initiatives</h2>
              <div className="space-y-3">
                {initiatives.map(initiative => (
                  <a
                    key={initiative.id}
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span className="text-2xl">{initiative.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{initiative.name}</h3>
                      <p className="text-sm text-gray-500">{initiative.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="font-medium text-green-900 mb-3">Did You Know?</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Duke diverts 60% of campus waste from landfills</li>
                <li>• The Campus Farm grows over 5,000 lbs of produce annually</li>
                <li>• Composting food scraps reduces methane emissions by 90%</li>
                <li>• Student volunteers log 2,000+ hours at campus gardens</li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="bg-white rounded-xl p-4 border">
              <h3 className="font-medium text-gray-900 mb-3">Get Involved</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-[#001A57]" />
                  <p className="text-sm font-medium">Join a Club</p>
                </button>
                <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-[#001A57]" />
                  <p className="text-sm font-medium">Volunteer</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plot Detail Modal */}
      {selectedPlot && <PlotDetail plot={selectedPlot} />}
    </div>
  )
}
