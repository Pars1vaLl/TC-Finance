import React from 'react'
import { ReportSummary } from '../../services/api'

interface KPICardsProps {
  summary: ReportSummary
  loading?: boolean
}

const KPICards: React.FC<KPICardsProps> = ({ summary, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card">
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: summary.totalRevenue,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: '💰',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      change: '+8.2%',
      changeType: 'negative' as const,
      icon: '💸',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-600'
    },
    {
      title: 'Gross Profit',
      value: summary.grossProfit,
      change: summary.profitMargin > 0 ? '+15.3%' : '-5.2%',
      changeType: summary.profitMargin > 0 ? 'positive' as const : 'negative' as const,
      icon: '📈',
      color: summary.profitMargin > 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200',
      textColor: summary.profitMargin > 0 ? 'text-blue-600' : 'text-yellow-600'
    },
    {
      title: 'Profit Margin',
      value: summary.profitMargin,
      change: '+2.8%',
      changeType: 'positive' as const,
      icon: '📊',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600',
      isPercentage: true
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`card border-2 ${card.color}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{card.title}</p>
              <p className={`text-lg lg:text-2xl font-bold ${card.textColor} truncate`}>
                {card.isPercentage 
                  ? `${card.value.toFixed(1)}%`
                  : `${card.value.toLocaleString()} TJS`
                }
              </p>
              <p className={`text-xs font-medium ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change} from last month
              </p>
            </div>
            <div className="text-2xl lg:text-3xl ml-2 flex-shrink-0">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default KPICards 