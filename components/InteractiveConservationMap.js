import { useState, useEffect, useRef } from 'react'
import { 
  Map, Layers, MapPin, Satellite, Navigation, Search, Filter,
  Plus, Eye, Edit, Trash2, Camera, Download, Settings,
  TrendingUp, AlertTriangle, CheckCircle, Activity
} from 'lucide-react'

// Simulated map data for conservation sites
const conservationSites = [
  {
    id: 1,
    name: 'Amazon Rainforest Conservation Area',
    coordinates: [-59.9756, -3.1190],
    type: 'Forest Conservation',
    status: 'active',
    threat_level: 7,
    species_count: 2847,
    area_size: '15,000 hectares',
    last_survey: '2024-11-15',
    conservation_score: 8.2,
    team_size: 12,
    recent_activity: 'Species monitoring completed'
  },
  {
    id: 2,
    name: 'Great Barrier Reef Marine Protected Area',
    coordinates: [145.7781, -16.2839],
    type: 'Marine Conservation',
    status: 'critical',
    threat_level: 9,
    species_count: 1625,
    area_size: '344,400 km²',
    last_survey: '2024-11-20',
    conservation_score: 6.8,
    team_size: 28,
    recent_activity: 'Coral bleaching assessment'
  },
  {
    id: 3,
    name: 'Serengeti Wildlife Corridor',
    coordinates: [34.8333, -2.3333],
    type: 'Wildlife Protection',
    status: 'active',
    threat_level: 5,
    species_count: 1456,
    area_size: '30,000 km²',
    last_survey: '2024-11-10',
    conservation_score: 7.9,
    team_size: 18,
    recent_activity: 'Migration tracking updated'
  },
  {
    id: 4,
    name: 'Yellowstone Ecosystem Restoration',
    coordinates: [-110.5885, 44.4280],
    type: 'Ecosystem Restoration',
    status: 'seasonal',
    threat_level: 3,
    species_count: 987,
    area_size: '8,983 km²',
    last_survey: '2024-10-25',
    conservation_score: 8.7,
    team_size: 15,
    recent_activity: 'Wolf population study'
  },
  {
    id: 5,
    name: 'Madagascar Lemur Sanctuary',
    coordinates: [47.5079, -18.7669],
    type: 'Species Protection',
    status: 'active',
    threat_level: 8,
    species_count: 234,
    area_size: '2,500 hectares',
    last_survey: '2024-11-18',
    conservation_score: 6.3,
    team_size: 8,
    recent_activity: 'Habitat restoration phase 2'
  }
]

const mapLayers = [
  { id: 'satellite', name: 'Satellite View', active: true },
  { id: 'terrain', name: 'Terrain', active: false },
  { id: 'conservation', name: 'Conservation Areas', active: true },
  { id: 'threats', name: 'Threat Zones', active: true },
  { id: 'species', name: 'Species Distribution', active: false },
  { id: 'water', name: 'Water Bodies', active: false },
  { id: 'roads', name: 'Access Routes', active: false }
]

export default function InteractiveConservationMap({ 
  onSiteSelect = () => {}, 
  onSiteCreate = () => {},
  onSiteEdit = () => {},
  showControls = true 
}) {
  const [activeLayers, setActiveLayers] = useState(
    mapLayers.filter(layer => layer.active).map(layer => layer.id)
  )
  const [selectedSite, setSelectedSite] = useState(null)
  const [mapMode, setMapMode] = useState('view') // 'view', 'edit', 'create'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [hoveredSite, setHoveredSite] = useState(null)
  const mapRef = useRef(null)

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'critical': return '#EF4444'
      case 'seasonal': return '#F59E0B'
      default: return '#6B7280'
    }
  }

  const getThreatColor = (level) => {
    if (level >= 8) return '#DC2626'
    if (level >= 6) return '#F59E0B'
    if (level >= 4) return '#10B981'
    return '#3B82F6'
  }

  const filteredSites = conservationSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || site.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleSiteClick = (site) => {
    setSelectedSite(site)
    onSiteSelect(site)
  }

  const renderMapMarker = (site) => {
    const isSelected = selectedSite?.id === site.id
    const isHovered = hoveredSite?.id === site.id
    const scale = isSelected ? 1.3 : isHovered ? 1.1 : 1

    return (
      <div
        key={site.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
        style={{
          left: `${((site.coordinates[0] + 180) / 360) * 100}%`,
          top: `${((90 - site.coordinates[1]) / 180) * 100}%`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          zIndex: isSelected ? 20 : isHovered ? 15 : 10
        }}
        onClick={() => handleSiteClick(site)}
        onMouseEnter={() => setHoveredSite(site)}
        onMouseLeave={() => setHoveredSite(null)}
      >
        <div 
          className={`
            w-4 h-4 rounded-full border-2 border-white shadow-lg
            ${isSelected ? 'ring-4 ring-blue-300' : ''}
          `}
          style={{ backgroundColor: getStatusColor(site.status) }}
        />
        {site.threat_level >= 7 && (
          <div className="absolute -top-1 -right-1">
            <AlertTriangle className="h-3 w-3 text-red-500" />
          </div>
        )}
      </div>
    )
  }

  const renderSiteInfo = (site) => (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{site.name}</h3>
          <p className="text-xs text-gray-600">{site.type}</p>
        </div>
        <div className="flex items-center space-x-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(site.status) }}
          />
          <span className="text-xs text-gray-600 capitalize">{site.status}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Species Count:</span>
          <span className="font-medium">{site.species_count.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Area Size:</span>
          <span className="font-medium">{site.area_size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Threat Level:</span>
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: getThreatColor(site.threat_level) }}
            />
            <span className="font-medium">{site.threat_level}/10</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Conservation Score:</span>
          <span className="font-medium">{site.conservation_score}/10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Team Size:</span>
          <span className="font-medium">{site.team_size} members</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-gray-600">Recent Activity:</p>
          <p className="font-medium">{site.recent_activity}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => onSiteEdit(site)}
          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
        >
          <Edit className="h-3 w-3 inline mr-1" />
          Edit
        </button>
        <button
          onClick={() => alert(`Generating report for ${site.name}`)}
          className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
        >
          <Download className="h-3 w-3 inline mr-1" />
          Report
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="relative w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-blue-300"
        style={{
          backgroundImage: activeLayers.includes('satellite') 
            ? 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")'
            : 'none'
        }}
      >
        {/* Conservation Site Markers */}
        {filteredSites.map(site => renderMapMarker(site))}

        {/* Hover Tooltip */}
        {hoveredSite && (
          <div 
            className="absolute pointer-events-none z-30"
            style={{
              left: `${((hoveredSite.coordinates[0] + 180) / 360) * 100}%`,
              top: `${((90 - hoveredSite.coordinates[1]) / 180) * 100 - 10}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
              {hoveredSite.name}
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Search and Filter Bar */}
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conservation sites..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Forest Conservation">Forest Conservation</option>
                  <option value="Marine Conservation">Marine Conservation</option>
                  <option value="Wildlife Protection">Wildlife Protection</option>
                  <option value="Ecosystem Restoration">Ecosystem Restoration</option>
                  <option value="Species Protection">Species Protection</option>
                </select>
                <button
                  onClick={() => setShowLayerPanel(!showLayerPanel)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  <Layers className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Layer Control Panel */}
          {showLayerPanel && (
            <div className="absolute top-20 right-4 z-20">
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-64">
                <h3 className="font-semibold text-gray-900 mb-3">Map Layers</h3>
                <div className="space-y-2">
                  {mapLayers.map(layer => (
                    <label key={layer.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeLayers.includes(layer.id)}
                        onChange={() => toggleLayer(layer.id)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{layer.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Site Information Panel */}
          {selectedSite && (
            <div className="absolute bottom-4 right-4 z-20">
              {renderSiteInfo(selectedSite)}
            </div>
          )}

          {/* Map Tools */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setMapMode('create')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md"
                  title="Add New Site"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => alert('Map export feature coming soon!')}
                  className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md"
                  title="Export Map"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => alert('Satellite view toggle')}
                  className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-md"
                  title="Toggle Satellite"
                >
                  <Satellite className="h-4 w-4" />
                </button>
                <button
                  onClick={() => alert('Map settings')}
                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-80 z-20">
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Site Status</h4>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Seasonal</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Site Statistics */}
      <div className="absolute top-20 left-4 z-20">
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Overview</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Sites:</span>
              <span className="font-medium">{filteredSites.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active:</span>
              <span className="font-medium text-green-600">
                {filteredSites.filter(s => s.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Critical:</span>
              <span className="font-medium text-red-600">
                {filteredSites.filter(s => s.status === 'critical').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Threat:</span>
              <span className="font-medium">
                {(filteredSites.reduce((sum, s) => sum + s.threat_level, 0) / filteredSites.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
