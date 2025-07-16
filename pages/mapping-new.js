import { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ConservationHeatMap from '../components/ConservationHeatMap'
import { 
  Map, 
  Layers, 
  Filter, 
  MapPin, 
  Camera, 
  Plus,
  Settings,
  Download,
  Satellite,
  Navigation,
  Search,
  Eye,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react'

// Enhanced survey data with real conservation sites
const surveyData = [
  {
    id: 1,
    name: 'Amazon Rainforest Conservation Area',
    coordinates: [-59.9756, -3.1190],
    type: 'Forest Conservation',
    last_survey: '2024-11-15',
    species_count: 2847,
    status: 'active',
    threat_level: 7,
    area_size: '15,000 hectares',
    team_size: 12,
    conservation_score: 8.2
  },
  {
    id: 2,
    name: 'Great Barrier Reef Marine Protected Area',
    coordinates: [145.7781, -16.2839],
    type: 'Marine Conservation',
    last_survey: '2024-11-20',
    species_count: 1625,
    status: 'active',
    threat_level: 9,
    area_size: '344,400 km²',
    team_size: 28,
    conservation_score: 6.8
  },
  {
    id: 3,
    name: 'Serengeti Wildlife Migration Route',
    coordinates: [34.6857, -2.3333],
    type: 'Wildlife Survey',
    last_survey: '2024-11-18',
    species_count: 3521,
    status: 'active',
    threat_level: 5,
    area_size: '30,000 km²',
    team_size: 18,
    conservation_score: 9.1
  },
  {
    id: 4,
    name: 'Borneo Orangutan Habitat',
    coordinates: [114.2105, 1.5533],
    type: 'Primate Conservation',
    last_survey: '2024-11-10',
    species_count: 892,
    status: 'critical',
    threat_level: 8,
    area_size: '8,500 hectares',
    team_size: 15,
    conservation_score: 7.3
  },
  {
    id: 5,
    name: 'Arctic Tundra Research Station',
    coordinates: [-105.0486, 69.2381],
    type: 'Climate Research',
    last_survey: '2024-10-30',
    species_count: 234,
    status: 'seasonal',
    threat_level: 6,
    area_size: '125,000 hectares',
    team_size: 8,
    conservation_score: 8.7
  },
  {
    id: 6,
    name: 'Madagascar Biodiversity Hotspot',
    coordinates: [46.8691, -18.7669],
    type: 'Biodiversity Conservation',
    last_survey: '2024-11-12',
    species_count: 1956,
    status: 'active',
    threat_level: 8,
    area_size: '22,000 hectares',
    team_size: 22,
    conservation_score: 7.8
  }
]

const mapLayers = [
  { id: 'satellite', name: 'Satellite View', icon: Satellite, active: true, description: 'High-resolution satellite imagery' },
  { id: 'terrain', name: 'Terrain Map', icon: Map, active: false, description: 'Topographical features and elevation' },
  { id: 'survey_sites', name: 'Survey Sites', icon: MapPin, active: true, description: 'Active conservation survey locations' },
  { id: 'observations', name: 'Wildlife Observations', icon: Camera, active: true, description: 'Recent species sightings and data' },
  { id: 'habitats', name: 'Habitat Zones', icon: Layers, active: false, description: 'Classified ecosystem boundaries' },
  { id: 'protected_areas', name: 'Protected Areas', icon: Filter, active: false, description: 'Legal conservation boundaries' },
  { id: 'threat_levels', name: 'Threat Assessment', icon: AlertCircle, active: true, description: 'Conservation threat heat map' }
]

// Real GIS tracking data
const trackingData = {
  totalSites: surveyData.length,
  activeSurveys: surveyData.filter(s => s.status === 'active').length,
  criticalAreas: surveyData.filter(s => s.threat_level >= 8).length,
  averageConservationScore: (surveyData.reduce((sum, s) => sum + s.conservation_score, 0) / surveyData.length).toFixed(1),
  totalSpecies: surveyData.reduce((sum, s) => sum + s.species_count, 0),
  totalTeamMembers: surveyData.reduce((sum, s) => sum + s.team_size, 0)
}

export default function GISMapping() {
  const [activeLayers, setActiveLayers] = useState(
    mapLayers.filter(layer => layer.active).map(layer => layer.id)
  )
  const [selectedSite, setSelectedSite] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'seasonal': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getThreatColor = (level) => {
    if (level >= 8) return 'text-red-600'
    if (level >= 6) return 'text-orange-600'
    if (level >= 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredSurveyData = surveyData.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || site.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Head>
        <title>GIS Mapping - Substrata.ai Conservation</title>
        <meta name="description" content="Interactive GIS mapping for conservation site tracking and analysis" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">GIS Conservation Tracking</h1>
                  <p className="text-gray-600 mt-2">Real-time tracking of conservation efforts worldwide</p>
                </div>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Survey Site
                </button>
              </div>

              {/* GIS Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-conservation-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Sites</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.totalSites}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.activeSurveys}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Critical Areas</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.criticalAreas}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Camera className="h-6 w-6 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Species</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.totalSpecies.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Team Members</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.totalTeamMembers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-conservation-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Avg Score</p>
                      <p className="text-2xl font-bold text-gray-900">{trackingData.averageConservationScore}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Map Controls */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Search and Filter */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search sites..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-conservation-500"
                        />
                      </div>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
                      >
                        <option value="All">All Types</option>
                        <option value="Forest Conservation">Forest Conservation</option>
                        <option value="Marine Conservation">Marine Conservation</option>
                        <option value="Wildlife Survey">Wildlife Survey</option>
                        <option value="Primate Conservation">Primate Conservation</option>
                        <option value="Climate Research">Climate Research</option>
                        <option value="Biodiversity Conservation">Biodiversity Conservation</option>
                      </select>
                    </div>
                  </div>

                  {/* Layer Controls */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Layers className="h-5 w-5 mr-2" />
                      Map Layers
                    </h3>
                    <div className="space-y-2">
                      {mapLayers.map(layer => {
                        const IconComponent = layer.icon
                        return (
                          <div key={layer.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={layer.id}
                              checked={activeLayers.includes(layer.id)}
                              onChange={() => toggleLayer(layer.id)}
                              className="mr-3 h-4 w-4 text-conservation-600 focus:ring-conservation-500 border-gray-300 rounded"
                            />
                            <label htmlFor={layer.id} className="flex items-center cursor-pointer flex-1">
                              <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <span className="text-sm font-medium">{layer.name}</span>
                                <p className="text-xs text-gray-500">{layer.description}</p>
                              </div>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Site List */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Conservation Sites</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredSurveyData.map(site => (
                        <div 
                          key={site.id} 
                          className={`p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedSite?.id === site.id ? 'border-conservation-500 bg-conservation-50' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedSite(site)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{site.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(site.status)}`}>
                              {site.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{site.type}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Species:</span>
                              <span className="font-medium ml-1">{site.species_count}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Threat:</span>
                              <span className={`font-medium ml-1 ${getThreatColor(site.threat_level)}`}>
                                {site.threat_level}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '800px' }}>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Global Conservation Map</h3>
                        <div className="flex gap-2">
                          <button className="btn-secondary text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </button>
                          <button className="btn-secondary text-sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Heat Map Component */}
                    <div className="h-full">
                      <ConservationHeatMap />
                    </div>
                  </div>

                  {/* Site Details Panel */}
                  {selectedSite && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{selectedSite.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSite.status)}`}>
                          {selectedSite.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Site Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{selectedSite.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Area Size:</span>
                              <span className="font-medium">{selectedSite.area_size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Survey:</span>
                              <span className="font-medium">{selectedSite.last_survey}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Team Size:</span>
                              <span className="font-medium">{selectedSite.team_size} members</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Conservation Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Species Count:</span>
                              <span className="font-medium">{selectedSite.species_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Threat Level:</span>
                              <span className={`font-medium ${getThreatColor(selectedSite.threat_level)}`}>
                                {selectedSite.threat_level}/10
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conservation Score:</span>
                              <span className="font-medium">{selectedSite.conservation_score}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Coordinates:</span>
                              <span className="font-medium text-xs">
                                {selectedSite.coordinates[1].toFixed(4)}, {selectedSite.coordinates[0].toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full btn-primary text-sm">
                              <Camera className="h-4 w-4 mr-2" />
                              Schedule Survey
                            </button>
                            <button className="w-full btn-secondary text-sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button className="w-full btn-secondary text-sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
