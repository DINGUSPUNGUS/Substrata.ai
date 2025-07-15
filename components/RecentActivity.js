import { Activity, Clock, MapPin, Camera } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'survey',
    title: 'Wildlife Survey Completed',
    description: 'Spotted 12 species at River Valley site',
    user: 'Dr. Sarah Johnson',
    time: '2 hours ago',
    icon: Camera,
    color: 'conservation'
  },
  {
    id: 2,
    type: 'donor',
    title: 'New Major Donor Added',
    description: 'Green Earth Foundation - $50,000 pledge',
    user: 'Mike Chen',
    time: '4 hours ago',
    icon: Activity,
    color: 'blue'
  },
  {
    id: 3,
    type: 'location',
    title: 'Survey Site Updated',
    description: 'GPS coordinates verified for Mountain Ridge',
    user: 'Alex Rivera',
    time: '6 hours ago',
    icon: MapPin,
    color: 'earth'
  },
  {
    id: 4,
    type: 'report',
    title: 'Monthly Report Generated',
    description: 'Impact assessment for November 2024',
    user: 'System',
    time: '8 hours ago',
    icon: Activity,
    color: 'orange'
  }
]

export default function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${
              activity.color === 'conservation' ? 'bg-conservation-100 text-conservation-600' :
              activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              activity.color === 'earth' ? 'bg-earth-100 text-earth-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              <activity.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                by {activity.user}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="/activity"
          className="block text-center text-sm text-conservation-600 hover:text-conservation-700 font-medium"
        >
          View all activity
        </a>
      </div>
    </div>
  )
}
