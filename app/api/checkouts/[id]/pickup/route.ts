import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { containerId } = body

    const checkout = await prisma.checkout.findUnique({
      where: { id },
    })

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    if (checkout.status !== 'reserved') {
      return NextResponse.json(
        { error: 'Checkout is not in reserved status' },
        { status: 400 }
      )
    }

    // Update checkout
    const updatedCheckout = await prisma.checkout.update({
      where: { id },
      data: {
        status: 'picked_up',
        containerId,
        actualPickupTime: new Date(),
      },
    })

    // Update container status
    if (containerId) {
      await prisma.container.update({
        where: { id: containerId },
        data: {
          status: 'checked_out',
          totalUses: { increment: 1 },
        },
      })
    }

    // Update user stats
    await prisma.user.update({
      where: { id: checkout.userId },
      data: {
        totalCheckouts: { increment: 1 },
      },
    })

    return NextResponse.json(updatedCheckout)
  } catch (error) {
    console.error('Failed to mark pickup:', error)
    return NextResponse.json({ error: 'Failed to mark pickup' }, { status: 500 })
  }
}
