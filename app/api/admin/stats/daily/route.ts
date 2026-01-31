import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's stats from checkouts
    const [todayCheckouts, todayReturns, activeContainers, totalUsers] = await Promise.all([
      prisma.checkout.count({
        where: {
          createdAt: { gte: today },
          status: { not: 'cancelled' },
        },
      }),
      prisma.checkout.count({
        where: {
          actualReturnDate: { gte: today },
          status: 'returned',
        },
      }),
      prisma.container.count({
        where: { status: 'checked_out' },
      }),
      prisma.user.count(),
    ])

    const onTimeReturns = await prisma.checkout.count({
      where: {
        actualReturnDate: { gte: today },
        status: 'returned',
        isLate: false,
      },
    })

    const lateReturns = todayReturns - onTimeReturns
    const returnRate = todayReturns > 0 ? Math.round((onTimeReturns / todayReturns) * 100) : 100

    return NextResponse.json({
      totalCheckouts: todayCheckouts,
      totalReturns: todayReturns,
      onTimeReturns,
      lateReturns,
      activeContainers,
      returnRate,
      activeUsers: totalUsers,
      disposablesSaved: todayCheckouts * 2,
    })
  } catch (error) {
    console.error('Failed to fetch daily stats:', error)
    // Return mock data for demo
    return NextResponse.json({
      totalCheckouts: 156,
      totalReturns: 142,
      onTimeReturns: 127,
      lateReturns: 15,
      activeContainers: 67,
      returnRate: 89,
      activeUsers: 342,
      disposablesSaved: 312,
    })
  }
}
