import { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { 
  Camera, 
  MapPin, 
  Plus, 
  Filter, 
  Download, 
  Search,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const surveys = [
  {
    id: 1,
    name: 'Yellowstone Wildlife Survey - Winter 2024',
    location: 'Yellowstone National Park, WY',
    date: '2024-12-10',
    status: 'completed',
    species_count: 15,
    observer: 'Dr. Sarah Johnson',
    weather: 'Clear, -5°C',
    images: 23,
    notes: 'Observed increased wolf pack activity near Lamar Valley'
  },
  {
    id: 2,
    name: 'Bird Migration Count - Fall',
    location: 'Point Pelee, Ontario',
    date: '2024-12-08',
    status: 'in_progress',
    species_count: 42,
    observer: 'Alex Rivera',
    weather: 'Partly cloudy, 8°C',
    images: 67,
    notes: 'Peak migration period, high waterfowl activity'
  },
  {
    id: 3,
    name: 'Forest Biodiversity Assessment',
    location: 'Olympic National Park, WA',
    date: '2024-12-05',
    status: 'pending',
    species_count: 0,
    observer: 'Mike Chen',
    weather: 'Rainy, 12°C',
    images: 0,
    notes: 'Survey postponed due to weather conditions'
  }
]

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  pending: AlertTriangle,
  cancelled: Trash2
}

export default function Surveys() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  
  const filteredSurveys = surveys
    .filter(survey => 
      (filterStatus === 'all' || survey.status === filterStatus) &&
      (searchTerm === '' || 
       survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       survey.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
       survey.observer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'species') return b.species_count - a.species_count
      return 0
    })

  return (
    <>
      <Head>
        <title>Field Surveys - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Manage field surveys and wildlife observations" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 ml-64">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Field Surveys</h1>
                <p className="text-gray-600 mt-1">
                  Manage data collection, observations, and field research
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button className="btn-secondary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Survey
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-conservation-100 rounded-lg">
                    <Camera className="h-5 w-5 text-conservation-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Surveys</p>
                    <p className="text-xl font-semibold text-gray-900">124</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Species Recorded</p>
                    <p className="text-xl font-semibold text-gray-900">342</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-earth-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-earth-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Survey Sites</p>
                    <p className="text-xl font-semibold text-gray-900">28</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Camera className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Photos Captured</p>
                    <p className="text-xl font-semibold text-gray-900">1,247</p>
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
                    placeholder="Search surveys, locations, or observers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="species">Sort by Species Count</option>
                </select>
              </div>
            </div>

            {/* Surveys List */}
            <div className="space-y-4">
              {filteredSurveys.map((survey) => {
                const StatusIcon = statusIcons[survey.status]
                return (
                  <div key={survey.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{survey.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[survey.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {survey.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {survey.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(survey.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {survey.observer}
                          </div>
                          <div className="flex items-center">
                            <Camera className="h-4 w-4 mr-2" />
                            {survey.species_count} species, {survey.images} photos
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded-md">
                          <strong>Weather:</strong> {survey.weather}<br />
                          <strong>Notes:</strong> {survey.notes}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredSurveys.length === 0 && (
              <div className="text-center py-12">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first field survey.
                </p>
                <div className="mt-6">
                  <button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Survey
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