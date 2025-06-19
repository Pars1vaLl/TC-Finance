import React, { useState } from 'react'
import { useMetadata } from '../hooks/useMetadata'
import { api, WarehouseCreate, CostTypeCreate } from '../services/api'
import toast from 'react-hot-toast'

type TabType = 'warehouses' | 'costTypes'

const ReferenceDataPage: React.FC = () => {
  const { warehouses, costTypes, loading, error, refetch } = useMetadata()
  const [activeTab, setActiveTab] = useState<TabType>('warehouses')
  const [showWarehouseForm, setShowWarehouseForm] = useState(false)
  const [showCostTypeForm, setShowCostTypeForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Warehouse form state
  const [warehouseForm, setWarehouseForm] = useState<WarehouseCreate>({
    name: '',
    emoji: '🏢',
    color: '#3B82F6'
  })

  // Cost type form state
  const [costTypeForm, setCostTypeForm] = useState<CostTypeCreate>({
    name: '',
    is_direct: true
  })

  const handleWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!warehouseForm.name.trim()) {
      toast.error('Warehouse name is required')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.createWarehouse(warehouseForm)
      
      if (response.error) {
        toast.error(response.error)
        return
      }
      
      toast.success('Warehouse created successfully!')
      setShowWarehouseForm(false)
      setWarehouseForm({ name: '', emoji: '🏢', color: '#3B82F6' })
      refetch()
    } catch (error) {
      toast.error('Failed to create warehouse')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCostTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!costTypeForm.name.trim()) {
      toast.error('Cost type name is required')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.createCostType(costTypeForm)
      
      if (response.error) {
        toast.error(response.error)
        return
      }
      
      toast.success('Cost type created successfully!')
      setShowCostTypeForm(false)
      setCostTypeForm({ name: '', is_direct: true })
      refetch()
    } catch (error) {
      toast.error('Failed to create cost type')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (activeTab === 'warehouses') {
      setWarehouseForm(prev => ({ ...prev, [field]: value }))
    } else {
      setCostTypeForm(prev => ({ ...prev, [field]: value }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reference Data</h1>
          <p className="text-gray-600">Manage warehouses and cost types</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reference Data</h1>
          <p className="text-gray-600">Manage warehouses and cost types</p>
        </div>
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading data: {error}</p>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reference Data</h1>
        <p className="text-gray-600">Manage warehouses and cost types</p>
      </div>
      
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'warehouses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('warehouses')}
            >
              Warehouses ({warehouses.length})
            </button>
            <button 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'costTypes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('costTypes')}
            >
              Cost Types ({costTypes.length})
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'warehouses' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Warehouses</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowWarehouseForm(true)}
                >
                  Add Warehouse
                </button>
              </div>
              
              {warehouses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {warehouses.map(warehouse => (
                    <div key={warehouse.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{warehouse.emoji}</span>
                          <span className="font-medium">{warehouse.name}</span>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: warehouse.color }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {warehouse.id.substring(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No warehouses found. Add your first warehouse to get started.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'costTypes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Cost Types</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCostTypeForm(true)}
                >
                  Add Cost Type
                </button>
              </div>
              
              {costTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {costTypes.map(costType => (
                    <div key={costType.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{costType.name}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          costType.is_direct 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {costType.is_direct ? 'Direct' : 'Indirect'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {costType.id.substring(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No cost types found. Add your first cost type to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Warehouse Form Modal */}
      {showWarehouseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Warehouse</h3>
            <form onSubmit={handleWarehouseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  className="input mt-1"
                  value={warehouseForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter warehouse name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Emoji</label>
                <input
                  type="text"
                  className="input mt-1"
                  value={warehouseForm.emoji}
                  onChange={(e) => handleInputChange('emoji', e.target.value)}
                  placeholder="🏢"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  className="input mt-1 h-10"
                  value={warehouseForm.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWarehouseForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Warehouse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cost Type Form Modal */}
      {showCostTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Cost Type</h3>
            <form onSubmit={handleCostTypeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  className="input mt-1"
                  value={costTypeForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter cost type name"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    checked={costTypeForm.is_direct}
                    onChange={(e) => handleInputChange('is_direct', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Direct cost (vs indirect cost)</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCostTypeForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Cost Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferenceDataPage 