import { useState, useEffect } from 'react'
import { 
  Plus, Edit3, Trash2, Save, Eye, Copy, Download, Upload,
  Type, Calendar, Hash, MapPin, Image, FileText, CheckSquare,
  Radio, List, Star, Clock, User, Mail, Phone, Link2,
  Move, GripVertical, Settings, Play, Pause, RotateCcw
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { dataManager } from '../utils/supabaseManager'

export default function EnhancedCustomFormBuilder() {
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [formBuilder, setFormBuilder] = useState({
    name: '',
    description: '',
    category: 'wildlife_survey',
    fields: [],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: false,
      enableOfflineMode: true,
      autoSave: true,
      emailNotifications: false,
      notificationEmail: ''
    }
  })
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)

  // Available field types
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
      type: 'time',
      label: 'Time',
      icon: Clock,
      description: 'Time picker'
    },
    {
      type: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Email address with validation'
    },
    {
      type: 'phone',
      label: 'Phone',
      icon: Phone,
      description: 'Phone number input'
    },
    {
      type: 'url',
      label: 'URL',
      icon: Link2,
      description: 'Website URL input'
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: List,
      description: 'Single selection dropdown'
    },
    {
      type: 'multiselect',
      label: 'Multi-Select',
      icon: CheckSquare,
      description: 'Multiple selection dropdown'
    },
    {
      type: 'radio',
      label: 'Radio Buttons',
      icon: Radio,
      description: 'Single choice from options'
    },
    {
      type: 'checkbox',
      label: 'Checkboxes',
      icon: CheckSquare,
      description: 'Multiple choice from options'
    },
    {
      type: 'rating',
      label: 'Rating',
      icon: Star,
      description: 'Star rating scale'
    },
    {
      type: 'gps',
      label: 'GPS Coordinates',
      icon: MapPin,
      description: 'Latitude/longitude capture'
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: Upload,
      description: 'File and image upload'
    },
    {
      type: 'signature',
      label: 'Signature',
      icon: Edit3,
      description: 'Digital signature capture'
    }
  ]

  // Form categories
  const formCategories = [
    'wildlife_survey',
    'vegetation_survey',
    'water_quality',
    'soil_analysis',
    'habitat_assessment',
    'volunteer_registration',
    'incident_report',
    'maintenance_log',
    'research_data',
    'custom'
  ]

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    setLoading(true)
    try {
      const result = await dataManager.read('custom_forms')
      if (result.success) {
        setForms(result.data)
      }
    } catch (error) {
      console.error('Error loading forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const createField = (type) => {
    const baseField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `New ${fieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
      placeholder: '',
      required: false,
      description: '',
      validation: {},
      options: type === 'select' || type === 'multiselect' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : [],
      defaultValue: '',
      conditional: {
        show: true,
        dependsOn: null,
        condition: 'equals',
        value: ''
      }
    }

    // Type-specific defaults
    switch (type) {
      case 'number':
        baseField.validation = { min: '', max: '', step: '1' }
        break
      case 'text':
      case 'textarea':
        baseField.validation = { minLength: '', maxLength: '', pattern: '' }
        break
      case 'rating':
        baseField.validation = { min: 1, max: 5 }
        baseField.options = ['1', '2', '3', '4', '5']
        break
      case 'file':
        baseField.validation = { maxSize: '10', allowedTypes: ['image/*', '.pdf', '.doc', '.docx'] }
        break
      case 'gps':
        baseField.validation = { accuracy: 'high' }
        break
    }

    return baseField
  }

  const addField = (type) => {
    const newField = createField(type)
    setFormBuilder(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateField = (fieldId, updates) => {
    setFormBuilder(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const deleteField = (fieldId) => {
    setFormBuilder(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
  }

  const duplicateField = (fieldId) => {
    const field = formBuilder.fields.find(f => f.id === fieldId)
    if (field) {
      const duplicatedField = {
        ...field,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: `${field.label} (Copy)`
      }
      setFormBuilder(prev => ({
        ...prev,
        fields: [...prev.fields, duplicatedField]
      }))
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const fields = Array.from(formBuilder.fields)
    const [reorderedField] = fields.splice(result.source.index, 1)
    fields.splice(result.destination.index, 0, reorderedField)

    setFormBuilder(prev => ({
      ...prev,
      fields
    }))
  }

  const saveForm = async () => {
    if (!formBuilder.name.trim()) {
      alert('Please enter a form name')
      return
    }

    setLoading(true)
    try {
      const formData = {
        ...formBuilder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft'
      }

      let result
      if (selectedForm) {
        result = await dataManager.update('custom_forms', selectedForm.id, formData)
      } else {
        result = await dataManager.create('custom_forms', formData)
      }

      if (result.success) {
        await loadForms()
        alert('Form saved successfully!')
        resetBuilder()
      }
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Failed to save form')
    } finally {
      setLoading(false)
    }
  }

  const resetBuilder = () => {
    setFormBuilder({
      name: '',
      description: '',
      category: 'wildlife_survey',
      fields: [],
      settings: {
        allowMultipleSubmissions: true,
        requireAuthentication: false,
        enableOfflineMode: true,
        autoSave: true,
        emailNotifications: false,
        notificationEmail: ''
      }
    })
    setSelectedForm(null)
    setShowPreview(false)
    setShowSettings(false)
  }

  const loadForm = (form) => {
    setSelectedForm(form)
    setFormBuilder(form)
  }

  const deleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      const result = await dataManager.delete('custom_forms', formId)
      if (result.success) {
        await loadForms()
        if (selectedForm?.id === formId) {
          resetBuilder()
        }
        alert('Form deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      alert('Failed to delete form')
    }
  }

  const exportForm = (form) => {
    const formData = JSON.stringify(form, null, 2)
    const blob = new Blob([formData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${form.name.replace(/\\s+/g, '_').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importForm = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const formData = JSON.parse(e.target.result)
        setFormBuilder({
          ...formData,
          name: `${formData.name} (Imported)`,
          fields: formData.fields.map(field => ({
            ...field,
            id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }))
        })
        setSelectedForm(null)
        alert('Form imported successfully!')
      } catch (error) {
        alert('Invalid form file format')
      }
    }
    reader.readAsText(file)
  }

  const renderFieldEditor = (field) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <span className="font-medium text-gray-900">{field.label}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {fieldTypes.find(ft => ft.type === field.type)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => duplicateField(field.id)}
              className="text-gray-600 hover:text-gray-800"
              title="Duplicate field"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteField(field.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete field"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Properties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="input-field"
              placeholder="Enter field label"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="input-field"
              placeholder="Enter placeholder text"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={field.description}
              onChange={(e) => updateField(field.id, { description: e.target.value })}
              className="input-field"
              placeholder="Help text for this field"
            />
          </div>

          {/* Options for select/radio/checkbox fields */}
          {['select', 'multiselect', 'radio', 'checkbox'].includes(field.type) && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
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
                      className="input-field flex-1"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index)
                        updateField(field.id, { options: newOptions })
                      }}
                      className="text-red-600 hover:text-red-800"
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
                  className="text-sm text-conservation-600 hover:text-conservation-700"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {/* Validation Rules */}
          {field.type === 'number' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Value</label>
                <input
                  type="number"
                  value={field.validation.min || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, min: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Value</label>
                <input
                  type="number"
                  value={field.validation.max || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, max: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {['text', 'textarea'].includes(field.type) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                <input
                  type="number"
                  value={field.validation.minLength || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, minLength: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                <input
                  type="number"
                  value={field.validation.maxLength || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { ...field.validation, maxLength: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Field Settings */}
          <div className="md:col-span-2 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Required field</span>
            </label>
          </div>
        </div>
      </div>
    )
  }

  const renderFormPreview = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Form Preview</h3>
        <div className="space-y-4">
          {formBuilder.fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
              )}
              
              {/* Render field based on type */}
              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="input-field"
                  disabled
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  rows="3"
                  className="input-field"
                  disabled
                />
              )}
              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="input-field"
                  disabled
                />
              )}
              {field.type === 'date' && (
                <input
                  type="date"
                  className="input-field"
                  disabled
                />
              )}
              {field.type === 'select' && (
                <select className="input-field" disabled>
                  <option>{field.placeholder || 'Select an option'}</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input type="radio" name={field.id} className="mr-2" disabled />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                <div className="space-y-2">
                  {field.options.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="mr-2" disabled />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'rating' && (
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
              )}
              {field.type === 'gps' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Latitude"
                    className="input-field"
                    disabled
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    className="input-field"
                    disabled
                  />
                </div>
              )}
              {field.type === 'file' && (
                <input
                  type="file"
                  className="input-field"
                  disabled
                />
              )}
            </div>
          ))}
          
          {formBuilder.fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No fields added yet. Add fields to see the preview.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Form Builder</h1>
          <p className="text-gray-600">Create dynamic forms for field data collection</p>
        </div>
        <div className="flex space-x-3">
          <label className="btn-secondary cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import Form
            <input
              type="file"
              accept=".json"
              onChange={importForm}
              className="hidden"
            />
          </label>
          <button
            onClick={resetBuilder}
            className="btn-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">My Forms</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {forms.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No forms created yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {forms.map(form => (
                    <div key={form.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => loadForm(form)}
                        >
                          <h4 className="font-medium text-gray-900 truncate">{form.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {form.fields.length} fields • {form.category.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => exportForm(form)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Export form"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteForm(form.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete form"
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
          </div>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Form Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Form Details</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`btn-secondary ${showSettings ? 'bg-gray-200' : ''}`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`btn-secondary ${showPreview ? 'bg-gray-200' : ''}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={saveForm}
                    disabled={loading}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Form'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
                  <input
                    type="text"
                    value={formBuilder.name}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Wildlife Survey Form"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formBuilder.category}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {formCategories.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formBuilder.description}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, description: e.target.value }))}
                    rows="2"
                    className="input-field"
                    placeholder="Describe the purpose of this form"
                  />
                </div>
              </div>

              {/* Form Settings */}
              {showSettings && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-4">Form Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formBuilder.settings.allowMultipleSubmissions}
                        onChange={(e) => setFormBuilder(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowMultipleSubmissions: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Allow multiple submissions</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formBuilder.settings.enableOfflineMode}
                        onChange={(e) => setFormBuilder(prev => ({
                          ...prev,
                          settings: { ...prev.settings, enableOfflineMode: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable offline mode</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formBuilder.settings.autoSave}
                        onChange={(e) => setFormBuilder(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoSave: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Auto-save responses</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formBuilder.settings.emailNotifications}
                        onChange={(e) => setFormBuilder(prev => ({
                          ...prev,
                          settings: { ...prev.settings, emailNotifications: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Email notifications</span>
                    </label>
                  </div>
                  {formBuilder.settings.emailNotifications && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
                      <input
                        type="email"
                        value={formBuilder.settings.notificationEmail}
                        onChange={(e) => setFormBuilder(prev => ({
                          ...prev,
                          settings: { ...prev.settings, notificationEmail: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="admin@conservation.org"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Field Types Palette */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Add Fields</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {fieldTypes.map(fieldType => {
                  const Icon = fieldType.icon
                  return (
                    <button
                      key={fieldType.type}
                      onClick={() => addField(fieldType.type)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-conservation-300 hover:bg-conservation-50 transition-colors text-center"
                      title={fieldType.description}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                      <span className="text-xs text-gray-700">{fieldType.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Form Fields Editor */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Form Fields ({formBuilder.fields.length})</h3>
              
              {formBuilder.fields.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No fields added yet</p>
                  <p className="text-sm">Click on the field types above to add them to your form</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="form-fields">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {formBuilder.fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {renderFieldEditor(field)}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

            {/* Form Preview */}
            {showPreview && renderFormPreview()}
          </div>
        </div>
      </div>
    </div>
  )
}
