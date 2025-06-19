import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { WarehouseStats } from '../../services/api'

interface WarehousePerformanceChartProps {
  warehouses: WarehouseStats[]
  loading?: boolean
}

const WarehousePerformanceChart: React.FC<WarehousePerformanceChartProps> = ({ warehouses, loading = false }) => {
  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Performance Distribution</h3>
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Performance Distribution</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for this period</p>
        </div>
      </div>
    )
  }

  // Filter warehouses with positive revenue
  const data = warehouses
    .filter(warehouse => warehouse.revenue > 0)
    .map(warehouse => ({
      name: warehouse.name,
      value: warehouse.revenue,
      profit: warehouse.profit,
      margin: warehouse.margin,
      emoji: warehouse.emoji,
      color: warehouse.color
    }))

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Performance Distribution</h3>
        <div className="text-center py-12">
          <p className="text-gray-500">No revenue data available for this period</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Performance Distribution</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name.substring(0, 6)}... ${(percent * 100).toFixed(0)}%`}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, _name: string, props: any) => [
              `${value.toLocaleString()} TJS`, 
              `${props.payload.name} ${props.payload.emoji}`
            ]}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            formatter={(_value, entry: any) => (
              <span style={{ color: entry.color }}>
                {entry.payload.name.substring(0, 8)}... {entry.payload.emoji}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WarehousePerformanceChart 