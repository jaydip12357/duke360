import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const validStatuses = ['available', 'checked_out', 'washing', 'maintenance']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const container = await prisma.container.update({
      where: { id },
      data: {
        status,
        lastWashDate: status === 'available' ? new Date() : undefined,
      },
    })

    return NextResponse.json(container)
  } catch (error) {
    console.error('Failed to update container status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
