import { Camera, Users, MapPin, FileText, Calendar, Plus } from 'lucide-react'

const quickActions = [
  {
    title: 'New Field Survey',
    description: 'Start data collection',
    icon: Camera,
    href: '/surveys/new',
    color: 'conservation'
  },
  {
    title: 'Schedule Volunteers',
    description: 'Manage team calendar',
    icon: Calendar,
    href: '/volunteers/schedule',
    color: 'blue'
  },
  {
    title: 'Add Survey Site',
    description: 'Map new location',
    icon: MapPin,
    href: '/mapping/add-site',
    color: 'earth'
  },
  {
    title: 'Generate Report',
    description: 'Create impact summary',
    icon: FileText,
    href: '/reports/generate',
    color: 'orange'
  }
]

export default function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Plus className="h-5 w-5 text-conservation-500 mr-2" />
        <h3 className="text-lg font-semibold">Quick Actions</h3>
      </div>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="block p-3 rounded-lg border border-gray-200 hover:border-conservation-300 hover:bg-conservation-50 transition-all group"
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${
                action.color === 'conservation' ? 'bg-conservation-100 text-conservation-600' :
                action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                action.color === 'earth' ? 'bg-earth-100 text-earth-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-conservation-700">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Emergency Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency Actions</h4>
        <div className="space-y-2">
          <button className="w-full p-2 text-left text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
            🚨 Report Wildlife Emergency
          </button>
          <button className="w-full p-2 text-left text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            ⚠️ Log Equipment Issue
          </button>
        </div>
      </div>
    </div>
  )
}
