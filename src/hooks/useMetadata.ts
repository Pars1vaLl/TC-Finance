import { useState, useEffect } from 'react'
import { api, Warehouse, CostType } from '../services/api'

// interface Metadata {
//   warehouses: Warehouse[]
//   costTypes: CostType[]
// }

interface UseMetadataReturn {
  warehouses: Warehouse[]
  costTypes: CostType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useMetadata = (): UseMetadataReturn => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [costTypes, setCostTypes] = useState<CostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.getMetadata()
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        setWarehouses(response.data.warehouses)
        setCostTypes(response.data.costTypes)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetadata()
  }, [])

  return {
    warehouses,
    costTypes,
    loading,
    error,
    refetch: fetchMetadata,
  }
} 