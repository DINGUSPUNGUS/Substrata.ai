import { useState, useEffect } from 'react'
import { 
  Users, Plus, Edit3, Trash2, Search, Filter, Mail, Phone, MapPin,
  Building, User, Calendar, Activity, FileText, Download, Upload,
  Star, Eye, MessageSquare, Clock, Tag, Globe, Linkedin, Twitter,
  Send, Archive, UserPlus, UserCheck, AlertTriangle, CheckCircle,
  TrendingUp, BarChart, PieChart, Target, Briefcase, Heart,
  DollarSign, Award, Handshake, Camera, Link2, BookOpen
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function EnhancedStakeholderCRM() {
  const [contacts, setContacts] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [interactions, setInteractions] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid, list, table
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showContactForm, setShowContactForm] = useState(false)
  const [showInteractionForm, setShowInteractionForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('contacts') // contacts, organizations, interactions, analytics

  // Contact form state
  const [contactForm, setContactForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    job_title: '',
    organization_id: '',
    organization_name: '',
    contact_type: 'supporter',
    status: 'active',
    priority: 'medium',
    source: 'direct',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    social_media: {
      linkedin: '',
      twitter: '',
      facebook: '',
      website: ''
    },
    interests: [],
    expertise: [],
    preferred_contact: 'email',
    notes: '',
    tags: [],
    consent: {
      email_marketing: false,
      phone_marketing: false,
      data_sharing: false
    }
  })

  // Interaction form state
  const [interactionForm, setInteractionForm] = useState({
    contact_id: '',
    type: 'email',
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    outcome: '',
    follow_up_date: '',
    priority: 'medium',
    location: '',
    attendees: [],
    attachments: [],
    status: 'completed',
    project_id: ''
  })

  // Contact types and categories
  const contactTypes = [
    { value: 'supporter', label: 'Supporter', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { value: 'donor', label: 'Donor', icon: DollarSign, color: 'bg-green-100 text-green-800' },
    { value: 'volunteer', label: 'Volunteer', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { value: 'researcher', label: 'Researcher', icon: BookOpen, color: 'bg-purple-100 text-purple-800' },
    { value: 'partner', label: 'Partner', icon: Handshake, color: 'bg-orange-100 text-orange-800' },
    { value: 'government', label: 'Government', icon: Building, color: 'bg-gray-100 text-gray-800' },
    { value: 'media', label: 'Media', icon: MessageSquare, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'vendor', label: 'Vendor', icon: Briefcase, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'expert', label: 'Expert', icon: Award, color: 'bg-teal-100 text-teal-800' }
  ]

  const interactionTypes = [
    'email', 'phone', 'meeting', 'event', 'letter', 'social_media',
    'presentation', 'survey', 'interview', 'site_visit', 'conference'
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
    { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [contactsResult, organizationsResult, interactionsResult] = await Promise.all([
        dataManager.read('contacts'),
        dataManager.read('organizations'),
        dataManager.read('contact_interactions')
      ])

      if (contactsResult.success) setContacts(contactsResult.data)
      if (organizationsResult.success) setOrganizations(organizationsResult.data)
      if (interactionsResult.success) setInteractions(interactionsResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || contact.contact_type === filterType
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const saveContact = async () => {
    if (!contactForm.first_name.trim() || !contactForm.last_name.trim()) {
      alert('Please enter first and last name')
      return
    }

    if (!contactForm.email.trim()) {
      alert('Please enter an email address')
      return
    }

    setLoading(true)
    try {
      const contactData = {
        ...contactForm,
        full_name: `${contactForm.first_name} ${contactForm.last_name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await dataManager.create('contacts', contactData)
      if (result.success) {
        await loadData()
        setShowContactForm(false)
        resetContactForm()
        alert('Contact saved successfully!')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Failed to save contact')
    } finally {
      setLoading(false)
    }
  }

  const saveInteraction = async () => {
    if (!interactionForm.contact_id || !interactionForm.type || !interactionForm.subject.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const interactionData = {
        ...interactionForm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await dataManager.create('contact_interactions', interactionData)
      if (result.success) {
        await loadData()
        setShowInteractionForm(false)
        resetInteractionForm()
        alert('Interaction logged successfully!')
      }
    } catch (error) {
      console.error('Error saving interaction:', error)
      alert('Failed to save interaction')
    } finally {
      setLoading(false)
    }
  }

  const resetContactForm = () => {
    setContactForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      mobile: '',
      job_title: '',
      organization_id: '',
      organization_name: '',
      contact_type: 'supporter',
      status: 'active',
      priority: 'medium',
      source: 'direct',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      social_media: {
        linkedin: '',
        twitter: '',
        facebook: '',
        website: ''
      },
      interests: [],
      expertise: [],
      preferred_contact: 'email',
      notes: '',
      tags: [],
      consent: {
        email_marketing: false,
        phone_marketing: false,
        data_sharing: false
      }
    })
  }

  const resetInteractionForm = () => {
    setInteractionForm({
      contact_id: selectedContact?.id || '',
      type: 'email',
      subject: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      duration_minutes: '',
      outcome: '',
      follow_up_date: '',
      priority: 'medium',
      location: '',
      attendees: [],
      attachments: [],
      status: 'completed',
      project_id: ''
    })
  }

  const exportContacts = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Organization', 'Type', 'Status', 'Created'].join(','),
      ...filteredContacts.map(contact => [
        `"${contact.full_name}"`,
        `"${contact.email}"`,
        `"${contact.phone || ''}"`,
        `"${contact.organization_name || ''}"`,
        `"${contact.contact_type}"`,
        `"${contact.status}"`,
        `"${new Date(contact.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getContactInteractions = (contactId) => {
    return interactions.filter(interaction => interaction.contact_id === contactId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getContactTypeConfig = (type) => {
    return contactTypes.find(ct => ct.value === type) || contactTypes[0]
  }

  const getStatusConfig = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const getPriorityConfig = (priority) => {
    return priorityLevels.find(p => p.value === priority) || priorityLevels[1]
  }

  const renderContactCard = (contact) => {
    const typeConfig = getContactTypeConfig(contact.contact_type)
    const statusConfig = getStatusConfig(contact.status)
    const priorityConfig = getPriorityConfig(contact.priority)
    const contactInteractions = getContactInteractions(contact.id)
    const TypeIcon = typeConfig.icon

    return (
      <div
        key={contact.id}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedContact(contact)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{contact.full_name}</h3>
              <p className="text-sm text-gray-600">{contact.job_title}</p>
              {contact.organization_name && (
                <p className="text-sm text-gray-500">{contact.organization_name}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.address?.city && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{contact.address.city}, {contact.address.state}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>{contactInteractions.length} interactions</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(contact.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setContactForm({...contact})
                setShowContactForm(true)
              }}
              className="text-gray-600 hover:text-gray-800"
              title="Edit contact"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setInteractionForm(prev => ({ ...prev, contact_id: contact.id }))
                setShowInteractionForm(true)
              }}
              className="text-conservation-600 hover:text-conservation-800"
              title="Log interaction"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>

        {contact.tags?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {contact.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{contact.tags.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderContactDetail = () => {
    if (!selectedContact) return null

    const typeConfig = getContactTypeConfig(selectedContact.contact_type)
    const contactInteractions = getContactInteractions(selectedContact.id)
    const TypeIcon = typeConfig.icon

    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${typeConfig.color}`}>
                <TypeIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedContact.full_name}</h2>
                <p className="text-gray-600">{selectedContact.job_title}</p>
                {selectedContact.organization_name && (
                  <p className="text-gray-500">{selectedContact.organization_name}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setContactForm({...selectedContact})
                  setShowContactForm(true)
                }}
                className="btn-secondary"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  setInteractionForm(prev => ({ ...prev, contact_id: selectedContact.id }))
                  setShowInteractionForm(true)
                }}
                className="btn-primary"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Interaction
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <a href={`mailto:${selectedContact.email}`} className="text-conservation-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <a href={`tel:${selectedContact.phone}`} className="text-conservation-600 hover:underline">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                {selectedContact.mobile && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <a href={`tel:${selectedContact.mobile}`} className="text-conservation-600 hover:underline">
                      {selectedContact.mobile} (Mobile)
                    </a>
                  </div>
                )}
                {selectedContact.address?.street && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 mt-1 text-gray-400" />
                    <div className="text-sm">
                      <p>{selectedContact.address.street}</p>
                      <p>{selectedContact.address.city}, {selectedContact.address.state} {selectedContact.address.zip}</p>
                      {selectedContact.address.country && <p>{selectedContact.address.country}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {selectedContact.social_media && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Social Media</h4>
                  <div className="space-y-2">
                    {selectedContact.social_media.linkedin && (
                      <a
                        href={selectedContact.social_media.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    )}
                    {selectedContact.social_media.twitter && (
                      <a
                        href={selectedContact.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:underline"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    )}
                    {selectedContact.social_media.website && (
                      <a
                        href={selectedContact.social_media.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:underline"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tags and Interests */}
              {selectedContact.tags?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedContact.notes && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Notes</h4>
                  <p className="text-gray-600 text-sm">{selectedContact.notes}</p>
                </div>
              )}
            </div>

            {/* Interaction History */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Interaction History ({contactInteractions.length})</h3>
                <button
                  onClick={() => {
                    setInteractionForm(prev => ({ ...prev, contact_id: selectedContact.id }))
                    setShowInteractionForm(true)
                  }}
                  className="btn-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Interaction
                </button>
              </div>

              {contactInteractions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No interactions recorded yet</p>
                  <button
                    onClick={() => {
                      setInteractionForm(prev => ({ ...prev, contact_id: selectedContact.id }))
                      setShowInteractionForm(true)
                    }}
                    className="mt-2 btn-primary"
                  >
                    Log First Interaction
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contactInteractions.map(interaction => (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-conservation-100 text-conservation-800 text-xs px-2 py-1 rounded">
                            {interaction.type.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(interaction.date).toLocaleDateString()}
                          </span>
                          {interaction.duration_minutes && (
                            <span className="text-sm text-gray-500">
                              ({interaction.duration_minutes} min)
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          interaction.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          interaction.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {interaction.priority}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{interaction.subject}</h4>
                      <p className="text-gray-600 text-sm mb-3">{interaction.description}</p>
                      {interaction.outcome && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <strong>Outcome:</strong> {interaction.outcome}
                        </div>
                      )}
                      {interaction.follow_up_date && (
                        <div className="mt-2 text-sm text-orange-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Follow-up: {new Date(interaction.follow_up_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalytics = () => {
    const totalContacts = contacts.length
    const contactsByType = contactTypes.map(type => ({
      ...type,
      count: contacts.filter(c => c.contact_type === type.value).length
    }))
    const contactsByStatus = statusOptions.map(status => ({
      ...status,
      count: contacts.filter(c => c.status === status.value).length
    }))
    const totalInteractions = interactions.length
    const recentInteractions = interactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    return (
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-conservation-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{totalContacts}</h3>
                <p className="text-gray-600">Total Contacts</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{totalInteractions}</h3>
                <p className="text-gray-600">Interactions</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{organizations.length}</h3>
                <p className="text-gray-600">Organizations</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p className="text-gray-600">New This Month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contacts by Type */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Contacts by Type</h3>
            <div className="space-y-3">
              {contactsByType.map(type => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <type.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-conservation-600 h-2 rounded-full"
                        style={{ width: `${totalContacts > 0 ? (type.count / totalContacts) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Interactions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
            <div className="space-y-3">
              {recentInteractions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No interactions yet</p>
              ) : (
                recentInteractions.map(interaction => {
                  const contact = contacts.find(c => c.id === interaction.contact_id)
                  return (
                    <div key={interaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{interaction.subject}</p>
                        <p className="text-gray-600 text-xs">{contact?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(interaction.date).toLocaleDateString()}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {interaction.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
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
          <h1 className="text-2xl font-bold text-gray-900">Stakeholder CRM</h1>
          <p className="text-gray-600">Manage contacts, organizations, and stakeholder relationships</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportContacts}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowContactForm(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-conservation-500 text-conservation-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'analytics' ? (
        renderAnalytics()
      ) : (
        <>
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-conservation-500 focus:border-conservation-500"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-conservation-500 focus:border-conservation-500"
              >
                <option value="all">All Types</option>
                {contactTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-conservation-500 focus:border-conservation-500"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredContacts.length} of {contacts.length} contacts
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contacts List */}
            <div className={`${selectedContact ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">
                    Contacts ({filteredContacts.length})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No contacts found</p>
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="mt-2 btn-primary"
                      >
                        Add First Contact
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {filteredContacts.map(contact => renderContactCard(contact))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Detail */}
            {selectedContact && (
              <div className="lg:col-span-2">
                {renderContactDetail()}
              </div>
            )}
          </div>
        </>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {contactForm.id ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={contactForm.first_name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, first_name: e.target.value }))}
                      className="input-field"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={contactForm.last_name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, last_name: e.target.value }))}
                      className="input-field"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={contactForm.job_title}
                      onChange={(e) => setContactForm(prev => ({ ...prev, job_title: e.target.value }))}
                      className="input-field"
                      placeholder="Wildlife Researcher"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm(prev => ({ ...prev, mobile: e.target.value }))}
                      className="input-field"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input
                      type="text"
                      value={contactForm.organization_name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, organization_name: e.target.value }))}
                      className="input-field"
                      placeholder="Wildlife Conservation Trust"
                    />
                  </div>
                </div>

                {/* Categories and Status */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                    <select
                      value={contactForm.contact_type}
                      onChange={(e) => setContactForm(prev => ({ ...prev, contact_type: e.target.value }))}
                      className="input-field"
                    >
                      {contactTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={contactForm.status}
                      onChange={(e) => setContactForm(prev => ({ ...prev, status: e.target.value }))}
                      className="input-field"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                    <select
                      value={contactForm.preferred_contact}
                      onChange={(e) => setContactForm(prev => ({ ...prev, preferred_contact: e.target.value }))}
                      className="input-field"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="mobile">Mobile</option>
                      <option value="mail">Mail</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium mb-3">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        value={contactForm.address.street}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={contactForm.address.city}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={contactForm.address.state}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={contactForm.notes}
                    onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    className="input-field"
                    placeholder="Additional notes about this contact"
                  />
                </div>

                {/* Consent */}
                <div>
                  <h4 className="font-medium mb-3">Communication Consent</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={contactForm.consent.email_marketing}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          consent: { ...prev.consent, email_marketing: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Email marketing consent</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={contactForm.consent.phone_marketing}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          consent: { ...prev.consent, phone_marketing: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Phone marketing consent</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveContact}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Contact'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Form Modal */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Log Interaction</h2>
                <button
                  onClick={() => setShowInteractionForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <select
                      value={interactionForm.contact_id}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, contact_id: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select a contact</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interaction Type</label>
                    <select
                      value={interactionForm.type}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field"
                    >
                      {interactionTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={interactionForm.date}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={interactionForm.duration_minutes}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      className="input-field"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={interactionForm.subject}
                    onChange={(e) => setInteractionForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field"
                    placeholder="Meeting about habitat restoration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={interactionForm.description}
                    onChange={(e) => setInteractionForm(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    className="input-field"
                    placeholder="Detailed description of the interaction"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                  <textarea
                    value={interactionForm.outcome}
                    onChange={(e) => setInteractionForm(prev => ({ ...prev, outcome: e.target.value }))}
                    rows="2"
                    className="input-field"
                    placeholder="Results or outcomes from this interaction"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={interactionForm.priority}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={interactionForm.follow_up_date}
                      onChange={(e) => setInteractionForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowInteractionForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveInteraction}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Interaction'}
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
