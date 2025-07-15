import { TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardCard({ title, value, icon: Icon, change, changeType, color }) {
  const colorClasses = {
    conservation: 'text-conservation-600 bg-conservation-100',
    blue: 'text-blue-600 bg-blue-100',
    earth: 'text-earth-600 bg-earth-100',
    orange: 'text-orange-600 bg-orange-100',
  }

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
                {change} from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
