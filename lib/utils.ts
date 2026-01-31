import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Environmental impact calculations
export const IMPACT_PER_USE = {
  disposablesSaved: 2, // 1 container + 1 lid
  co2SavedGrams: 50, // grams of CO2 saved
  waterSavedLiters: 4, // liters of water saved
  wasteSavedGrams: 24, // grams of waste saved
}

export function calculateImpact(totalUses: number) {
  return {
    disposablesSaved: totalUses * IMPACT_PER_USE.disposablesSaved,
    co2SavedKg: (totalUses * IMPACT_PER_USE.co2SavedGrams) / 1000,
    waterSavedLiters: totalUses * IMPACT_PER_USE.waterSavedLiters,
    wasteSavedKg: (totalUses * IMPACT_PER_USE.wasteSavedGrams) / 1000,
  }
}

// Points calculations
export const POINTS = {
  checkout: 10,
  earlyReturn: 5,
  streak5: 25,
  streak10: 50,
  streak15: 75,
  lateReturnPenalty: -5,
  veryLateReturnPenalty: -10,
}

// Time slot utilities
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  slotDuration: number = 15
): string[] {
  const slots: string[] = []
  const [openHour, openMin] = openTime.split(':').map(Number)
  const [closeHour, closeMin] = closeTime.split(':').map(Number)

  let currentHour = openHour
  let currentMin = openMin

  while (
    currentHour < closeHour ||
    (currentHour === closeHour && currentMin < closeMin)
  ) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
    slots.push(timeStr)

    currentMin += slotDuration
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60)
      currentMin = currentMin % 60
    }
  }

  return slots
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

// Zone assignment
const ZONES = ['A', 'B', 'C', 'D']

export function assignZone(existingBookings: number): string {
  return ZONES[existingBookings % ZONES.length]
}

// Container ID generation
export function generateContainerId(sequence: number): string {
  const year = new Date().getFullYear()
  return `DU-${year}-${String(sequence).padStart(3, '0')}`
}

// Check if return is late
export function isReturnLate(expectedReturn: Date, actualReturn: Date): boolean {
  return actualReturn > expectedReturn
}

export function hoursOverdue(expectedReturn: Date, actualReturn: Date): number {
  const diff = actualReturn.getTime() - expectedReturn.getTime()
  return Math.max(0, diff / (1000 * 60 * 60))
}
