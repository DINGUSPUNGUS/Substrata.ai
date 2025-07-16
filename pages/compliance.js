import Head from 'next/head'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { 
  Shield, FileCheck, AlertTriangle, Calendar, CheckCircle, 
  Clock, Download, Eye, Filter, Search, Plus
} from 'lucide-react'

// Sample compliance data
const complianceData = [
  {
    id: 1,
    title: "Environmental Impact Assessment - Amazon Project",
    type: "Environmental Compliance",
    status: "Compliant",
    dueDate: "2024-12-31",
    lastReview: "2024-11-15",
    reviewer: "Dr. Sarah Mitchell",
    priority: "High",
    requirements: [
      { item: "Biodiversity Impact Study", status: "Complete", date: "2024-10-15" },
      { item: "Soil Quality Assessment", status: "Complete", date: "2024-10-20" },
      { item: "Water Quality Monitoring", status: "In Progress", date: "2024-12-01" },
      { item: "Air Quality Analysis", status: "Pending", date: "2024-12-15" }
    ],
    documents: ["EIA_Report_Final.pdf", "Biodiversity_Study.pdf", "Monitoring_Protocol.pdf"]
  },
  {
    id: 2,
    title: "Grant Compliance - Marine Conservation Fund",
    type: "Financial Compliance",
    status: "At Risk",
    dueDate: "2024-12-01",
    lastReview: "2024-11-10",
    reviewer: "James Rodriguez",
    priority: "Critical",
    requirements: [
      { item: "Quarterly Financial Report", status: "Overdue", date: "2024-11-30" },
      { item: "Expense Documentation", status: "Complete", date: "2024-11-15" },
      { item: "Audit Trail Verification", status: "In Progress", date: "2024-12-01" },
      { item: "Budget Variance Analysis", status: "Pending", date: "2024-12-05" }
    ],
    documents: ["Financial_Report_Q3.pdf", "Expense_Records.xlsx", "Audit_Checklist.pdf"]
  },
  {
    id: 3,
    title: "Wildlife Protection Permit Renewal",
    type: "Regulatory Compliance",
    status: "Compliant",
    dueDate: "2025-03-15",
    lastReview: "2024-11-01",
    reviewer: "Dr. Maria Santos",
    priority: "Medium",
    requirements: [
      { item: "Wildlife Handling Certification", status: "Complete", date: "2024-09-15" },
      { item: "Site Safety Inspection", status: "Complete", date: "2024-10-01" },
      { item: "Staff Training Records", status: "Complete", date: "2024-10-15" },
      { item: "Equipment Calibration", status: "Complete", date: "2024-10-30" }
    ],
    documents: ["Permit_Application.pdf", "Safety_Report.pdf", "Training_Certificates.pdf"]
  },
  {
    id: 4,
    title: "Carbon Offset Verification",
    type: "Environmental Compliance",
    status: "In Review",
    dueDate: "2025-01-15",
    lastReview: "2024-11-12",
    reviewer: "Dr. Emily Chen",
    priority: "High",
    requirements: [
      { item: "Carbon Measurement Protocol", status: "Complete", date: "2024-10-15" },
      { item: "Third-Party Verification", status: "In Progress", date: "2024-12-01" },
      { item: "Monitoring System Setup", status: "In Progress", date: "2024-12-10" },
      { item: "Baseline Data Collection", status: "Complete", date: "2024-11-01" }
    ],
    documents: ["Carbon_Protocol.pdf", "Measurement_Data.xlsx", "Verification_Request.pdf"]
  }
]

const impactAssessments = [
  {
    id: 1,
    project: "Amazon Rainforest Restoration",
    period: "Q3 2024",
    biodiversityScore: 8.7,
    carbonSequestration: "2,450 tons CO2",
    habitatRestored: "1,200 hectares",
    speciesProtected: 156,
    communityBenefit: "High",
    economicValue: "$1.2M",
    sustainability: 92,
    riskLevel: "Low"
  },
  {
    id: 2,
    project: "Coral Reef Monitoring",
    period: "Q3 2024",
    biodiversityScore: 7.3,
    carbonSequestration: "890 tons CO2",
    habitatRestored: "45 hectares",
    speciesProtected: 89,
    communityBenefit: "Medium",
    economicValue: "$650K",
    sustainability: 78,
    riskLevel: "Medium"
  },
  {
    id: 3,
    project: "Wildlife Corridor Protection",
    period: "Q3 2024",
    biodiversityScore: 9.1,
    carbonSequestration: "1,780 tons CO2",
    habitatRestored: "850 hectares",
    speciesProtected: 203,
    communityBenefit: "High",
    economicValue: "$980K",
    sustainability: 96,
    riskLevel: "Low"
  }
]

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('compliance')
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-800'
      case 'At Risk': return 'bg-red-100 text-red-800'
      case 'In Review': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600'
      case 'High': return 'text-orange-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredCompliance = complianceData.filter(item => {
    const matchesType = filterType === 'All' || item.type === filterType
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <>
      <Head>
        <title>Compliance & Impact - Substrata.ai Conservation</title>
        <meta name="description" content="Compliance tracking and impact assessments for conservation projects" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Compliance & Impact Assessment</h1>
                  <p className="text-gray-600 mt-2">Monitor compliance status and measure conservation impact</p>
                </div>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('compliance')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'compliance'
                          ? 'border-conservation-500 text-conservation-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Shield className="h-4 w-4 inline mr-2" />
                      Compliance Tracking
                    </button>
                    <button
                      onClick={() => setActiveTab('impact')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'impact'
                          ? 'border-conservation-500 text-conservation-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FileCheck className="h-4 w-4 inline mr-2" />
                      Impact Assessments
                    </button>
                  </nav>
                </div>

                {activeTab === 'compliance' && (
                  <div className="p-6">
                    {/* Compliance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Compliant</p>
                            <p className="text-2xl font-bold text-green-900">
                              {complianceData.filter(c => c.status === 'Compliant').length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-8 w-8 text-red-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-600">At Risk</p>
                            <p className="text-2xl font-bold text-red-900">
                              {complianceData.filter(c => c.status === 'At Risk').length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Clock className="h-8 w-8 text-yellow-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-600">In Review</p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {complianceData.filter(c => c.status === 'In Review').length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Calendar className="h-8 w-8 text-blue-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-600">Due This Month</p>
                            <p className="text-2xl font-bold text-blue-900">3</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search compliance items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          />
                        </div>
                      </div>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      >
                        <option value="All">All Types</option>
                        <option value="Environmental Compliance">Environmental</option>
                        <option value="Financial Compliance">Financial</option>
                        <option value="Regulatory Compliance">Regulatory</option>
                      </select>
                    </div>

                    {/* Compliance List */}
                    <div className="space-y-4">
                      {filteredCompliance.map(item => (
                        <div key={item.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <p className="text-gray-600">{item.type}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Due Date</p>
                              <p className="font-medium">{item.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Review</p>
                              <p className="font-medium">{item.lastReview}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Reviewer</p>
                              <p className="font-medium">{item.reviewer}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Requirements Progress</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {item.requirements.map((req, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{req.item}</span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    req.status === 'Complete' ? 'bg-green-100 text-green-800' :
                                    req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                    req.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {req.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {item.documents.map((doc, index) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {doc}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button className="btn-secondary text-sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </button>
                              <button className="btn-secondary text-sm">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {impactAssessments.map(assessment => (
                        <div key={assessment.id} className="bg-white border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{assessment.project}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(assessment.riskLevel)}`}>
                              {assessment.riskLevel} Risk
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4">{assessment.period}</p>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Biodiversity Score</span>
                              <span className="font-semibold">{assessment.biodiversityScore}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Carbon Sequestration</span>
                              <span className="font-semibold">{assessment.carbonSequestration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Habitat Restored</span>
                              <span className="font-semibold">{assessment.habitatRestored}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Species Protected</span>
                              <span className="font-semibold">{assessment.speciesProtected}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Economic Value</span>
                              <span className="font-semibold">{assessment.economicValue}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Sustainability Score</span>
                              <span className="font-semibold">{assessment.sustainability}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-conservation-500 h-2 rounded-full" 
                                style={{ width: `${assessment.sustainability}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button className="btn-secondary flex-1 text-sm">
                              <FileCheck className="h-3 w-3 mr-1" />
                              View Report
                            </button>
                            <button className="btn-secondary text-sm">
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
