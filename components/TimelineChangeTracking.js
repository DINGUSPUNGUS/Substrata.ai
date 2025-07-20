import { useState, useEffect } from 'react'
import { 
  Clock, Calendar, User, Eye, Edit3, Trash2, Database,
  Filter, Search, Download, RefreshCw, AlertCircle, CheckCircle,
  ArrowRight, ArrowLeft, MoreHorizontal, Activity, FileText,
  MapPin, Users, Leaf, Camera, BarChart3, Settings
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function TimelineChangeTracking() {
  const [activities, setActivities] = useState([])
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    user: '',
    entityType: 'all', // 'all', 'survey', 'species', 'site', 'project', 'volunteer'
    actionType: 'all', // 'all', 'create', 'update', 'delete', 'view'
    search: ''
  })
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [timelineView, setTimelineView] = useState('activity') // 'activity', 'changes', 'analytics'

  const entityTypes = [
    { value: 'survey', label: 'Surveys', icon: MapPin, color: 'text-blue-600' },
    { value: 'species', label: 'Species', icon: Leaf, color: 'text-green-600' },
    { value: 'site', label: 'Sites', icon: MapPin, color: 'text-purple-600' },
    { value: 'project', label: 'Projects', icon: FileText, color: 'text-orange-600' },
    { value: 'volunteer', label: 'Volunteers', icon: Users, color: 'text-pink-600' },
    { value: 'report', label: 'Reports', icon: BarChart3, color: 'text-indigo-600' }
  ]

  const actionTypes = [
    { value: 'create', label: 'Created', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'update', label: 'Updated', color: 'bg-blue-100 text-blue-800', icon: Edit3 },
    { value: 'delete', label: 'Deleted', color: 'bg-red-100 text-red-800', icon: Trash2 },
    { value: 'view', label: 'Viewed', color: 'bg-gray-100 text-gray-800', icon: Eye },
    { value: 'export', label: 'Exported', color: 'bg-purple-100 text-purple-800', icon: Download },
    { value: 'import', label: 'Imported', color: 'bg-yellow-100 text-yellow-800', icon: Database }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [activitiesResult, changesResult] = await Promise.all([
        dataManager.read('activity_logs'),
        dataManager.read('change_logs')
      ])

      if (activitiesResult.success) setActivities(activitiesResult.data)
      if (changesResult.success) setChanges(changesResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp)
    const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01')
    const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-12-31')
    
    const dateMatch = activityDate >= startDate && activityDate <= endDate
    const userMatch = !filters.user || activity.user_id === filters.user
    const entityMatch = filters.entityType === 'all' || activity.entity_type === filters.entityType
    const actionMatch = filters.actionType === 'all' || activity.action_type === filters.actionType
    const searchMatch = !filters.search || 
                       activity.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                       activity.entity_name?.toLowerCase().includes(filters.search.toLowerCase())

    return dateMatch && userMatch && entityMatch && actionMatch && searchMatch
  })

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})

  // Get activity statistics
  const getActivityStats = () => {
    const stats = {
      total: filteredActivities.length,
      byType: {},
      byEntity: {},
      byUser: {},
      recentTrend: []
    }

    // Count by action type
    actionTypes.forEach(type => {
      stats.byType[type.value] = filteredActivities.filter(a => a.action_type === type.value).length
    })

    // Count by entity type
    entityTypes.forEach(type => {
      stats.byEntity[type.value] = filteredActivities.filter(a => a.entity_type === type.value).length
    })

    // Count by user
    filteredActivities.forEach(activity => {
      const userId = activity.user_id || 'system'
      stats.byUser[userId] = (stats.byUser[userId] || 0) + 1
    })

    // Recent trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    }).reverse()

    stats.recentTrend = last7Days.map(date => ({
      date,
      count: filteredActivities.filter(a => new Date(a.timestamp).toDateString() === date).length
    }))

    return stats
  }

  // Log activity function (used by other components)
  const logActivity = async (entityType, entityId, entityName, actionType, description, metadata = {}) => {
    try {
      const activityData = {
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        action_type: actionType,
        description,
        metadata,
        user_id: 'current-user-id', // Would come from auth context
        timestamp: new Date().toISOString(),
        ip_address: 'unknown', // Would be captured from request
        user_agent: navigator.userAgent
      }

      const result = await dataManager.create('activity_logs', activityData)
      if (result.success) {
        setActivities(prev => [result.data, ...prev])
      }
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  // Log change function (used when data is modified)
  const logChange = async (entityType, entityId, fieldName, oldValue, newValue, changeType = 'update') => {
    try {
      const changeData = {
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        old_value: oldValue,
        new_value: newValue,
        change_type: changeType,
        user_id: 'current-user-id',
        timestamp: new Date().toISOString()
      }

      const result = await dataManager.create('change_logs', changeData)
      if (result.success) {
        setChanges(prev => [result.data, ...prev])
        
        // Also log as activity
        await logActivity(
          entityType,
          entityId,
          `${entityType} ${entityId}`,
          changeType,
          `Changed ${fieldName} from "${oldValue}" to "${newValue}"`
        )
      }
    } catch (error) {
      console.error('Error logging change:', error)
    }
  }

  // Export timeline data
  const exportTimeline = () => {
    const exportData = {
      activities: filteredActivities,
      changes: changes.filter(change => {
        const changeDate = new Date(change.timestamp)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01')
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-12-31')
        return changeDate >= startDate && changeDate <= endDate
      }),
      filters,
      statistics: getActivityStats(),
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timeline_export_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString()
  }

  const getEntityIcon = (entityType) => {
    const entity = entityTypes.find(e => e.value === entityType)
    return entity ? entity.icon : Activity
  }

  const getActionIcon = (actionType) => {
    const action = actionTypes.find(a => a.value === actionType)
    return action ? action.icon : Activity
  }

  const getActionColor = (actionType) => {
    const action = actionTypes.find(a => a.value === actionType)
    return action ? action.color : 'bg-gray-100 text-gray-800'
  }

  const stats = getActivityStats()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline & Change Tracking</h1>
          <p className="text-gray-600">Monitor system activities and data changes</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={loadData} className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button onClick={exportTimeline} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Creates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.byType.create || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Edit3 className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Updates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.byType.update || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{Object.keys(stats.byUser).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'activity', label: 'Activity Timeline', icon: Clock },
            { id: 'changes', label: 'Change Log', icon: Database },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setTimelineView(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  timelineView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filters.entityType}
              onChange={(e) => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Entities</option>
              {entityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.actionType}
              onChange={(e) => setFilters(prev => ({ ...prev, actionType: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Actions</option>
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredActivities.length} activities
          </div>
        </div>
      </div>

      {/* Activity Timeline View */}
      {timelineView === 'activity' && (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{new Date(date).toLocaleDateString()}</h3>
                <p className="text-sm text-gray-600">{dayActivities.length} activities</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dayActivities.map((activity, index) => {
                    const EntityIcon = getEntityIcon(activity.entity_type)
                    const ActionIcon = getActionIcon(activity.action_type)
                    
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedActivity(activity)
                          setShowDetails(true)
                        }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <EntityIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action_type)}`}>
                              {actionTypes.find(a => a.value === activity.action_type)?.label}
                            </span>
                            <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                          </div>
                          
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {activity.entity_name || `${activity.entity_type} ${activity.entity_id}`}
                          </p>
                          
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              Additional details available
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <MoreHorizontal className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {Object.keys(groupedActivities).length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more activities.</p>
            </div>
          )}
        </div>
      )}

      {/* Change Log View */}
      {timelineView === 'changes' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Change Log</h3>
            <p className="text-sm text-gray-600">Detailed record of all data modifications</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Old Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {changes.slice(0, 50).map((change) => (
                  <tr key={change.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(change.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {change.entity_type} {change.entity_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {change.field_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                      {change.old_value || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {change.new_value || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(change.change_type)}`}>
                        {change.change_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {timelineView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Type</h3>
            <div className="space-y-3">
              {actionTypes.map(type => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <type.icon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{stats.byType[type.value] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Entity</h3>
            <div className="space-y-3">
              {entityTypes.map(type => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <type.icon className={`h-4 w-4 mr-2 ${type.color}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{stats.byEntity[type.value] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {stats.recentTrend.map((day, index) => {
                const maxCount = Math.max(...stats.recentTrend.map(d => d.count))
                const height = maxCount > 0 ? (day.count / maxCount) * 200 : 0
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-blue-500 rounded-t w-full min-h-[4px]"
                      style={{ height: `${height}px` }}
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <div className="text-xs text-gray-900 font-medium">
                      {day.count}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {showDetails && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Entity Type</label>
                <p className="text-lg text-gray-900">{selectedActivity.entity_type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Entity ID</label>
                <p className="text-lg text-gray-900">{selectedActivity.entity_id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(selectedActivity.action_type)}`}>
                  {actionTypes.find(a => a.value === selectedActivity.action_type)?.label}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedActivity.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="text-gray-900">{new Date(selectedActivity.timestamp).toLocaleString()}</p>
              </div>
              
              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Metadata</label>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
