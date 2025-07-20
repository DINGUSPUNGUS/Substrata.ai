import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, 
  MapPin, Calendar, AlertTriangle, CheckCircle, Clock
} from 'lucide-react'

// Sample analytics data
const conservationMetrics = [
  { month: 'Jan', surveys: 12, volunteers: 45, funding: 85000 },
  { month: 'Feb', surveys: 15, volunteers: 52, funding: 92000 },
  { month: 'Mar', surveys: 18, volunteers: 61, funding: 78000 },
  { month: 'Apr', surveys: 22, volunteers: 58, funding: 105000 },
  { month: 'May', surveys: 25, volunteers: 67, funding: 118000 },
  { month: 'Jun', surveys: 28, volunteers: 73, funding: 132000 }
]

const threatLevelData = [
  { name: 'Low Risk', value: 35, color: '#10B981' },
  { name: 'Medium Risk', value: 45, color: '#F59E0B' },
  { name: 'High Risk', value: 15, color: '#EF4444' },
  { name: 'Critical', value: 5, color: '#DC2626' }
]

const projectStatusData = [
  { status: 'Completed', count: 24, color: '#10B981' },
  { status: 'In Progress', count: 18, color: '#3B82F6' },
  { status: 'Planning', count: 12, color: '#F59E0B' },
  { status: 'On Hold', count: 6, color: '#6B7280' }
]

const speciesData = [
  { category: 'Mammals', count: 245, endangered: 23 },
  { category: 'Birds', count: 412, endangered: 34 },
  { category: 'Fish', count: 189, endangered: 19 },
  { category: 'Reptiles', count: 167, endangered: 28 },
  { category: 'Amphibians', count: 98, endangered: 15 },
  { category: 'Insects', count: 1203, endangered: 67 }
]

export default function AdvancedAnalyticsDashboard({ type = 'overview' }) {
  const [selectedMetric, setSelectedMetric] = useState('surveys')
  const [timeRange, setTimeRange] = useState('6months')
  const [isLoading, setIsLoading] = useState(false)

  const calculateTrend = (data, metric) => {
    if (data.length < 2) return 0
    const latest = data[data.length - 1][metric]
    const previous = data[data.length - 2][metric]
    return ((latest - previous) / previous * 100).toFixed(1)
  }

  const getTotalValue = (data, metric) => {
    return data.reduce((sum, item) => sum + item[metric], 0)
  }

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Surveys</p>
              <p className="text-3xl font-bold text-gray-900">{getTotalValue(conservationMetrics, 'surveys')}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{calculateTrend(conservationMetrics, 'surveys')}%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
              <p className="text-3xl font-bold text-gray-900">{conservationMetrics[conservationMetrics.length - 1]?.volunteers || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{calculateTrend(conservationMetrics, 'volunteers')}%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Funding</p>
              <p className="text-3xl font-bold text-gray-900">${(getTotalValue(conservationMetrics, 'funding') / 1000).toFixed(0)}K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{calculateTrend(conservationMetrics, 'funding')}%</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conservation Score</p>
              <p className="text-3xl font-bold text-gray-900">8.4</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2.1%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conservation Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conservation Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="surveys">Surveys</option>
              <option value="volunteers">Volunteers</option>
              <option value="funding">Funding</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conservationMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => selectedMetric === 'funding' ? `$${value.toLocaleString()}` : value} />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Level Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatLevelData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {threatLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Species Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Species Conservation Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={speciesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Total Species" />
            <Bar dataKey="endangered" fill="#EF4444" name="Endangered" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderProjectDashboard = () => (
    <div className="space-y-6">
      {/* Project Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStatusData.map((status, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{status.status}</p>
                <p className="text-2xl font-bold text-gray-900">{status.count}</p>
              </div>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: status.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {[
            { name: 'Amazon Reforestation', progress: 75, deadline: '2024-12-31', status: 'On Track' },
            { name: 'Marine Sanctuary Expansion', progress: 60, deadline: '2025-03-15', status: 'At Risk' },
            { name: 'Wildlife Corridor Development', progress: 90, deadline: '2024-11-30', status: 'Ahead' },
            { name: 'Community Education Program', progress: 45, deadline: '2025-06-30', status: 'On Track' }
          ].map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <div className="flex items-center space-x-2">
                  {project.status === 'On Track' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {project.status === 'At Risk' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {project.status === 'Ahead' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                  <span className={`text-sm font-medium ${
                    project.status === 'On Track' ? 'text-green-600' :
                    project.status === 'At Risk' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                <span className="text-sm text-gray-600">Due: {project.deadline}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    project.progress >= 80 ? 'bg-green-500' :
                    project.progress >= 60 ? 'bg-blue-500' :
                    project.progress >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'overview' ? 'Conservation Analytics Overview' : 'Project Management Dashboard'}
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time insights into conservation impact and progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 1000)
              }}
              disabled={isLoading}
              className="btn-primary text-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Refresh Data'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {type === 'overview' ? renderOverviewDashboard() : renderProjectDashboard()}

      {/* Real-time Updates */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Live data updates enabled</span>
          </div>
          <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
