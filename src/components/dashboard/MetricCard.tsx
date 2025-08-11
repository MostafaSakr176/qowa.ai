import React from 'react'
import Card from '../ui/marketing/animated-card'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className = ''
}: MetricCardProps) {
  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <Card className={className}>
      <div className="flex items-center">
        {icon && (
          <div className="p-2 bg-blue-100 rounded-lg mr-4">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColorClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
} 