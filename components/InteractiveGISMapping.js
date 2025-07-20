import { useState, useEffect, useRef } from 'react'
import { 
  Map, Layers, Filter, Search, Upload, Download, 
  MapPin, Satellite, Navigation, ZoomIn, ZoomOut,
  Settings, Eye, EyeOff, Calendar, BarChart3,
  FileImage, Database, Crosshair, Move, Square
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function InteractiveGISMapping() {
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [sites, setSites] = useState([])
  const [species, setSpecies] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [mapLayers, setMapLayers] = useState({
    surveys: { visible: true, style: 'pins' }, // pins, heatmap, clusters
    sites: { visible: true, style: 'polygons' },
    species: { visible: false, style: 'density' },
    projects: { visible: false, style: 'boundaries' },
    satellite: { visible: false },
    terrain: { visible: false },
    custom: { visible: false, files: [] }
  })
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    species: [],
    projects: [],
    conservationStatus: [],
    surveyType: 'all'
  })
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showLayerPanel, setShowLayerPanel] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [mapStyle, setMapStyle] = useState('streets') // streets, satellite, hybrid, terrain
  const [drawingMode, setDrawingMode] = useState(null) // null, 'point', 'polygon', 'line'
  const [measurements, setMeasurements] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Map styles configuration
  const mapStyles = [
    { value: 'streets', label: 'Streets', preview: '#f8f9fa' },
    { value: 'satellite', label: 'Satellite', preview: '#2d5016' },
    { value: 'hybrid', label: 'Hybrid', preview: '#4a5d2a' },
    { value: 'terrain', label: 'Terrain', preview: '#8b7355' },
    { value: 'dark', label: 'Dark', preview: '#1a1a1a' }
  ]

  // Data visualization styles
  const visualizationStyles = [
    { value: 'pins', label: 'Map Pins', icon: MapPin },
    { value: 'heatmap', label: 'Heat Map', icon: BarChart3 },
    { value: 'clusters', label: 'Clusters', icon: Layers },
    { value: 'density', label: 'Density', icon: Eye }
  ]

  useEffect(() => {
    loadData()
    initializeMap()
  }, [])

  useEffect(() => {
    if (mapInstance) {
      updateMapLayers()
    }
  }, [mapLayers, filters, surveys, sites, species])

  const loadData = async () => {
    setLoading(true)
    try {
      const [surveysResult, sitesResult, speciesResult, projectsResult] = await Promise.all([
        dataManager.read('surveys'),
        dataManager.read('survey_sites'),
        dataManager.read('species_observations'),
        dataManager.read('projects')
      ])

      if (surveysResult.success) setSurveys(surveysResult.data)
      if (sitesResult.success) setSites(sitesResult.data)
      if (speciesResult.success) setSpecies(speciesResult.data)
      if (projectsResult.success) setProjects(projectsResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeMap = () => {
    // This would initialize your preferred mapping library (Leaflet, Mapbox, etc.)
    // For demo purposes, we'll simulate map initialization
    setTimeout(() => {
      setMapInstance({
        center: [40.7128, -74.0060], // New York coordinates as example
        zoom: 10,
        layers: new Map(),
        markers: new Map(),
        polygons: new Map()
      })
    }, 1000)
  }

  const updateMapLayers = () => {
    if (!mapInstance) return

    // Filter data based on current filters
    const filteredSurveys = surveys.filter(survey => {
      const surveyDate = new Date(survey.date)
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01')
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-12-31')
      
      const dateMatch = surveyDate >= startDate && surveyDate <= endDate
      const projectMatch = filters.projects.length === 0 || filters.projects.includes(survey.project_id)
      
      return dateMatch && projectMatch
    })

    const filteredSpecies = species.filter(observation => {
      const speciesMatch = filters.species.length === 0 || filters.species.includes(observation.species_name)
      const statusMatch = filters.conservationStatus.length === 0 || 
                         filters.conservationStatus.includes(observation.conservation_status)
      const surveyMatch = filteredSurveys.some(s => s.id === observation.survey_id)
      
      return speciesMatch && statusMatch && surveyMatch
    })

    // Update survey layer
    if (mapLayers.surveys.visible) {
      updateSurveyLayer(filteredSurveys, mapLayers.surveys.style)
    }

    // Update sites layer
    if (mapLayers.sites.visible) {
      updateSitesLayer(sites, mapLayers.sites.style)
    }

    // Update species layer
    if (mapLayers.species.visible) {
      updateSpeciesLayer(filteredSpecies, mapLayers.species.style)
    }

    // Update projects layer
    if (mapLayers.projects.visible) {
      updateProjectsLayer(projects, mapLayers.projects.style)
    }
  }

  const updateSurveyLayer = (surveyData, style) => {
    // Clear existing survey markers
    mapInstance.markers.clear()

    surveyData.forEach(survey => {
      if (survey.gps_coordinates) {
        const [lat, lng] = survey.gps_coordinates.split(',').map(Number)
        
        if (style === 'pins') {
          addMapPin(lat, lng, {
            type: 'survey',
            data: survey,
            popup: createSurveyPopup(survey)
          })
        } else if (style === 'clusters') {
          addToCluster(lat, lng, survey)
        }
      }
    })

    if (style === 'heatmap') {
      createHeatmap(surveyData)
    }
  }

  const updateSitesLayer = (siteData, style) => {
    siteData.forEach(site => {
      if (site.boundary_coordinates) {
        if (style === 'polygons') {
          addPolygon(site.boundary_coordinates, {
            type: 'site',
            data: site,
            popup: createSitePopup(site),
            style: {
              fillColor: '#10B981',
              fillOpacity: 0.3,
              strokeColor: '#059669',
              strokeWeight: 2
            }
          })
        }
      } else if (site.gps_coordinates) {
        const [lat, lng] = site.gps_coordinates.split(',').map(Number)
        addMapPin(lat, lng, {
          type: 'site',
          data: site,
          popup: createSitePopup(site),
          icon: 'site'
        })
      }
    })
  }

  const updateSpeciesLayer = (speciesData, style) => {
    if (style === 'density') {
      createSpeciesDensityMap(speciesData)
    } else if (style === 'pins') {
      speciesData.forEach(observation => {
        const survey = surveys.find(s => s.id === observation.survey_id)
        if (survey && survey.gps_coordinates) {
          const [lat, lng] = survey.gps_coordinates.split(',').map(Number)
          addMapPin(lat, lng, {
            type: 'species',
            data: observation,
            popup: createSpeciesPopup(observation),
            icon: getSpeciesIcon(observation.conservation_status)
          })
        }
      })
    }
  }

  const updateProjectsLayer = (projectData, style) => {
    projectData.forEach(project => {
      if (project.boundary_coordinates) {
        addPolygon(project.boundary_coordinates, {
          type: 'project',
          data: project,
          popup: createProjectPopup(project),
          style: {
            fillColor: '#3B82F6',
            fillOpacity: 0.2,
            strokeColor: '#2563EB',
            strokeWeight: 2,
            strokeDashArray: '5,5'
          }
        })
      }
    })
  }

  // Popup creators
  const createSurveyPopup = (survey) => {
    const surveySpecies = species.filter(s => s.survey_id === survey.id)
    const site = sites.find(s => s.id === survey.site_id)
    
    return `
      <div class="p-3 min-w-64">
        <h3 class="font-bold text-lg mb-2">Survey Details</h3>
        <p><strong>Date:</strong> ${new Date(survey.date).toLocaleDateString()}</p>
        <p><strong>Site:</strong> ${site?.name || 'Unknown'}</p>
        <p><strong>Surveyor:</strong> ${survey.surveyor_name}</p>
        <p><strong>Duration:</strong> ${survey.duration_minutes} minutes</p>
        <p><strong>Weather:</strong> ${survey.weather_conditions}</p>
        <p><strong>Species Observed:</strong> ${surveySpecies.length}</p>
        <div class="mt-3">
          <button onclick="viewSurveyDetails('${survey.id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm">
            View Details
          </button>
        </div>
      </div>
    `
  }

  const createSitePopup = (site) => {
    const siteSurveys = surveys.filter(s => s.site_id === site.id)
    
    return `
      <div class="p-3 min-w-64">
        <h3 class="font-bold text-lg mb-2">${site.name}</h3>
        <p><strong>Type:</strong> ${site.habitat_type}</p>
        <p><strong>Area:</strong> ${site.area_hectares} hectares</p>
        <p><strong>Elevation:</strong> ${site.elevation_meters}m</p>
        <p><strong>Access:</strong> ${site.access_difficulty}</p>
        <p><strong>Surveys:</strong> ${siteSurveys.length}</p>
        <p class="mt-2 text-sm text-gray-600">${site.description}</p>
        <div class="mt-3">
          <button onclick="viewSiteDetails('${site.id}')" class="bg-green-500 text-white px-3 py-1 rounded text-sm">
            View Site
          </button>
        </div>
      </div>
    `
  }

  const createSpeciesPopup = (observation) => {
    const survey = surveys.find(s => s.id === observation.survey_id)
    
    return `
      <div class="p-3 min-w-64">
        <h3 class="font-bold text-lg mb-2">${observation.species_name}</h3>
        <p><strong>Count:</strong> ${observation.count || 1}</p>
        <p><strong>Status:</strong> <span class="px-2 py-1 rounded text-xs ${getStatusColor(observation.conservation_status)}">${observation.conservation_status}</span></p>
        <p><strong>Behavior:</strong> ${observation.behavior}</p>
        <p><strong>Date:</strong> ${survey ? new Date(survey.date).toLocaleDateString() : 'Unknown'}</p>
        ${observation.notes ? `<p><strong>Notes:</strong> ${observation.notes}</p>` : ''}
        <div class="mt-3">
          <button onclick="viewSpeciesDetails('${observation.id}')" class="bg-purple-500 text-white px-3 py-1 rounded text-sm">
            View Details
          </button>
        </div>
      </div>
    `
  }

  const createProjectPopup = (project) => {
    const projectSurveys = surveys.filter(s => s.project_id === project.id)
    
    return `
      <div class="p-3 min-w-64">
        <h3 class="font-bold text-lg mb-2">${project.name}</h3>
        <p><strong>Status:</strong> ${project.status}</p>
        <p><strong>Start Date:</strong> ${new Date(project.start_date).toLocaleDateString()}</p>
        <p><strong>Funding:</strong> $${project.funding_amount?.toLocaleString()}</p>
        <p><strong>Surveys:</strong> ${projectSurveys.length}</p>
        <p class="mt-2 text-sm text-gray-600">${project.description}</p>
        <div class="mt-3">
          <button onclick="viewProjectDetails('${project.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            View Project
          </button>
        </div>
      </div>
    `
  }

  // Utility functions
  const getStatusColor = (status) => {
    const colors = {
      'Endangered': 'bg-red-100 text-red-800',
      'Threatened': 'bg-orange-100 text-orange-800',
      'Vulnerable': 'bg-yellow-100 text-yellow-800',
      'Near Threatened': 'bg-blue-100 text-blue-800',
      'Least Concern': 'bg-green-100 text-green-800',
      'Data Deficient': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getSpeciesIcon = (status) => {
    const icons = {
      'Endangered': 'red-marker',
      'Threatened': 'orange-marker',
      'Vulnerable': 'yellow-marker',
      'Near Threatened': 'blue-marker',
      'Least Concern': 'green-marker',
      'Data Deficient': 'gray-marker'
    }
    return icons[status] || 'gray-marker'
  }

  // Map interaction functions
  const addMapPin = (lat, lng, options) => {
    // Implementation would depend on your mapping library
    console.log('Adding pin at:', lat, lng, options)
  }

  const addPolygon = (coordinates, options) => {
    // Implementation would depend on your mapping library
    console.log('Adding polygon:', coordinates, options)
  }

  const createHeatmap = (data) => {
    // Implementation would create a heatmap visualization
    console.log('Creating heatmap with data:', data.length, 'points')
  }

  const createSpeciesDensityMap = (speciesData) => {
    // Implementation would create species density visualization
    console.log('Creating species density map with:', speciesData.length, 'observations')
  }

  const addToCluster = (lat, lng, data) => {
    // Implementation would add point to clustering system
    console.log('Adding to cluster:', lat, lng, data)
  }

  // File upload handlers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
      if (file.name.endsWith('.geojson') || file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = file.name.endsWith('.geojson') ? JSON.parse(e.target.result) : e.target.result
            addCustomLayer(file.name, data)
            setUploadedFiles(prev => [...prev, { name: file.name, type: file.type, data }])
          } catch (error) {
            alert(`Error loading file ${file.name}: ${error.message}`)
          }
        }
        reader.readAsText(file)
      } else if (file.type.startsWith('image/')) {
        // Handle image overlays
        const reader = new FileReader()
        reader.onload = (e) => {
          addImageOverlay(file.name, e.target.result)
          setUploadedFiles(prev => [...prev, { name: file.name, type: file.type, data: e.target.result }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const addCustomLayer = (name, data) => {
    // Implementation would add custom geographic data layer
    console.log('Adding custom layer:', name, data)
  }

  const addImageOverlay = (name, imageData) => {
    // Implementation would add image overlay to map
    console.log('Adding image overlay:', name)
  }

  // Export functions
  const exportMapData = () => {
    const mapData = {
      surveys: surveys.filter(survey => {
        const surveyDate = new Date(survey.date)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01')
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-12-31')
        return surveyDate >= startDate && surveyDate <= endDate
      }),
      sites,
      species,
      projects,
      layers: mapLayers,
      filters,
      bounds: mapInstance ? {
        center: mapInstance.center,
        zoom: mapInstance.zoom
      } : null
    }

    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `map_data_export_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsImage = () => {
    // Implementation would capture map as image
    if (mapRef.current) {
      html2canvas(mapRef.current).then(canvas => {
        const link = document.createElement('a')
        link.download = `conservation_map_${new Date().toISOString().split('T')[0]}.png`
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Interactive GIS Mapping</h1>
            <p className="text-gray-600">Visualize and analyze conservation data geographically</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`p-2 rounded-md ${showLayerPanel ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Layers className="h-5 w-5" />
            </button>
            <button onClick={exportMapData} className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
            <button onClick={exportAsImage} className="btn-secondary">
              <FileImage className="h-4 w-4 mr-2" />
              Export Image
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Layer Control */}
        {showLayerPanel && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Map Layers</h2>
              
              {/* Base Map Style */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Base Map</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mapStyles.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setMapStyle(style.value)}
                      className={`p-3 rounded-lg border text-sm ${
                        mapStyle === style.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-full h-8 rounded mb-1" 
                        style={{ backgroundColor: style.preview }}
                      />
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Layers */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Data Layers</h3>
                <div className="space-y-3">
                  {/* Surveys Layer */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapLayers.surveys.visible}
                          onChange={(e) => setMapLayers(prev => ({
                            ...prev,
                            surveys: { ...prev.surveys, visible: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <span className="font-medium">Surveys ({surveys.length})</span>
                      </label>
                    </div>
                    <select
                      value={mapLayers.surveys.style}
                      onChange={(e) => setMapLayers(prev => ({
                        ...prev,
                        surveys: { ...prev.surveys, style: e.target.value }
                      }))}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={!mapLayers.surveys.visible}
                    >
                      <option value="pins">Map Pins</option>
                      <option value="heatmap">Heat Map</option>
                      <option value="clusters">Clusters</option>
                    </select>
                  </div>

                  {/* Sites Layer */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapLayers.sites.visible}
                          onChange={(e) => setMapLayers(prev => ({
                            ...prev,
                            sites: { ...prev.sites, visible: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <span className="font-medium">Sites ({sites.length})</span>
                      </label>
                    </div>
                    <select
                      value={mapLayers.sites.style}
                      onChange={(e) => setMapLayers(prev => ({
                        ...prev,
                        sites: { ...prev.sites, style: e.target.value }
                      }))}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={!mapLayers.sites.visible}
                    >
                      <option value="polygons">Polygons</option>
                      <option value="pins">Map Pins</option>
                    </select>
                  </div>

                  {/* Species Layer */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapLayers.species.visible}
                          onChange={(e) => setMapLayers(prev => ({
                            ...prev,
                            species: { ...prev.species, visible: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <span className="font-medium">Species ({species.length})</span>
                      </label>
                    </div>
                    <select
                      value={mapLayers.species.style}
                      onChange={(e) => setMapLayers(prev => ({
                        ...prev,
                        species: { ...prev.species, style: e.target.value }
                      }))}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={!mapLayers.species.visible}
                    >
                      <option value="pins">Map Pins</option>
                      <option value="density">Density Map</option>
                      <option value="heatmap">Heat Map</option>
                    </select>
                  </div>

                  {/* Projects Layer */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapLayers.projects.visible}
                          onChange={(e) => setMapLayers(prev => ({
                            ...prev,
                            projects: { ...prev.projects, visible: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <span className="font-medium">Projects ({projects.length})</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Layers</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload GeoJSON, KML, or Image files</p>
                  <input
                    type="file"
                    multiple
                    accept=".geojson,.kml,.kmz,.png,.jpg,.jpeg,.tiff"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <div ref={mapRef} className="w-full h-full bg-gray-200 relative">
            {/* Map Loading State */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map data...</p>
                </div>
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-1">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <ZoomOut className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow border border-gray-200 p-1">
                <button 
                  className={`p-2 rounded ${drawingMode === 'point' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setDrawingMode(drawingMode === 'point' ? null : 'point')}
                >
                  <MapPin className="h-5 w-5" />
                </button>
                <button 
                  className={`p-2 rounded ${drawingMode === 'polygon' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setDrawingMode(drawingMode === 'polygon' ? null : 'polygon')}
                >
                  <Square className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-1">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Crosshair className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Navigation className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Feature Info Panel */}
            {selectedFeature && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Feature Details</h3>
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {/* Feature details would be displayed here */}
                  <p>Feature information and details...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              {/* Date Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {/* Projects Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Projects</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projects.map(project => (
                    <label key={project.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.projects.includes(project.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              projects: [...prev.projects, project.id]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              projects: prev.projects.filter(id => id !== project.id)
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{project.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Species Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Species</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {[...new Set(species.map(s => s.species_name))].map(speciesName => (
                    <label key={speciesName} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.species.includes(speciesName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              species: [...prev.species, speciesName]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              species: prev.species.filter(name => name !== speciesName)
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{speciesName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conservation Status Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Conservation Status</h3>
                <div className="space-y-2">
                  {['Endangered', 'Threatened', 'Vulnerable', 'Near Threatened', 'Least Concern', 'Data Deficient'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.conservationStatus.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              conservationStatus: [...prev.conservationStatus, status]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              conservationStatus: prev.conservationStatus.filter(s => s !== status)
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  dateRange: { start: '', end: '' },
                  species: [],
                  projects: [],
                  conservationStatus: [],
                  surveyType: 'all'
                })}
                className="w-full btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
