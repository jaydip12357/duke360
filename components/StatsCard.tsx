'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  delay?: number
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-duke-navy mt-1">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
              {trend && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}% from last week
                </p>
              )}
            </div>
            {icon && (
              <div className="text-duke-blue opacity-80">{icon}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
