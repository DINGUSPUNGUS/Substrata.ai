import { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
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
  MessageSquare
} from 'lucide-react'

const donors = [
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

export default function Donors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('total_donated')
  
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
                  onClick={() => alert('Donor update feature coming soon!')}
                  className="btn-secondary flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Update
                </button>
                <button 
                  onClick={() => alert('Add Donor feature coming soon!')}
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
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                        <MessageSquare className="h-4 w-4" />
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
                    onClick={() => alert('Add Donor feature coming soon!')}
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
      </div>
    </>
  )
}