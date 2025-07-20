import { useState, useRef, useEffect } from 'react'
import { 
  Plus, Trash2, Edit3, Save, Eye, Copy, Download, Upload,
  Type, Calendar, Hash, MapPin, ChevronDown, Image, 
  CheckSquare, RadioIcon, Star, Clock, FileText
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function CustomFormBuilder({ 
  existingForm = null,
  onFormSaved = () => {},
  mode = 'edit' // 'edit', 'preview', 'view'
}) {
  const [form, setForm] = useState(existingForm || {
    id: null,
    name: '',
    description: '',
    category: 'data_collection',
    fields: [],
    settings: {
      offline_capable: true,
      auto_save: true,
      require_gps: false,
      allow_photo_upload: true,
      submit_confirmation: true
    },
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  const [draggedField, setDraggedField] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({}) // For preview mode
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineData, setOfflineData] = useState([])

  // Field types available in the form builder
  const fieldTypes = [
    { 
      type: 'text', 
      label: 'Text Input', 
      icon: Type,
      description: 'Single line text input'
    },
    { 
      type: 'textarea', 
      label: 'Text Area', 
      icon: FileText,
      description: 'Multi-line text input'
    },
    { 
      type: 'number', 
      label: 'Number', 
      icon: Hash,
      description: 'Numeric input with validation'
    },
    { 
      type: 'date', 
      label: 'Date', 
      icon: Calendar,
      description: 'Date picker'
    },
    { 
      type: 'datetime', 
      label: 'Date & Time', 
      icon: Clock,
      description: 'Date and time picker'
    },
    { 
      type: 'location', 
      label: 'GPS Coordinates', 
      icon: MapPin,
      description: 'GPS location picker'
    },
    { 
      type: 'dropdown', 
      label: 'Dropdown', 
      icon: ChevronDown,
      description: 'Single selection dropdown'
    },
    { 
      type: 'radio', 
      label: 'Radio Buttons', 
      icon: RadioIcon,
      description: 'Single selection from options'
    },
    { 
      type: 'checkbox', 
      label: 'Checkboxes', 
      icon: CheckSquare,
      description: 'Multiple selection'
    },
    { 
      type: 'rating', 
      label: 'Rating', 
      icon: Star,
      description: '1-5 star rating'
    },
    { 
      type: 'photo', 
      label: 'Photo Upload', 
      icon: Image,
      description: 'Camera or file upload'
    }
  ]

  // Form categories
  const formCategories = [
    'data_collection',
    'species_survey',
    'habitat_assessment',
    'volunteer_feedback',
    'incident_report',
    'project_evaluation',
    'compliance_check',
    'donor_feedback'
  ]

  // Monitor online status for offline capability
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineData()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (form.settings.auto_save && form.id) {
      const timer = setTimeout(() => {
        saveForm(false) // Silent save
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [form])

  // Create a new field
  const createField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: `New ${fieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
      placeholder: '',
      required: false,
      validation: {},
      options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : [],
      conditional_logic: null,
      order: form.fields.length
    }

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
    
    setEditingField(newField.id)
  }

  // Update field properties
  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  // Delete field
  const deleteField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    if (editingField === fieldId) {
      setEditingField(null)
    }
  }

  // Reorder fields
  const reorderFields = (startIndex, endIndex) => {
    const newFields = Array.from(form.fields)
    const [removed] = newFields.splice(startIndex, 1)
    newFields.splice(endIndex, 0, removed)
    
    // Update order property
    newFields.forEach((field, index) => {
      field.order = index
    })

    setForm(prev => ({ ...prev, fields: newFields }))
  }

  // Drag and drop handlers
  const handleDragStart = (e, field) => {
    setDraggedField(field)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetField) => {
    e.preventDefault()
    if (!draggedField || draggedField.id === targetField.id) return

    const draggedIndex = form.fields.findIndex(f => f.id === draggedField.id)
    const targetIndex = form.fields.findIndex(f => f.id === targetField.id)

    reorderFields(draggedIndex, targetIndex)
    setDraggedField(null)
  }

  // Save form
  const saveForm = async (showNotification = true) => {
    try {
      const formToSave = {
        ...form,
        updated_at: new Date().toISOString()
      }

      let result
      if (form.id) {
        result = await dataManager.update('custom_forms', form.id, formToSave)
      } else {
        result = await dataManager.create('custom_forms', formToSave)
        setForm(prev => ({ ...prev, id: result.data.id }))
      }

      if (result.success && showNotification) {
        alert('Form saved successfully!')
        onFormSaved(result.data)
      }
    } catch (error) {
      console.error('Save error:', error)
      if (showNotification) {
        alert('Failed to save form: ' + error.message)
      }
    }
  }

  // Publish form
  const publishForm = async () => {
    try {
      const updatedForm = {
        ...form,
        status: 'published',
        published_at: new Date().toISOString()
      }
      
      setForm(updatedForm)
      await saveForm()
      alert('Form published successfully!')
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish form: ' + error.message)
    }
  }

  // Export form configuration
  const exportForm = () => {
    const exportData = {
      ...form,
      exported_at: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${form.name.replace(/\s+/g, '_').toLowerCase()}_form.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import form configuration
  const importForm = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedForm = JSON.parse(e.target.result)
        setForm({
          ...importedForm,
          id: null, // Reset ID for new form
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        alert('Form imported successfully!')
      } catch (error) {
        alert('Failed to import form: Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  // Handle form submission (for preview mode)
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const errors = {}
    form.fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        errors[field.id] = `${field.label} is required`
      }
    })

    if (Object.keys(errors).length > 0) {
      alert('Please fill in all required fields')
      return
    }

    // Add metadata
    const submissionData = {
      form_id: form.id,
      form_name: form.name,
      submitted_at: new Date().toISOString(),
      data: formData,
      location: form.settings.require_gps ? await getCurrentLocation() : null,
      device_info: {
        user_agent: navigator.userAgent,
        online: isOnline
      }
    }

    if (isOnline) {
      // Submit online
      try {
        await dataManager.create('form_submissions', submissionData)
        alert('Form submitted successfully!')
        setFormData({}) // Reset form
      } catch (error) {
        console.error('Submission error:', error)
        alert('Failed to submit form: ' + error.message)
      }
    } else {
      // Store offline
      const offlineSubmissions = JSON.parse(localStorage.getItem('offline_form_submissions') || '[]')
      offlineSubmissions.push(submissionData)
      localStorage.setItem('offline_form_submissions', JSON.stringify(offlineSubmissions))
      setOfflineData(offlineSubmissions)
      alert('Form saved offline. Will sync when online.')
      setFormData({}) // Reset form
    }
  }

  // Sync offline data when online
  const syncOfflineData = async () => {
    const offlineSubmissions = JSON.parse(localStorage.getItem('offline_form_submissions') || '[]')
    
    if (offlineSubmissions.length === 0) return

    try {
      for (const submission of offlineSubmissions) {
        await dataManager.create('form_submissions', submission)
      }
      
      localStorage.removeItem('offline_form_submissions')
      setOfflineData([])
      alert(`Synced ${offlineSubmissions.length} offline submissions`)
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  // Get current GPS location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          }),
          error => reject(error)
        )
      } else {
        reject(new Error('Geolocation not supported'))
      }
    })
  }

  // Render field editor
  const renderFieldEditor = (field) => {
    if (editingField !== field.id) return null

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded border">
        <h4 className="font-medium text-gray-900 mb-3">Edit Field Properties</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor={`required-${field.id}`} className="text-sm text-gray-700">Required field</label>
          </div>
        </div>

        {/* Options for dropdown, radio, checkbox */}
        {(field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...field.options]
                      newOptions[index] = e.target.value
                      updateField(field.id, { options: newOptions })
                    }}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={() => {
                      const newOptions = field.options.filter((_, i) => i !== index)
                      updateField(field.id, { options: newOptions })
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...field.options, `Option ${field.options.length + 1}`]
                  updateField(field.id, { options: newOptions })
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation rules */}
        {field.type === 'number' && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
              <input
                type="number"
                value={field.validation?.min || ''}
                onChange={(e) => updateField(field.id, { 
                  validation: { ...field.validation, min: parseFloat(e.target.value) || undefined }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <input
                type="number"
                value={field.validation?.max || ''}
                onChange={(e) => updateField(field.id, { 
                  validation: { ...field.validation, max: parseFloat(e.target.value) || undefined }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setEditingField(null)}
            className="btn-secondary"
          >
            Done Editing
          </button>
        </div>
      </div>
    )
  }

  // Render form field for preview
  const renderFormField = (field) => {
    const fieldValue = formData[field.id] || ''
    const updateFieldValue = (value) => {
      setFormData(prev => ({ ...prev, [field.id]: value }))
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            required={field.required}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            required={field.required}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )

      case 'location':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Latitude"
                value={fieldValue.lat || ''}
                onChange={(e) => updateFieldValue({ ...fieldValue, lat: parseFloat(e.target.value) })}
                step="any"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={fieldValue.lng || ''}
                onChange={(e) => updateFieldValue({ ...fieldValue, lng: parseFloat(e.target.value) })}
                step="any"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  const location = await getCurrentLocation()
                  updateFieldValue(location)
                } catch (error) {
                  alert('Could not get current location: ' + error.message)
                }
              }}
              className="btn-secondary text-sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Get Current Location
            </button>
          </div>
        )

      case 'dropdown':
        return (
          <select
            value={fieldValue}
            onChange={(e) => updateFieldValue(e.target.value)}
            required={field.required}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select an option...</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={fieldValue === option}
                  onChange={(e) => updateFieldValue(e.target.value)}
                  required={field.required}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(fieldValue || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = fieldValue || []
                    if (e.target.checked) {
                      updateFieldValue([...currentValues, option])
                    } else {
                      updateFieldValue(currentValues.filter(v => v !== option))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => updateFieldValue(rating)}
                className={`text-2xl ${fieldValue >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        )

      case 'photo':
        return (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  // In production, upload to storage and get URL
                  const file = e.target.files[0]
                  updateFieldValue({
                    file: file,
                    url: URL.createObjectURL(file),
                    name: file.name
                  })
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {fieldValue.url && (
              <img 
                src={fieldValue.url} 
                alt="Preview" 
                className="mt-2 max-w-xs rounded border"
              />
            )}
          </div>
        )

      default:
        return <div className="text-gray-500">Unsupported field type: {field.type}</div>
    }
  }

  if (mode === 'preview') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
          {form.description && (
            <p className="text-gray-600 mt-1">{form.description}</p>
          )}
          {!isOnline && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded mt-2">
              Offline Mode - Form data will be saved locally and synced when online
            </div>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderFormField(field)}
            </div>
          ))}

          <div className="flex justify-end space-x-3">
            <button type="button" className="btn-secondary">
              Save Draft
            </button>
            <button type="submit" className="btn-primary">
              Submit Form
            </button>
          </div>
        </form>

        {offlineData.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded border">
            <p className="text-blue-800">
              {offlineData.length} form submission(s) saved offline, waiting to sync
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Form Builder</h1>
          <p className="text-gray-600">Design dynamic forms for field data collection</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="file"
            accept=".json"
            onChange={importForm}
            className="hidden"
            id="import-form"
          />
          <label htmlFor="import-form" className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </label>
          <button onClick={exportForm} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button onClick={() => saveForm()} className="btn-secondary">
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
          {form.status === 'draft' && (
            <button onClick={publishForm} className="btn-primary">
              Publish Form
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Properties */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Properties</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter form name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Describe the form purpose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {formCategories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Settings</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.settings.offline_capable}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, offline_capable: e.target.checked }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Offline Capable</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.settings.auto_save}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, auto_save: e.target.checked }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Auto Save</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.settings.require_gps}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, require_gps: e.target.checked }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Require GPS</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.settings.allow_photo_upload}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allow_photo_upload: e.target.checked }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allow Photo Upload</span>
              </label>
            </div>
          </div>

          {/* Field Types Palette */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Add Fields</h4>
            <div className="space-y-2">
              {fieldTypes.map(fieldType => {
                const IconComponent = fieldType.icon
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => createField(fieldType.type)}
                    className="w-full flex items-center p-2 text-left border border-gray-200 rounded hover:bg-gray-50"
                    title={fieldType.description}
                  >
                    <IconComponent className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">{fieldType.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form Builder Canvas */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setFormData({})}
                className="btn-secondary text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                form.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {form.status.toUpperCase()}
              </span>
            </div>
          </div>

          {form.fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No fields added yet. Select a field type from the left to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.fields.map((field, index) => {
                const IconComponent = fieldTypes.find(ft => ft.type === field.type)?.icon || Type
                return (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field)}
                    className={`border rounded-lg p-4 cursor-move ${
                      editingField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-sm text-gray-500">
                            {fieldTypes.find(ft => ft.type === field.type)?.label} • 
                            {field.placeholder || 'No placeholder'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const newField = { ...field, id: Date.now().toString() }
                            setForm(prev => ({
                              ...prev,
                              fields: [...prev.fields, newField]
                            }))
                          }}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteField(field.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {renderFieldEditor(field)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
