'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Clock, Users } from 'lucide-react'

interface TimeSlot {
  time: string
  zone: string
  available: number
  total: number
}

interface TimeSlotSelectorProps {
  locationId: string
  selectedDate: Date
  onSelect: (slot: TimeSlot) => void
  selectedSlot?: TimeSlot | null
}

export function TimeSlotSelector({
  locationId,
  selectedDate,
  onSelect,
  selectedSlot,
}: TimeSlotSelectorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/locations/${locationId}/timeslots?date=${selectedDate.toISOString()}`
        )
        const data = await response.json()
        setSlots(data.slots || [])
      } catch (error) {
        console.error('Failed to fetch time slots:', error)
        // Generate mock slots for demo
        const mockSlots: TimeSlot[] = []
        const zones = ['A', 'B', 'C', 'D']
        for (let hour = 11; hour <= 14; hour++) {
          for (let min = 0; min < 60; min += 15) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
            const zoneIndex = Math.floor(Math.random() * zones.length)
            const available = Math.floor(Math.random() * 20)
            mockSlots.push({
              time,
              zone: zones[zoneIndex],
              available,
              total: 20,
            })
          }
        }
        setSlots(mockSlots)
      }
      setLoading(false)
    }

    fetchSlots()
  }, [locationId, selectedDate])

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio > 0.5) return 'bg-green-100 border-green-300 hover:bg-green-200'
    if (ratio > 0.2) return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
    if (available > 0) return 'bg-orange-100 border-orange-300 hover:bg-orange-200'
    return 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((slot) => {
        const isSelected =
          selectedSlot?.time === slot.time && selectedSlot?.zone === slot.zone
        const isAvailable = slot.available > 0

        return (
          <button
            key={`${slot.time}-${slot.zone}`}
            onClick={() => isAvailable && onSelect(slot)}
            disabled={!isAvailable}
            className={cn(
              'p-3 rounded-lg border-2 transition-all text-left',
              getAvailabilityColor(slot.available, slot.total),
              isSelected && 'ring-2 ring-duke-navy ring-offset-2',
              !isAvailable && 'cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-1 font-semibold text-sm">
              <Clock className="h-4 w-4" />
              {slot.time}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Zone {slot.zone}
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <Users className="h-3 w-3" />
              {isAvailable ? (
                <span>{slot.available} left</span>
              ) : (
                <span className="text-red-600">Full</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
