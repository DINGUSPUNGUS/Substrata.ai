import { useState, useRef } from 'react'
import { 
  Upload, MapPin, Camera, Calendar, Thermometer, 
  CloudRain, Wind, Eye, Plus, Save, X, Download,
  FileText, Image, Video, Mic, Search, Filter
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function SurveyDataManager({ 
  onSurveyCreated = () => {},
  onSurveyUpdated = () => {},
  existingSurvey = null,
  mode = 'create' // 'create', 'edit', 'view'
}) {
  const [surveyData, setSurveyData] = useState(existingSurvey || {
    name: '',
    description: '',
    survey_type: 'wildlife',
    location: { lat: null, lng: null, address: '' },
    date_start: '',
    date_end: '',
    weather_conditions: {
      temperature: '',
      humidity: '',
      precipitation: '',
      wind_speed: '',
      visibility: '',
      cloud_cover: ''
    },
    species_observations: [],
    habitat_type: '',
    environmental_data: {},
    observers: [],
    methodology: '',
    notes: '',
    media_files: [],
    status: 'planned'
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const [showGPSPicker, setShowGPSPicker] = useState(false)

  // Species tracking
  const [newSpecies, setNewSpecies] = useState({
    scientific_name: '',
    common_name: '',
    count: 1,
    life_stage: 'adult',
    behavior: '',
    confidence: 'certain',
    photos: []
  })

  // Environmental data tracking
  const [environmentalReadings, setEnvironmentalReadings] = useState({
    water_quality: { ph: '', dissolved_oxygen: '', turbidity: '' },
    soil_quality: { ph: '', moisture: '', temperature: '' },
    air_quality: { pm25: '', co2: '', noise_level: '' },
    vegetation: { coverage: '', dominant_species: '', health_status: '' }
  })

  const habitatTypes = [
    'Forest', 'Grassland', 'Wetland', 'Desert', 'Marine', 'Freshwater',
    'Mountain', 'Urban', 'Agricultural', 'Coastal', 'Tundra', 'Savanna'
  ]

  const surveyTypes = [
    'wildlife', 'biodiversity', 'habitat_assessment', 'water_quality',
    'vegetation', 'restoration_monitoring', 'threat_assessment', 'baseline'
  ]

  const handleInputChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleWeatherChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      weather_conditions: {
        ...prev.weather_conditions,
        [field]: value
      }
    }))
  }

  const handleLocationChange = (location) => {
    setSurveyData(prev => ({
      ...prev,
      location: location
    }))
  }

  // Get current GPS location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          })
        },
        (error) => {
          alert('Unable to get current location: ' + error.message)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser')
    }
  }

  // Add species observation
  const addSpeciesObservation = () => {
    if (!newSpecies.scientific_name && !newSpecies.common_name) {
      alert('Please enter at least scientific or common name')
      return
    }

    const species = {
      ...newSpecies,
      id: Date.now(), // temporary ID
      timestamp: new Date().toISOString()
    }

    setSurveyData(prev => ({
      ...prev,
      species_observations: [...prev.species_observations, species]
    }))

    // Reset form
    setNewSpecies({
      scientific_name: '',
      common_name: '',
      count: 1,
      life_stage: 'adult',
      behavior: '',
      confidence: 'certain',
      photos: []
    })
  }

  const removeSpeciesObservation = (id) => {
    setSurveyData(prev => ({
      ...prev,
      species_observations: prev.species_observations.filter(s => s.id !== id)
    }))
  }

  // File upload handling
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFiles = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Simulate file upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(progress)
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // In production, upload to Supabase storage
        const uploadedFile = {
          id: Date.now() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // temporary URL for preview
          uploaded_at: new Date().toISOString()
        }

        uploadedFiles.push(uploadedFile)
      }

      setSurveyData(prev => ({
        ...prev,
        media_files: [...prev.media_files, ...uploadedFiles]
      }))

    } catch (error) {
      console.error('Upload error:', error)
      alert('File upload failed: ' + error.message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // CSV/Excel data import
  const handleDataImport = async (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target.result
        let parsedData

        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(content)
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parsing (in production, use a library like Papa Parse)
          const lines = content.split('\n')
          const headers = lines[0].split(',')
          parsedData = lines.slice(1).map(line => {
            const values = line.split(',')
            const obj = {}
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || ''
            })
            return obj
          })
        }

        // Process imported data and merge with survey
        if (parsedData && Array.isArray(parsedData)) {
          // Convert to species observations if the data matches
          const speciesData = parsedData.map((item, index) => ({
            id: Date.now() + index,
            scientific_name: item.scientific_name || item.species || '',
            common_name: item.common_name || item.name || '',
            count: parseInt(item.count) || 1,
            life_stage: item.life_stage || 'adult',
            behavior: item.behavior || '',
            confidence: item.confidence || 'certain',
            timestamp: new Date().toISOString()
          }))

          setSurveyData(prev => ({
            ...prev,
            species_observations: [...prev.species_observations, ...speciesData]
          }))

          alert(`Successfully imported ${speciesData.length} species observations`)
        }
      } catch (error) {
        console.error('Import error:', error)
        alert('Failed to import data: ' + error.message)
      }
    }

    reader.readAsText(file)
  }

  // Validation
  const validateSurvey = () => {
    const newErrors = {}

    if (!surveyData.name.trim()) {
      newErrors.name = 'Survey name is required'
    }

    if (!surveyData.date_start) {
      newErrors.date_start = 'Start date is required'
    }

    if (!surveyData.location.lat || !surveyData.location.lng) {
      newErrors.location = 'GPS coordinates are required'
    }

    if (!surveyData.habitat_type) {
      newErrors.habitat_type = 'Habitat type is required'
    }

    if (surveyData.observers.length === 0) {
      newErrors.observers = 'At least one observer is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save survey
  const handleSave = async () => {
    if (!validateSurvey()) {
      alert('Please fix the validation errors before saving')
      return
    }

    try {
      setIsUploading(true)

      const surveyToSave = {
        ...surveyData,
        environmental_data: environmentalReadings,
        updated_at: new Date().toISOString()
      }

      if (mode === 'create') {
        const result = await dataManager.createSurvey(surveyToSave)
        if (result.success) {
          onSurveyCreated(result.data)
          alert('Survey created successfully!')
        } else {
          throw new Error(result.error)
        }
      } else if (mode === 'edit') {
        const result = await dataManager.updateSurvey(existingSurvey.id, surveyToSave)
        if (result.success) {
          onSurveyUpdated(result.data)
          alert('Survey updated successfully!')
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save survey: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Export survey data
  const handleExport = (format) => {
    let content, filename, type

    switch (format) {
      case 'json':
        content = JSON.stringify(surveyData, null, 2)
        filename = `${surveyData.name || 'survey'}_data.json`
        type = 'application/json'
        break
      case 'csv':
        // Convert species observations to CSV
        const headers = ['Scientific Name', 'Common Name', 'Count', 'Life Stage', 'Behavior', 'Confidence']
        const csvContent = [
          headers.join(','),
          ...surveyData.species_observations.map(s => 
            [s.scientific_name, s.common_name, s.count, s.life_stage, s.behavior, s.confidence].join(',')
          )
        ].join('\n')
        content = csvContent
        filename = `${surveyData.name || 'survey'}_species.csv`
        type = 'text/csv'
        break
    }

    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Survey' : mode === 'edit' ? 'Edit Survey' : 'Survey Details'}
          </h2>
          <p className="text-gray-600">Comprehensive ecological field survey management</p>
        </div>
        <div className="flex space-x-3">
          {mode !== 'view' && (
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Create Survey' : 'Update Survey'}
            </button>
          )}
          <button
            onClick={() => handleExport('json')}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Name *
                </label>
                <input
                  type="text"
                  value={surveyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Winter Bird Count 2024"
                  disabled={mode === 'view'}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Type *
                </label>
                <select
                  value={surveyData.survey_type}
                  onChange={(e) => handleInputChange('survey_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                >
                  {surveyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitat Type *
                </label>
                <select
                  value={surveyData.habitat_type}
                  onChange={(e) => handleInputChange('habitat_type', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.habitat_type ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={mode === 'view'}
                >
                  <option value="">Select habitat type...</option>
                  {habitatTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.habitat_type && <p className="text-red-500 text-sm mt-1">{errors.habitat_type}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={surveyData.date_start}
                    onChange={(e) => handleInputChange('date_start', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${errors.date_start ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={mode === 'view'}
                  />
                  {errors.date_start && <p className="text-red-500 text-sm mt-1">{errors.date_start}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={surveyData.date_end}
                    onChange={(e) => handleInputChange('date_end', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & GPS */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & GPS</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={getCurrentLocation}
                  className="btn-secondary text-sm"
                  disabled={mode === 'view'}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Current Location
                </button>
                <button
                  onClick={() => setShowGPSPicker(!showGPSPicker)}
                  className="btn-secondary text-sm"
                  disabled={mode === 'view'}
                >
                  <Search className="h-4 w-4 mr-1" />
                  Pick on Map
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={surveyData.location.lat || ''}
                    onChange={(e) => handleLocationChange({
                      ...surveyData.location,
                      lat: parseFloat(e.target.value)
                    })}
                    className={`w-full border rounded-md px-3 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., 44.9778"
                    disabled={mode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={surveyData.location.lng || ''}
                    onChange={(e) => handleLocationChange({
                      ...surveyData.location,
                      lng: parseFloat(e.target.value)
                    })}
                    className={`w-full border rounded-md px-3 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., -110.3983"
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Description
                </label>
                <input
                  type="text"
                  value={surveyData.location.address || ''}
                  onChange={(e) => handleLocationChange({
                    ...surveyData.location,
                    address: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Lamar Valley, Yellowstone National Park"
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Conditions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Thermometer className="h-4 w-4 inline mr-1" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={surveyData.weather_conditions.temperature}
                  onChange={(e) => handleWeatherChange('temperature', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={surveyData.weather_conditions.humidity}
                  onChange={(e) => handleWeatherChange('humidity', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CloudRain className="h-4 w-4 inline mr-1" />
                  Precipitation (mm)
                </label>
                <input
                  type="number"
                  min="0"
                  value={surveyData.weather_conditions.precipitation}
                  onChange={(e) => handleWeatherChange('precipitation', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wind className="h-4 w-4 inline mr-1" />
                  Wind Speed (km/h)
                </label>
                <input
                  type="number"
                  min="0"
                  value={surveyData.weather_conditions.wind_speed}
                  onChange={(e) => handleWeatherChange('wind_speed', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="h-4 w-4 inline mr-1" />
                  Visibility (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={surveyData.weather_conditions.visibility}
                  onChange={(e) => handleWeatherChange('visibility', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cloud Cover (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={surveyData.weather_conditions.cloud_cover}
                  onChange={(e) => handleWeatherChange('cloud_cover', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Data Files</h3>
            
            {mode !== 'view' && (
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*,audio/*,.csv,.json,.xlsx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400"
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload photos, videos, or data files</p>
                    <p className="text-sm text-gray-500">Supports: Images, Videos, Audio, CSV, JSON, Excel</p>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Survey Data
                  </label>
                  <input
                    type="file"
                    accept=".csv,.json,.xlsx"
                    onChange={(e) => e.target.files[0] && handleDataImport(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Import species data from CSV/JSON files</p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {/* Uploaded Files */}
            {surveyData.media_files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Uploaded Files</h4>
                <div className="space-y-2">
                  {surveyData.media_files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center">
                        {file.type.startsWith('image/') && <Image className="h-4 w-4 mr-2 text-blue-500" />}
                        {file.type.startsWith('video/') && <Video className="h-4 w-4 mr-2 text-purple-500" />}
                        {file.type.startsWith('audio/') && <Mic className="h-4 w-4 mr-2 text-green-500" />}
                        {file.type.includes('csv') || file.type.includes('json') && <FileText className="h-4 w-4 mr-2 text-orange-500" />}
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      {mode !== 'view' && (
                        <button
                          onClick={() => {
                            setSurveyData(prev => ({
                              ...prev,
                              media_files: prev.media_files.filter(f => f.id !== file.id)
                            }))
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Species Observations Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Species Observations</h3>
        
        {mode !== 'view' && (
          <div className="bg-white p-4 rounded-lg border mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Add Species Observation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Scientific name"
                value={newSpecies.scientific_name}
                onChange={(e) => setNewSpecies(prev => ({ ...prev, scientific_name: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="Common name"
                value={newSpecies.common_name}
                onChange={(e) => setNewSpecies(prev => ({ ...prev, common_name: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="number"
                placeholder="Count"
                min="1"
                value={newSpecies.count}
                onChange={(e) => setNewSpecies(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <select
                value={newSpecies.life_stage}
                onChange={(e) => setNewSpecies(prev => ({ ...prev, life_stage: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="adult">Adult</option>
                <option value="juvenile">Juvenile</option>
                <option value="larva">Larva</option>
                <option value="egg">Egg</option>
              </select>
              <select
                value={newSpecies.confidence}
                onChange={(e) => setNewSpecies(prev => ({ ...prev, confidence: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="certain">Certain</option>
                <option value="probable">Probable</option>
                <option value="possible">Possible</option>
              </select>
              <button
                onClick={addSpeciesObservation}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            <input
              type="text"
              placeholder="Behavior notes (optional)"
              value={newSpecies.behavior}
              onChange={(e) => setNewSpecies(prev => ({ ...prev, behavior: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
            />
          </div>
        )}

        {/* Species List */}
        {surveyData.species_observations.length > 0 ? (
          <div className="space-y-2">
            {surveyData.species_observations.map(species => (
              <div key={species.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {species.scientific_name && <em>{species.scientific_name}</em>}
                        {species.scientific_name && species.common_name && ' - '}
                        {species.common_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Count: {species.count} | Life Stage: {species.life_stage} | Confidence: {species.confidence}
                      </p>
                      {species.behavior && (
                        <p className="text-sm text-gray-600">Behavior: {species.behavior}</p>
                      )}
                    </div>
                  </div>
                </div>
                {mode !== 'view' && (
                  <button
                    onClick={() => removeSpeciesObservation(species.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No species observations recorded yet</p>
        )}
      </div>

      {/* Additional Notes */}
      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observers *
          </label>
          <input
            type="text"
            value={surveyData.observers.join(', ')}
            onChange={(e) => handleInputChange('observers', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            className={`w-full border rounded-md px-3 py-2 ${errors.observers ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter observer names separated by commas"
            disabled={mode === 'view'}
          />
          {errors.observers && <p className="text-red-500 text-sm mt-1">{errors.observers}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Methodology
          </label>
          <textarea
            value={surveyData.methodology}
            onChange={(e) => handleInputChange('methodology', e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Describe the survey methodology used..."
            disabled={mode === 'view'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes & Observations
          </label>
          <textarea
            value={surveyData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Additional notes, observations, or important details..."
            disabled={mode === 'view'}
          />
        </div>
      </div>
    </div>
  )
}
