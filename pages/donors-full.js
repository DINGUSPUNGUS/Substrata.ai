import { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { pdfGenerator, downloadReport } from '../utils/pdfGenerator'
import { 
  Users, 
  DollarSign, 
  Plus, 
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Gift,
  Star,
  MapPin,
  Eye,
  Edit,
  MessageSquare,
  Save,
  X,
  UserPlus,
  Send,
  CreditCard,
  Heart,
  Award,
  Trash2
} from 'lucide-react'

const initialDonors = [
  {
    id: 1,
    name: 'Green Earth Foundation',
    email: 'contact@greenearth.org',
    phone: '+1 (555) 123-4567',
    type: 'Foundation',
    location: 'Seattle, WA',
    total_donated: 125000,
    last_donation: '2024-11-15',
    donation_count: 8,
    tier: 'Major',
    engagement: 'High',
    interests: ['Wildlife Protection', 'Forest Conservation'],
    contact_person: 'Jennifer Martinez',
    notes: 'Particularly interested in wolf conservation programs'
  },
  {
    id: 2,
    name: 'Ocean Conservation Society',
    email: 'info@oceancons.org',
    phone: '+1 (555) 987-6543',
    type: 'Organization',
    location: 'San Francisco, CA',
    total_donated: 75000,
    last_donation: '2024-12-01',
    donation_count: 12,
    tier: 'Major',
    engagement: 'High',
    interests: ['Marine Biology', 'Coastal Protection'],
    contact_person: 'Dr. Michael Chen',
    notes: 'Monthly recurring donor, very responsive to updates'
  },
  {
    id: 3,
    name: 'Sarah & Robert Johnson',
    email: 'sarahjohnson@email.com',
    phone: '+1 (555) 456-7890',
    type: 'Individual',
    location: 'Denver, CO',
    total_donated: 15000,
    last_donation: '2024-10-20',
    donation_count: 24,
    tier: 'Regular',
    engagement: 'Medium',
    interests: ['Bird Watching', 'Habitat Restoration'],
    contact_person: 'Sarah Johnson',
    notes: 'Retired couple, donate annually in memory of their daughter'
  },
  {
    id: 4,
    name: 'TechForGood Corporation',
    email: 'giving@techforgood.com',
    phone: '+1 (555) 222-3333',
    type: 'Corporate',
    location: 'Austin, TX',
    total_donated: 50000,
    last_donation: '2024-09-15',
    donation_count: 3,
    tier: 'Major',
    engagement: 'Low',
    interests: ['Technology in Conservation', 'Data Analytics'],
    contact_person: 'Amanda Foster',
    notes: 'CSR program, interested in tech-driven solutions'
  }
]

export default function Donors() {
  // Move constants inside component to fix SSG
  const tierColors = {
    Major: 'bg-purple-100 text-purple-800',
    Regular: 'bg-blue-100 text-blue-800',
    Supporter: 'bg-green-100 text-green-800'
  }

  const engagementColors = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-red-100 text-red-800'
  }

  const [donors, setDonors] = useState(initialDonors)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('total_donated')
  const [showModal, setShowModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [modalType, setModalType] = useState('view') // 'view', 'create', 'edit', 'analytics'
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Individual',
    tier: 'Regular',
    total_donated: 0,
    donation_count: 0,
    last_donation: new Date().toISOString().split('T')[0],
    location: '',
    contact_person: '',
    interests: []
  })

  // Modal management functions
  const openModal = (type, donor = null) => {
    setModalType(type)
    setSelectedDonor(donor)
    if (donor && type === 'edit') {
      setFormData({...donor, interests: donor.interests || []})
    } else if (type === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'Individual',
        tier: 'Regular',
        total_donated: 0,
        donation_count: 0,
        last_donation: new Date().toISOString().split('T')[0],
        location: '',
        contact_person: '',
        interests: []
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDonor(null)
    setModalType('view')
  }

  const generateDonorReport = async (donor) => {
    setIsGenerating(true)
    
    try {
      // Create mock donations data for the donor
      const donations = [
        { amount: donor.total_donated * 0.4, project_name: 'Forest Conservation', date: '2024-01-15' },
        { amount: donor.total_donated * 0.3, project_name: 'Marine Protection', date: '2024-06-20' },
        { amount: donor.total_donated * 0.3, project_name: 'Wildlife Sanctuary', date: '2024-09-10' }
      ];

      // Use the professional PDF generator
      const result = await pdfGenerator.generateDonorReport(donor, donations)
      
      if (result.success) {
        alert(`✅ Donor Report Generated!\n📄 File: ${result.filename}\n📊 Impact Report for ${donor.name}\n📋 Pages: ${result.pages}`)
      } else {
        alert(`❌ Report Generation Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Donor Report Error:', error)
      alert('❌ Report Generation Failed: Please try again')
    }
    
    setIsGenerating(false)
  }

  const sendDonorUpdate = async (donor) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(`Sent update email to ${donor.name}`)
    setIsGenerating(false)
  }

  const saveDonor = () => {
    if (modalType === 'create') {
      // Add new donor logic
      alert(`Added new donor: ${formData.name}`)
    } else if (modalType === 'edit') {
      // Update donor logic
      alert(`Updated donor: ${formData.name}`)
    }
    closeModal()
  }
  
  const filteredDonors = donors
    .filter(donor => 
      (filterTier === 'all' || donor.tier === filterTier) &&
      (filterType === 'all' || donor.type === filterType) &&
      (searchTerm === '' || 
       donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       donor.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'total_donated') return b.total_donated - a.total_donated
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'last_donation') return new Date(b.last_donation) - new Date(a.last_donation)
      return 0
    })

  const totalDonors = donors.length
  const totalDonated = donors.reduce((sum, donor) => sum + donor.total_donated, 0)
  const averageDonation = totalDonated / totalDonors
  const majorDonors = donors.filter(d => d.tier === 'Major').length

  return (
    <>
      <Head>
        <title>Donor Management - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Manage donor relationships and fundraising" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 ml-64">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
                <p className="text-gray-600 mt-1">
                  Build relationships and track conservation funding
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => openModal('analytics')}
                  className="btn-secondary flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Update
                </button>
                <button 
                  onClick={() => openModal('create')}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Donor
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Donors</p>
                    <p className="text-xl font-semibold text-gray-900">{totalDonors}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Raised</p>
                    <p className="text-xl font-semibold text-gray-900">${totalDonated.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Major Donors</p>
                    <p className="text-xl font-semibold text-gray-900">{majorDonors}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-earth-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-earth-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Avg. Donation</p>
                    <p className="text-xl font-semibold text-gray-900">${Math.round(averageDonation).toLocaleString()}</p>
                  </div>
                </div>
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
                    placeholder="Search donors by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  />
                </div>
                
                {/* Tier Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Major">Major</option>
                    <option value="Regular">Regular</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>
                
                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                >
                  <option value="all">All Types</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                </select>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                >
                  <option value="total_donated">Sort by Total Donated</option>
                  <option value="name">Sort by Name</option>
                  <option value="last_donation">Sort by Last Donation</option>
                </select>
              </div>
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColors[donor.tier]}`}>
                          {donor.tier}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${engagementColors[donor.engagement]}`}>
                          {donor.engagement} Engagement
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {donor.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {donor.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {donor.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openModal('view', donor)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => openModal('edit', donor)}
                        className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md"
                        title="Edit Donor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => sendDonorUpdate(donor)}
                        disabled={isGenerating}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                        title="Send Update"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => generateDonorReport(donor)}
                        disabled={isGenerating}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md disabled:opacity-50"
                        title="Generate Report"
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Donation Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Donated</p>
                      <p className="text-lg font-semibold text-green-600">${donor.total_donated.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Donations</p>
                      <p className="text-lg font-semibold text-blue-600">{donor.donation_count}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Last Gift</p>
                      <p className="text-lg font-semibold text-gray-700">{new Date(donor.last_donation).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Contact Person and Interests */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Contact: </span>
                      <span className="text-sm text-gray-600">{donor.contact_person}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Interests: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {donor.interests.map((interest, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-conservation-100 text-conservation-700">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                      <strong>Notes:</strong> {donor.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredDonors.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No donors found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first donor.
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => openModal('create')}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Donor
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Comprehensive Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalType === 'view' && 'Donor Details'}
                  {modalType === 'create' && 'Add New Donor'}
                  {modalType === 'edit' && 'Edit Donor'}
                  {modalType === 'analytics' && 'Donor Analytics & Communications'}
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
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm text-blue-600">Total Donors</p>
                            <p className="text-2xl font-bold text-blue-900">{donors.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm text-green-600">Total Raised</p>
                            <p className="text-2xl font-bold text-green-900">${totalDonated.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Activity className="h-8 w-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm text-purple-600">Avg Donation</p>
                            <p className="text-2xl font-bold text-purple-900">${Math.round(averageDonation).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Star className="h-8 w-8 text-orange-600" />
                          <div className="ml-3">
                            <p className="text-sm text-orange-600">Major Donors</p>
                            <p className="text-2xl font-bold text-orange-900">{majorDonors}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Communication Tools */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => alert('Newsletter feature coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <Mail className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Send Newsletter</h4>
                          <p className="text-sm text-gray-600">Send updates to all donors</p>
                        </button>
                        <button 
                          onClick={() => alert('Thank you cards feature coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <Heart className="h-6 w-6 text-red-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Thank You Cards</h4>
                          <p className="text-sm text-gray-600">Generate personalized thanks</p>
                        </button>
                        <button 
                          onClick={() => alert('Tax receipts feature coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <FileText className="h-6 w-6 text-green-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Tax Receipts</h4>
                          <p className="text-sm text-gray-600">Generate annual tax documents</p>
                        </button>
                        <button 
                          onClick={() => alert('Reports feature coming soon!')}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <BarChart className="h-6 w-6 text-purple-600 mb-2" />
                          <h4 className="font-medium text-gray-900">Donor Reports</h4>
                          <p className="text-sm text-gray-600">Generate giving analysis</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(modalType === 'create' || modalType === 'edit') && (
                  <form onSubmit={(e) => { e.preventDefault(); saveDonor(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Donor Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Donor Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        >
                          <option value="Individual">Individual</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Foundation">Foundation</option>
                          <option value="Government">Government</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Donor Tier
                        </label>
                        <select
                          value={formData.tier}
                          onChange={(e) => setFormData({...formData, tier: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Major">Major</option>
                          <option value="Supporter">Supporter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Donated ($)
                        </label>
                        <input
                          type="number"
                          value={formData.total_donated}
                          onChange={(e) => setFormData({...formData, total_donated: parseFloat(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Donations
                        </label>
                        <input
                          type="number"
                          value={formData.donation_count}
                          onChange={(e) => setFormData({...formData, donation_count: parseInt(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Donation Date
                        </label>
                        <input
                          type="date"
                          value={formData.last_donation}
                          onChange={(e) => setFormData({...formData, last_donation: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={formData.contact_person}
                          onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                          placeholder="Primary contact name"
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
                        {modalType === 'create' ? 'Add Donor' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}

                {modalType === 'view' && selectedDonor && (
                  <div className="space-y-6">
                    {/* Donor Overview */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedDonor.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColors[selectedDonor.tier]}`}>
                              {selectedDonor.tier} Donor
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${engagementColors[selectedDonor.engagement]}`}>
                              {selectedDonor.engagement} Engagement
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${selectedDonor.total_donated.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total Contributed</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {selectedDonor.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {selectedDonor.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {selectedDonor.location}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Giving Summary</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>Number of Donations: {selectedDonor.donation_count}</div>
                            <div>Last Donation: {new Date(selectedDonor.last_donation).toLocaleDateString()}</div>
                            <div>Average Gift: ${Math.round(selectedDonor.total_donated / selectedDonor.donation_count).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => openModal('edit', selectedDonor)}
                        className="flex items-center px-4 py-2 bg-conservation-600 text-white rounded-md hover:bg-conservation-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Donor
                      </button>
                      <button 
                        onClick={() => sendDonorUpdate(selectedDonor)}
                        disabled={isGenerating}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Update
                      </button>
                      <button 
                        onClick={() => generateDonorReport(selectedDonor)}
                        disabled={isGenerating}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Generate Report
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

// Use server-side rendering to avoid static generation issues
export async function getStaticProps() {
  return { 
    props: {},
    revalidate: 60 // ISR - regenerate every 60 seconds
  }
}