'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Check, ArrowLeft, ArrowRight, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TimeSlotSelector } from '@/components/TimeSlotSelector'
import { cn } from '@/lib/utils'

interface Location {
  id: string
  name: string
  shortName: string
  availableNow: number
  totalContainers: number
  address: string
}

interface TimeSlot {
  time: string
  zone: string
  available: number
  total: number
}

export default function BookPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations')
        if (response.ok) {
          const data = await response.json()
          setLocations(data)
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err)
        // Use mock data for demo
        setLocations([
          {
            id: 'broadhead',
            name: 'Broadhead',
            shortName: 'BH',
            availableNow: 67,
            totalContainers: 100,
            address: '705 Broad St, Durham, NC',
          },
          {
            id: 'west-union',
            name: 'West Union',
            shortName: 'WU',
            availableNow: 45,
            totalContainers: 80,
            address: '308 Research Dr, Durham, NC',
          },
          {
            id: 'marketplace',
            name: 'Marketplace',
            shortName: 'MP',
            availableNow: 32,
            totalContainers: 60,
            address: '1600 Science Dr, Durham, NC',
          },
        ])
      }
      setLoading(false)
    }

    fetchLocations()
  }, [])

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setSelectedSlot(null)
    setStep(2)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setStep(3)
  }

  const handleConfirm = async () => {
    if (!selectedLocation || !selectedSlot) return

    setSubmitting(true)
    setError(null)

    try {
      const pickupTime = new Date(selectedDate)
      const [hours, minutes] = selectedSlot.time.split(':').map(Number)
      pickupTime.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/checkouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: selectedLocation.id,
          locationName: selectedLocation.name,
          pickupZone: selectedSlot.zone,
          pickupTimeSlot: pickupTime.toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create reservation')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio > 0.5) return 'text-green-600'
    if (ratio > 0.2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const steps = [
    { number: 1, title: 'Location', icon: MapPin },
    { number: 2, title: 'Time', icon: Clock },
    { number: 3, title: 'Confirm', icon: Check },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duke-navy"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    step >= s.number
                      ? 'bg-duke-navy border-duke-navy text-white'
                      : 'border-gray-300 text-gray-400'
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    'ml-2 font-medium',
                    step >= s.number ? 'text-duke-navy' : 'text-gray-400'
                  )}
                >
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-1 mx-4 rounded',
                      step > s.number ? 'bg-duke-navy' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Location */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-duke-navy mb-6 text-center">
                Select Dining Location
              </h1>
              <div className="grid md:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Card
                    key={location.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      selectedLocation?.id === location.id && 'ring-2 ring-duke-navy'
                    )}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <Badge variant="secondary">{location.shortName}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Available Now</span>
                        <span
                          className={cn(
                            'font-bold text-lg',
                            getAvailabilityColor(location.availableNow, location.totalContainers)
                          )}
                        >
                          {location.availableNow}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-duke-navy h-2 rounded-full transition-all"
                          style={{
                            width: `${(location.availableNow / location.totalContainers) * 100}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Time Slot */}
          {step === 2 && selectedLocation && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-duke-navy">
                  Select Pickup Time at {selectedLocation.name}
                </h1>
                <div className="w-20" />
              </div>

              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                      <span>Plenty Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
                      <span>Few Left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded" />
                      <span>Almost Full</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
                      <span>Full</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TimeSlotSelector
                locationId={selectedLocation.id}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelect={handleSlotSelect}
              />
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedLocation && selectedSlot && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-duke-navy">
                  Confirm Reservation
                </h1>
                <div className="w-20" />
              </div>

              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-duke-navy" />
                    Reservation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{selectedLocation.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Pickup Zone</span>
                    <Badge variant="secondary">Zone {selectedSlot.zone}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Pickup Time</span>
                    <span className="font-medium">{selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Return By</span>
                    <span className="font-medium">
                      Tomorrow at {selectedSlot.time}
                    </span>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="bg-duke-gray/50 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-600">
                      By confirming, you agree to return the container within 24 hours
                      to any return station. Late returns may affect your ability to
                      book future containers.
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Confirming...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Confirm Reservation
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
