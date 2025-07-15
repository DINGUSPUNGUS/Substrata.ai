import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  LayoutDashboard, 
  Camera, 
  Map, 
  Users, 
  FileText, 
  Calendar,
  DollarSign,
  Settings,
  HelpCircle,
  Leaf,
  BarChart3,
  MapPin,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: false },
  { name: 'Field Surveys', href: '/surveys', icon: Camera, current: false, badge: '3' },
  { name: 'GIS Mapping', href: '/mapping', icon: Map, current: false },
  { name: 'Donor Management', href: '/donors', icon: Users, current: false },
  { name: 'Grant Tracker', href: '/grants', icon: DollarSign, current: false },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3, current: false },
  { name: 'Volunteer Scheduler', href: '/volunteers', icon: Calendar, current: false },
  { name: 'Project Management', href: '/projects', icon: MapPin, current: false },
  { name: 'Compliance Logs', href: '/compliance', icon: FileText, current: false },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

export default function Sidebar() {
  const router = useRouter()
  
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Leaf className="h-8 w-8 text-conservation-600" />
          </div>
          <div className="ml-2">
            <span className="text-xl font-bold text-gray-900">Substrata</span>
            <span className="text-xs text-conservation-600 block">Conservation Hub</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full btn-primary text-sm py-2">
          + New Survey
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 mt-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-conservation-100 text-conservation-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-conservation-500' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-conservation-100 text-conservation-600 py-0.5 px-2 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Impact Summary */}
      <div className="mx-4 mt-6 p-4 bg-conservation-50 rounded-lg">
        <div className="flex items-center mb-2">
          <BarChart3 className="h-4 w-4 text-conservation-600 mr-2" />
          <span className="text-sm font-medium text-conservation-900">Monthly Impact</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Species Monitored</span>
            <span className="font-medium text-conservation-700">42</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Surveys Completed</span>
            <span className="font-medium text-conservation-700">156</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Habitat Protected</span>
            <span className="font-medium text-conservation-700">2.4k ha</span>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="px-4 mt-6 border-t border-gray-200 pt-4">
        <ul className="space-y-1">
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Notification Bell */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Bell className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-900">2 New Alerts</span>
          </div>
          <button className="text-blue-600 text-xs hover:text-blue-800">
            View
          </button>
        </div>
      </div>
    </aside>
  )
}