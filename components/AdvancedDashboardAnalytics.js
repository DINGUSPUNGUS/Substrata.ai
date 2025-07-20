import { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, MapPin, Leaf, 
  Calendar, Filter, Download, RefreshCw, Settings, Eye,
  AlertTriangle, CheckCircle, Clock, Camera, Database
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, ScatterChart, Scatter, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { dataManager } from '../utils/supabaseManager'

export default function AdvancedDashboardAnalytics() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedMetrics, setSelectedMetrics] = useState([
    'species_diversity', 'survey_frequency', 'volunteer_activity', 'conservation_status'
  ])
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, custom
  
  const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  const metricOptions = [
    { id: 'species_diversity', label: 'Species Diversity', icon: Leaf },
    { id: 'survey_frequency', label: 'Survey Frequency', icon: Calendar },
    { id: 'volunteer_activity', label: 'Volunteer Activity', icon: Users },
    { id: 'conservation_status', label: 'Conservation Status', icon: AlertTriangle },
    { id: 'site_coverage', label: 'Site Coverage', icon: MapPin },
    { id: 'data_quality', label: 'Data Quality', icon: Database },
    { id: 'project_progress', label: 'Project Progress', icon: TrendingUp },
    { id: 'funding_efficiency', label: 'Funding Efficiency', icon: BarChart3 }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [surveys, species, sites, projects, volunteers, donors] = await Promise.all([
        dataManager.read('surveys'),
        dataManager.read('species_observations'),
        dataManager.read('survey_sites'),
        dataManager.read('projects'),
        dataManager.read('volunteers'),
        dataManager.read('donors')
      ])

      const processedData = processAnalyticsData({
        surveys: surveys.success ? surveys.data : [],
        species: species.success ? species.data : [],
        sites: sites.success ? sites.data : [],
        projects: projects.success ? projects.data : [],
        volunteers: volunteers.success ? volunteers.data : [],
        donors: donors.success ? donors.data : []
      })

      setDashboardData(processedData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (rawData) => {
    const { surveys, species, sites, projects, volunteers, donors } = rawData
    
    // Filter data by date range
    const filteredSurveys = surveys.filter(survey => {
      const surveyDate = new Date(survey.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      return surveyDate >= startDate && surveyDate <= endDate
    })

    const filteredSpecies = species.filter(obs => 
      filteredSurveys.some(survey => survey.id === obs.survey_id)
    )

    // Key Performance Indicators
    const kpis = {
      totalSurveys: filteredSurveys.length,
      uniqueSpecies: new Set(filteredSpecies.map(s => s.species_name)).size,
      totalObservations: filteredSpecies.length,
      activeSites: new Set(filteredSurveys.map(s => s.site_id)).size,
      activeVolunteers: new Set(filteredSurveys.map(s => s.surveyor_id)).size,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalFunding: projects.reduce((sum, p) => sum + (p.funding_amount || 0), 0),
      avgSurveyDuration: filteredSurveys.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / filteredSurveys.length
    }

    // Species Diversity Analysis
    const speciesFrequency = filteredSpecies.reduce((acc, obs) => {
      acc[obs.species_name] = (acc[obs.species_name] || 0) + (obs.count || 1)
      return acc
    }, {})

    const speciesData = Object.entries(speciesFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Conservation Status Distribution
    const statusDistribution = filteredSpecies.reduce((acc, obs) => {
      const status = obs.conservation_status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const statusData = Object.entries(statusDistribution)
      .map(([status, count]) => ({ status, count }))

    // Survey Timeline
    const surveyTimeline = filteredSurveys.reduce((acc, survey) => {
      const date = survey.date.split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const timelineData = Object.entries(surveyTimeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    // Site Performance Analysis
    const sitePerformance = sites.map(site => {
      const siteSurveys = filteredSurveys.filter(s => s.site_id === site.id)
      const siteSpecies = filteredSpecies.filter(obs => 
        siteSurveys.some(survey => survey.id === obs.survey_id)
      )
      
      return {
        name: site.name,
        surveys: siteSurveys.length,
        species: new Set(siteSpecies.map(s => s.species_name)).size,
        biodiversityIndex: calculateBiodiversityIndex(siteSpecies),
        lastSurvey: siteSurveys.length > 0 ? 
          Math.max(...siteSurveys.map(s => new Date(s.date).getTime())) : null
      }
    }).filter(site => site.surveys > 0)

    // Volunteer Performance
    const volunteerPerformance = volunteers.map(volunteer => {
      const volunteerSurveys = filteredSurveys.filter(s => s.surveyor_id === volunteer.id)
      const volunteerSpecies = filteredSpecies.filter(obs => 
        volunteerSurveys.some(survey => survey.id === obs.survey_id)
      )
      
      return {
        name: volunteer.name,
        surveys: volunteerSurveys.length,
        species: new Set(volunteerSpecies.map(s => s.species_name)).size,
        totalHours: volunteerSurveys.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60,
        avgSpeciesPerSurvey: volunteerSurveys.length > 0 ? 
          new Set(volunteerSpecies.map(s => s.species_name)).size / volunteerSurveys.length : 0
      }
    }).filter(v => v.surveys > 0)

    // Project Progress Analysis
    const projectProgress = projects.map(project => {
      const projectSurveys = filteredSurveys.filter(s => s.project_id === project.id)
      const progress = calculateProjectProgress(project, projectSurveys)
      
      return {
        name: project.name,
        progress: progress.percentage,
        status: project.status,
        funding: project.funding_amount || 0,
        surveys: projectSurveys.length,
        efficiency: projectSurveys.length / (project.funding_amount || 1) * 1000 // surveys per $1000
      }
    })

    // Biodiversity Trends
    const biodiversityTrends = calculateBiodiversityTrends(filteredSurveys, filteredSpecies)

    // Data Quality Metrics
    const dataQuality = calculateDataQuality(filteredSurveys, filteredSpecies)

    // Funding Analysis
    const fundingAnalysis = analyzeFunding(projects, donors)

    return {
      kpis,
      charts: {
        speciesFrequency: speciesData.slice(0, 15),
        conservationStatus: statusData,
        surveyTimeline: timelineData,
        sitePerformance: sitePerformance.slice(0, 10),
        volunteerPerformance: volunteerPerformance.slice(0, 10),
        projectProgress,
        biodiversityTrends,
        dataQuality,
        fundingAnalysis
      },
      trends: calculateTrends(filteredSurveys, filteredSpecies),
      predictions: generatePredictions(timelineData, speciesData)
    }
  }

  const calculateBiodiversityIndex = (speciesObservations) => {
    // Shannon Diversity Index calculation
    const speciesCounts = speciesObservations.reduce((acc, obs) => {
      acc[obs.species_name] = (acc[obs.species_name] || 0) + (obs.count || 1)
      return acc
    }, {})

    const total = Object.values(speciesCounts).reduce((sum, count) => sum + count, 0)
    if (total === 0) return 0

    const shannon = -Object.values(speciesCounts).reduce((sum, count) => {
      const proportion = count / total
      return sum + (proportion * Math.log(proportion))
    }, 0)

    return Math.round(shannon * 100) / 100
  }

  const calculateProjectProgress = (project, surveys) => {
    // Simple progress calculation based on surveys vs target
    const targetSurveys = project.target_surveys || 10
    const completedSurveys = surveys.length
    const percentage = Math.min((completedSurveys / targetSurveys) * 100, 100)
    
    return {
      percentage: Math.round(percentage),
      completed: completedSurveys,
      target: targetSurveys
    }
  }

  const calculateBiodiversityTrends = (surveys, species) => {
    // Group by month and calculate diversity trends
    const monthlyData = surveys.reduce((acc, survey) => {
      const month = new Date(survey.date).toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { surveys: [], species: [] }
      }
      acc[month].surveys.push(survey)
      
      const surveySpecies = species.filter(s => s.survey_id === survey.id)
      acc[month].species.push(...surveySpecies)
      
      return acc
    }, {})

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      uniqueSpecies: new Set(data.species.map(s => s.species_name)).size,
      totalObservations: data.species.length,
      biodiversityIndex: calculateBiodiversityIndex(data.species),
      surveys: data.surveys.length
    })).sort((a, b) => a.month.localeCompare(b.month))
  }

  const calculateDataQuality = (surveys, species) => {
    const totalSurveys = surveys.length
    const totalSpecies = species.length
    
    // Calculate various quality metrics
    const surveysWithGPS = surveys.filter(s => s.gps_coordinates).length
    const surveysWithPhotos = surveys.filter(s => s.photos && s.photos.length > 0).length
    const speciesWithCounts = species.filter(s => s.count && s.count > 0).length
    const speciesWithStatus = species.filter(s => s.conservation_status).length
    
    return [
      { metric: 'GPS Coverage', value: totalSurveys > 0 ? (surveysWithGPS / totalSurveys) * 100 : 0 },
      { metric: 'Photo Documentation', value: totalSurveys > 0 ? (surveysWithPhotos / totalSurveys) * 100 : 0 },
      { metric: 'Species Counts', value: totalSpecies > 0 ? (speciesWithCounts / totalSpecies) * 100 : 0 },
      { metric: 'Conservation Status', value: totalSpecies > 0 ? (speciesWithStatus / totalSpecies) * 100 : 0 },
      { metric: 'Completeness Score', value: totalSurveys > 0 ? ((surveysWithGPS + surveysWithPhotos) / (totalSurveys * 2)) * 100 : 0 }
    ]
  }

  const analyzeFunding = (projects, donors) => {
    const totalFunding = projects.reduce((sum, p) => sum + (p.funding_amount || 0), 0)
    const activeFunding = projects.filter(p => p.status === 'active').reduce((sum, p) => sum + (p.funding_amount || 0), 0)
    
    const fundingBySource = donors.reduce((acc, donor) => {
      const type = donor.donor_type || 'Individual'
      acc[type] = (acc[type] || 0) + (donor.total_donated || 0)
      return acc
    }, {})

    return {
      total: totalFunding,
      active: activeFunding,
      utilization: totalFunding > 0 ? (activeFunding / totalFunding) * 100 : 0,
      bySource: Object.entries(fundingBySource).map(([source, amount]) => ({ source, amount }))
    }
  }

  const calculateTrends = (surveys, species) => {
    // Calculate period-over-period changes
    const currentPeriod = surveys.length
    const previousStart = new Date(dateRange.start)
    previousStart.setDate(previousStart.getDate() - (new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))
    
    // This would ideally compare with previous period data
    return {
      surveys: { current: currentPeriod, change: 0, trend: 'stable' },
      species: { current: new Set(species.map(s => s.species_name)).size, change: 0, trend: 'stable' },
      diversity: { current: calculateBiodiversityIndex(species), change: 0, trend: 'stable' }
    }
  }

  const generatePredictions = (timelineData, speciesData) => {
    // Simple linear prediction for next month
    if (timelineData.length < 2) return null

    const recentData = timelineData.slice(-7) // Last 7 data points
    const trend = recentData.length > 1 ? 
      (recentData[recentData.length - 1].count - recentData[0].count) / (recentData.length - 1) : 0

    const nextPeriodPrediction = Math.max(0, (recentData[recentData.length - 1]?.count || 0) + trend)

    return {
      nextPeriodSurveys: Math.round(nextPeriodPrediction),
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
      confidence: Math.min(recentData.length / 7, 1) * 100 // Simple confidence based on data points
    }
  }

  const exportAnalytics = () => {
    if (!dashboardData) return

    const exportData = {
      ...dashboardData,
      dateRange,
      selectedMetrics,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics_dashboard_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into conservation data and trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button onClick={loadDashboardData} className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button onClick={exportAnalytics} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Surveys</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.kpis.totalSurveys}</p>
              {dashboardData.trends.surveys.change !== 0 && (
                <p className={`text-sm flex items-center ${dashboardData.trends.surveys.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.trends.surveys.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(dashboardData.trends.surveys.change)}%
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Unique Species</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.kpis.uniqueSpecies}</p>
              <p className="text-sm text-gray-600">{dashboardData.kpis.totalObservations} observations</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Sites</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.kpis.activeSites}</p>
              <p className="text-sm text-gray-600">Survey locations</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Volunteers</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.kpis.activeVolunteers}</p>
              <p className="text-sm text-gray-600">{Math.round(dashboardData.kpis.avgSurveyDuration)}min avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Species Frequency Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Species Observed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.charts.speciesFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={10}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Survey Timeline */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.charts.surveyTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conservation Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservation Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.charts.conservationStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {dashboardData.charts.conservationStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biodiversity Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Biodiversity Index Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.charts.biodiversityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="biodiversityIndex" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Site and Volunteer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Site Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sites</h3>
          <div className="space-y-3">
            {dashboardData.charts.sitePerformance.map((site, index) => (
              <div key={site.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium text-gray-900">{site.name}</h4>
                  <p className="text-sm text-gray-600">
                    {site.surveys} surveys • {site.species} species • Index: {site.biodiversityIndex}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality Radar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={dashboardData.charts.dataQuality}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" fontSize={10} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Radar name="Quality %" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Quality']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Progress and Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
          <div className="space-y-4">
            {dashboardData.charts.projectProgress.slice(0, 5).map((project) => (
              <div key={project.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{project.name}</span>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{project.surveys} surveys</span>
                  <span>${project.funding?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funding Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Funding</span>
              <span className="text-lg font-semibold">${dashboardData.charts.fundingAnalysis.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Projects</span>
              <span className="text-lg font-semibold">${dashboardData.charts.fundingAnalysis.active.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization Rate</span>
              <span className="text-lg font-semibold">{dashboardData.charts.fundingAnalysis.utilization.toFixed(1)}%</span>
            </div>
            
            {dashboardData.charts.fundingAnalysis.bySource.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Funding by Source</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={dashboardData.charts.fundingAnalysis.bySource}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.charts.fundingAnalysis.bySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Predictions and Insights */}
      {dashboardData.predictions && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Next Period Prediction</h4>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.predictions.nextPeriodSurveys}</p>
              <p className="text-sm text-blue-700">Expected surveys</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Trend Direction</h4>
              <p className="text-lg font-bold text-green-600 capitalize">{dashboardData.predictions.trend}</p>
              <p className="text-sm text-green-700">Activity trend</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Confidence Level</h4>
              <p className="text-2xl font-bold text-purple-600">{dashboardData.predictions.confidence.toFixed(0)}%</p>
              <p className="text-sm text-purple-700">Prediction accuracy</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
