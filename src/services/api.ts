// API service for communicating with Google Apps Script backend

const API_BASE_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL

// Types for API responses
export interface Warehouse {
  id: string
  name: string
  emoji: string
  color: string
}

export interface CostType {
  id: string
  name: string
  is_direct: boolean
}

export interface Transaction {
  id: string
  date: string
  warehouse_id: string
  cost_type_id: string
  is_income: boolean
  amount: number
  currency: string
  amount_tjs: number
}

export interface TransactionCreate {
  date: string
  warehouse_id: string
  cost_type_id: string
  is_income: boolean
  amount: number
  currency: string
}

export interface WarehouseCreate {
  name: string
  emoji: string
  color: string
}

export interface CostTypeCreate {
  name: string
  is_direct: boolean
}

export interface ReportSummary {
  totalRevenue: number
  totalExpenses: number
  grossProfit: number
  profitMargin: number
  transactionCount: number
  warehouseCount: number
}

export interface WarehouseStats {
  id: string
  name: string
  emoji: string
  color: string
  revenue: number
  expenses: number
  profit: number
  margin: number
  transactionCount: number
}

export interface Report {
  month: string
  summary: ReportSummary
  warehouses: WarehouseStats[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

// API client class
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}?path=${endpoint}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get metadata (warehouses and cost types)
  async getMetadata(): Promise<ApiResponse<{ warehouses: Warehouse[]; costTypes: CostType[] }>> {
    return this.request<{ warehouses: Warehouse[]; costTypes: CostType[] }>('meta')
  }

  // Create a new transaction
  async createTransaction(transaction: TransactionCreate): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.request<{ id: string; message: string }>('txn', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  }

  // Create a new warehouse
  async createWarehouse(warehouse: WarehouseCreate): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.request<{ id: string; message: string }>('warehouse', {
      method: 'POST',
      body: JSON.stringify(warehouse),
    })
  }

  // Create a new cost type
  async createCostType(costType: CostTypeCreate): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.request<{ id: string; message: string }>('costType', {
      method: 'POST',
      body: JSON.stringify(costType),
    })
  }

  // Get report for a specific month
  async getReport(month: string): Promise<ApiResponse<Report>> {
    return this.request<Report>(`report&month=${month}`)
  }

  // Get snapshot data for a specific month
  async getSnapshot(month: string): Promise<ApiResponse<{ transactions: Transaction[] }>> {
    return this.request<{ transactions: Transaction[] }>(`snapshot&month=${month}`)
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL || '')

// Convenience functions for common API calls
export const api = {
  // Metadata
  getMetadata: () => apiClient.getMetadata(),
  
  // Transactions
  createTransaction: (transaction: TransactionCreate) => apiClient.createTransaction(transaction),
  
  // Warehouses
  createWarehouse: (warehouse: WarehouseCreate) => apiClient.createWarehouse(warehouse),
  
  // Cost Types
  createCostType: (costType: CostTypeCreate) => apiClient.createCostType(costType),
  
  // Reports
  getReport: (month: string) => apiClient.getReport(month),
  getSnapshot: (month: string) => apiClient.getSnapshot(month),
}

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'TJS'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const getCurrentMonth = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const getMonthName = (month: string): string => {
  const [year, monthNum] = month.split('-')
  const date = new Date(parseInt(year), parseInt(monthNum) - 1)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
} 