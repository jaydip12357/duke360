'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, MapPin, Clock, Users, Bell, Heart, Share2, Filter, Search } from 'lucide-react'

interface FoodPost {
  id: string
  type: 'leftover' | 'event' | 'mealprep'
  title: string
  description: string
  location: string
  building: string
  quantity: string
  postedBy: string
  postedAt: string
  expiresAt: string
  claimed: number
  available: number
  dietary: string[]
  image?: string
  distance: string
}

export default function FoodRescuePage() {
  const [posts, setPosts] = useState<FoodPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'leftover' | 'event' | 'mealprep'>('all')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulated data - would come from API
    const mockPosts: FoodPost[] = [
      {
        id: '1',
        type: 'event',
        title: 'Pizza from CS Club Meeting',
        description: '6 large pizzas left over from our weekly meeting. Mix of cheese, pepperoni, and veggie.',
        location: 'LSRC B101',
        building: 'LSRC',
        quantity: '~30 slices',
        postedBy: 'CS Club',
        postedAt: '10 min ago',
        expiresAt: '2 hours',
        claimed: 12,
        available: 30,
        dietary: ['vegetarian options'],
        distance: '0.2 mi'
      },
      {
        id: '2',
        type: 'leftover',
        title: 'Dining Hall Surplus - Pasta',
        description: 'Marketplace has extra pasta and marinara sauce from dinner service.',
        location: 'Marketplace',
        building: 'Bryan Center',
        quantity: 'Large tray',
        postedBy: 'Duke Dining',
        postedAt: '25 min ago',
        expiresAt: '1 hour',
        claimed: 8,
        available: 20,
        dietary: ['vegetarian', 'vegan available'],
        distance: '0.3 mi'
      },
      {
        id: '3',
        type: 'mealprep',
        title: 'Homemade Chicken Stir-fry',
        description: 'Made too much for meal prep! Chicken, vegetables, rice. 4 portions available.',
        location: 'Randolph Hall Kitchen',
        building: 'Randolph',
        quantity: '4 portions',
        postedBy: 'Sarah K.',
        postedAt: '1 hour ago',
        expiresAt: '3 hours',
        claimed: 1,
        available: 4,
        dietary: ['gluten-free'],
        distance: '0.1 mi'
      },
      {
        id: '4',
        type: 'event',
        title: 'Sandwiches from Career Fair',
        description: 'Assorted sandwiches and wraps from the engineering career fair.',
        location: 'Fitzpatrick Atrium',
        building: 'Fitzpatrick',
        quantity: '~25 sandwiches',
        postedBy: 'Pratt Career Services',
        postedAt: '45 min ago',
        expiresAt: '2 hours',
        claimed: 15,
        available: 25,
        dietary: ['vegetarian options', 'halal options'],
        distance: '0.4 mi'
      },
      {
        id: '5',
        type: 'leftover',
        title: 'Fresh Fruit Bowl',
        description: 'Fruit salad from faculty meeting - apples, oranges, grapes, berries.',
        location: 'Gross Hall 330',
        building: 'Gross Hall',
        quantity: 'Large bowl',
        postedBy: 'Econ Department',
        postedAt: '30 min ago',
        expiresAt: '4 hours',
        claimed: 5,
        available: 15,
        dietary: ['vegan', 'gluten-free'],
        distance: '0.5 mi'
      }
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 500)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.type === filter
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-100 text-purple-700'
      case 'leftover': return 'bg-green-100 text-green-700'
      case 'mealprep': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event Surplus'
      case 'leftover': return 'Dining Leftover'
      case 'mealprep': return 'Meal Prep'
      default: return type
    }
  }

  const CreatePostModal = () => {
    const [postType, setPostType] = useState<'leftover' | 'event' | 'mealprep'>('leftover')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [quantity, setQuantity] = useState('')
    const [expiresIn, setExpiresIn] = useState('2')

    const handleSubmit = () => {
      // Would submit to API
      const newPost: FoodPost = {
        id: Date.now().toString(),
        type: postType,
        title,
        description,
        location,
        building: location.split(' ')[0],
        quantity,
        postedBy: 'You',
        postedAt: 'Just now',
        expiresAt: `${expiresIn} hours`,
        claimed: 0,
        available: parseInt(quantity) || 10,
        dietary: [],
        distance: '0 mi'
      }
      setPosts([newPost, ...posts])
      setShowCreateModal(false)
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Share Food</h2>
            <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['leftover', 'event', 'mealprep'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setPostType(type)}
                    className={`p-2 rounded-lg text-sm font-medium transition ${
                      postType === type
                        ? 'bg-[#001A57] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What food?</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Pizza from club meeting"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the food, dietary info, etc."
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., LSRC B101"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity available</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 10 slices, 5 portions"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Expires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available for (hours)</label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!title || !location}
              className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Share Food
            </button>
          </div>
        </div>
      </div>
    )
  }

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 hover:bg-white/10 rounded">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-semibold text-lg">Food Rescue</h1>
            </div>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`p-2 rounded-lg transition ${alertsEnabled ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food or location..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Alert Banner */}
        {alertsEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Alerts Enabled</p>
              <p className="text-sm text-green-600">You&apos;ll be notified when free food is posted nearby</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'event', label: 'Events' },
            { id: 'leftover', label: 'Dining' },
            { id: 'mealprep', label: 'Meal Prep' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === tab.id
                  ? 'bg-[#001A57] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center border">
            <p className="text-2xl font-bold text-[#001A57]">{posts.length}</p>
            <p className="text-xs text-gray-500">Active Posts</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <p className="text-2xl font-bold text-green-600">127</p>
            <p className="text-xs text-gray-500">Meals Saved Today</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <p className="text-2xl font-bold text-blue-600">89 lbs</p>
            <p className="text-xs text-gray-500">Food Rescued</p>
          </div>
        </div>

        {/* Food Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                        {getTypeLabel(post.type)}
                      </span>
                      <span className="text-xs text-gray-400">{post.postedAt}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{post.distance}</span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{post.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {post.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Expires in {post.expiresAt}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {post.claimed}/{post.available} claimed
                  </div>
                </div>

                {post.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.dietary.map((diet, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition">
                    Claim
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50 transition">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50 transition">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-gray-100">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(post.claimed / post.available) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No food posts match your search</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#001A57] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#00296B] transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Modal */}
      {showCreateModal && <CreatePostModal />}
    </div>
  )
}
