import Head from 'next/head'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { 
  DollarSign, Calendar, TrendingUp, AlertCircle, CheckCircle, 
  Clock, FileText, Users, Search, Filter, Plus, Download,
  Edit, Eye, X, Save, Mail, Settings, Printer, PieChart, BarChart, Activity
} from 'lucide-react'

// Sample grant data
const grantsData = [
  {
    id: 1,
    title: "Amazon Conservation Initiative",
    funder: "Global Environment Facility",
    amount: 2500000,
    awarded: 1800000,
    remaining: 700000,
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2026-12-31",
    progress: 72,
    category: "Forest Conservation",
    requirements: [
      { task: "Quarterly Progress Reports", due: "2024-12-31", completed: true },
      { task: "Financial Audit", due: "2025-03-15", completed: false },
      { task: "Environmental Impact Assessment", due: "2025-06-30", completed: false }
    ],
    milestones: [
      { name: "Phase 1 Completion", date: "2024-06-30", completed: true, payment: 600000 },
      { name: "Research Station Setup", date: "2024-12-15", completed: true, payment: 450000 },
      { name: "Community Training Program", date: "2025-06-30", completed: false, payment: 750000 },
      { name: "Final Evaluation", date: "2026-11-30", completed: false, payment: 700000 }
    ]
  },
  {
    id: 2,
    title: "Marine Biodiversity Protection",
    funder: "Ocean Conservation Trust",
    amount: 1200000,
    awarded: 400000,
    remaining: 800000,
    status: "In Review",
    startDate: "2024-07-01",
    endDate: "2025-12-31",
    progress: 33,
    category: "Marine Conservation",
    requirements: [
      { task: "Baseline Study Completion", due: "2024-10-31", completed: true },
      { task: "Equipment Procurement Report", due: "2024-12-31", completed: false },
      { task: "Partnership Agreements", due: "2025-01-31", completed: false }
    ],
    milestones: [
      { name: "Baseline Research", date: "2024-10-31", completed: true, payment: 400000 },
      { name: "Equipment Deployment", date: "2025-03-31", completed: false, payment: 400000 },
      { name: "Data Collection Phase", date: "2025-09-30", completed: false, payment: 400000 }
    ]
  },
  {
    id: 3,
    title: "Wildlife Corridor Development",
    funder: "National Science Foundation",
    amount: 850000,
    awarded: 850000,
    remaining: 0,
    status: "Completed",
    startDate: "2023-03-01",
    endDate: "2024-08-31",
    progress: 100,
    category: "Wildlife Protection",
    requirements: [
      { task: "Final Report Submission", due: "2024-09-30", completed: true },
      { task: "Financial Reconciliation", due: "2024-10-15", completed: true },
      { task: "Impact Assessment", due: "2024-11-30", completed: true }
    ],
    milestones: [
      { name: "Site Selection", date: "2023-06-30", completed: true, payment: 200000 },
      { name: "Construction Phase", date: "2024-03-31", completed: true, payment: 400000 },
      { name: "Monitoring Setup", date: "2024-08-31", completed: true, payment: 250000 }
    ]
  }
]

export default function GrantsPage() {
  const [grants, setGrants] = useState(grantsData)
  const [selectedGrant, setSelectedGrant] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view') // 'view', 'create', 'edit', 'analytics'
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    funder: '',
    amount: 0,
    awarded: 0,
    status: 'Pending',
    startDate: '',
    endDate: '',
    category: '',
    requirements: [],
    milestones: []
  })

  // Modal management functions
  const openModal = (type, grant = null) => {
    setModalType(type)
    setSelectedGrant(grant)
    if (grant && type === 'edit') {
      setFormData({
        title: grant.title,
        funder: grant.funder,
        amount: grant.amount,
        awarded: grant.awarded,
        status: grant.status,
        startDate: grant.startDate,
        endDate: grant.endDate,
        category: grant.category,
        requirements: grant.requirements || [],
        milestones: grant.milestones || []
      })
    } else if (type === 'create') {
      setFormData({
        title: '',
        funder: '',
        amount: 0,
        awarded: 0,
        status: 'Pending',
        startDate: '',
        endDate: '',
        category: '',
        requirements: [],
        milestones: []
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedGrant(null)
    setModalType('view')
  }

  const generateGrantReport = async (grant) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`Generated comprehensive report for ${grant.title}`)
    setIsGenerating(false)
  }

  const saveGrant = () => {
    if (modalType === 'create') {
      alert(`Added new grant: ${formData.title}`)
    } else if (modalType === 'edit') {
      alert(`Updated grant: ${formData.title}`)
    }
    closeModal()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'In Review': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredGrants = grants.filter(grant => {
    const matchesStatus = filterStatus === 'All' || grant.status === filterStatus
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.funder.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalGrantValue = grants.reduce((sum, grant) => sum + grant.amount, 0)
  const totalAwarded = grants.reduce((sum, grant) => sum + grant.awarded, 0)
  const activeGrants = grants.filter(g => g.status === 'Active').length

  return (
    <>
      <Head>
        <title>Grants - Substrata.ai Conservation</title>
        <meta name="description" content="Grant tracking and management for conservation projects" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Grant Management</h1>
                  <p className="text-gray-600 mt-2">Track funding, compliance, and milestone progress</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => openModal('analytics')}
                    className="btn-secondary flex items-center"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Analytics
                  </button>
                  <button 
                    onClick={() => openModal('create')}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Grant
                  </button>
                </div>
              </div>

              {/* Grant Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Grant Value</p>
                      <p className="text-2xl font-bold text-gray-900">${(totalGrantValue / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Funds Awarded</p>
                      <p className="text-2xl font-bold text-gray-900">${(totalAwarded / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-conservation-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Grants</p>
                      <p className="text-2xl font-bold text-gray-900">{activeGrants}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search grants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      />
                    </div>
                  </div>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Grants List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Grant Portfolio</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredGrants.map(grant => (
                    <div key={grant.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedGrant(grant)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{grant.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(grant.status)}`}>
                              {grant.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{grant.funder} • {grant.category}</p>
                          
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="font-semibold">${grant.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Awarded</p>
                              <p className="font-semibold text-green-600">${grant.awarded.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Remaining</p>
                              <p className="font-semibold text-blue-600">${grant.remaining.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Progress</p>
                              <p className="font-semibold">{grant.progress}%</p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-conservation-500 h-2 rounded-full" 
                              style={{ width: `${grant.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grant Details Modal */}
              {selectedGrant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{selectedGrant.title}</h2>
                        <button 
                          onClick={() => setSelectedGrant(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Grant Information */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Grant Details</h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-500">Funding Organization</span>
                              <p className="font-medium">{selectedGrant.funder}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Duration</span>
                              <p className="font-medium">{selectedGrant.startDate} to {selectedGrant.endDate}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Category</span>
                              <p className="font-medium">{selectedGrant.category}</p>
                            </div>
                          </div>

                          <h4 className="text-lg font-semibold mt-6 mb-4">Compliance Requirements</h4>
                          <div className="space-y-2">
                            {selectedGrant.requirements.map((req, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  {req.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-orange-500 mr-2" />
                                  )}
                                  <span className={req.completed ? 'line-through text-gray-500' : ''}>{req.task}</span>
                                </div>
                                <span className="text-sm text-gray-500">Due: {req.due}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Total Grant</p>
                                <p className="text-xl font-bold">${selectedGrant.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Funds Received</p>
                                <p className="text-xl font-bold text-green-600">${selectedGrant.awarded.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="text-lg font-semibold mb-4">Payment Milestones</h4>
                          <div className="space-y-3">
                            {selectedGrant.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-3 ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                  <div>
                                    <p className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                      {milestone.name}
                                    </p>
                                    <p className="text-sm text-gray-500">{milestone.date}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">${milestone.payment.toLocaleString()}</p>
                                  {milestone.completed && (
                                    <p className="text-sm text-green-600">Received</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button 
                          onClick={() => generateGrantReport(selectedGrant)}
                          disabled={isGenerating}
                          className="btn-primary disabled:opacity-50"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </button>
                        <button 
                          onClick={() => openModal('edit', selectedGrant)}
                          className="btn-secondary"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Grant
                        </button>
                        <button 
                          onClick={() => alert('Document download feature coming soon!')}
                          className="btn-secondary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Documents
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Comprehensive Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalType === 'view' && 'Grant Details'}
                  {modalType === 'create' && 'Apply for New Grant'}
                  {modalType === 'edit' && 'Edit Grant Application'}
                  {modalType === 'analytics' && 'Grant Analytics Dashboard'}
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
                    {/* Analytics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm text-green-600">Total Applied</p>
                            <p className="text-2xl font-bold text-green-900">${(totalGrantValue / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm text-blue-600">Awarded</p>
                            <p className="text-2xl font-bold text-blue-900">${(totalAwarded / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Activity className="h-8 w-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm text-purple-600">Active Grants</p>
                            <p className="text-2xl font-bold text-purple-900">{activeGrants}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <BarChart className="h-8 w-8 text-orange-600" />
                          <div className="ml-3">
                            <p className="text-sm text-orange-600">Success Rate</p>
                            <p className="text-2xl font-bold text-orange-900">{Math.round((totalAwarded / totalGrantValue) * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grant Management Tools */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Management Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => alert('Compliance tracker coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Compliance Tracker</h4>
                          <p className="text-sm text-gray-600">Monitor reporting requirements</p>
                        </button>
                        <button 
                          onClick={() => alert('Milestone tracker coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Milestone Tracker</h4>
                          <p className="text-sm text-gray-600">Track project milestones</p>
                        </button>
                        <button 
                          onClick={() => alert('Financial reports coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <FileText className="h-6 w-6 text-purple-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Financial Reports</h4>
                          <p className="text-sm text-gray-600">Generate spending reports</p>
                        </button>
                        <button 
                          onClick={() => alert('Grant opportunities coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <Search className="h-6 w-6 text-orange-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Find Opportunities</h4>
                          <p className="text-sm text-gray-600">Discover new grant opportunities</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(modalType === 'create' || modalType === 'edit') && (
                  <form onSubmit={(e) => { e.preventDefault(); saveGrant(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grant Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Funding Organization *
                        </label>
                        <input
                          type="text"
                          value={formData.funder}
                          onChange={(e) => setFormData({...formData, funder: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requested Amount ($) *
                        </label>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount Awarded ($)
                        </label>
                        <input
                          type="number"
                          value={formData.awarded}
                          onChange={(e) => setFormData({...formData, awarded: parseFloat(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        >
                          <option value="">Select Category</option>
                          <option value="Forest Conservation">Forest Conservation</option>
                          <option value="Marine Conservation">Marine Conservation</option>
                          <option value="Wildlife Protection">Wildlife Protection</option>
                          <option value="Climate Action">Climate Action</option>
                          <option value="Community Outreach">Community Outreach</option>
                          <option value="Research">Research</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-conservation-600 text-white hover:bg-conservation-700 rounded-md"
                      >
                        {modalType === 'create' ? 'Submit Application' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
