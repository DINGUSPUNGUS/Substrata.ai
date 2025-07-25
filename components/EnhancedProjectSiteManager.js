import { useState, useEffect, useRef } from 'react'
import { 
  MapPin, Plus, Edit3, Trash2, Save, Upload, Download, Eye, 
  Settings, Calendar, Users, Activity, Layers, Navigation,
  Search, Filter, Grid, List, Map as MapIcon, Polygon,
  Ruler, Area, Target, Compass, AlertTriangle, CheckCircle,
  Clock, FileText, Camera, MoreVertical
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function EnhancedProjectSiteManager() {
  const [projects, setProjects] = useState([])
  const [sites, setSites] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid, list, map
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null)
  const [mapMode, setMapMode] = useState('view') // view, draw, edit
  const [drawingMode, setDrawingMode] = useState('point') // point, polygon, circle
  const [currentPolygon, setCurrentPolygon] = useState([])

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    end_date: '',
    budget: '',
    manager: '',
    team_members: [],
    objectives: [],
    conservation_goals: []
  })

  // Site form state
  const [siteForm, setSiteForm] = useState({
    name: '',
    description: '',
    project_id: '',
    site_type: 'research_area',
    status: 'active',
    coordinates: {
      type: 'Point',
      coordinates: [0, 0]
    },
    boundary: null,
    area_hectares: 0,
    elevation: '',
    habitat_type: '',
    access_notes: '',
    equipment_deployed: [],
    last_visit: '',
    visit_frequency: 'monthly',
    safety_notes: '',
    permits_required: false,
    permit_details: ''
  })

  // Project statuses and types
  const projectStatuses = [
    { value: 'planning', label: 'Planning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  const siteTypes = [
    'research_area',
    'monitoring_station',
    'habitat_restoration',
    'wildlife_corridor',
    'protected_zone',
    'survey_transect',
    'water_source',
    'nesting_site',
    'feeding_ground',
    'observation_point'
  ]

  const habitatTypes = [
    'forest',
    'grassland',
    'wetland',
    'desert',
    'coastal',
    'marine',
    'urban',
    'agricultural',
    'riparian',
    'mountain'
  ]

  useEffect(() => {
    loadData()
    initializeMap()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [projectsResult, sitesResult] = await Promise.all([
        dataManager.read('projects'),
        dataManager.read('project_sites')
      ])

      if (projectsResult.success) setProjects(projectsResult.data)
      if (sitesResult.success) setSites(sitesResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeMap = () => {
    // Initialize map (would integrate with Leaflet, Mapbox, or Google Maps)
    if (mapRef.current && typeof window !== 'undefined') {
      console.log('Map initialized')
      // Map initialization code would go here
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = !selectedProject || site.project_id === selectedProject.id
    return matchesSearch && matchesProject
  })

  const saveProject = async () => {
    if (!projectForm.name.trim()) {
      alert('Please enter a project name')
      return
    }

    setLoading(true)
    try {
      const projectData = {
        ...projectForm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await dataManager.create('projects', projectData)
      if (result.success) {
        await loadData()
        setShowProjectForm(false)
        resetProjectForm()
        alert('Project saved successfully!')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const saveSite = async () => {
    if (!siteForm.name.trim()) {
      alert('Please enter a site name')
      return
    }

    if (!siteForm.project_id) {
      alert('Please select a project')
      return
    }

    setLoading(true)
    try {
      const siteData = {
        ...siteForm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await dataManager.create('project_sites', siteData)
      if (result.success) {
        await loadData()
        setShowSiteForm(false)
        resetSiteForm()
        alert('Site saved successfully!')
      }
    } catch (error) {
      console.error('Error saving site:', error)
      alert('Failed to save site')
    } finally {
      setLoading(false)
    }
  }

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: '',
      end_date: '',
      budget: '',
      manager: '',
      team_members: [],
      objectives: [],
      conservation_goals: []
    })
  }

  const resetSiteForm = () => {
    setSiteForm({
      name: '',
      description: '',
      project_id: selectedProject?.id || '',
      site_type: 'research_area',
      status: 'active',
      coordinates: {
        type: 'Point',
        coordinates: [0, 0]
      },
      boundary: null,
      area_hectares: 0,
      elevation: '',
      habitat_type: '',
      access_notes: '',
      equipment_deployed: [],
      last_visit: '',
      visit_frequency: 'monthly',
      safety_notes: '',
      permits_required: false,
      permit_details: ''
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSiteForm(prev => ({
            ...prev,
            coordinates: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }))
          alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        },
        (error) => {
          alert('Unable to get current location: ' + error.message)
        },
        { enableHighAccuracy: true }
      )
    } else {
      alert('Geolocation is not supported by this browser')
    }
  }

  const drawPolygon = () => {
    setMapMode('draw')
    setDrawingMode('polygon')
    setCurrentPolygon([])
    // Enable polygon drawing on map
  }

  const completePolygon = () => {
    if (currentPolygon.length >= 3) {
      const area = calculatePolygonArea(currentPolygon)
      setSiteForm(prev => ({
        ...prev,
        boundary: {
          type: 'Polygon',
          coordinates: [currentPolygon]
        },
        area_hectares: area
      }))
      setMapMode('view')
      setCurrentPolygon([])
    }
  }

  const calculatePolygonArea = (coordinates) => {
    // Simple area calculation (would use proper GIS calculation in production)
    let area = 0
    const n = coordinates.length
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      area += coordinates[i][0] * coordinates[j][1]
      area -= coordinates[j][0] * coordinates[i][1]
    }
    
    area = Math.abs(area) / 2
    // Convert to hectares (approximate)
    return (area * 111.32 * 111.32 / 10000).toFixed(2)
  }

  const exportProjectData = (project) => {
    const projectSites = sites.filter(site => site.project_id === project.id)
    const exportData = {
      project,
      sites: projectSites,
      export_date: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name.replace(/\\s+/g, '_').toLowerCase()}_export.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderProjectCard = (project) => {
    const projectSites = sites.filter(site => site.project_id === project.id)
    const statusConfig = projectStatuses.find(s => s.value === project.status)

    return (
      <div
        key={project.id}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedProject(project)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
              {statusConfig?.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                exportProjectData(project)
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{projectSites.length} sites</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{project.team_members?.length || 0} members</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Activity className="h-4 w-4 mr-2" />
            <span>{project.priority} priority</span>
          </div>
        </div>

        {project.conservation_goals?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-1">
              {project.conservation_goals.slice(0, 3).map((goal, index) => (
                <span
                  key={index}
                  className="bg-conservation-100 text-conservation-800 text-xs px-2 py-1 rounded"
                >
                  {goal}
                </span>
              ))}
              {project.conservation_goals.length > 3 && (
                <span className="text-xs text-gray-500">+{project.conservation_goals.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSiteCard = (site) => {
    const project = projects.find(p => p.id === site.project_id)

    return (
      <div
        key={site.id}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedSite(site)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{site.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{project?.name}</p>
            <p className="text-gray-600 text-sm line-clamp-2">{site.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              site.status === 'active' ? 'bg-green-100 text-green-800' :
              site.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {site.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapIcon className="h-4 w-4 mr-2" />
            <span>{site.site_type.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Layers className="h-4 w-4 mr-2" />
            <span>{site.habitat_type || 'Unknown habitat'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Area className="h-4 w-4 mr-2" />
            <span>{site.area_hectares} ha</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            <span>
              {site.coordinates.coordinates[1].toFixed(4)}, {site.coordinates.coordinates[0].toFixed(4)}
            </span>
          </div>
        </div>

        {site.equipment_deployed?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              <span>{site.equipment_deployed.length} equipment deployed</span>
            </div>
          </div>
        )}

        {site.last_visit && (
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last visit: {new Date(site.last_visit).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderMapView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Interactive Map</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMapMode('view')}
                className={`btn-secondary ${mapMode === 'view' ? 'bg-gray-200' : ''}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </button>
              <button
                onClick={drawPolygon}
                className={`btn-secondary ${mapMode === 'draw' ? 'bg-gray-200' : ''}`}
              >
                <Polygon className="h-4 w-4 mr-2" />
                Draw
              </button>
              <button
                onClick={getCurrentLocation}
                className="btn-secondary"
              >
                <Navigation className="h-4 w-4 mr-2" />
                My Location
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative h-96">
          <div
            ref={mapRef}
            className="w-full h-full bg-gray-100 flex items-center justify-center"
          >
            <div className="text-center">
              <MapIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Interactive map will be rendered here</p>
              <p className="text-sm text-gray-500 mt-1">
                {mapMode === 'draw' ? 'Click to add polygon points' : 'Viewing mode'}
              </p>
              {mapMode === 'draw' && currentPolygon.length > 0 && (
                <button
                  onClick={completePolygon}
                  className="mt-2 btn-primary"
                >
                  Complete Polygon ({currentPolygon.length} points)
                </button>
              )}
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
            <div className="flex flex-col space-y-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Plus className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Compass className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project & Site Management</h1>
          <p className="text-gray-600">Manage conservation projects and field sites with GPS mapping</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowProjectForm(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </button>
          <button
            onClick={() => setShowSiteForm(true)}
            className="btn-secondary"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add Site
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects and sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-conservation-500 focus:border-conservation-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-conservation-500 focus:border-conservation-500"
          >
            <option value="all">All Statuses</option>
            {projectStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-conservation-100 text-conservation-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-conservation-100 text-conservation-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-conservation-100 text-conservation-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MapIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'map' ? (
        renderMapView()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Projects ({filteredProjects.length})</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredProjects.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No projects found</p>
                  </div>
                ) : (
                  <div className={`p-4 space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : ''}`}>
                    {filteredProjects.map(project => renderProjectCard(project))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sites Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Sites ({filteredSites.length})
                  {selectedProject && (
                    <span className="text-sm text-gray-600 ml-2">
                      for {selectedProject.name}
                    </span>
                  )}
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredSites.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No sites found</p>
                    {selectedProject && (
                      <button
                        onClick={() => setShowSiteForm(true)}
                        className="mt-2 btn-primary"
                      >
                        Add First Site
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`p-4 space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : ''}`}>
                    {filteredSites.map(site => renderSiteCard(site))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Create New Project</h2>
                <button
                  onClick={() => setShowProjectForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., Wetland Restoration Initiative"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                      className="input-field"
                    >
                      {projectStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={projectForm.priority}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Manager</label>
                    <input
                      type="text"
                      value={projectForm.manager}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, manager: e.target.value }))}
                      className="input-field"
                      placeholder="Manager name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={projectForm.start_date}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={projectForm.end_date}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="input-field"
                    placeholder="Describe the project goals and methodology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowProjectForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProject}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Project'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Site Form Modal */}
      {showSiteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add New Site</h2>
                <button
                  onClick={() => setShowSiteForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={siteForm.name}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., Monitoring Station Alpha"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                      value={siteForm.project_id}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, project_id: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Type</label>
                    <select
                      value={siteForm.site_type}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, site_type: e.target.value }))}
                      className="input-field"
                    >
                      {siteTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Habitat Type</label>
                    <select
                      value={siteForm.habitat_type}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, habitat_type: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select habitat type</option>
                      {habitatTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={siteForm.description}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, description: e.target.value }))}
                    rows="2"
                    className="input-field"
                    placeholder="Describe the site characteristics and purpose"
                  />
                </div>

                {/* GPS Coordinates */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">GPS Coordinates</h4>
                    <button
                      onClick={getCurrentLocation}
                      className="btn-secondary"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Current Location
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={siteForm.coordinates.coordinates[1] || ''}
                        onChange={(e) => setSiteForm(prev => ({
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            coordinates: [prev.coordinates.coordinates[0], parseFloat(e.target.value) || 0]
                          }
                        }))}
                        className="input-field"
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={siteForm.coordinates.coordinates[0] || ''}
                        onChange={(e) => setSiteForm(prev => ({
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            coordinates: [parseFloat(e.target.value) || 0, prev.coordinates.coordinates[1]]
                          }
                        }))}
                        className="input-field"
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                  </div>
                </div>

                {/* Site Boundary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Site Boundary</h4>
                    <button
                      onClick={drawPolygon}
                      className="btn-secondary"
                    >
                      <Polygon className="h-4 w-4 mr-2" />
                      Draw Polygon
                    </button>
                  </div>
                  {siteForm.boundary && (
                    <div className="text-sm text-gray-600">
                      <p>Polygon defined with {siteForm.boundary.coordinates[0].length} points</p>
                      <p>Calculated area: {siteForm.area_hectares} hectares</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Elevation (m)</label>
                    <input
                      type="number"
                      value={siteForm.elevation}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, elevation: e.target.value }))}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Frequency</label>
                    <select
                      value={siteForm.visit_frequency}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, visit_frequency: e.target.value }))}
                      className="input-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                    <input
                      type="date"
                      value={siteForm.last_visit}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, last_visit: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Notes</label>
                  <textarea
                    value={siteForm.access_notes}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, access_notes: e.target.value }))}
                    rows="2"
                    className="input-field"
                    placeholder="Directions, parking, special access requirements"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Safety Notes</label>
                  <textarea
                    value={siteForm.safety_notes}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, safety_notes: e.target.value }))}
                    rows="2"
                    className="input-field"
                    placeholder="Safety hazards, required protective equipment"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={siteForm.permits_required}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, permits_required: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Permits required for access</label>
                </div>

                {siteForm.permits_required && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit Details</label>
                    <textarea
                      value={siteForm.permit_details}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, permit_details: e.target.value }))}
                      rows="2"
                      className="input-field"
                      placeholder="Required permits, contact information, validity dates"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSiteForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSite}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Site'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
