import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
}

export function StatsCard({ label, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-granit">{label}</p>
          <p className="text-2xl font-bold mt-1 text-bleu-baie dark:text-blanc-ecume">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'text-xs mt-1',
                trend.value >= 0 ? 'text-green-600' : 'text-red-500'
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-cognac/10 dark:bg-cognac/20">
          <Icon className="w-5 h-5 text-cognac" />
        </div>
      </div>
    </div>
  )
}
