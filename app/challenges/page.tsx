'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Trophy, Target, Calendar, Plus, ChevronRight, Crown, Medal, Zap, Share2, MessageCircle, Check, Clock } from 'lucide-react'

interface Team {
  id: string
  name: string
  type: 'dorm' | 'friends' | 'club'
  members: number
  points: number
  rank: number
  avatar: string
  isUserTeam: boolean
}

interface Challenge {
  id: string
  name: string
  description: string
  type: 'individual' | 'team' | 'campus'
  difficulty: 'easy' | 'medium' | 'hard'
  reward: string
  points: number
  startDate: string
  endDate: string
  progress: number
  goal: number
  participants: number
  status: 'active' | 'upcoming' | 'completed'
  icon: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  avatar: string
  isUser: boolean
  change: number
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'challenges' | 'teams' | 'leaderboard'>('challenges')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Bassett Hall', points: 15420, avatar: '🏠', isUser: false, change: 0 },
    { rank: 2, name: 'Randolph Hall', points: 14890, avatar: '🏠', isUser: true, change: 1 },
    { rank: 3, name: 'Trinity Hall', points: 14230, avatar: '🏠', isUser: false, change: -1 },
    { rank: 4, name: 'Kilgo Quad', points: 13890, avatar: '🏠', isUser: false, change: 2 },
    { rank: 5, name: 'Crowell Quad', points: 13450, avatar: '🏠', isUser: false, change: 0 },
    { rank: 6, name: 'Brown Hall', points: 12980, avatar: '🏠', isUser: false, change: -2 },
    { rank: 7, name: 'Edens Quad', points: 12540, avatar: '🏠', isUser: false, change: 1 },
    { rank: 8, name: 'Wannamaker', points: 12100, avatar: '🏠', isUser: false, change: -1 }
  ]

  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        name: 'Zero Waste Week',
        description: 'Finish every meal with less than 20g of food waste for 7 days',
        type: 'individual',
        difficulty: 'hard',
        reward: '500 points + Badge',
        points: 500,
        startDate: 'Nov 1',
        endDate: 'Nov 7',
        progress: 4,
        goal: 7,
        participants: 342,
        status: 'active',
        icon: '🌱'
      },
      {
        id: '2',
        name: 'Reusable Champion',
        description: 'Use reusable containers for 20 meals this month',
        type: 'individual',
        difficulty: 'medium',
        reward: '300 points',
        points: 300,
        startDate: 'Nov 1',
        endDate: 'Nov 30',
        progress: 12,
        goal: 20,
        participants: 856,
        status: 'active',
        icon: '♻️'
      },
      {
        id: '3',
        name: 'Dorm vs Dorm: November',
        description: 'Help your dorm earn the most sustainability points!',
        type: 'team',
        difficulty: 'medium',
        reward: 'Pizza Party for Winners',
        points: 1000,
        startDate: 'Nov 1',
        endDate: 'Nov 30',
        progress: 14890,
        goal: 20000,
        participants: 2340,
        status: 'active',
        icon: '🏆'
      },
      {
        id: '4',
        name: 'Clean Plate Club',
        description: 'Log 5 consecutive meals with zero waste',
        type: 'individual',
        difficulty: 'easy',
        reward: '150 points',
        points: 150,
        startDate: 'Ongoing',
        endDate: 'Ongoing',
        progress: 3,
        goal: 5,
        participants: 1203,
        status: 'active',
        icon: '🍽️'
      },
      {
        id: '5',
        name: 'Water Warrior Week',
        description: 'Use only refillable water bottles for a week',
        type: 'campus',
        difficulty: 'easy',
        reward: '200 points',
        points: 200,
        startDate: 'Nov 8',
        endDate: 'Nov 14',
        progress: 0,
        goal: 7,
        participants: 0,
        status: 'upcoming',
        icon: '💧'
      },
      {
        id: '6',
        name: 'Meatless Monday Master',
        description: 'Go vegetarian every Monday for a month',
        type: 'individual',
        difficulty: 'medium',
        reward: '250 points + Badge',
        points: 250,
        startDate: 'Nov 1',
        endDate: 'Nov 30',
        progress: 2,
        goal: 4,
        participants: 567,
        status: 'active',
        icon: '🥗'
      }
    ]

    const mockTeams: Team[] = [
      { id: '1', name: 'Randolph Recyclers', type: 'dorm', members: 45, points: 14890, rank: 2, avatar: '🏠', isUserTeam: true },
      { id: '2', name: 'Green Devils', type: 'friends', members: 8, points: 2340, rank: 12, avatar: '😈', isUserTeam: true },
      { id: '3', name: 'Eco Engineers', type: 'club', members: 23, points: 5670, rank: 5, avatar: '🔧', isUserTeam: false }
    ]

    setTimeout(() => {
      setChallenges(mockChallenges)
      setTeams(mockTeams)
      setLoading(false)
    }, 500)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700'
      case 'upcoming': return 'bg-purple-100 text-purple-700'
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const ChallengeDetail = ({ challenge }: { challenge: Challenge }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">{challenge.name}</h2>
          <button onClick={() => setSelectedChallenge(null)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center">
            <span className="text-5xl">{challenge.icon}</span>
          </div>

          <div className="flex justify-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
              {challenge.status}
            </span>
          </div>

          <p className="text-gray-600 text-center">{challenge.description}</p>

          {/* Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Your Progress</span>
              <span className="font-medium">{challenge.progress}/{challenge.goal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#001A57] h-3 rounded-full transition-all"
                style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {challenge.goal - challenge.progress} more to complete!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-[#001A57]">{challenge.points}</p>
              <p className="text-xs text-gray-500">Points</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-green-600">{challenge.participants}</p>
              <p className="text-xs text-gray-500">Participants</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-purple-600">{challenge.endDate}</p>
              <p className="text-xs text-gray-500">Ends</p>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Reward</span>
            </div>
            <p className="text-yellow-700 mt-1">{challenge.reward}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition">
              {challenge.status === 'upcoming' ? 'Join When Active' : 'Log Progress'}
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
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
            <h1 className="font-semibold text-lg">Sustainability Challenges</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* User Stats */}
        <div className="bg-white rounded-xl p-4 border mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your Points This Month</p>
              <p className="text-3xl font-bold text-[#001A57]">2,847</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">+342 this week</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Rank #156</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'teams', label: 'Teams', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${
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

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {/* Active Challenges */}
            <div>
              <h2 className="font-medium text-gray-900 mb-3">Active Challenges</h2>
              <div className="space-y-3">
                {challenges.filter(c => c.status === 'active').map(challenge => (
                  <button
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="w-full bg-white rounded-xl border p-4 text-left hover:border-gray-300 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{challenge.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {challenge.participants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ends {challenge.endDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#001A57]">{challenge.progress}/{challenge.goal}</p>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-[#001A57] h-1.5 rounded-full"
                            style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <h2 className="font-medium text-gray-900 mb-3">Coming Soon</h2>
              <div className="space-y-3">
                {challenges.filter(c => c.status === 'upcoming').map(challenge => (
                  <div
                    key={challenge.id}
                    className="bg-white rounded-xl border p-4 opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{challenge.name}</h3>
                        <p className="text-sm text-gray-500">Starts {challenge.startDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create or Join a Team
            </button>

            <h2 className="font-medium text-gray-900">Your Teams</h2>
            <div className="space-y-3">
              {teams.filter(t => t.isUserTeam).map(team => (
                <div key={team.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{team.avatar}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{team.type} • {team.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#001A57]">#{team.rank}</p>
                      <p className="text-sm text-gray-500">{team.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Competition */}
            <div className="bg-gradient-to-r from-[#001A57] to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">November Dorm Competition</span>
              </div>
              <p className="text-blue-100 text-sm mb-3">Your dorm is in 2nd place! 530 points behind Bassett.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">Prize: Pizza Party</span>
                <span className="text-sm text-blue-200">18 days left</span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            {/* Top 3 */}
            <div className="bg-white rounded-xl border p-4">
              <h2 className="font-medium text-gray-900 mb-4 text-center">November Top Dorms</h2>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <p className="font-medium text-sm">Randolph</p>
                  <p className="text-xs text-gray-500">14,890 pts</p>
                  <Medal className="w-6 h-6 text-gray-400 mx-auto mt-1" />
                </div>
                {/* 1st Place */}
                <div className="text-center -mt-4">
                  <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-yellow-300">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <p className="font-medium">Bassett</p>
                  <p className="text-xs text-gray-500">15,420 pts</p>
                </div>
                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <p className="font-medium text-sm">Trinity</p>
                  <p className="text-xs text-gray-500">14,230 pts</p>
                  <Medal className="w-6 h-6 text-orange-400 mx-auto mt-1" />
                </div>
              </div>
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="p-3 border-b bg-gray-50">
                <h3 className="font-medium text-gray-900">All Dorms</h3>
              </div>
              <div className="divide-y">
                {leaderboard.map(entry => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 ${entry.isUser ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-medium text-gray-500">{entry.rank}</span>
                      <span className="text-xl">{entry.avatar}</span>
                      <div>
                        <p className={`font-medium ${entry.isUser ? 'text-blue-700' : 'text-gray-900'}`}>
                          {entry.name}
                          {entry.isUser && <span className="ml-2 text-xs bg-blue-200 px-1.5 py-0.5 rounded">You</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.points.toLocaleString()}</span>
                      {entry.change !== 0 && (
                        <span className={`text-xs ${entry.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.change > 0 ? '↑' : '↓'}{Math.abs(entry.change)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && <ChallengeDetail challenge={selectedChallenge} />}
    </div>
  )
}
