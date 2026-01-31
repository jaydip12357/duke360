import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isReturnLate, hoursOverdue, POINTS } from '@/lib/utils'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { returnLocation } = body

    const checkout = await prisma.checkout.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    if (checkout.status !== 'picked_up') {
      return NextResponse.json(
        { error: 'Checkout is not in picked_up status' },
        { status: 400 }
      )
    }

    const now = new Date()
    const isLate = isReturnLate(new Date(checkout.expectedReturnDate), now)
    const hoursLate = hoursOverdue(new Date(checkout.expectedReturnDate), now)

    // Calculate points
    let pointsChange = POINTS.checkout
    if (isLate) {
      pointsChange = hoursLate > 6 ? POINTS.veryLateReturnPenalty : POINTS.lateReturnPenalty
    } else if (hoursLate < -2) {
      // Early return bonus
      pointsChange += POINTS.earlyReturn
    }

    // Update checkout
    const updatedCheckout = await prisma.checkout.update({
      where: { id },
      data: {
        status: 'returned',
        actualReturnDate: now,
        returnLocation: returnLocation || checkout.pickupLocation,
        isLate,
      },
    })

    // Update container status
    if (checkout.containerId) {
      await prisma.container.update({
        where: { id: checkout.containerId },
        data: { status: 'washing' },
      })
    }

    // Update user stats
    const currentStreak = isLate ? 0 : checkout.user.currentStreak + 1
    await prisma.user.update({
      where: { id: checkout.userId },
      data: {
        totalReturns: { increment: 1 },
        onTimeReturns: isLate ? undefined : { increment: 1 },
        lateReturns: isLate ? { increment: 1 } : undefined,
        currentStreak,
        longestStreak: Math.max(currentStreak, checkout.user.longestStreak),
        points: { increment: pointsChange },
      },
    })

    return NextResponse.json(updatedCheckout)
  } catch (error) {
    console.error('Failed to process return:', error)
    return NextResponse.json({ error: 'Failed to process return' }, { status: 500 })
  }
}
