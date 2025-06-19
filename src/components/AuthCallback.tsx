import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setError(`Authentication failed: ${error}`)
          toast.error('Authentication failed')
          setTimeout(() => navigate('/login'), 3000)
          return
        }

        if (!code) {
          setError('No authorization code received')
          toast.error('No authorization code received')
          setTimeout(() => navigate('/login'), 3000)
          return
        }

        // Handle the OAuth callback
        await authService.handleCallback(code)
        
        toast.success('Successfully logged in!')
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('Failed to complete authentication')
        toast.error('Failed to complete authentication')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Completing Login</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we complete your authentication...</p>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback 