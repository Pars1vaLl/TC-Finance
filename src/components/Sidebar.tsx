import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊', roles: ['Admin', 'Clerk', 'Viewer'] },
    { name: 'New Transaction', href: '/transaction', icon: '➕', roles: ['Admin', 'Clerk'] },
    { name: 'Reference Data', href: '/reference', icon: '📋', roles: ['Admin'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-gray-900">WPA</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500">
              Logged in as: {user?.role || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <h2 className="text-lg font-semibold text-gray-900">WPA</h2>
          </div>
          <div className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500">
              Logged in as: {user?.role || 'Unknown'}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Sidebar 