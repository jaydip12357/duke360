import { NextRequest, NextResponse } from 'next/server'
import { generateTimeSlots, assignZone } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  const { id: locationId } = await params

  // For demo, generate time slots based on current time
  const now = new Date()
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()

  // Generate slots for next 4 hours
  const slots = []
  const zones = ['A', 'B', 'C', 'D']

  for (let i = 0; i < 16; i++) {
    let slotHour = currentHour + Math.floor((currentMin + 15 + i * 15) / 60)
    let slotMin = (Math.ceil((currentMin + 15) / 15) * 15 + i * 15) % 60

    // Skip if past closing time (21:00)
    if (slotHour >= 21) continue

    // Skip if before opening time (7:00)
    if (slotHour < 7) {
      slotHour = 7
      slotMin = 0
    }

    const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMin).padStart(2, '0')}`
    const zoneIndex = i % zones.length
    const baseAvailable = locationId === 'broadhead' ? 20 : locationId === 'west-union' ? 15 : 12
    const available = Math.max(0, baseAvailable - Math.floor(Math.random() * 15))

    slots.push({
      time: timeStr,
      zone: zones[zoneIndex],
      available,
      total: baseAvailable,
    })
  }

  return NextResponse.json({ slots })
}
