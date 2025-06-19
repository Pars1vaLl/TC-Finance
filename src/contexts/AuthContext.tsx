import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/auth'

export interface User {
  id: string
  email: string
  name: string
  picture: string
  role: 'Admin' | 'Clerk' | 'Viewer'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = () => {
      try {
        const storedUser = authService.getStoredUser()
        const token = authService.getStoredToken()
        
        if (storedUser && token) {
          // Convert GoogleUser to our User interface
          const user: User = {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            picture: storedUser.picture,
            role: authService.getUserRole(storedUser.email)
          }
          setUser(user)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear any corrupted data
        authService.logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async () => {
    try {
      setLoading(true)
      await authService.login()
      // The login method will redirect to Google OAuth
      // The callback will be handled by the AuthCallback component
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    authService.logout()
  }



  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { authService } 