import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get pilot signup stats
export async function GET() {
  try {
    const totalSignups = await prisma.pilotSignup.count()
    const tier1Remaining = Math.max(0, 20 - totalSignups)
    const tier2Remaining = totalSignups >= 20 ? Math.max(0, 50 - totalSignups) : 30

    return NextResponse.json({
      totalSignups,
      tier1Remaining,
      tier2Remaining,
      tier1Full: totalSignups >= 20,
      tier2Full: totalSignups >= 50,
    })
  } catch (error) {
    console.error('Failed to fetch pilot stats:', error)
    // Return mock data if database is not available
    return NextResponse.json({
      totalSignups: 14,
      tier1Remaining: 6,
      tier2Remaining: 30,
      tier1Full: false,
      tier2Full: false,
    })
  }
}

// POST - Create new pilot signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, netId, email, preferredDining } = body

    // Validate required fields
    if (!name || !netId || !email || !preferredDining) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!email.endsWith('@duke.edu')) {
      return NextResponse.json(
        { error: 'Please use your Duke email address' },
        { status: 400 }
      )
    }

    // Check if already signed up
    const existing = await prisma.pilotSignup.findUnique({
      where: { netId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already signed up for the pilot program' },
        { status: 400 }
      )
    }

    // Count current signups to determine reward tier
    const currentCount = await prisma.pilotSignup.count()

    let rewardTier: string
    let rewardAmount: number

    if (currentCount < 20) {
      rewardTier = 'tier1'
      rewardAmount = 10
    } else if (currentCount < 50) {
      rewardTier = 'tier2'
      rewardAmount = 5
    } else {
      rewardTier = 'none'
      rewardAmount = 0
    }

    // Create the signup
    const signup = await prisma.pilotSignup.create({
      data: {
        name,
        netId,
        email,
        preferredDining,
        rewardTier,
        rewardAmount,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up for the pilot program!',
      signupNumber: currentCount + 1,
      rewardTier,
      rewardAmount,
      id: signup.id,
    })
  } catch (error) {
    console.error('Failed to create pilot signup:', error)

    // Handle unique constraint violation
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already signed up for the pilot program' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process signup. Please try again.' },
      { status: 500 }
    )
  }
}
