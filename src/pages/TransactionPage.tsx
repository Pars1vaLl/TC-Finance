import React, { useState } from 'react'
import { useMetadata } from '../hooks/useMetadata'
import { api, TransactionCreate } from '../services/api'
import toast from 'react-hot-toast'

const TransactionPage: React.FC = () => {
  const { warehouses, costTypes, loading: metadataLoading, error: metadataError } = useMetadata()
  
  const [formData, setFormData] = useState<TransactionCreate>({
    date: new Date().toISOString().split('T')[0],
    warehouse_id: '',
    cost_type_id: '',
    is_income: false,
    amount: 0,
    currency: 'TJS'
  })
  
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.warehouse_id || !formData.cost_type_id || formData.amount <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.createTransaction(formData)
      
      if (response.error) {
        toast.error(response.error)
        return
      }
      
      toast.success('Transaction created successfully!')
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        warehouse_id: '',
        cost_type_id: '',
        is_income: false,
        amount: 0,
        currency: 'TJS'
      })
    } catch (error) {
      toast.error('Failed to create transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TransactionCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (metadataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Transaction</h1>
            <p className="text-gray-600">Add a new income or expense transaction</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600 text-lg">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (metadataError) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Transaction</h1>
            <p className="text-gray-600">Add a new income or expense transaction</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 text-lg mb-6">Error loading data: {metadataError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 text-white rounded-xl py-4 px-6 text-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Transaction</h1>
          <p className="text-gray-600">Add a new income or expense transaction</p>
        </div>
        
        {/* Transaction Type Toggle */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-2xl p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                  !formData.is_income 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleInputChange('is_income', false)}
              >
                💸 Expense
              </button>
              <button
                type="button"
                className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                  formData.is_income 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleInputChange('is_income', true)}
              >
                💰 Income
              </button>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Amount Section */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amount *
              </label>
              <div className="flex">
                <select 
                  className="flex-shrink-0 bg-gray-50 border border-gray-300 rounded-l-xl px-4 py-4 text-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="TJS">TJS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <input 
                  type="number" 
                  className="flex-1 border border-l-0 border-gray-300 rounded-r-xl px-4 py-4 text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            {/* Warehouse Section */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Warehouse *
              </label>
              <select 
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.warehouse_id}
                onChange={(e) => handleInputChange('warehouse_id', e.target.value)}
                required
              >
                <option value="">Choose warehouse...</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.emoji} {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Cost Type Section */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type *
              </label>
              <select 
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.cost_type_id}
                onChange={(e) => handleInputChange('cost_type_id', e.target.value)}
                required
              >
                <option value="">Choose transaction type...</option>
                {costTypes.map(costType => (
                  <option key={costType.id} value={costType.id}>
                    {costType.name} {costType.is_direct ? '(Direct)' : '(Indirect)'}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Section */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date
              </label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
          </form>
        </div>
        
        {/* Save Button */}
        <div className="mt-8">
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-primary-600 text-white rounded-2xl py-5 px-6 text-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Saving Transaction...
              </div>
            ) : (
              `Save ${formData.is_income ? 'Income' : 'Expense'} Transaction`
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All fields marked with * are required
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionPage 