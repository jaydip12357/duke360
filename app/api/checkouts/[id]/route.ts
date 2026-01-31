import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const checkout = await prisma.checkout.findUnique({
      where: { id },
      include: { container: true, user: true },
    })

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    return NextResponse.json(checkout)
  } catch (error) {
    console.error('Failed to fetch checkout:', error)
    return NextResponse.json({ error: 'Failed to fetch checkout' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('mock_session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params
    const session = JSON.parse(sessionCookie.value)

    const checkout = await prisma.checkout.findUnique({
      where: { id },
    })

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })
    }

    if (checkout.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (checkout.status !== 'reserved') {
      return NextResponse.json(
        { error: 'Can only cancel reserved checkouts' },
        { status: 400 }
      )
    }

    await prisma.checkout.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to cancel checkout:', error)
    return NextResponse.json({ error: 'Failed to cancel checkout' }, { status: 500 })
  }
}
