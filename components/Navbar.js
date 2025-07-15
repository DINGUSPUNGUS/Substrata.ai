import { useState } from 'react'
import { Bell, Search, User, ChevronDown, MapPin, Wifi, WifiOff } from 'lucide-react'

export default function Navbar() {
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState(2)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const currentLocation = "Yellowstone National Park"
  const lastSync = "2 min ago"

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-40 top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Search and Location */}
          <div className="flex items-center flex-1">
            <div className="flex items-center ml-64"> {/* Offset for sidebar */}
              {/* Search Bar */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search surveys, donors, projects..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-conservation-500 focus:border-transparent"
                />
              </div>

              {/* Current Location */}
              <div className="ml-6 flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Right side - Status, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Sync Status */}
            <div className="flex items-center text-sm">
              {isOnline ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span>Synced {lastSync}</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span>Offline</span>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-conservation-500 rounded-md">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center p-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-conservation-500 rounded-md"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-conservation-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-conservation-600" />
                  </div>
                  <div className="ml-2 text-left hidden sm:block">
                    <div className="text-sm font-medium">Dr. Jane Smith</div>
                    <div className="text-xs text-gray-500">Field Coordinator</div>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Dr. Jane Smith</div>
                    <div className="text-sm text-gray-500">jane.smith@conservation.org</div>
                  </div>
                  <div className="py-1">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a href="/organization" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Organization
                    </a>
                    <div className="border-t border-gray-100">
                      <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}