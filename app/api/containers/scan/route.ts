import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/containers/scan - Handle QR code scan (checkout or return)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { containerId, action, userId } = body

    if (!containerId) {
      return NextResponse.json(
        { error: 'Container ID is required' },
        { status: 400 }
      )
    }

    // Look up container
    const container = await prisma.container.findUnique({
      where: { id: containerId },
      include: {
        checkouts: {
          where: { status: { in: ['picked_up', 'reserved'] } },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!container) {
      return NextResponse.json(
        {
          success: false,
          error: 'Container not found',
          message: `No container found with ID: ${containerId}`
        },
        { status: 404 }
      )
    }

    // Handle different actions
    if (action === 'lookup') {
      // Just return container info
      return NextResponse.json({
        success: true,
        container: {
          id: container.id,
          status: container.status,
          totalUses: container.totalUses,
          currentLocation: container.currentLocation,
          lastWashDate: container.lastWashDate,
          activeCheckout: container.checkouts[0] || null
        }
      })
    }

    if (action === 'checkout') {
      // Check if container is available
      if (container.status !== 'available') {
        return NextResponse.json({
          success: false,
          error: 'Container not available',
          message: `This container is currently ${container.status}`
        }, { status: 400 })
      }

      // Create checkout record
      const checkout = await prisma.checkout.create({
        data: {
          userId: userId || 'demo-user',
          containerId: container.id,
          pickupLocation: container.currentLocation,
          pickupZone: 'A',
          pickupTimeSlot: new Date(),
          actualPickupTime: new Date(),
          expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'picked_up'
        }
      })

      // Update container status
      await prisma.container.update({
        where: { id: container.id },
        data: {
          status: 'checked_out',
          totalUses: { increment: 1 }
        }
      })

      return NextResponse.json({
        success: true,
        action: 'checkout',
        message: 'Container checked out successfully!',
        container: {
          id: container.id,
          status: 'checked_out'
        },
        checkout: {
          id: checkout.id,
          expectedReturnDate: checkout.expectedReturnDate
        },
        points: 5
      })
    }

    if (action === 'return') {
      // Check if container is checked out
      if (container.status !== 'checked_out') {
        return NextResponse.json({
          success: false,
          error: 'Container not checked out',
          message: 'This container is not currently checked out'
        }, { status: 400 })
      }

      const activeCheckout = container.checkouts[0]

      if (activeCheckout) {
        // Update checkout record
        const isLate = new Date() > activeCheckout.expectedReturnDate
        await prisma.checkout.update({
          where: { id: activeCheckout.id },
          data: {
            actualReturnDate: new Date(),
            status: 'returned',
            isLate
          }
        })

        // Update user stats
        await prisma.user.update({
          where: { id: activeCheckout.userId },
          data: {
            totalReturns: { increment: 1 },
            onTimeReturns: isLate ? undefined : { increment: 1 },
            lateReturns: isLate ? { increment: 1 } : undefined,
            points: { increment: isLate ? 5 : 10 },
            currentStreak: isLate ? 0 : { increment: 1 }
          }
        })
      }

      // Update container status
      await prisma.container.update({
        where: { id: container.id },
        data: {
          status: 'available',
          currentLocation: 'Return Bin'
        }
      })

      return NextResponse.json({
        success: true,
        action: 'return',
        message: 'Container returned successfully!',
        container: {
          id: container.id,
          status: 'available',
          totalUses: container.totalUses + 1
        },
        points: 10
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: lookup, checkout, or return' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process scan' },
      { status: 500 }
    )
  }
}
