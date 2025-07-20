import { useState, useEffect, useRef } from 'react'
import { 
  MapPin, Calendar, Target, Users, DollarSign, AlertTriangle,
  Edit3, Trash2, Plus, Save, ChevronDown, ChevronUp,
  Clock, CheckCircle, XCircle, Pause, Play, Eye,
  Download, Upload, Share2, Bell, Tag, MoreHorizontal
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function ProjectSiteManager({ 
  mode = 'projects', // 'projects' or 'sites'
  selectedProject = null,
  onProjectSelected = () => {},
  onSiteSelected = () => {}
}) {
  const [projects, setProjects] = useState([])
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState(new Set())
  const mapRef = useRef(null)

  // Project/Site form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    end_date: '',
    budget_total: '',
    objectives: [],
    team_members: [],
    location: { lat: null, lng: null, address: '' },
    boundary_polygon: [],
    threat_level: 'low',
    threat_tags: [],
    linked_surveys: [],
    linked_reports: [],
    site_type: 'research',
    area_hectares: '',
    elevation_meters: '',
    habitat_types: [],
    access_requirements: '',
    equipment_needed: [],
    safety_protocols: '',
    contact_person: '',
    permits_required: [],
    monitoring_schedule: ''
  })

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const threatLevels = [
    { value: 'low', label: 'Low Risk', color: 'bg-green-100 text-green-800' },
    { value: 'moderate', label: 'Moderate Risk', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Risk', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical Risk', color: 'bg-red-100 text-red-800' }
  ]

  const threatTagOptions = [
    'Poaching', 'Illegal Logging', 'Invasive Species', 'Pollution',
    'Climate Change', 'Habitat Fragmentation', 'Overfishing', 'Mining',
    'Urban Development', 'Agricultural Expansion', 'Tourism Impact', 'Disease'
  ]

  const habitatTypeOptions = [
    'Forest', 'Grassland', 'Wetland', 'Desert', 'Marine', 'Freshwater',
    'Mountain', 'Urban', 'Agricultural', 'Coastal', 'Tundra', 'Savanna'
  ]

  const siteTypeOptions = [
    'research', 'conservation', 'restoration', 'monitoring', 'education',
    'sanctuary', 'breeding', 'release', 'observation', 'measurement'
  ]

  useEffect(() => {
    loadData()
  }, [mode])

  const loadData = async () => {
    setLoading(true)
    try {
      if (mode === 'projects') {
        const result = await dataManager.read('projects')
        if (result.success) {
          setProjects(result.data)
        }
      } else {
        const result = await dataManager.read('survey_sites')
        if (result.success) {
          setSites(result.data)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and search items
  const filteredItems = (mode === 'projects' ? projects : sites).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [field]: array
    }))
  }

  // GPS and mapping functions
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          })
        },
        (error) => alert('Unable to get current location: ' + error.message)
      )
    }
  }

  // Polygon boundary drawing (simplified - in production use proper mapping library)
  const drawBoundary = () => {
    // This would integrate with a mapping library like Mapbox or Leaflet
    alert('Boundary drawing would open an interactive map interface')
    // For now, simulate polygon creation
    const mockPolygon = [
      { lat: formData.location.lat + 0.001, lng: formData.location.lng + 0.001 },
      { lat: formData.location.lat + 0.001, lng: formData.location.lng - 0.001 },
      { lat: formData.location.lat - 0.001, lng: formData.location.lng - 0.001 },
      { lat: formData.location.lat - 0.001, lng: formData.location.lng + 0.001 }
    ]
    handleInputChange('boundary_polygon', mockPolygon)
  }

  // Save project or site
  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      if (editingItem) {
        const result = await dataManager.update(
          mode === 'projects' ? 'projects' : 'survey_sites',
          editingItem.id,
          dataToSave
        )
        if (result.success) {
          if (mode === 'projects') {
            setProjects(prev => prev.map(p => p.id === editingItem.id ? result.data : p))
          } else {
            setSites(prev => prev.map(s => s.id === editingItem.id ? result.data : s))
          }
        }
      } else {
        const result = await dataManager.create(
          mode === 'projects' ? 'projects' : 'survey_sites',
          { ...dataToSave, created_at: new Date().toISOString() }
        )
        if (result.success) {
          if (mode === 'projects') {
            setProjects(prev => [...prev, result.data])
          } else {
            setSites(prev => [...prev, result.data])
          }
        }
      }

      setShowCreateModal(false)
      setEditingItem(null)
      resetForm()
      alert(`${mode === 'projects' ? 'Project' : 'Site'} saved successfully!`)
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save: ' + error.message)
    }
  }

  // Delete item
  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete this ${mode === 'projects' ? 'project' : 'site'}?`)) return

    try {
      const result = await dataManager.delete(
        mode === 'projects' ? 'projects' : 'survey_sites',
        item.id
      )
      if (result.success) {
        if (mode === 'projects') {
          setProjects(prev => prev.filter(p => p.id !== item.id))
        } else {
          setSites(prev => prev.filter(s => s.id !== item.id))
        }
        alert(`${mode === 'projects' ? 'Project' : 'Site'} deleted successfully`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete: ' + error.message)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: '',
      end_date: '',
      budget_total: '',
      objectives: [],
      team_members: [],
      location: { lat: null, lng: null, address: '' },
      boundary_polygon: [],
      threat_level: 'low',
      threat_tags: [],
      linked_surveys: [],
      linked_reports: [],
      site_type: 'research',
      area_hectares: '',
      elevation_meters: '',
      habitat_types: [],
      access_requirements: '',
      equipment_needed: [],
      safety_protocols: '',
      contact_person: '',
      permits_required: [],
      monitoring_schedule: ''
    })
  }

  // Open edit modal
  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowCreateModal(true)
  }

  // Toggle expanded view
  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Calculate project progress
  const calculateProgress = (project) => {
    if (!project.objectives || project.objectives.length === 0) return 0
    const completed = project.objectives.filter(obj => obj.completed).length
    return Math.round((completed / project.objectives.length) * 100)
  }

  // Export project/site data
  const exportData = () => {
    const data = mode === 'projects' ? projects : sites
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${mode}_export_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'projects' ? 'Project Management' : 'Site Management'}
          </h1>
          <p className="text-gray-600">
            {mode === 'projects' 
              ? 'Manage conservation projects, timelines, and objectives'
              : 'Manage field sites, boundaries, and monitoring locations'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={exportData} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create {mode === 'projects' ? 'Project' : 'Site'}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder={`Search ${mode}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Priorities</option>
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredItems.length} {mode}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading {mode}...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No {mode} found. Create your first {mode === 'projects' ? 'project' : 'site'} to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const statusOption = statusOptions.find(s => s.value === item.status)
            const priorityOption = priorityOptions.find(p => p.value === item.priority)
            const threatOption = threatLevels.find(t => t.value === item.threat_level)
            const isExpanded = expandedItems.has(item.id)
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption?.color}`}>
                          {statusOption?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityOption?.color}`}>
                          {priorityOption?.label}
                        </span>
                        {mode === 'sites' && threatOption && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${threatOption.color}`}>
                            {threatOption.label}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    {mode === 'projects' ? (
                      <>
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <p className="font-medium">${item.budget_total?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Progress:</span>
                          <p className="font-medium">{calculateProgress(item)}%</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-gray-500">Area:</span>
                          <p className="font-medium">{item.area_hectares ? `${item.area_hectares} ha` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium capitalize">{item.site_type || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dates */}
                  {(item.start_date || item.end_date) && (
                    <div className="mt-3 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {item.start_date && new Date(item.start_date).toLocaleDateString()}
                      {item.start_date && item.end_date && ' - '}
                      {item.end_date && new Date(item.end_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Location */}
                  {item.location && (item.location.lat || item.location.address) && (
                    <div className="mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {item.location.address || `${item.location.lat}, ${item.location.lng}`}
                    </div>
                  )}
                </div>

                {/* Expandable Details */}
                <div className="px-6 py-3 bg-gray-50">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>Details</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-3 space-y-3 text-sm">
                      {/* Objectives (Projects) */}
                      {mode === 'projects' && item.objectives && item.objectives.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Objectives:</span>
                          <ul className="mt-1 space-y-1">
                            {item.objectives.map((obj, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                {obj.completed ? 
                                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" /> :
                                  <XCircle className="h-3 w-3 mr-2 text-gray-400" />
                                }
                                {obj.description || obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Threat Tags (Sites) */}
                      {mode === 'sites' && item.threat_tags && item.threat_tags.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Threats:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.threat_tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Habitat Types (Sites) */}
                      {mode === 'sites' && item.habitat_types && item.habitat_types.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Habitats:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.habitat_types.map((habitat, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {habitat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Team Members */}
                      {item.team_members && item.team_members.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Team:</span>
                          <p className="text-gray-600">{item.team_members.join(', ')}</p>
                        </div>
                      )}

                      {/* Contact Person */}
                      {item.contact_person && (
                        <div>
                          <span className="font-medium text-gray-700">Contact:</span>
                          <p className="text-gray-600">{item.contact_person}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Create'} {mode === 'projects' ? 'Project' : 'Site'}
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder={`Enter ${mode === 'projects' ? 'project' : 'site'} name`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Describe the objectives and scope"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {priorityOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  {mode === 'projects' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                      <input
                        type="number"
                        value={formData.budget_total}
                        onChange={(e) => handleInputChange('budget_total', parseFloat(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Total budget amount"
                      />
                    </div>
                  )}

                  {mode === 'sites' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Type</label>
                        <select
                          value={formData.site_type}
                          onChange={(e) => handleInputChange('site_type', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          {siteTypeOptions.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
                          <input
                            type="number"
                            value={formData.area_hectares}
                            onChange={(e) => handleInputChange('area_hectares', parseFloat(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="0.0"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Elevation (meters)</label>
                          <input
                            type="number"
                            value={formData.elevation_meters}
                            onChange={(e) => handleInputChange('elevation_meters', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Threat Level</label>
                        <select
                          value={formData.threat_level}
                          onChange={(e) => handleInputChange('threat_level', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          {threatLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Threat Tags</label>
                        <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {threatTagOptions.map(tag => (
                              <label key={tag} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={(formData.threat_tags || []).includes(tag)}
                                  onChange={(e) => {
                                    const currentTags = formData.threat_tags || []
                                    if (e.target.checked) {
                                      handleInputChange('threat_tags', [...currentTags, tag])
                                    } else {
                                      handleInputChange('threat_tags', currentTags.filter(t => t !== tag))
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">{tag}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Habitat Types</label>
                        <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {habitatTypeOptions.map(habitat => (
                              <label key={habitat} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={(formData.habitat_types || []).includes(habitat)}
                                  onChange={(e) => {
                                    const currentTypes = formData.habitat_types || []
                                    if (e.target.checked) {
                                      handleInputChange('habitat_types', [...currentTypes, habitat])
                                    } else {
                                      handleInputChange('habitat_types', currentTypes.filter(h => h !== habitat))
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">{habitat}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Location & Team */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPS Location</label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Latitude"
                          value={formData.location.lat || ''}
                          onChange={(e) => handleInputChange('location', {
                            ...formData.location,
                            lat: parseFloat(e.target.value)
                          })}
                          step="any"
                          className="border border-gray-300 rounded-md px-3 py-2"
                        />
                        <input
                          type="number"
                          placeholder="Longitude"
                          value={formData.location.lng || ''}
                          onChange={(e) => handleInputChange('location', {
                            ...formData.location,
                            lng: parseFloat(e.target.value)
                          })}
                          step="any"
                          className="border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Location description"
                        value={formData.location.address || ''}
                        onChange={(e) => handleInputChange('location', {
                          ...formData.location,
                          address: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          className="btn-secondary text-sm"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Current Location
                        </button>
                        {mode === 'sites' && (
                          <button
                            type="button"
                            onClick={drawBoundary}
                            className="btn-secondary text-sm"
                          >
                            Draw Boundary
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                    <input
                      type="text"
                      value={(formData.team_members || []).join(', ')}
                      onChange={(e) => handleArrayInputChange('team_members', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter names separated by commas"
                    />
                  </div>

                  {mode === 'projects' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
                      <textarea
                        value={(formData.objectives || []).join('\n')}
                        onChange={(e) => handleInputChange('objectives', 
                          e.target.value.split('\n').map(obj => obj.trim()).filter(obj => obj)
                        )}
                        rows="4"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter one objective per line"
                      />
                    </div>
                  )}

                  {mode === 'sites' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                        <input
                          type="text"
                          value={formData.contact_person}
                          onChange={(e) => handleInputChange('contact_person', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Site contact or coordinator"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Access Requirements</label>
                        <textarea
                          value={formData.access_requirements}
                          onChange={(e) => handleInputChange('access_requirements', e.target.value)}
                          rows="2"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Special permits, keys, access restrictions, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Needed</label>
                        <input
                          type="text"
                          value={(formData.equipment_needed || []).join(', ')}
                          onChange={(e) => handleArrayInputChange('equipment_needed', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter equipment separated by commas"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Safety Protocols</label>
                        <textarea
                          value={formData.safety_protocols}
                          onChange={(e) => handleInputChange('safety_protocols', e.target.value)}
                          rows="2"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Safety guidelines, emergency procedures, etc."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingItem(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Update' : 'Create'} {mode === 'projects' ? 'Project' : 'Site'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
