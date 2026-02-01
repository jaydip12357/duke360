'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Camera, TrendingDown, TrendingUp, Flame, Award, Calendar, ChevronRight, X, Check, Lightbulb, Upload } from 'lucide-react'

interface MealLog {
  id: string
  date: string
  meal: 'breakfast' | 'lunch' | 'dinner'
  location: string
  wasteAmount: number // grams
  wasteType: string[]
  beforePhoto?: string
  afterPhoto?: string
  aiEstimate: number
  tips: string[]
}

interface WeeklyStats {
  totalWaste: number
  avgPerMeal: number
  trend: number // percentage change
  cleanPlates: number
  totalMeals: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  goal: number
  unlocked: boolean
}

export default function WasteLogPage() {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [activeView, setActiveView] = useState<'log' | 'stats' | 'tips'>('log')
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalWaste: 245,
    avgPerMeal: 35,
    trend: -12,
    cleanPlates: 4,
    totalMeals: 14
  })
  const [streak, setStreak] = useState(5)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const mockLogs: MealLog[] = [
      {
        id: '1',
        date: 'Today',
        meal: 'lunch',
        location: 'Marketplace',
        wasteAmount: 28,
        wasteType: ['rice', 'vegetables'],
        aiEstimate: 30,
        tips: ['Try taking smaller rice portions', 'Vegetables can be composted']
      },
      {
        id: '2',
        date: 'Today',
        meal: 'breakfast',
        location: 'Brodhead',
        wasteAmount: 0,
        wasteType: [],
        aiEstimate: 0,
        tips: ['Great job! Clean plate!']
      },
      {
        id: '3',
        date: 'Yesterday',
        meal: 'dinner',
        location: 'Marketplace',
        wasteAmount: 45,
        wasteType: ['pasta', 'bread'],
        aiEstimate: 42,
        tips: ['Consider skipping the bread roll next time']
      },
      {
        id: '4',
        date: 'Yesterday',
        meal: 'lunch',
        location: 'Freeman',
        wasteAmount: 15,
        wasteType: ['salad'],
        aiEstimate: 18,
        tips: ['Salad bar allows custom portions - take only what you\'ll eat']
      },
      {
        id: '5',
        date: '2 days ago',
        meal: 'dinner',
        location: 'Marketplace',
        wasteAmount: 0,
        wasteType: [],
        aiEstimate: 0,
        tips: ['Another clean plate! You\'re on a roll!']
      }
    ]

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'Clean Plate Club',
        description: 'Finish 5 meals with zero waste',
        icon: '🍽️',
        progress: 4,
        goal: 5,
        unlocked: false
      },
      {
        id: '2',
        name: 'Waste Warrior',
        description: 'Reduce weekly waste by 20%',
        icon: '⚔️',
        progress: 12,
        goal: 20,
        unlocked: false
      },
      {
        id: '3',
        name: 'Streak Master',
        description: '7-day logging streak',
        icon: '🔥',
        progress: 5,
        goal: 7,
        unlocked: false
      },
      {
        id: '4',
        name: 'Portion Pro',
        description: 'Stay under 30g waste for 10 meals',
        icon: '🎯',
        progress: 10,
        goal: 10,
        unlocked: true
      }
    ]

    setTimeout(() => {
      setMealLogs(mockLogs)
      setAchievements(mockAchievements)
      setLoading(false)
    }, 500)
  }, [])

  const tips = [
    {
      category: 'Portions',
      items: [
        'Start with smaller portions - you can always go back for more',
        'Use a smaller plate to naturally reduce portion sizes',
        'Ask servers for half portions when available'
      ]
    },
    {
      category: 'Planning',
      items: [
        'Check the menu before going to plan your meal',
        'Avoid going to dining hall when overly hungry',
        'Share large portions with friends'
      ]
    },
    {
      category: 'Your Patterns',
      items: [
        'You often waste rice - try taking 1/2 scoop instead',
        'Bread rolls are frequently left - skip them if unsure',
        'Your cleanest meals are at breakfast - keep it up!'
      ]
    }
  ]

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      default: return '🍽️'
    }
  }

  const getWasteColor = (amount: number) => {
    if (amount === 0) return 'text-green-600 bg-green-100'
    if (amount < 30) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const LogMealModal = () => {
    const [step, setStep] = useState<'before' | 'after' | 'review'>('before')
    const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch')
    const [location, setLocation] = useState('Marketplace')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [beforeImage, setBeforeImage] = useState<string | null>(null)
    const [afterImage, setAfterImage] = useState<string | null>(null)
    const [estimatedWaste, setEstimatedWaste] = useState(0)

    const simulateAIAnalysis = () => {
      // Simulate AI analysis
      setEstimatedWaste(Math.floor(Math.random() * 50))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (type === 'before') {
            setBeforeImage(reader.result as string)
          } else {
            setAfterImage(reader.result as string)
            simulateAIAnalysis()
          }
        }
        reader.readAsDataURL(file)
      }
    }

    const handleSubmit = () => {
      const newLog: MealLog = {
        id: Date.now().toString(),
        date: 'Today',
        meal,
        location,
        wasteAmount: estimatedWaste,
        wasteType: estimatedWaste > 0 ? ['mixed'] : [],
        aiEstimate: estimatedWaste,
        tips: estimatedWaste === 0 ? ['Perfect! Clean plate!'] : ['Try smaller portions next time']
      }
      setMealLogs([newLog, ...mealLogs])
      setShowLogModal(false)
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Log Your Meal</h2>
            <button onClick={() => setShowLogModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {['before', 'after', 'review'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-[#001A57] text-white' :
                    ['before', 'after', 'review'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {['before', 'after', 'review'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>

            {step === 'before' && (
              <div className="space-y-4">
                <h3 className="font-medium text-center">Take a photo before eating</h3>

                {/* Meal Selection */}
                <div className="grid grid-cols-3 gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMeal(m)}
                      className={`p-3 rounded-lg text-sm font-medium transition ${
                        meal === m ? 'bg-[#001A57] text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {getMealIcon(m)} {m}
                    </button>
                  ))}
                </div>

                {/* Location */}
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option>Marketplace</option>
                  <option>Brodhead Center</option>
                  <option>Freeman Center</option>
                  <option>Divinity Cafe</option>
                </select>

                {/* Photo Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition"
                >
                  {beforeImage ? (
                    <img src={beforeImage} alt="Before" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Tap to take photo of your plate</p>
                      <p className="text-sm text-gray-400">Before you start eating</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'before')}
                  />
                </div>

                <button
                  onClick={() => setStep('after')}
                  disabled={!beforeImage}
                  className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Next: Photo After Eating
                </button>

                <button
                  onClick={() => setStep('after')}
                  className="w-full py-2 text-gray-500 text-sm"
                >
                  Skip photo (manual entry)
                </button>
              </div>
            )}

            {step === 'after' && (
              <div className="space-y-4">
                <h3 className="font-medium text-center">Photo after eating</h3>
                <p className="text-sm text-gray-500 text-center">Our AI will estimate your waste</p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition"
                >
                  {afterImage ? (
                    <img src={afterImage} alt="After" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Tap to take photo</p>
                      <p className="text-sm text-gray-400">Show what&apos;s left on your plate</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'after')}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('before')}
                    className="flex-1 py-3 border rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('review')}
                    className="flex-1 py-3 bg-[#001A57] text-white rounded-lg font-medium"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <h3 className="font-medium text-center">AI Analysis</h3>

                <div className={`text-center p-6 rounded-xl ${getWasteColor(estimatedWaste)}`}>
                  <p className="text-4xl font-bold">{estimatedWaste}g</p>
                  <p className="text-sm mt-1">Estimated food waste</p>
                </div>

                {estimatedWaste === 0 ? (
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <span className="text-3xl">🎉</span>
                    <p className="font-medium text-green-800 mt-2">Clean Plate!</p>
                    <p className="text-sm text-green-600">You&apos;re helping reduce food waste</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <p className="font-medium text-yellow-800 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Personalized Tips
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Try smaller portions of similar items</li>
                      <li>• This waste could have fed someone else</li>
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium"
                >
                  Save Log
                </button>
              </div>
            )}
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
            <h1 className="font-semibold text-lg">Food Waste Log</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Weekly Summary */}
        <div className="bg-white rounded-xl p-4 border mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">This Week</h2>
            <div className={`flex items-center gap-1 text-sm ${weeklyStats.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weeklyStats.trend < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(weeklyStats.trend)}% vs last week
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#001A57]">{weeklyStats.totalWaste}g</p>
              <p className="text-xs text-gray-500">Total Waste</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{weeklyStats.avgPerMeal}g</p>
              <p className="text-xs text-gray-500">Avg/Meal</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{weeklyStats.cleanPlates}</p>
              <p className="text-xs text-gray-500">Clean Plates</p>
            </div>
          </div>
        </div>

        {/* Log Button */}
        <button
          onClick={() => setShowLogModal(true)}
          className="w-full py-4 bg-[#001A57] text-white rounded-xl font-medium hover:bg-[#00296B] transition flex items-center justify-center gap-2 mb-4"
        >
          <Camera className="w-5 h-5" />
          Log a Meal
        </button>

        {/* View Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          {[
            { id: 'log', label: 'History' },
            { id: 'stats', label: 'Insights' },
            { id: 'tips', label: 'Tips' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeView === tab.id
                  ? 'border-[#001A57] text-[#001A57]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeView === 'log' && (
          <div className="space-y-3">
            {mealLogs.map(log => (
              <div key={log.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMealIcon(log.meal)}</span>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{log.meal}</p>
                      <p className="text-xs text-gray-500">{log.date} • {log.location}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getWasteColor(log.wasteAmount)}`}>
                    {log.wasteAmount}g
                  </div>
                </div>

                {log.wasteAmount === 0 ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    Clean plate!
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {log.wasteType.map((type, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{log.tips[0]}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeView === 'stats' && (
          <div className="space-y-4">
            {/* Achievements */}
            <div className="bg-white rounded-xl p-4 border">
              <h3 className="font-medium text-gray-900 mb-3">Achievements</h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className={`text-sm font-medium ${achievement.unlocked ? 'text-green-700' : 'text-gray-700'}`}>
                        {achievement.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{achievement.progress}/{achievement.goal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Waste by Meal */}
            <div className="bg-white rounded-xl p-4 border">
              <h3 className="font-medium text-gray-900 mb-3">Waste by Meal Type</h3>
              <div className="space-y-3">
                {[
                  { meal: 'Breakfast', avg: 12, icon: '🌅' },
                  { meal: 'Lunch', avg: 38, icon: '☀️' },
                  { meal: 'Dinner', avg: 45, icon: '🌙' }
                ].map(item => (
                  <div key={item.meal} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.meal}</span>
                        <span className="font-medium">{item.avg}g avg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.avg < 25 ? 'bg-green-500' : item.avg < 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(item.avg * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'tips' && (
          <div className="space-y-4">
            {tips.map((section, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border">
                <h3 className="font-medium text-gray-900 mb-3">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && <LogMealModal />}
    </div>
  )
}
