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
  AlertTriangle,
  Save,
  X,
  Upload,
  FileText
} from 'lucide-react'

const initialSurveys = [
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
    notes: 'Observed increased wolf pack activity near Lamar Valley',
    coordinates: { lat: 44.4280, lng: -110.5885 },
    duration: '6 hours',
    equipment: ['Binoculars', 'Camera', 'GPS tracker', 'Field notebook']
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
    notes: 'Peak migration period, high waterfowl activity',
    coordinates: { lat: 41.9583, lng: -82.5169 },
    duration: '4 hours',
    equipment: ['Spotting scope', 'Camera', 'Bird guide', 'Counter']
  },
  {
    id: 3,
    name: 'Forest Biodiversity Assessment',
    location: 'Olympic National Park, WA',
    date: '2024-12-05',
    status: 'planned',
    species_count: 0,
    observer: 'Dr. Maria Santos',
    weather: 'Scheduled for clear day',
    images: 0,
    notes: 'Comprehensive biodiversity survey of old-growth forest',
    coordinates: { lat: 47.8021, lng: -123.6044 },
    duration: '8 hours',
    equipment: ['Plant press', 'Magnifying glass', 'Camera', 'Measuring tape']
  }
]

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  planned: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  planned: AlertTriangle,
  cancelled: Trash2
}

export default function Surveys() {
  const [surveys, setSurveys] = useState(initialSurveys)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showModal, setShowModal] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    observer: '',
    weather: '',
    notes: '',
    equipment: [],
    duration: '',
    coordinates: { lat: '', lng: '' }
  })
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

  const openModal = (survey = null) => {
    if (survey) {
      setSelectedSurvey(survey)
      setFormData(survey)
      setEditMode(true)
    } else {
      setSelectedSurvey(null)
      setFormData({
        name: '',
        location: '',
        date: '',
        observer: '',
        weather: '',
        notes: '',
        equipment: [],
        duration: '',
        coordinates: { lat: '', lng: '' }
      })
      setEditMode(false)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSurvey(null)
    setEditMode(false)
  }

  const handleSave = () => {
    if (editMode && selectedSurvey) {
      setSurveys(surveys.map(survey => 
        survey.id === selectedSurvey.id 
          ? { ...formData, id: selectedSurvey.id, status: formData.status || 'planned', species_count: formData.species_count || 0, images: formData.images || 0 }
          : survey
      ))
    } else {
      const newSurvey = {
        ...formData,
        id: Math.max(...surveys.map(s => s.id)) + 1,
        status: 'planned',
        species_count: 0,
        images: 0
      }
      setSurveys([...surveys, newSurvey])
    }
    closeModal()
  }

  const deleteSurvey = (surveyId) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      setSurveys(surveys.filter(survey => survey.id !== surveyId))
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(filteredSurveys, null, 2)
    const dataBlob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'survey_data.json'
    link.click()
  }

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
                <button 
                  onClick={exportData}
                  className="btn-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button 
                  onClick={() => openModal()}
                  className="btn-primary flex items-center"
                >
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
                    <option value="planned">Planned</option>
                    <option value="cancelled">Cancelled</option>
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
                        <button 
                          onClick={() => openModal(survey)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openModal(survey)}
                          className="p-2 text-gray-400 hover:text-conservation-600 hover:bg-conservation-50 rounded-md"
                          title="Edit Survey"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteSurvey(survey.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete Survey"
                        >
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
                  <button 
                    onClick={() => openModal()}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Survey
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Survey Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editMode ? 'Edit Survey' : 'Create New Survey'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Survey Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="Enter survey name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="Enter survey location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observer *
                    </label>
                    <input
                      type="text"
                      value={formData.observer}
                      onChange={(e) => setFormData({...formData, observer: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="Enter observer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weather Conditions
                    </label>
                    <input
                      type="text"
                      value={formData.weather}
                      onChange={(e) => setFormData({...formData, weather: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="e.g., Clear, 15°C, Light wind"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="e.g., 4 hours"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordinates (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="any"
                        value={formData.coordinates?.lat || ''}
                        onChange={(e) => setFormData({...formData, coordinates: {...formData.coordinates, lat: e.target.value}})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        step="any"
                        value={formData.coordinates?.lng || ''}
                        onChange={(e) => setFormData({...formData, coordinates: {...formData.coordinates, lng: e.target.value}})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(formData.equipment) ? formData.equipment.join(', ') : formData.equipment || ''}
                      onChange={(e) => setFormData({...formData, equipment: e.target.value.split(',').map(item => item.trim())})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="Enter equipment (comma separated)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      placeholder="Enter survey notes and observations"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-conservation-600 text-white rounded-md hover:bg-conservation-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editMode ? 'Update Survey' : 'Create Survey'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}