import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const containers = await prisma.container.findMany({
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(containers)
  } catch (error) {
    console.error('Failed to fetch containers:', error)
    // Return mock data for demo
    const mockContainers = Array.from({ length: 100 }, (_, i) => ({
      id: `DU-2026-${String(i + 1).padStart(3, '0')}`,
      rfidTag: `RFID${String(i + 1).padStart(4, '0')}`,
      status: i < 67 ? 'available' : i < 90 ? 'checked_out' : i < 95 ? 'washing' : 'maintenance',
      totalUses: Math.floor(Math.random() * 100),
      currentLocation: i % 3 === 0 ? 'Broadhead' : i % 3 === 1 ? 'West Union' : 'Marketplace',
      lastWashDate: new Date().toISOString(),
      manufacturedDate: new Date('2026-01-01').toISOString(),
    }))
    return NextResponse.json(mockContainers)
  }
}
