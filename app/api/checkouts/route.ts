import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignZone } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('mock_session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const body = await req.json()
    const { locationId, locationName, pickupZone, pickupTimeSlot } = body

    if (!locationName || !pickupZone || !pickupTimeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pickupTime = new Date(pickupTimeSlot)
    const expectedReturn = new Date(pickupTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours later

    // Try to create in database
    try {
      // Check for existing active checkout
      const existingCheckout = await prisma.checkout.findFirst({
        where: {
          userId: session.userId,
          status: { in: ['reserved', 'picked_up'] },
        },
      })

      if (existingCheckout) {
        return NextResponse.json(
          { error: 'You already have an active checkout' },
          { status: 400 }
        )
      }

      const checkout = await prisma.checkout.create({
        data: {
          userId: session.userId,
          pickupLocation: locationName,
          pickupZone,
          pickupTimeSlot: pickupTime,
          expectedReturnDate: expectedReturn,
          status: 'reserved',
        },
      })

      return NextResponse.json(checkout)
    } catch (dbError) {
      // Fallback for demo without database
      console.error('Database error:', dbError)
      const mockCheckout = {
        id: `checkout-${Date.now()}`,
        userId: session.userId,
        containerId: null,
        pickupLocation: locationName,
        pickupZone,
        pickupTimeSlot: pickupTime.toISOString(),
        expectedReturnDate: expectedReturn.toISOString(),
        status: 'reserved',
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json(mockCheckout)
    }
  } catch (error) {
    console.error('Failed to create checkout:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const checkouts = await prisma.checkout.findMany({
      where: { userId },
      include: { container: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(checkouts)
  } catch (error) {
    console.error('Failed to fetch checkouts:', error)
    return NextResponse.json([])
  }
}
