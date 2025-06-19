import React from 'react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  onMenuClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
            Warehouse Analytics
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.picture || '/default-avatar.png'}
                  alt={user.name || 'User'}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              
              {/* Mobile user info */}
              <div className="sm:hidden flex items-center space-x-2">
                <img
                  className="h-6 w-6 rounded-full"
                  src={user.picture || '/default-avatar.png'}
                  alt={user.name || 'User'}
                />
                <span className="text-sm font-medium text-gray-700 truncate max-w-20">
                  {user.name}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 