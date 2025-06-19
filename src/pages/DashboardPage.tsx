import React, { useState } from 'react'
import { useReport } from '../hooks/useReport'
import { getCurrentMonth, getMonthName } from '../services/api'
import KPICards from '../components/charts/KPICards'
import RevenueProfitChart from '../components/charts/RevenueProfitChart'
import ProfitMarginChart from '../components/charts/ProfitMarginChart'
import WarehousePerformanceChart from '../components/charts/WarehousePerformanceChart'

const DashboardPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all')
  const { report, loading, error, refetch } = useReport(selectedMonth)

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value)
  }

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWarehouse(e.target.value)
  }

  const filteredWarehouses = selectedWarehouse === 'all' 
    ? report?.warehouses || []
    : report?.warehouses?.filter(w => w.id === selectedWarehouse) || []

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Warehouse profit analytics overview</p>
        </div>
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading dashboard: {error}</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Warehouse profit analytics overview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="input"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date()
                date.setMonth(date.getMonth() - i)
                const month = date.toISOString().slice(0, 7)
                return (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse
            </label>
            <select
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              className="input"
            >
              <option value="all">All Warehouses</option>
              {report?.warehouses?.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} {warehouse.emoji}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {report?.summary && (
        <KPICards summary={report.summary} loading={loading} />
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueProfitChart 
          warehouses={filteredWarehouses} 
          loading={loading} 
        />
        <ProfitMarginChart 
          warehouses={filteredWarehouses} 
          loading={loading} 
        />
      </div>

      {/* Full Width Chart */}
      <div className="grid grid-cols-1 gap-6">
        <WarehousePerformanceChart 
          warehouses={filteredWarehouses} 
          loading={loading} 
        />
      </div>

      {/* Warehouse Details Table */}
      {report?.warehouses && report.warehouses.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.warehouses.map(warehouse => (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{warehouse.emoji}</span>
                        <span className="font-medium text-gray-900">{warehouse.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouse.revenue.toLocaleString()} TJS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouse.expenses.toLocaleString()} TJS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        warehouse.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {warehouse.profit >= 0 ? '+' : ''}{warehouse.profit.toLocaleString()} TJS
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        warehouse.margin >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {warehouse.margin >= 0 ? '+' : ''}{warehouse.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouse.transactionCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage 