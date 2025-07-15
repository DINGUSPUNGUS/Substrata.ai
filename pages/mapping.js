import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
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
  Navigation
} from 'lucide-react'

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
})

const mapLayers = [
  { id: 'satellite', name: 'Satellite', icon: Satellite, active: true },
  { id: 'terrain', name: 'Terrain', icon: Map, active: false },
  { id: 'survey_sites', name: 'Survey Sites', icon: MapPin, active: true },
  { id: 'observations', name: 'Observations', icon: Camera, active: true },
  { id: 'habitats', name: 'Habitat Zones', icon: Layers, active: false },
  { id: 'protected_areas', name: 'Protected Areas', icon: Filter, active: false }
]

const surveyData = [
  {
    id: 1,
    name: 'Lamar Valley Wildlife Corridor',
    coordinates: [-110.1234, 44.9876],
    type: 'Wildlife Survey',
    last_survey: '2024-12-01',
    species_count: 15,
    status: 'active'
  },
  {
    id: 2,
    name: 'Hayden Valley Wetlands',
    coordinates: [-110.4567, 44.5678],
    type: 'Wetland Assessment',
    last_survey: '2024-11-28',
    species_count: 28,
    status: 'active'
  },
  {
    id: 3,
    name: 'Tower Creek Research Station',
    coordinates: [-110.8901, 44.8901],
    type: 'Forest Monitoring',
    last_survey: '2024-11-20',
    species_count: 12,
    status: 'seasonal'
  }
]

export default function GISMapping() {
  const [activeLayers, setActiveLayers] = useState(
    mapLayers.filter(layer => layer.active).map(layer => layer.id)
  )
  const [selectedSite, setSelectedSite] = useState(null)
  const [mapCenter, setMapCenter] = useState([-110.5, 44.7])
  const [mapZoom, setMapZoom] = useState(10)
  const [showSidebar, setShowSidebar] = useState(true)

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    )
  }

  return (
    <>
      <Head>
        <title>GIS Mapping - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Interactive mapping for conservation data visualization" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 ml-64 relative">
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-900">GIS Conservation Mapping</h1>
                  <span className="text-sm text-gray-500">Interactive wildlife and habitat data visualization</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="btn-secondary flex items-center text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  <button className="btn-secondary flex items-center text-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button className="btn-primary flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </button>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-screen pt-20 relative">
              {/* Layer Control Panel */}
              <div className={`absolute top-4 left-4 z-30 bg-white rounded-lg shadow-lg border border-gray-200 transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Map Layers</h3>
                    <button 
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Layers className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {mapLayers.map((layer) => (
                    <div key={layer.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`layer-${layer.id}`}
                        checked={activeLayers.includes(layer.id)}
                        onChange={() => toggleLayer(layer.id)}
                        className="h-4 w-4 text-conservation-600 focus:ring-conservation-500 border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`layer-${layer.id}`}
                        className="ml-3 flex items-center text-sm text-gray-700 cursor-pointer"
                      >
                        <layer.icon className="h-4 w-4 mr-2 text-gray-500" />
                        {layer.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Information Panel */}
              {selectedSite && (
                <div className="absolute top-4 right-4 z-30 bg-white rounded-lg shadow-lg border border-gray-200 w-80">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Site Information</h3>
                      <button 
                        onClick={() => setSelectedSite(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedSite.name}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedSite.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Survey:</span>
                        <span className="font-medium">{selectedSite.last_survey}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Species Count:</span>
                        <span className="font-medium">{selectedSite.species_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium capitalize ${
                          selectedSite.status === 'active' ? 'text-green-600' : 
                          selectedSite.status === 'seasonal' ? 'text-yellow-600' : 
                          'text-gray-600'
                        }`}>
                          {selectedSite.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinates:</span>
                        <span className="font-medium text-xs">
                          {selectedSite.coordinates[1].toFixed(4)}, {selectedSite.coordinates[0].toFixed(4)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 btn-secondary text-xs py-1">
                        View Details
                      </button>
                      <button className="flex-1 btn-primary text-xs py-1">
                        New Survey
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 right-4 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-conservation-500 rounded-full mr-2"></div>
                    <span>Active Survey Sites</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Seasonal Sites</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Recent Observations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>Protected Areas</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute bottom-4 left-4 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <div className="flex flex-col space-y-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <Navigation className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded font-bold"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded font-bold"
                  >
                    −
                  </button>
                </div>
              </div>

              {/* Map Component */}
              <div className="h-full w-full">
                <MapComponent
                  center={mapCenter}
                  zoom={mapZoom}
                  activeLayers={activeLayers}
                  surveyData={surveyData}
                  onSiteSelect={setSelectedSite}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
