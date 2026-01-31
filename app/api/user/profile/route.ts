import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('mock_session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          achievements: {
            include: { achievement: true },
          },
          checkouts: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { container: true },
          },
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Find active checkout
      const activeCheckout = user.checkouts.find(
        c => c.status === 'reserved' || c.status === 'picked_up'
      )

      // Recent completed checkouts
      const recentCheckouts = user.checkouts.filter(
        c => c.status === 'returned' || c.status === 'cancelled'
      ).slice(0, 5)

      return NextResponse.json({
        user: {
          id: user.id,
          netId: user.netId,
          name: user.name,
          email: user.email,
        },
        stats: {
          totalCheckouts: user.totalCheckouts,
          totalReturns: user.totalReturns,
          onTimeReturns: user.onTimeReturns,
          lateReturns: user.lateReturns,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          points: user.points,
        },
        activeCheckout: activeCheckout ? {
          id: activeCheckout.id,
          containerId: activeCheckout.containerId,
          pickupLocation: activeCheckout.pickupLocation,
          pickupZone: activeCheckout.pickupZone,
          pickupTimeSlot: activeCheckout.pickupTimeSlot,
          expectedReturnDate: activeCheckout.expectedReturnDate,
          actualPickupTime: activeCheckout.actualPickupTime,
          status: activeCheckout.status,
        } : null,
        recentCheckouts: recentCheckouts.map(c => ({
          id: c.id,
          containerId: c.containerId,
          pickupLocation: c.pickupLocation,
          pickupZone: c.pickupZone,
          pickupTimeSlot: c.pickupTimeSlot,
          expectedReturnDate: c.expectedReturnDate,
          actualReturnDate: c.actualReturnDate,
          status: c.status,
          isLate: c.isLate,
        })),
        achievements: user.achievements.map(ua => ({
          id: ua.achievement.id,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          points: ua.achievement.points,
          badgeColor: ua.achievement.badgeColor,
          unlockedAt: ua.unlockedAt,
        })),
      })
    } catch (dbError) {
      // Return mock data for demo
      console.error('Database error:', dbError)
      return NextResponse.json({
        user: {
          id: session.userId,
          netId: session.netId,
          name: session.name,
          email: session.email,
        },
        stats: {
          totalCheckouts: 42,
          totalReturns: 40,
          onTimeReturns: 38,
          lateReturns: 2,
          currentStreak: 12,
          longestStreak: 15,
          points: 420,
        },
        activeCheckout: null,
        recentCheckouts: [],
        achievements: [
          { id: '1', name: 'First Steps', description: 'Complete your first checkout', icon: 'seedling', points: 10, badgeColor: '#4CAF50' },
          { id: '2', name: 'Getting Started', description: '5 checkouts completed', icon: 'leaf', points: 25, badgeColor: '#8BC34A' },
          { id: '3', name: 'On a Roll', description: '5-day return streak', icon: 'fire', points: 50, badgeColor: '#FF9800' },
        ],
      })
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
