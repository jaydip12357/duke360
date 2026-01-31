'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, MapPin, Package, AlertTriangle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface ContainerCardProps {
  checkout: {
    id: string
    containerId?: string | null
    pickupLocation: string
    pickupZone: string
    pickupTimeSlot: string | Date
    expectedReturnDate: string | Date
    actualPickupTime?: string | Date | null
    status: string
  }
  showQR?: boolean
  onCancel?: () => void
}

export function ContainerCard({ checkout, showQR = true, onCancel }: ContainerCardProps) {
  const pickupTime = new Date(checkout.pickupTimeSlot)
  const returnTime = new Date(checkout.expectedReturnDate)
  const now = new Date()
  const isOverdue = checkout.status === 'picked_up' && now > returnTime
  const hoursLeft = Math.max(0, Math.floor((returnTime.getTime() - now.getTime()) / (1000 * 60 * 60)))

  const getStatusBadge = () => {
    switch (checkout.status) {
      case 'reserved':
        return <Badge variant="secondary">Reserved</Badge>
      case 'picked_up':
        return isOverdue ? (
          <Badge variant="destructive">Overdue</Badge>
        ) : (
          <Badge variant="success">In Use</Badge>
        )
      case 'returned':
        return <Badge variant="default">Returned</Badge>
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge>{checkout.status}</Badge>
    }
  }

  return (
    <Card className={isOverdue ? 'border-red-500 border-2' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-duke-navy" />
            {checkout.containerId || 'Container Pending'}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Pickup Location
            </p>
            <p className="font-medium">{checkout.pickupLocation} - Zone {checkout.pickupZone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {checkout.status === 'reserved' ? 'Pickup Time' : 'Due By'}
            </p>
            <p className="font-medium">
              {checkout.status === 'reserved'
                ? formatDateTime(pickupTime)
                : formatDateTime(returnTime)}
            </p>
          </div>
        </div>

        {checkout.status === 'picked_up' && (
          <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-50' : 'bg-duke-gray'}`}>
            {isOverdue ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Container overdue! Please return ASAP.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-duke-navy" />
                <span className="font-medium">{hoursLeft} hours remaining to return</span>
              </div>
            )}
          </div>
        )}

        {showQR && checkout.status === 'reserved' && (
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg border">
            <QRCodeSVG
              value={JSON.stringify({
                checkoutId: checkout.id,
                location: checkout.pickupLocation,
                zone: checkout.pickupZone,
                time: checkout.pickupTimeSlot,
              })}
              size={150}
              level="M"
              includeMargin
            />
            <p className="text-sm text-muted-foreground">Show this QR code at pickup</p>
          </div>
        )}

        {checkout.status === 'reserved' && onCancel && (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel Reservation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
