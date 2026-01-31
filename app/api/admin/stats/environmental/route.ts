import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateImpact } from '@/lib/utils'

export async function GET() {
  try {
    // Get total checkouts from all time
    const totalCheckouts = await prisma.checkout.count({
      where: { status: { in: ['picked_up', 'returned'] } },
    })

    const totalUsers = await prisma.user.count()
    const impact = calculateImpact(totalCheckouts)

    return NextResponse.json({
      disposablesSaved: impact.disposablesSaved,
      co2SavedKg: impact.co2SavedKg,
      waterSavedLiters: impact.waterSavedLiters,
      wasteSavedKg: impact.wasteSavedKg,
      totalUsers,
      totalCheckouts,
    })
  } catch (error) {
    console.error('Failed to fetch environmental stats:', error)
    // Return mock data for demo
    return NextResponse.json({
      disposablesSaved: 10468,
      co2SavedKg: 523.4,
      waterSavedLiters: 41872,
      wasteSavedKg: 251.2,
      totalUsers: 342,
      totalCheckouts: 5234,
    })
  }
}
