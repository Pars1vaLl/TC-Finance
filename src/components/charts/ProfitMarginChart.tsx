import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { WarehouseStats } from '../../services/api'

interface ProfitMarginChartProps {
  warehouses: WarehouseStats[]
  loading?: boolean
}

const ProfitMarginChart: React.FC<ProfitMarginChartProps> = ({ warehouses, loading = false }) => {
  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Margin by Warehouse</h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading chart...</span>
        </div>
      </div>
    )
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Margin by Warehouse</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for this period</p>
        </div>
      </div>
    )
  }

  const data = warehouses.map(warehouse => ({
    name: warehouse.name,
    margin: warehouse.margin,
    emoji: warehouse.emoji
  }))

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Margin by Warehouse</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => {
              const warehouse = data.find(d => d.name === value)
              return warehouse ? `${warehouse.emoji} ${value.substring(0, 8)}...` : value
            }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 11 }}
            width={50}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Profit Margin']}
            labelFormatter={(label) => {
              const warehouse = data.find(d => d.name === label)
              return warehouse ? `${label} ${warehouse.emoji}` : label
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line 
            type="monotone" 
            dataKey="margin" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProfitMarginChart 