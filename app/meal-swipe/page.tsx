'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Gift, Clock, MapPin, MessageCircle, Heart, Shield, Users, Plus, Send, Check } from 'lucide-react'

interface SwipeOffer {
  id: string
  type: 'gift' | 'trade' | 'donate'
  offeredBy: string
  isAnonymous: boolean
  swipes: number
  location: string
  availableTime: string
  message: string
  postedAt: string
  status: 'available' | 'pending' | 'claimed'
  requesterCount: number
}

interface UserStats {
  swipesGiven: number
  swipesReceived: number
  karmaPoints: number
  rank: string
}

export default function MealSwipePage() {
  const [offers, setOffers] = useState<SwipeOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'available' | 'my-offers' | 'requests'>('available')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    swipesGiven: 12,
    swipesReceived: 3,
    karmaPoints: 156,
    rank: 'Generous Giver'
  })

  useEffect(() => {
    const mockOffers: SwipeOffer[] = [
      {
        id: '1',
        type: 'gift',
        offeredBy: 'Anonymous',
        isAnonymous: true,
        swipes: 2,
        location: 'Marketplace',
        availableTime: 'Today 5-7 PM',
        message: 'Extra swipes this week, happy to share!',
        postedAt: '30 min ago',
        status: 'available',
        requesterCount: 3
      },
      {
        id: '2',
        type: 'gift',
        offeredBy: 'Sarah M.',
        isAnonymous: false,
        swipes: 1,
        location: 'Brodhead Center',
        availableTime: 'Today 12-2 PM',
        message: 'Have an extra swipe for lunch today',
        postedAt: '1 hour ago',
        status: 'available',
        requesterCount: 1
      },
      {
        id: '3',
        type: 'donate',
        offeredBy: 'Duke Dining',
        isAnonymous: false,
        swipes: 50,
        location: 'Any dining location',
        availableTime: 'End of semester',
        message: 'Donated swipes for food-insecure students. Apply anonymously.',
        postedAt: '2 days ago',
        status: 'available',
        requesterCount: 23
      },
      {
        id: '4',
        type: 'trade',
        offeredBy: 'Mike L.',
        isAnonymous: false,
        swipes: 3,
        location: 'Marketplace',
        availableTime: 'This weekend',
        message: 'Trading 3 swipes for help with CS homework!',
        postedAt: '3 hours ago',
        status: 'available',
        requesterCount: 2
      },
      {
        id: '5',
        type: 'gift',
        offeredBy: 'Anonymous',
        isAnonymous: true,
        swipes: 5,
        location: 'Any location',
        availableTime: 'Flexible',
        message: 'Graduating senior with leftover swipes. DM me!',
        postedAt: '1 day ago',
        status: 'available',
        requesterCount: 8
      }
    ]

    setTimeout(() => {
      setOffers(mockOffers)
      setLoading(false)
    }, 500)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gift': return 'bg-green-100 text-green-700'
      case 'trade': return 'bg-blue-100 text-blue-700'
      case 'donate': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gift': return <Gift className="w-4 h-4" />
      case 'trade': return <MessageCircle className="w-4 h-4" />
      case 'donate': return <Heart className="w-4 h-4" />
      default: return <Gift className="w-4 h-4" />
    }
  }

  const CreateOfferModal = () => {
    const [offerType, setOfferType] = useState<'gift' | 'trade' | 'donate'>('gift')
    const [swipes, setSwipes] = useState(1)
    const [location, setLocation] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)

    const handleSubmit = () => {
      const newOffer: SwipeOffer = {
        id: Date.now().toString(),
        type: offerType,
        offeredBy: isAnonymous ? 'Anonymous' : 'You',
        isAnonymous,
        swipes,
        location,
        availableTime: time,
        message,
        postedAt: 'Just now',
        status: 'available',
        requesterCount: 0
      }
      setOffers([newOffer, ...offers])
      setShowCreateModal(false)
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Share Meal Swipes</h2>
            <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Offer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['gift', 'trade', 'donate'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setOfferType(type)}
                    className={`p-3 rounded-lg text-sm font-medium transition flex flex-col items-center gap-1 ${
                      offerType === type
                        ? 'bg-[#001A57] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'gift' && <Gift className="w-5 h-5" />}
                    {type === 'trade' && <MessageCircle className="w-5 h-5" />}
                    {type === 'donate' && <Heart className="w-5 h-5" />}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Swipes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of swipes</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSwipes(Math.max(1, swipes - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{swipes}</span>
                <button
                  onClick={() => setSwipes(Math.min(20, swipes + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select location</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Brodhead Center">Brodhead Center</option>
                <option value="Freeman Center">Freeman Center</option>
                <option value="Any location">Any location</option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., Today 5-7 PM"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note for recipients..."
                rows={2}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <div>
                <p className="font-medium text-gray-900">Share anonymously</p>
                <p className="text-sm text-gray-500">Your name won&apos;t be shown</p>
              </div>
              <Shield className="w-5 h-5 text-gray-400 ml-auto" />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!location || !time}
              className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition disabled:opacity-50"
            >
              Share Swipes
            </button>
          </div>
        </div>
      </div>
    )
  }

  const RequestModal = () => {
    const [reason, setReason] = useState('')
    const [swipesNeeded, setSwipesNeeded] = useState(1)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Request Meal Swipes</h2>
            <button onClick={() => setShowRequestModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <Shield className="w-4 h-4 inline mr-1" />
                Your request is completely anonymous and confidential.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Swipes needed</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSwipesNeeded(Math.max(1, swipesNeeded - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{swipesNeeded}</span>
                <button
                  onClick={() => setSwipesNeeded(Math.min(10, swipesNeeded + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="You don't have to share, but it helps donors prioritize..."
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowRequestModal(false)}
              className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition"
            >
              Submit Request
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
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 hover:bg-white/10 rounded">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-lg">Meal Swipe Exchange</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* User Stats */}
        <div className="bg-white rounded-xl p-4 border mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">Your Impact</h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {userStats.rank}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#001A57]">{userStats.swipesGiven}</p>
              <p className="text-xs text-gray-500">Given</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{userStats.swipesReceived}</p>
              <p className="text-xs text-gray-500">Received</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{userStats.karmaPoints}</p>
              <p className="text-xs text-gray-500">Karma</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-4 bg-[#001A57] text-white rounded-xl font-medium hover:bg-[#00296B] transition flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Share Swipes
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="p-4 bg-white border-2 border-[#001A57] text-[#001A57] rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Request Swipes
          </button>
        </div>

        {/* End of Semester Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-purple-900">End of Semester Donation Drive</p>
              <p className="text-sm text-purple-700 mt-1">
                Have unused swipes? Donate them to students in need. All donations are anonymous.
              </p>
              <button className="mt-2 text-sm font-medium text-purple-700 hover:text-purple-900">
                Donate Now →
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          {[
            { id: 'available', label: 'Available' },
            { id: 'my-offers', label: 'My Offers' },
            { id: 'requests', label: 'Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#001A57] text-[#001A57]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offers List */}
        <div className="space-y-3">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(offer.type)}`}>
                    {getTypeIcon(offer.type)}
                    <span className="capitalize">{offer.type}</span>
                  </span>
                  {offer.isAnonymous && (
                    <Shield className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-xs text-gray-400">{offer.postedAt}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-[#001A57]">{offer.swipes}</span>
                <span className="text-gray-600">swipe{offer.swipes > 1 ? 's' : ''} available</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{offer.message}</p>

              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {offer.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {offer.availableTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {offer.requesterCount} interested
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  From: {offer.offeredBy}
                </span>
                <button className="px-4 py-2 bg-[#001A57] text-white rounded-lg text-sm font-medium hover:bg-[#00296B] transition">
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="mt-6 bg-white rounded-xl p-4 border">
          <h3 className="font-medium text-gray-900 mb-3">How It Works</h3>
          <div className="space-y-3">
            {[
              { icon: <Gift className="w-5 h-5" />, title: 'Share', desc: 'Post available swipes for others' },
              { icon: <Shield className="w-5 h-5" />, title: 'Match', desc: 'Anonymous matching with recipients' },
              { icon: <Check className="w-5 h-5" />, title: 'Meet', desc: 'Meet briefly at the dining hall' }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#001A57] text-white flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateOfferModal />}
      {showRequestModal && <RequestModal />}
    </div>
  )
}
