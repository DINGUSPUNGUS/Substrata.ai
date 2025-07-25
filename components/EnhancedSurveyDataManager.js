import { useState, useEffect, useRef } from 'react'
import { 
  Camera, Upload, Download, MapPin, Calendar, Search, Filter,
  Save, Edit3, Trash2, Plus, FileText, AlertTriangle, CheckCircle,
  Eye, MoreHorizontal, Thermometer, Droplets, Wind, Sun,
  Users, Leaf, Bug, Fish, Bird, TreePine, Flower, Globe
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'
import conservationData from '../utils/conservationData'

export default function EnhancedSurveyDataManager() {
  const [surveys, setSurveys] = useState(conservationData.surveys || [])
  const [filteredSurveys, setFilteredSurveys] = useState(conservationData.surveys || [])
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    habitat: 'all',
    species: 'all',
    site: 'all',
    surveyor: 'all'
  })

  // Form data for creating/editing surveys
  const [formData, setFormData] = useState({
    survey_name: '',
    site_id: '',
    survey_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    surveyor_name: '',
    survey_type: 'wildlife',
    habitat_type: '',
    weather_conditions: {
      temperature: '',
      humidity: '',
      wind_speed: '',
      precipitation: '',
      cloud_cover: ''
    },
    gps_coordinates: {
      latitude: '',
      longitude: '',
      accuracy: '',
      elevation: ''
    },
    species_observations: [],
    environmental_data: {
      water_ph: '',
      water_temperature: '',
      turbidity: '',
      dissolved_oxygen: '',
      noise_level: ''
    },
    notes: '',
    photos: [],
    data_files: [],
    quality_score: 5,
    validation_status: 'pending'
  })

  // Species categories and common species
  const speciesCategories = {
    mammals: ['White-tailed Deer', 'Black Bear', 'Coyote', 'Raccoon', 'Squirrel', 'Rabbit'],
    birds: ['Bald Eagle', 'Red-tailed Hawk', 'Cardinal', 'Blue Jay', 'Robin', 'Owl'],
    reptiles: ['Garter Snake', 'Box Turtle', 'Lizard', 'Salamander'],
    fish: ['Bass', 'Trout', 'Salmon', 'Catfish', 'Minnow'],
    amphibians: ['Frog', 'Toad', 'Newt', 'Salamander'],
    insects: ['Butterfly', 'Bee', 'Dragonfly', 'Beetle', 'Ant'],
    plants: ['Oak Tree', 'Pine Tree', 'Wildflower', 'Fern', 'Grass', 'Moss']
  }

  const habitatTypes = [
    'Forest', 'Grassland', 'Wetland', 'Desert', 'Marine', 'Freshwater',
    'Mountain', 'Urban', 'Agricultural', 'Coastal', 'Tundra', 'Savanna'
  ]

  const surveyTypes = [
    'wildlife', 'vegetation', 'water_quality', 'soil_analysis', 
    'air_quality', 'noise_monitoring', 'habitat_assessment', 'species_count'
  ]

  useEffect(() => {
    loadSurveys()
  }, [])

  useEffect(() => {
    filterSurveys()
  }, [surveys, searchTerm, filters])

  const loadSurveys = async () => {
    setLoading(true)
    try {
      const result = await dataManager.read('surveys')
      if (result.success) {
        setSurveys(result.data)
      }
    } catch (error) {
      console.error('Error loading surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSurveys = () => {
    let filtered = surveys.filter(survey => {
      const matchesSearch = survey.survey_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.surveyor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.notes.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesHabitat = filters.habitat === 'all' || survey.habitat_type === filters.habitat
      const matchesSite = filters.site === 'all' || survey.site_id === filters.site

      const surveyDate = new Date(survey.survey_date)
      const matchesDate = (!filters.dateRange.start || surveyDate >= new Date(filters.dateRange.start)) &&
                         (!filters.dateRange.end || surveyDate <= new Date(filters.dateRange.end))

      return matchesSearch && matchesHabitat && matchesSite && matchesDate
    })

    setFilteredSurveys(filtered)
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addSpeciesObservation = () => {
    const newObservation = {
      id: Date.now(),
      species_name: '',
      category: 'mammals',
      count: 1,
      behavior: '',
      age_class: 'adult',
      sex: 'unknown',
      location_notes: '',
      photo_reference: '',
      confidence_level: 'high'
    }
    
    setFormData(prev => ({
      ...prev,
      species_observations: [...prev.species_observations, newObservation]
    }))
  }

  const updateSpeciesObservation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      species_observations: prev.species_observations.map(obs =>
        obs.id === id ? { ...obs, [field]: value } : obs
      )
    }))
  }

  const removeSpeciesObservation = (id) => {
    setFormData(prev => ({
      ...prev,
      species_observations: prev.species_observations.filter(obs => obs.id !== id)
    }))
  }

  const handleFileUpload = async (files, type) => {
    // Handle photo and data file uploads
    const uploadPromises = Array.from(files).map(async (file) => {
      // In real implementation, upload to storage service
      const mockUrl = URL.createObjectURL(file)
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        url: mockUrl,
        type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString()
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...uploadedFiles]
    }))
  }

  const saveSurvey = async () => {
    setLoading(true)
    try {
      const surveyData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      let result
      if (selectedSurvey) {
        result = await dataManager.update('surveys', selectedSurvey.id, surveyData)
      } else {
        result = await dataManager.create('surveys', surveyData)
      }

      if (result.success) {
        await loadSurveys()
        setShowCreateModal(false)
        setSelectedSurvey(null)
        resetForm()
        alert('Survey saved successfully!')
      }
    } catch (error) {
      console.error('Error saving survey:', error)
      alert('Failed to save survey')
    } finally {
      setLoading(false)
    }
  }

  const deleteSurvey = async (id) => {
    if (!confirm('Are you sure you want to delete this survey?')) return

    try {
      const result = await dataManager.delete('surveys', id)
      if (result.success) {
        await loadSurveys()
        alert('Survey deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting survey:', error)
      alert('Failed to delete survey')
    }
  }

  const resetForm = () => {
    setFormData({
      survey_name: '',
      site_id: '',
      survey_date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      surveyor_name: '',
      survey_type: 'wildlife',
      habitat_type: '',
      weather_conditions: {
        temperature: '',
        humidity: '',
        wind_speed: '',
        precipitation: '',
        cloud_cover: ''
      },
      gps_coordinates: {
        latitude: '',
        longitude: '',
        accuracy: '',
        elevation: ''
      },
      species_observations: [],
      environmental_data: {
        water_ph: '',
        water_temperature: '',
        turbidity: '',
        dissolved_oxygen: '',
        noise_level: ''
      },
      notes: '',
      photos: [],
      data_files: [],
      quality_score: 5,
      validation_status: 'pending'
    })
  }

  const exportSurveys = (format) => {
    let content, filename, mimeType

    if (format === 'csv') {
      const headers = ['Survey Name', 'Date', 'Surveyor', 'Site', 'Habitat', 'Species Count', 'Quality Score']
      const rows = filteredSurveys.map(survey => [
        survey.survey_name,
        survey.survey_date,
        survey.surveyor_name,
        survey.site_id,
        survey.habitat_type,
        survey.species_observations?.length || 0,
        survey.quality_score
      ])
      
      content = [headers, ...rows].map(row => row.join(',')).join('\\n')
      filename = `surveys_export_${new Date().toISOString().split('T')[0]}.csv`
      mimeType = 'text/csv'
    } else if (format === 'json') {
      content = JSON.stringify(filteredSurveys, null, 2)
      filename = `surveys_export_${new Date().toISOString().split('T')[0]}.json`
      mimeType = 'application/json'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('gps_coordinates.latitude', position.coords.latitude.toString())
          handleInputChange('gps_coordinates.longitude', position.coords.longitude.toString())
          handleInputChange('gps_coordinates.accuracy', position.coords.accuracy.toString())
        },
        (error) => {
          alert('Error getting location: ' + error.message)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Survey Data Management</h1>
          <p className="text-gray-600">Comprehensive field data collection and analysis</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </button>
          <div className="relative">
            <select
              onChange={(e) => exportSurveys(e.target.value)}
              className="btn-secondary appearance-none pr-8"
            >
              <option value="">Export</option>
              <option value="csv">Export CSV</option>
              <option value="json">Export JSON</option>
            </select>
            <Download className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              setSelectedSurvey(null)
              resetForm()
              setShowCreateModal(true)
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Survey
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habitat Type</label>
            <select
              value={filters.habitat}
              onChange={(e) => setFilters(prev => ({ ...prev, habitat: e.target.value }))}
              className="input-field"
            >
              <option value="all">All Habitats</option>
              {habitatTypes.map(habitat => (
                <option key={habitat} value={habitat}>{habitat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Survey List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Surveys ({filteredSurveys.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conservation-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading surveys...</p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="p-8 text-center">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No surveys found. Create your first survey to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSurveys.map(survey => (
              <div key={survey.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{survey.survey_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        survey.validation_status === 'approved' ? 'bg-green-100 text-green-800' :
                        survey.validation_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {survey.validation_status}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {survey.survey_date}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {survey.surveyor_name}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {survey.habitat_type}
                      </div>
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 mr-1" />
                        {survey.species_observations?.length || 0} species
                      </div>
                    </div>

                    {survey.notes && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{survey.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm">
                      <span className="mr-1">Quality:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`text-sm ${star <= survey.quality_score ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedSurvey(survey)
                        setFormData(survey)
                        setShowCreateModal(true)
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSurvey(survey.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Survey Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {selectedSurvey ? 'Edit Survey' : 'Create New Survey'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Name *</label>
                    <input
                      type="text"
                      value={formData.survey_name}
                      onChange={(e) => handleInputChange('survey_name', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Morning Bird Count - Forest Area A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Type</label>
                    <select
                      value={formData.survey_type}
                      onChange={(e) => handleInputChange('survey_type', e.target.value)}
                      className="input-field"
                    >
                      {surveyTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Date *</label>
                    <input
                      type="date"
                      value={formData.survey_date}
                      onChange={(e) => handleInputChange('survey_date', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surveyor Name *</label>
                    <input
                      type="text"
                      value={formData.surveyor_name}
                      onChange={(e) => handleInputChange('surveyor_name', e.target.value)}
                      className="input-field"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Location & GPS */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location & GPS Coordinates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Habitat Type</label>
                    <select
                      value={formData.habitat_type}
                      onChange={(e) => handleInputChange('habitat_type', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Habitat</option>
                      {habitatTypes.map(habitat => (
                        <option key={habitat} value={habitat}>{habitat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site ID</label>
                    <input
                      type="text"
                      value={formData.site_id}
                      onChange={(e) => handleInputChange('site_id', e.target.value)}
                      className="input-field"
                      placeholder="e.g., SITE_001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.gps_coordinates.latitude}
                      onChange={(e) => handleInputChange('gps_coordinates.latitude', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.gps_coordinates.longitude}
                      onChange={(e) => handleInputChange('gps_coordinates.longitude', e.target.value)}
                      className="input-field"
                      placeholder="e.g., -74.0060"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="mt-2 btn-secondary"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Current Location
                </button>
              </div>

              {/* Weather Conditions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Weather Conditions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <input
                      type="number"
                      value={formData.weather_conditions.temperature}
                      onChange={(e) => handleInputChange('weather_conditions.temperature', e.target.value)}
                      className="input-field"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                    <input
                      type="number"
                      value={formData.weather_conditions.humidity}
                      onChange={(e) => handleInputChange('weather_conditions.humidity', e.target.value)}
                      className="input-field"
                      placeholder="65"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
                    <input
                      type="number"
                      value={formData.weather_conditions.wind_speed}
                      onChange={(e) => handleInputChange('weather_conditions.wind_speed', e.target.value)}
                      className="input-field"
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>

              {/* Species Observations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Leaf className="h-5 w-5 mr-2" />
                    Species Observations
                  </h3>
                  <button
                    type="button"
                    onClick={addSpeciesObservation}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Species
                  </button>
                </div>

                {formData.species_observations.map((observation, index) => (
                  <div key={observation.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Species Observation #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeSpeciesObservation(observation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={observation.category}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'category', e.target.value)}
                          className="input-field"
                        >
                          {Object.keys(speciesCategories).map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                        <input
                          type="text"
                          list={`species-${observation.id}`}
                          value={observation.species_name}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'species_name', e.target.value)}
                          className="input-field"
                          placeholder="Type or select species"
                        />
                        <datalist id={`species-${observation.id}`}>
                          {speciesCategories[observation.category]?.map(species => (
                            <option key={species} value={species} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                        <input
                          type="number"
                          min="1"
                          value={observation.count}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'count', parseInt(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                        <input
                          type="text"
                          value={observation.behavior}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'behavior', e.target.value)}
                          className="input-field"
                          placeholder="e.g., feeding, nesting"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Class</label>
                        <select
                          value={observation.age_class}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'age_class', e.target.value)}
                          className="input-field"
                        >
                          <option value="adult">Adult</option>
                          <option value="juvenile">Juvenile</option>
                          <option value="infant">Infant</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confidence</label>
                        <select
                          value={observation.confidence_level}
                          onChange={(e) => updateSpeciesObservation(observation.id, 'confidence_level', e.target.value)}
                          className="input-field"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.species_observations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Leaf className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No species observations added yet.</p>
                  </div>
                )}
              </div>

              {/* Environmental Data */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  Environmental Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.environmental_data.water_ph}
                      onChange={(e) => handleInputChange('environmental_data.water_ph', e.target.value)}
                      className="input-field"
                      placeholder="7.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Temperature (°C)</label>
                    <input
                      type="number"
                      value={formData.environmental_data.water_temperature}
                      onChange={(e) => handleInputChange('environmental_data.water_temperature', e.target.value)}
                      className="input-field"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dissolved Oxygen (mg/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.environmental_data.dissolved_oxygen}
                      onChange={(e) => handleInputChange('environmental_data.dissolved_oxygen', e.target.value)}
                      className="input-field"
                      placeholder="8.5"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos & Data Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                      className="input-field"
                    />
                    {formData.photos.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {formData.photos.map(photo => (
                          <div key={photo.id} className="relative">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter(p => p.id !== photo.id)
                              }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Files</label>
                    <input
                      type="file"
                      multiple
                      accept=".csv,.json,.xlsx,.txt"
                      onChange={(e) => handleFileUpload(e.target.files, 'data_files')}
                      className="input-field"
                    />
                    {formData.data_files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.data_files.map(file => (
                          <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                data_files: prev.data_files.filter(f => f.id !== file.id)
                              }))}
                              className="text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes and Quality */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows="4"
                      className="input-field"
                      placeholder="Additional observations, conditions, or notes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality Score (1-5)</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleInputChange('quality_score', score)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            formData.quality_score >= score
                              ? 'bg-yellow-400 border-yellow-500 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      1 = Poor conditions/data, 5 = Excellent conditions/data
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedSurvey(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSurvey}
                disabled={loading || !formData.survey_name || !formData.surveyor_name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (selectedSurvey ? 'Update Survey' : 'Create Survey')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Import Survey Data</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <input
                    type="file"
                    accept=".csv,.json,.xlsx"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: CSV, JSON, Excel (.xlsx)
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">CSV Format Expected:</h4>
                  <code className="text-xs text-blue-800 block">
                    survey_name,survey_date,surveyor_name,habitat_type,species_name,count,notes
                  </code>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
