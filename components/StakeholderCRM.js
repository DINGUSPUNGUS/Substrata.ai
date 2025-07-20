import { useState, useEffect } from 'react'
import { 
  Users, DollarSign, Heart, Mail, Phone, Calendar, 
  MessageSquare, TrendingUp, Gift, Star, Plus, Edit3, Trash2,
  Eye, Download, Upload, Filter, Search, Send, Bell,
  ChevronDown, ChevronUp, ExternalLink, Copy, Check
} from 'lucide-react'
import { dataManager } from '../utils/supabaseManager'

export default function StakeholderCRM({ 
  mode = 'donors', // 'donors', 'partners', 'volunteers', 'all'
  onContactSelected = () => {}
}) {
  const [contacts, setContacts] = useState([])
  const [donations, setDonations] = useState([])
  const [communications, setCommunications] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [expandedContacts, setExpandedContacts] = useState(new Set())
  const [filters, setFilters] = useState({
    type: 'all',
    tier: 'all',
    engagement: 'all',
    status: 'active',
    search: ''
  })

  // Contact form data
  const [contactForm, setContactForm] = useState({
    name: '',
    type: 'individual',
    email: '',
    phone: '',
    contact_person: '',
    organization: '',
    tier: 'regular',
    engagement_level: 'medium',
    interests: [],
    status: 'active',
    first_donation_date: '',
    total_donated: 0,
    last_communication: '',
    notes: '',
    address: '',
    preferred_contact_method: 'email',
    communication_frequency: 'monthly',
    tags: []
  })

  // Communication form data
  const [communicationForm, setCommunicationForm] = useState({
    contact_id: '',
    type: 'email',
    subject: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    outcome: '',
    follow_up_required: false,
    follow_up_date: '',
    attachments: []
  })

  // Campaign form data
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'donor_update',
    target_audience: [],
    subject: '',
    content: '',
    scheduled_date: '',
    status: 'draft',
    template: 'default',
    personalization: true,
    tracking_enabled: true
  })

  const contactTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'government', label: 'Government' },
    { value: 'ngo', label: 'NGO/Partner' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'media', label: 'Media' }
  ]

  const tierOptions = [
    { value: 'regular', label: 'Regular', color: 'bg-gray-100 text-gray-800' },
    { value: 'major', label: 'Major Donor', color: 'bg-blue-100 text-blue-800' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800' },
    { value: 'legacy', label: 'Legacy', color: 'bg-gold-100 text-gold-800' }
  ]

  const engagementLevels = [
    { value: 'low', label: 'Low', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-green-100 text-green-800' },
    { value: 'very_high', label: 'Very High', color: 'bg-emerald-100 text-emerald-800' }
  ]

  const communicationTypes = [
    'email', 'phone', 'meeting', 'letter', 'social_media', 'event', 'other'
  ]

  const campaignTypes = [
    'donor_update', 'thank_you', 'donation_drive', 'newsletter',
    'project_update', 'emergency_appeal', 'year_end', 'anniversary'
  ]

  const interestOptions = [
    'Wildlife Protection', 'Forest Conservation', 'Marine Biology',
    'Climate Change', 'Habitat Restoration', 'Species Research',
    'Environmental Education', 'Policy Advocacy', 'Community Outreach',
    'Technology Solutions', 'Field Research', 'Conservation Training'
  ]

  useEffect(() => {
    loadData()
  }, [mode])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load contacts based on mode
      let contactsResult
      if (mode === 'all') {
        contactsResult = await dataManager.read('stakeholders')
      } else {
        contactsResult = await dataManager.read('stakeholders', { type: mode === 'donors' ? ['individual', 'foundation', 'corporation'] : [mode] })
      }

      if (contactsResult.success) {
        setContacts(contactsResult.data)
      }

      // Load donations for donor analytics
      if (mode === 'donors' || mode === 'all') {
        const donationsResult = await dataManager.read('donations')
        if (donationsResult.success) {
          setDonations(donationsResult.data)
        }
      }

      // Load communications
      const communicationsResult = await dataManager.read('communications')
      if (communicationsResult.success) {
        setCommunications(communicationsResult.data)
      }

      // Load campaigns
      const campaignsResult = await dataManager.read('email_campaigns')
      if (campaignsResult.success) {
        setCampaigns(campaignsResult.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         contact.email.toLowerCase().includes(filters.search.toLowerCase())
    const matchesType = filters.type === 'all' || contact.type === filters.type
    const matchesTier = filters.tier === 'all' || contact.tier === filters.tier
    const matchesEngagement = filters.engagement === 'all' || contact.engagement_level === filters.engagement
    const matchesStatus = contact.status === filters.status

    return matchesSearch && matchesType && matchesTier && matchesEngagement && matchesStatus
  })

  // Handle contact form changes
  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Save contact
  const saveContact = async () => {
    try {
      const contactData = {
        ...contactForm,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingContact) {
        result = await dataManager.update('stakeholders', editingContact.id, contactData)
        setContacts(prev => prev.map(c => c.id === editingContact.id ? result.data : c))
      } else {
        result = await dataManager.create('stakeholders', {
          ...contactData,
          created_at: new Date().toISOString()
        })
        setContacts(prev => [...prev, result.data])
      }

      if (result.success) {
        setShowCreateModal(false)
        setEditingContact(null)
        resetContactForm()
        alert('Contact saved successfully!')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save contact: ' + error.message)
    }
  }

  // Delete contact
  const deleteContact = async (contact) => {
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) return

    try {
      const result = await dataManager.delete('stakeholders', contact.id)
      if (result.success) {
        setContacts(prev => prev.filter(c => c.id !== contact.id))
        alert('Contact deleted successfully')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete contact: ' + error.message)
    }
  }

  // Reset contact form
  const resetContactForm = () => {
    setContactForm({
      name: '',
      type: 'individual',
      email: '',
      phone: '',
      contact_person: '',
      organization: '',
      tier: 'regular',
      engagement_level: 'medium',
      interests: [],
      status: 'active',
      first_donation_date: '',
      total_donated: 0,
      last_communication: '',
      notes: '',
      address: '',
      preferred_contact_method: 'email',
      communication_frequency: 'monthly',
      tags: []
    })
  }

  // Open edit modal
  const openEditModal = (contact) => {
    setEditingContact(contact)
    setContactForm(contact)
    setShowCreateModal(true)
  }

  // Record communication
  const recordCommunication = async () => {
    try {
      const commData = {
        ...communicationForm,
        created_at: new Date().toISOString()
      }

      const result = await dataManager.create('communications', commData)
      if (result.success) {
        setCommunications(prev => [...prev, result.data])
        
        // Update contact's last communication
        if (communicationForm.contact_id) {
          await dataManager.update('stakeholders', communicationForm.contact_id, {
            last_communication: new Date().toISOString()
          })
          setContacts(prev => prev.map(c => 
            c.id === communicationForm.contact_id 
              ? { ...c, last_communication: new Date().toISOString() }
              : c
          ))
        }

        setShowCommunicationModal(false)
        setCommunicationForm({
          contact_id: '',
          type: 'email',
          subject: '',
          content: '',
          date: new Date().toISOString().split('T')[0],
          outcome: '',
          follow_up_required: false,
          follow_up_date: '',
          attachments: []
        })
        alert('Communication recorded successfully!')
      }
    } catch (error) {
      console.error('Communication save error:', error)
      alert('Failed to record communication: ' + error.message)
    }
  }

  // Launch email campaign
  const launchCampaign = async () => {
    try {
      const campaignData = {
        ...campaignForm,
        status: 'sending',
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString()
      }

      const result = await dataManager.create('email_campaigns', campaignData)
      if (result.success) {
        setCampaigns(prev => [...prev, result.data])
        
        // In production, this would trigger the actual email sending
        // For now, simulate the process
        setTimeout(async () => {
          await dataManager.update('email_campaigns', result.data.id, {
            status: 'sent',
            sent_count: campaignForm.target_audience.length
          })
          setCampaigns(prev => prev.map(c => 
            c.id === result.data.id 
              ? { ...c, status: 'sent', sent_count: campaignForm.target_audience.length }
              : c
          ))
        }, 2000)

        setShowCampaignModal(false)
        setCampaignForm({
          name: '',
          type: 'donor_update',
          target_audience: [],
          subject: '',
          content: '',
          scheduled_date: '',
          status: 'draft',
          template: 'default',
          personalization: true,
          tracking_enabled: true
        })
        alert('Campaign launched successfully!')
      }
    } catch (error) {
      console.error('Campaign launch error:', error)
      alert('Failed to launch campaign: ' + error.message)
    }
  }

  // Calculate donor analytics
  const calculateDonorAnalytics = (contact) => {
    const contactDonations = donations.filter(d => d.donor_id === contact.id)
    const totalDonated = contactDonations.reduce((sum, d) => sum + d.amount, 0)
    const donationCount = contactDonations.length
    const averageDonation = donationCount > 0 ? totalDonated / donationCount : 0
    const lastDonation = contactDonations.length > 0 
      ? contactDonations.sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date))[0]
      : null

    return {
      totalDonated,
      donationCount,
      averageDonation,
      lastDonation
    }
  }

  // Export contacts
  const exportContacts = () => {
    const exportData = filteredContacts.map(contact => ({
      ...contact,
      analytics: calculateDonorAnalytics(contact)
    }))
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Toggle contact expansion
  const toggleExpanded = (contactId) => {
    setExpandedContacts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(contactId)) {
        newSet.delete(contactId)
      } else {
        newSet.add(contactId)
      }
      return newSet
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stakeholder CRM</h1>
          <p className="text-gray-600">Manage relationships with donors, partners, and volunteers</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={exportContacts} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowCommunicationModal(true)}
            className="btn-secondary"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Log Communication
          </button>
          <button 
            onClick={() => setShowCampaignModal(true)}
            className="btn-secondary"
          >
            <Send className="h-4 w-4 mr-2" />
            Email Campaign
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Contacts</p>
              <p className="text-2xl font-semibold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Donated</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Donors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {contacts.filter(c => ['individual', 'foundation', 'corporation'].includes(c.type) && c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Communications</p>
              <p className="text-2xl font-semibold text-gray-900">{communications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search contacts..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              {contactTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.tier}
              onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Tiers</option>
              {tierOptions.map(tier => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.engagement}
              onChange={(e) => setFilters(prev => ({ ...prev, engagement: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Engagement</option>
              {engagementLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredContacts.length} contacts found
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No contacts found. Add your first contact to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map(contact => {
            const tierOption = tierOptions.find(t => t.value === contact.tier)
            const engagementOption = engagementLevels.find(e => e.value === contact.engagement_level)
            const typeOption = contactTypes.find(t => t.value === contact.type)
            const isExpanded = expandedContacts.has(contact.id)
            const analytics = calculateDonorAnalytics(contact)
            const recentCommunications = communications
              .filter(c => c.contact_id === contact.id)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3)

            return (
              <div key={contact.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {/* Contact Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{contact.name}</h3>
                      {contact.organization && (
                        <p className="text-gray-600 text-sm mb-2">{contact.organization}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {typeOption?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierOption?.color}`}>
                          {tierOption?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${engagementOption?.color}`}>
                          {engagementOption?.label}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => openEditModal(contact)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteContact(contact)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {(['individual', 'foundation', 'corporation'].includes(contact.type)) && (
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Donated:</span>
                        <p className="font-medium">${analytics.totalDonated.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Donations:</span>
                        <p className="font-medium">{analytics.donationCount}</p>
                      </div>
                    </div>
                  )}

                  {contact.last_communication && (
                    <div className="mt-3 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Last contact: {new Date(contact.last_communication).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Expandable Details */}
                <div className="px-6 py-3 bg-gray-50">
                  <button
                    onClick={() => toggleExpanded(contact.id)}
                    className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>Details & Communications</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-3 space-y-3 text-sm">
                      {/* Interests */}
                      {contact.interests && contact.interests.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Interests:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {contact.interests.map((interest, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Communications */}
                      {recentCommunications.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Recent Communications:</span>
                          <div className="mt-1 space-y-1">
                            {recentCommunications.map((comm, index) => (
                              <div key={index} className="text-gray-600">
                                <span className="font-medium">{comm.type}:</span> {comm.subject}
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(comm.date).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {contact.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="text-gray-600 mt-1">{contact.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => {
                            setCommunicationForm(prev => ({ ...prev, contact_id: contact.id }))
                            setShowCommunicationModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1 inline" />
                          Log Communication
                        </button>
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            <Mail className="h-3 w-3 mr-1 inline" />
                            Send Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => handleContactFormChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Full name or organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={contactForm.type}
                    onChange={(e) => handleContactFormChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactFormChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => handleContactFormChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="+1-555-123-4567"
                  />
                </div>

                {contactForm.type !== 'individual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={contactForm.contact_person}
                      onChange={(e) => handleContactFormChange('contact_person', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Main contact person"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input
                    type="text"
                    value={contactForm.organization}
                    onChange={(e) => handleContactFormChange('organization', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
                  <select
                    value={contactForm.tier}
                    onChange={(e) => handleContactFormChange('tier', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {tierOptions.map(tier => (
                      <option key={tier.value} value={tier.value}>{tier.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Level</label>
                  <select
                    value={contactForm.engagement_level}
                    onChange={(e) => handleContactFormChange('engagement_level', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {engagementLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map(interest => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(contactForm.interests || []).includes(interest)}
                          onChange={(e) => {
                            const currentInterests = contactForm.interests || []
                            if (e.target.checked) {
                              handleContactFormChange('interests', [...currentInterests, interest])
                            } else {
                              handleContactFormChange('interests', currentInterests.filter(i => i !== interest))
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={contactForm.notes}
                  onChange={(e) => handleContactFormChange('notes', e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Internal notes about this contact"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingContact(null)
                  resetContactForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={saveContact} className="btn-primary">
                {editingContact ? 'Update' : 'Create'} Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {showCommunicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Log Communication</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <select
                  value={communicationForm.contact_id}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, contact_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select contact...</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={communicationForm.type}
                    onChange={(e) => setCommunicationForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {communicationTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={communicationForm.date}
                    onChange={(e) => setCommunicationForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={communicationForm.subject}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Communication subject or topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={communicationForm.content}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, content: e.target.value }))}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Communication details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                <input
                  type="text"
                  value={communicationForm.outcome}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Result or next steps"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="follow-up"
                  checked={communicationForm.follow_up_required}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="follow-up" className="text-sm text-gray-700">Follow-up required</label>
              </div>

              {communicationForm.follow_up_required && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                  <input
                    type="date"
                    value={communicationForm.follow_up_date}
                    onChange={(e) => setCommunicationForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCommunicationModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={recordCommunication} className="btn-primary">
                Record Communication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Email Campaign</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Campaign name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={campaignForm.type}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {campaignTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                  <div className="space-y-2">
                    {contactTypes.map(type => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(campaignForm.target_audience || []).includes(type.value)}
                          onChange={(e) => {
                            const currentAudience = campaignForm.target_audience || []
                            if (e.target.checked) {
                              setCampaignForm(prev => ({ ...prev, target_audience: [...currentAudience, type.value] }))
                            } else {
                              setCampaignForm(prev => ({ ...prev, target_audience: currentAudience.filter(a => a !== type.value) }))
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Email subject line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
                <textarea
                  value={campaignForm.content}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                  rows="6"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Email content (use {{name}} for personalization)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Date (optional)</label>
                <input
                  type="datetime-local"
                  value={campaignForm.scheduled_date}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaignForm.personalization}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, personalization: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enable personalization</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaignForm.tracking_enabled}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, tracking_enabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Track opens/clicks</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={launchCampaign} className="btn-primary">
                <Send className="h-4 w-4 mr-2" />
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
