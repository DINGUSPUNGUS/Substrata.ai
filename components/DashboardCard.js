import { memo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

// Memoized component for better performance
const DashboardCard = memo(function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, 
  color = 'conservation' 
}) {
  // Pre-defined classes for better performance (no runtime object creation)
  const getColorClasses = (colorKey) => {
    switch (colorKey) {
      case 'conservation': return 'text-conservation-600 bg-conservation-100'
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'earth': return 'text-earth-600 bg-earth-100'
      case 'orange': return 'text-orange-600 bg-orange-100'
      default: return 'text-conservation-600 bg-conservation-100'
    }
  }

  const getChangeColorClass = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  // Render change indicator only when needed
  const renderChangeIndicator = () => {
    if (!change) return null
    
    return (
      <div className="flex items-center mt-2">
        {changeType === 'positive' && <TrendingUp className="h-4 w-4 mr-1" />}
        {changeType === 'negative' && <TrendingDown className="h-4 w-4 mr-1" />}
        <span className={`text-sm font-medium ${getChangeColorClass(changeType)}`}>
          {change}
        </span>
      </div>
    )
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {renderChangeIndicator()}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
})

export default DashboardCard
