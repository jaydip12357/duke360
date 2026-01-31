import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const locations = await prisma.diningLocation.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    // Return mock data for demo
    const mockLocations = [
      {
        id: 'broadhead',
        name: 'Broadhead',
        shortName: 'BH',
        address: '705 Broad St, Durham, NC',
        isActive: true,
        totalContainers: 100,
        availableNow: 67,
        openTime: '07:00',
        closeTime: '21:00',
        slotDuration: 15,
        slotsPerZone: 20,
      },
      {
        id: 'west-union',
        name: 'West Union',
        shortName: 'WU',
        address: '308 Research Dr, Durham, NC',
        isActive: true,
        totalContainers: 80,
        availableNow: 45,
        openTime: '07:00',
        closeTime: '22:00',
        slotDuration: 15,
        slotsPerZone: 15,
      },
      {
        id: 'marketplace',
        name: 'Marketplace',
        shortName: 'MP',
        address: '1600 Science Dr, Durham, NC',
        isActive: true,
        totalContainers: 60,
        availableNow: 32,
        openTime: '07:30',
        closeTime: '20:00',
        slotDuration: 15,
        slotsPerZone: 12,
      },
    ]
    return NextResponse.json(mockLocations)
  }
}
