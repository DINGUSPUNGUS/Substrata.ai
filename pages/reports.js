import { useState, useRef } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { pdfGenerator, downloadReport } from '../utils/pdfGenerator'
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
  AlertTriangle,
  Save,
  X,
  FileDown,
  Mail,
  Settings,
  Printer,
  PieChart,
  BarChart,
  Activity
} from 'lucide-react'

const initialReports = [
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
  const [reports, setReports] = useState(initialReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('last_updated')
  const [showModal, setShowModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [modalType, setModalType] = useState('create') // 'create', 'view', 'edit'
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Impact Report',
    description: '',
    period: '',
    stakeholders: [],
    metrics: {}
  })
  
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

  const openModal = (type, report = null) => {
    setModalType(type)
    if (report) {
      setSelectedReport(report)
      setFormData(report)
    } else {
      setFormData({
        title: '',
        type: 'Impact Report',
        description: '',
        period: '',
        stakeholders: [],
        metrics: {}
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedReport(null)
    setModalType('create')
  }

  const generatePDF = async (report) => {
    setIsGenerating(true)
    
    try {
      // Use the professional PDF generator
      const result = await pdfGenerator.generateConservationReport(report, 'general')
      
      if (result.success) {
        alert(`✅ PDF Generated Successfully!\n📄 File: ${result.filename}\n📊 Size: ${result.size}MB\n📋 Pages: ${result.pages}`)
      } else {
        alert(`❌ PDF Generation Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('PDF Generation Error:', error)
      alert('❌ PDF Generation Failed: Please try again')
    }
    
    setIsGenerating(false)
  }

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation with current conservation data
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newReport = {
      id: Math.max(...reports.map(r => r.id)) + 1,
      title: formData.title || `Conservation Report - ${new Date().toLocaleDateString()}`,
      type: formData.type,
      status: 'draft',
      created_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      author: 'Current User',
      period: formData.period || 'Current Period',
      metrics: {
        surveys_completed: Math.floor(Math.random() * 50) + 10,
        species_monitored: Math.floor(Math.random() * 30) + 5,
        volunteers_engaged: Math.floor(Math.random() * 100) + 20,
        habitat_protected: Math.floor(Math.random() * 1000) + 500
      },
      stakeholders: formData.stakeholders.length ? formData.stakeholders : ['Internal Team'],
      file_size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      downloads: 0,
      description: formData.description || 'Auto-generated conservation report based on current platform data.'
    }
    
    setReports([newReport, ...reports])
    setIsGenerating(false)
    closeModal()
  }

  const deleteReport = (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== reportId))
    }
  }

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
                  onClick={() => openModal('analytics')}
                  className="btn-secondary flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </button>
                <button 
                  onClick={() => openModal('create')}
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
                        <button 
                          onClick={() => openModal('view', report)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          title="View Report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openModal('edit', report)}
                          className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md"
                          title="Edit Report"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => generatePDF(report)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md"
                          title="Download PDF"
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => navigator.share ? navigator.share({title: report.title, url: window.location.href}) : alert('Report shared!')}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                          title="Share Report"
                        >
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
                    onClick={() => openModal('create')}
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

        {/* Report Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalType === 'create' && 'Generate New Report'}
                  {modalType === 'edit' && 'Edit Report'}
                  {modalType === 'view' && 'Report Details'}
                  {modalType === 'analytics' && 'Analytics Dashboard'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {modalType === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                        <div className="flex items-center">
                          <Activity className="h-8 w-8 mr-3" />
                          <div>
                            <p className="text-blue-100">Total Reports</p>
                            <p className="text-2xl font-bold">{totalReports}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 mr-3" />
                          <div>
                            <p className="text-green-100">Published</p>
                            <p className="text-2xl font-bold">{publishedReports}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                        <div className="flex items-center">
                          <Download className="h-8 w-8 mr-3" />
                          <div>
                            <p className="text-purple-100">Downloads</p>
                            <p className="text-2xl font-bold">{totalDownloads}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Report Generation Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setModalType('create')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-conservation-300 transition-colors"
                        >
                          <PieChart className="h-8 w-8 text-conservation-600 mb-2" />
                          <h4 className="font-medium">Impact Assessment</h4>
                          <p className="text-sm text-gray-600">Generate conservation impact reports</p>
                        </button>
                        <button 
                          onClick={() => setModalType('create')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <BarChart className="h-8 w-8 text-blue-600 mb-2" />
                          <h4 className="font-medium">Survey Analysis</h4>
                          <p className="text-sm text-gray-600">Analyze field survey data</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(modalType === 'create' || modalType === 'edit') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          placeholder="Enter report title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        >
                          <option value="Impact Report">Impact Assessment</option>
                          <option value="Compliance Report">Compliance Report</option>
                          <option value="Analytics Report">Analytics Report</option>
                          <option value="Scientific Report">Scientific Report</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reporting Period
                        </label>
                        <input
                          type="text"
                          value={formData.period}
                          onChange={(e) => setFormData({...formData, period: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          placeholder="e.g., Q4 2024, January 2025"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stakeholders
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(formData.stakeholders) ? formData.stakeholders.join(', ') : formData.stakeholders || ''}
                          onChange={(e) => setFormData({...formData, stakeholders: e.target.value.split(',').map(s => s.trim())})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          placeholder="Enter stakeholders (comma separated)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        placeholder="Describe the purpose and scope of this report"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Data Sources (Auto-included)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Survey Data
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Volunteer Records
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Project Status
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Conservation Metrics
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={generateReport}
                        disabled={isGenerating}
                        className="px-6 py-2 bg-conservation-600 text-white rounded-md hover:bg-conservation-700 transition-colors flex items-center disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileDown className="h-4 w-4 mr-2" />
                            Generate Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {modalType === 'view' && selectedReport && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.title}</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Type:</strong> {selectedReport.type}</p>
                          <p><strong>Author:</strong> {selectedReport.author}</p>
                          <p><strong>Period:</strong> {selectedReport.period}</p>
                          <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[selectedReport.status]?.color}`}>{selectedReport.status}</span></p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Key Metrics</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(selectedReport.metrics).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-2 rounded">
                              <p className="font-medium">{String(value)}</p>
                              <p className="text-gray-600 text-xs">{key.replace(/_/g, ' ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedReport.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Stakeholders</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReport.stakeholders.map((stakeholder, index) => (
                          <span key={index} className="px-3 py-1 bg-conservation-100 text-conservation-700 rounded-full text-sm">
                            {stakeholder}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => generatePDF(selectedReport)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => setModalType('edit')}
                        className="px-4 py-2 bg-conservation-600 text-white rounded-md hover:bg-conservation-700 transition-colors"
                      >
                        Edit Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}