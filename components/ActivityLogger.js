import React, { useState, useEffect } from 'react'
import { 
  Activity, Clock, User, Database, Shield, Eye,
  Search, Filter, Download, AlertTriangle, CheckCircle,
  Info, Calendar, MapPin, Mail, FileText, Users,
  Settings, Trash2, Edit, Plus, TrendingUp, BarChart3
} from 'lucide-react'

// Complete Activity Logging & Audit Trail System
export default function ActivityLogger() {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [filters, setFilters] = useState({
    dateRange: 'all',
    category: 'all',
    user: 'all',
    action: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [analytics, setAnalytics] = useState({})

  // Initialize activity data
  useEffect(() => {
    const activityData = [
      {
        id: 1,
        timestamp: '2025-07-25 09:30:15',
        user: 'Dr. Sarah Johnson',
        userRole: 'Administrator',
        action: 'USER_CREATED',
        category: 'user_management',
        description: 'Created new user account for Mike Chen',
        details: {
          targetUser: 'Mike Chen',
          role: 'Field Researcher',
          permissions: ['surveys', 'mapping', 'reports']
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        success: true
      },
      {
        id: 2,
        timestamp: '2025-07-25 08:45:22',
        user: 'Emma Rodriguez',
        userRole: 'Data Analyst',
        action: 'DATA_EXPORT',
        category: 'data_access',
        description: 'Exported biodiversity report data',
        details: {
          exportType: 'CSV',
          recordCount: 1247,
          dateRange: '2024-01-01 to 2025-07-25',
          fileName: 'biodiversity_report_2025-07-25.csv'
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        success: true
      },
      {
        id: 3,
        timestamp: '2025-07-24 16:20:33',
        user: 'Mike Chen',
        userRole: 'Field Researcher',
        action: 'SURVEY_CREATED',
        category: 'data_collection',
        description: 'Created new wildlife survey for Yellowstone Research Area',
        details: {
          surveyName: 'Yellowstone Wildlife Count Q3 2025',
          location: 'Yellowstone Research Area',
          coordinates: { lat: 44.428, lng: -110.588 },
          speciesTargeted: ['Grizzly Bear', 'Wolf', 'Elk']
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        severity: 'low',
        success: true
      },
      {
        id: 4,
        timestamp: '2025-07-24 14:15:44',
        user: 'Dr. Sarah Johnson',
        userRole: 'Administrator',
        action: 'PERMISSION_MODIFIED',
        category: 'security',
        description: 'Updated volunteer coordinator permissions',
        details: {
          targetUser: 'James Wilson',
          oldPermissions: ['volunteers', 'events'],
          newPermissions: ['volunteers', 'events', 'communication'],
          reason: 'Added communication access for outreach campaigns'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'high',
        success: true
      },
      {
        id: 5,
        timestamp: '2025-07-24 11:30:12',
        user: 'Emma Rodriguez',
        userRole: 'Data Analyst',
        action: 'REPORT_GENERATED',
        category: 'analytics',
        description: 'Generated conservation impact analysis report',
        details: {
          reportType: 'Conservation Impact Analysis',
          timeframe: 'Q2 2025',
          sites: ['Yellowstone Research Area', 'Coastal Wetland Zone'],
          metrics: ['biodiversity', 'habitat_health', 'conservation_score']
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        success: true
      },
      {
        id: 6,
        timestamp: '2025-07-24 10:45:18',
        user: 'Anonymous',
        userRole: 'Unknown',
        action: 'LOGIN_FAILED',
        category: 'security',
        description: 'Failed login attempt with invalid credentials',
        details: {
          attemptedEmail: 'admin@suspicious.com',
          failureReason: 'Invalid credentials',
          attemptCount: 3
        },
        ipAddress: '203.0.113.42',
        userAgent: 'curl/7.68.0',
        severity: 'high',
        success: false
      },
      {
        id: 7,
        timestamp: '2025-07-23 15:22:55',
        user: 'James Wilson',
        userRole: 'Volunteer Coordinator',
        action: 'EMAIL_SENT',
        category: 'communication',
        description: 'Sent volunteer recruitment email campaign',
        details: {
          campaignName: 'Summer Volunteer Drive 2025',
          recipientCount: 156,
          emailType: 'recruitment',
          openRate: 68.2,
          clickRate: 12.5
        },
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'low',
        success: true
      },
      {
        id: 8,
        timestamp: '2025-07-23 13:45:30',
        user: 'Mike Chen',
        userRole: 'Field Researcher',
        action: 'SITE_UPDATED',
        category: 'data_collection',
        description: 'Updated GPS boundaries for Mountain Forest Preserve',
        details: {
          siteName: 'Mountain Forest Preserve',
          oldArea: 1180,
          newArea: 1200,
          boundaryPoints: 8,
          reason: 'Survey revealed additional protected habitat'
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        severity: 'medium',
        success: true
      }
    ]

    setActivities(activityData)
    setFilteredActivities(activityData)

    // Calculate analytics
    setAnalytics({
      totalActivities: activityData.length,
      todayActivities: activityData.filter(a => a.timestamp.startsWith('2025-07-25')).length,
      failedActions: activityData.filter(a => !a.success).length,
      highSeverity: activityData.filter(a => a.severity === 'high').length,
      topUser: 'Dr. Sarah Johnson',
      topCategory: 'data_collection'
    })
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = activities

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(activity => activity.category === filters.category)
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter(activity => activity.user === filters.user)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      let startDate = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= startDate
      })
    }

    setFilteredActivities(filtered)
  }, [activities, filters, searchTerm])

  const categories = [
    { id: 'user_management', name: 'User Management', icon: Users, color: 'blue' },
    { id: 'data_collection', name: 'Data Collection', icon: Database, color: 'green' },
    { id: 'security', name: 'Security', icon: Shield, color: 'red' },
    { id: 'data_access', name: 'Data Access', icon: Eye, color: 'purple' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'yellow' },
    { id: 'communication', name: 'Communication', icon: Mail, color: 'indigo' }
  ]

  const severityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  }

  const actionIcons = {
    USER_CREATED: Users,
    DATA_EXPORT: Download,
    SURVEY_CREATED: MapPin,
    PERMISSION_MODIFIED: Shield,
    REPORT_GENERATED: FileText,
    LOGIN_FAILED: AlertTriangle,
    EMAIL_SENT: Mail,
    SITE_UPDATED: Edit,
    default: Activity
  }

  const getActionIcon = (action) => {
    return actionIcons[action] || actionIcons.default
  }

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.color : 'gray'
  }

  const exportActivities = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Category', 'Description', 'Success', 'IP Address'],
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.user,
        activity.action,
        activity.category,
        activity.description,
        activity.success ? 'Yes' : 'No',
        activity.ipAddress
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity_log_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const uniqueUsers = [...new Set(activities.map(a => a.user))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">📊 Activity Logger & Audit Trail</h2>
              <p className="text-gray-600">Complete system activity monitoring and audit trail</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportActivities}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{analytics.totalActivities}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{analytics.todayActivities}</div>
            <div className="text-sm text-gray-600">Today's Activities</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{analytics.failedActions}</div>
            <div className="text-sm text-gray-600">Failed Actions</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{analytics.highSeverity}</div>
            <div className="text-sm text-gray-600">High Severity</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600">Top User</div>
            <div className="font-bold text-purple-600 truncate">{analytics.topUser}</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="text-sm text-gray-600">Top Category</div>
            <div className="font-bold text-indigo-600">{analytics.topCategory?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities, users, or actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.user}
              onChange={(e) => setFilters({...filters, user: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            <button
              onClick={() => setFilters({dateRange: 'all', category: 'all', user: 'all', action: 'all'})}
              className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Activity Log</h3>
            <span className="text-sm text-gray-600">
              Showing {filteredActivities.length} of {activities.length} activities
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredActivities.map(activity => {
            const ActionIcon = getActionIcon(activity.action)
            return (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 bg-${getCategoryColor(activity.category)}-100 rounded-lg flex-shrink-0`}>
                    <ActionIcon className={`h-4 w-4 text-${getCategoryColor(activity.category)}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </span>
                        <span className="text-sm text-gray-500">
                          {activity.action.replace('_', ' ').toLowerCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${severityColors[activity.severity]}`}>
                          {activity.severity}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        {activity.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>IP: {activity.ipAddress}</span>
                      <span>Role: {activity.userRole}</span>
                      <span className={`px-2 py-1 rounded bg-${getCategoryColor(activity.category)}-100 text-${getCategoryColor(activity.category)}-800`}>
                        {activity.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Activity Details</h3>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{selectedActivity.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User</label>
                  <p className="text-sm text-gray-900">{selectedActivity.user} ({selectedActivity.userRole})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <p className="text-sm text-gray-900">{selectedActivity.action.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedActivity.category.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedActivity.description}</p>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm text-gray-900">{selectedActivity.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center space-x-2">
                    {selectedActivity.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900">
                      {selectedActivity.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              {selectedActivity.details && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Details</label>
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      {JSON.stringify(selectedActivity.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* User Agent */}
              <div>
                <label className="text-sm font-medium text-gray-700">User Agent</label>
                <p className="text-xs text-gray-600 mt-1 break-all">{selectedActivity.userAgent}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
