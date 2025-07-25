import React, { useState, useEffect } from 'react'
import { 
  Mail, Send, Clock, Users, Calendar, Bell,
  Plus, Edit, Trash2, Eye, Search, Filter,
  CheckCircle, AlertCircle, Play, Pause, Stop,
  TrendingUp, BarChart3, MessageSquare, Star,
  FileText, Image, Paperclip, Globe, Zap
} from 'lucide-react'

// Automated Email System for Conservation Organizations
export default function AutomatedEmailSystem() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState([])
  const [templates, setTemplates] = useState([])
  const [scheduledEmails, setScheduledEmails] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  useEffect(() => {
    setCampaigns([
      {
        id: 1,
        name: 'Monthly Conservation Update',
        type: 'newsletter',
        status: 'active',
        recipients: 245,
        openRate: 68.2,
        clickRate: 12.5,
        lastSent: '2025-07-01',
        nextSend: '2025-08-01',
        template: 'conservation_update',
        frequency: 'monthly'
      },
      {
        id: 2,
        name: 'Volunteer Recruitment Drive',
        type: 'recruitment',
        status: 'active',
        recipients: 120,
        openRate: 75.8,
        clickRate: 18.3,
        lastSent: '2025-07-15',
        nextSend: '2025-07-30',
        template: 'volunteer_recruitment',
        frequency: 'biweekly'
      },
      {
        id: 3,
        name: 'Donor Appreciation Series',
        type: 'fundraising',
        status: 'paused',
        recipients: 89,
        openRate: 82.1,
        clickRate: 25.6,
        lastSent: '2025-06-20',
        nextSend: '2025-08-15',
        template: 'donor_appreciation',
        frequency: 'quarterly'
      },
      {
        id: 4,
        name: 'Emergency Wildlife Alert',
        type: 'alert',
        status: 'draft',
        recipients: 356,
        openRate: 0,
        clickRate: 0,
        lastSent: null,
        nextSend: 'manual',
        template: 'emergency_alert',
        frequency: 'as_needed'
      }
    ])

    setTemplates([
      {
        id: 1,
        name: 'Conservation Update Newsletter',
        category: 'newsletter',
        subject: 'Monthly Conservation Progress Report',
        preview: 'Discover the amazing progress we\'ve made this month...',
        variables: ['recipient_name', 'month', 'key_achievements', 'next_goals'],
        lastUsed: '2025-07-01',
        usageCount: 12
      },
      {
        id: 2,
        name: 'Volunteer Recruitment',
        category: 'recruitment',
        subject: 'Join Our Conservation Mission - Make a Difference!',
        preview: 'We need passionate individuals like you to help protect...',
        variables: ['recipient_name', 'event_date', 'location', 'contact_info'],
        lastUsed: '2025-07-15',
        usageCount: 8
      },
      {
        id: 3,
        name: 'Donor Appreciation',
        category: 'fundraising',
        subject: 'Thank You for Your Conservation Impact',
        preview: 'Your generous support has made incredible conservation...',
        variables: ['donor_name', 'donation_amount', 'project_impact', 'photos'],
        lastUsed: '2025-06-20',
        usageCount: 15
      },
      {
        id: 4,
        name: 'Emergency Wildlife Alert',
        category: 'alert',
        subject: 'URGENT: Wildlife Emergency Response Needed',
        preview: 'Immediate action required to protect endangered species...',
        variables: ['species_name', 'location', 'threat_level', 'action_needed'],
        lastUsed: null,
        usageCount: 3
      }
    ])

    setScheduledEmails([
      {
        id: 1,
        campaign: 'Monthly Conservation Update',
        recipientGroup: 'All Subscribers',
        sendDate: '2025-08-01 09:00',
        status: 'scheduled',
        recipientCount: 245
      },
      {
        id: 2,
        campaign: 'Volunteer Recruitment Drive',
        recipientGroup: 'Local Community',
        sendDate: '2025-07-30 10:00',
        status: 'scheduled',
        recipientCount: 120
      },
      {
        id: 3,
        campaign: 'Field Survey Reminder',
        recipientGroup: 'Field Researchers',
        sendDate: '2025-07-28 08:00',
        status: 'pending',
        recipientCount: 15
      }
    ])

    setAnalytics({
      totalSent: 1247,
      avgOpenRate: 72.3,
      avgClickRate: 16.8,
      activeSubscribers: 489,
      unsubscribeRate: 2.1,
      bounceRate: 1.8,
      topPerformingCampaign: 'Donor Appreciation Series',
      recentGrowth: 12.5
    })
  }, [])

  const tabs = [
    { id: 'campaigns', name: 'Campaigns', icon: Mail, count: campaigns.length },
    { id: 'templates', name: 'Templates', icon: FileText, count: templates.length },
    { id: 'scheduled', name: 'Scheduled', icon: Clock, count: scheduledEmails.length },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, count: 0 }
  ]

  const campaignTypes = [
    { id: 'newsletter', name: 'Newsletter', icon: Mail, color: 'blue' },
    { id: 'recruitment', name: 'Recruitment', icon: Users, color: 'green' },
    { id: 'fundraising', name: 'Fundraising', icon: Star, color: 'yellow' },
    { id: 'alert', name: 'Alert', icon: Bell, color: 'red' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCampaignTypeColor = (type) => {
    const campaignType = campaignTypes.find(ct => ct.id === type)
    return campaignType ? campaignType.color : 'gray'
  }

  const getCampaignTypeIcon = (type) => {
    const campaignType = campaignTypes.find(ct => ct.id === type)
    return campaignType ? campaignType.icon : Mail
  }

  const renderCampaignsTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Types</option>
            {campaignTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowCreateCampaign(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map(campaign => {
          const TypeIcon = getCampaignTypeIcon(campaign.type)
          return (
            <div key={campaign.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${getCampaignTypeColor(campaign.type)}-100 rounded-lg`}>
                  <TypeIcon className={`h-5 w-5 text-${getCampaignTypeColor(campaign.type)}-600`} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{campaign.name}</h3>
              <p className="text-sm text-gray-600 mb-4 capitalize">{campaign.type.replace('_', ' ')}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recipients:</span>
                  <span className="font-medium">{campaign.recipients}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Open Rate:</span>
                  <span className="font-medium text-green-600">{campaign.openRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Click Rate:</span>
                  <span className="font-medium text-blue-600">{campaign.clickRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Send:</span>
                  <span className="font-medium">{campaign.nextSend}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200">
                  <Eye className="h-3 w-3 inline mr-1" />
                  View
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-sm text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Templates</h3>
        <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map(template => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.subject}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.preview}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getCampaignTypeColor(template.category)}-100 text-${getCampaignTypeColor(template.category)}-800`}>
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.usageCount} times
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.lastUsed || 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderScheduledTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scheduled Emails</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {scheduledEmails.filter(e => e.status === 'scheduled').length} pending
          </span>
        </div>
      </div>

      {/* Scheduled Emails */}
      <div className="space-y-3">
        {scheduledEmails.map(email => (
          <div key={email.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 bg-blue-100 rounded-lg`}>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{email.campaign}</h4>
                  <p className="text-sm text-gray-600">
                    To: {email.recipientGroup} ({email.recipientCount} recipients)
                  </p>
                  <p className="text-sm text-gray-500">
                    Scheduled for: {email.sendDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(email.status)}`}>
                  {email.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Stop className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+{analytics.recentGrowth}% this month</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgOpenRate}%</p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">Above industry average</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgClickRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-blue-600 mt-2">Excellent engagement</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeSubscribers}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-600 mt-2">Growing community</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                <span className={`text-xs px-2 py-1 rounded bg-${getCampaignTypeColor(campaign.type)}-100 text-${getCampaignTypeColor(campaign.type)}-800`}>
                  {campaign.type}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Open Rate</div>
                  <div className="font-medium text-green-600">{campaign.openRate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Click Rate</div>
                  <div className="font-medium text-blue-600">{campaign.clickRate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Recipients</div>
                  <div className="font-medium text-gray-900">{campaign.recipients}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Strong Performance</span>
            </div>
            <p className="text-sm text-green-700">
              Your donor appreciation emails have exceptional engagement. Consider this format for other campaigns.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Improvement Opportunity</span>
            </div>
            <p className="text-sm text-yellow-700">
              Newsletter open rates could improve with more compelling subject lines and send time optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">📧 Automated Email System</h2>
              <p className="text-gray-600">Streamlined communication for conservation outreach</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Zap className="h-4 w-4" />
              <span>Quick Send</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{campaigns.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{scheduledEmails.filter(e => e.status === 'scheduled').length}</div>
            <div className="text-sm text-gray-600">Scheduled Emails</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Email Templates</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{analytics.activeSubscribers}</div>
            <div className="text-sm text-gray-600">Total Subscribers</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'campaigns' && renderCampaignsTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'scheduled' && renderScheduledTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  )
}
