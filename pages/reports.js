import { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { 
  FileText, 
  Download, 
  Plus, 
  Search,
  Filter,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Eye,
  Edit,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

const reports = [
  {
    id: 1,
    title: 'Quarterly Wildlife Impact Assessment',
    type: 'Impact Report',
    status: 'published',
    created_date: '2024-12-01',
    last_updated: '2024-12-10',
    author: 'Dr. Sarah Johnson',
    period: 'Q4 2024',
    metrics: {
      species_monitored: 42,
      surveys_completed: 156,
      habitat_protected: 2400, // hectares
      volunteers_engaged: 89
    },
    stakeholders: ['Board of Directors', 'Major Donors', 'Grant Agencies'],
    file_size: '2.4 MB',
    downloads: 23,
    description: 'Comprehensive assessment of conservation outcomes and biodiversity monitoring results for the fourth quarter.'
  },
  {
    id: 2,
    title: 'Grant Compliance Report - Green Foundation',
    type: 'Compliance Report',
    status: 'draft',
    created_date: '2024-11-28',
    last_updated: '2024-12-08',
    author: 'Mike Chen',
    period: 'November 2024',
    metrics: {
      funds_utilized: 75000,
      milestones_completed: 8,
      deliverables_pending: 2,
      budget_variance: -2.5 // percentage
    },
    stakeholders: ['Green Foundation', 'Finance Team'],
    file_size: '1.8 MB',
    downloads: 5,
    description: 'Monthly compliance report detailing fund utilization and project milestone achievements.'
  },
  {
    id: 3,
    title: 'Volunteer Engagement Analytics',
    type: 'Analytics Report',
    status: 'in_review',
    created_date: '2024-12-05',
    last_updated: '2024-12-09',
    author: 'Alex Rivera',
    period: 'Full Year 2024',
    metrics: {
      total_volunteers: 234,
      volunteer_hours: 5670,
      retention_rate: 87.5, // percentage
      satisfaction_score: 4.2 // out of 5
    },
    stakeholders: ['HR Team', 'Program Managers', 'Board'],
    file_size: '3.1 MB',
    downloads: 12,
    description: 'Analysis of volunteer participation, engagement levels, and program effectiveness throughout 2024.'
  },
  {
    id: 4,
    title: 'Endangered Species Monitoring Summary',
    type: 'Scientific Report',
    status: 'scheduled',
    created_date: '2024-12-08',
    last_updated: '2024-12-10',
    author: 'Dr. Jennifer Martinez',
    period: 'December 2024',
    metrics: {
      endangered_species: 12,
      population_trend: 8.3, // percentage increase
      critical_habitats: 6,
      conservation_actions: 18
    },
    stakeholders: ['Scientific Community', 'Government Agencies', 'Conservation Partners'],
    file_size: '4.7 MB',
    downloads: 0,
    description: 'Scientific analysis of endangered species population trends and conservation intervention effectiveness.'
  }
]

const statusConfig = {
  published: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  draft: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Edit 
  },
  in_review: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: Clock 
  },
  scheduled: { 
    color: 'bg-purple-100 text-purple-800', 
    icon: Calendar 
  }
}

const reportTypeColors = {
  'Impact Report': 'bg-conservation-100 text-conservation-700',
  'Compliance Report': 'bg-blue-100 text-blue-700',
  'Analytics Report': 'bg-orange-100 text-orange-700',
  'Scientific Report': 'bg-purple-100 text-purple-700'
}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('last_updated')
  
  const filteredReports = reports
    .filter(report => 
      (filterType === 'all' || report.type === filterType) &&
      (filterStatus === 'all' || report.status === filterStatus) &&
      (searchTerm === '' || 
       report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
       report.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'last_updated') return new Date(b.last_updated) - new Date(a.last_updated)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'downloads') return b.downloads - a.downloads
      return 0
    })

  const totalReports = reports.length
  const publishedReports = reports.filter(r => r.status === 'published').length
  const totalDownloads = reports.reduce((sum, report) => sum + report.downloads, 0)
  const pendingReports = reports.filter(r => r.status === 'draft' || r.status === 'in_review').length

  return (
    <>
      <Head>
        <title>Reports & Analytics - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Generate and manage conservation reports" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 ml-64">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">
                  Generate impact reports and track conservation outcomes
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => alert('Analytics Dashboard feature coming soon!')}
                  className="btn-secondary flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </button>
                <button 
                  onClick={() => alert('Report Generator feature coming soon!')}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-conservation-100 rounded-lg">
                    <FileText className="h-5 w-5 text-conservation-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-xl font-semibold text-gray-900">{totalReports}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-xl font-semibold text-gray-900">{publishedReports}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Downloads</p>
                    <p className="text-xl font-semibold text-gray-900">{totalDownloads}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Pending Review</p>
                    <p className="text-xl font-semibold text-gray-900">{pendingReports}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Report Templates */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Generate</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button className="p-3 text-left border border-gray-200 rounded-lg hover:border-conservation-300 hover:bg-conservation-50 transition-all">
                  <div className="text-sm font-medium text-gray-900">Monthly Impact</div>
                  <div className="text-xs text-gray-500">Species & habitat data</div>
                </button>
                <button className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="text-sm font-medium text-gray-900">Grant Report</div>
                  <div className="text-xs text-gray-500">Compliance & milestones</div>
                </button>
                <button className="p-3 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all">
                  <div className="text-sm font-medium text-gray-900">Donor Update</div>
                  <div className="text-xs text-gray-500">Impact & gratitude</div>
                </button>
                <button className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <div className="text-sm font-medium text-gray-900">Scientific Brief</div>
                  <div className="text-xs text-gray-500">Research findings</div>
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports by title, author, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  />
                </div>
                
                {/* Type Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Impact Report">Impact Report</option>
                    <option value="Compliance Report">Compliance Report</option>
                    <option value="Analytics Report">Analytics Report</option>
                    <option value="Scientific Report">Scientific Report</option>
                  </select>
                </div>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                >
                  <option value="last_updated">Sort by Updated</option>
                  <option value="title">Sort by Title</option>
                  <option value="downloads">Sort by Downloads</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const StatusIcon = statusConfig[report.status].icon
                return (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reportTypeColors[report.type]}`}>
                            {report.type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[report.status].color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {report.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {report.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {report.period}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            {report.downloads} downloads
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {report.file_size}
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Metrics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {Object.entries(report.metrics).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="font-semibold text-conservation-700">{value}</div>
                                <div className="text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          <strong>Stakeholders:</strong> {report.stakeholders.join(', ')}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                          <Share className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate your first conservation impact report.
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => alert('Report Generator feature coming soon!')}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}