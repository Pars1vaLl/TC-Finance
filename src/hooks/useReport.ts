import { useState, useEffect } from 'react'
import { api, Report, getCurrentMonth } from '../services/api'

interface UseReportReturn {
  report: Report | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setMonth: (month: string) => void
  currentMonth: string
}

export const useReport = (initialMonth?: string): UseReportReturn => {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(initialMonth || getCurrentMonth())

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.getReport(currentMonth)
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      if (response.data) {
        setReport(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [currentMonth])

  const setMonth = (month: string) => {
    setCurrentMonth(month)
  }

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
    setMonth,
    currentMonth,
  }
} 