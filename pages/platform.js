import { useState } from 'react'
import { 
  Database, Users, FileText, MapPin, Settings, BarChart3,
  Calendar, Activity, Mail, Target, Layers, Zap, Shield,
  Clock, Eye, Bell
} from 'lucide-react'
import EnhancedSurveyDataManager from '../components/EnhancedSurveyDataManager'
import EnhancedCustomFormBuilder from '../components/EnhancedCustomFormBuilder'
import EnhancedProjectSiteManager from '../components/EnhancedProjectSiteManager'
import EnhancedStakeholderCRM from '../components/EnhancedStakeholderCRM'
import InteractiveGISMapping from '../components/InteractiveGISMapping'
import TimelineChangeTracking from '../components/TimelineChangeTracking'
import RoleBasedAccessControl from '../components/RoleBasedAccessControl'
import AutomatedEmailSystem from '../components/AutomatedEmailSystem'
import ActivityLogger from '../components/ActivityLogger'

export default function ConservationPlatform() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const modules = [
    {
      id: 'dashboard',
      name: 'Platform Overview',
      icon: BarChart3,
      description: 'Complete conservation management suite'
    },
    {
      id: 'surveys',
      name: 'Survey Data Manager',
      icon: Database,
      description: 'Enhanced field data collection system'
    },
    {
      id: 'forms',
      name: 'Form Builder',
      icon: FileText,
      description: 'Dynamic form creation with GPS & validation'
    },
    {
      id: 'projects',
      name: 'Project & Site Manager',
      icon: MapPin,
      description: 'GPS polygon drawing & site management'
    },
    {
      id: 'crm',
      name: 'Stakeholder CRM',
      icon: Users,
      description: 'Complete relationship management system'
    },
    {
      id: 'gis',
      name: 'Interactive GIS',
      icon: Layers,
      description: 'Advanced mapping with heatmaps & overlays'
    },
    {
      id: 'timeline',
      name: 'Timeline Tracking',
      icon: Clock,
      description: 'Visual conservation progress over time'
    },
    {
      id: 'security',
      name: 'Access Control',
      icon: Shield,
      description: 'Role-based permissions & user management'
    },
    {
      id: 'email',
      name: 'Email Automation',
      icon: Mail,
      description: 'Automated communication campaigns'
    },
    {
      id: 'audit',
      name: 'Activity Logger',
      icon: Eye,
      description: 'Complete audit trail & monitoring'
    }
  ]

  const renderDashboard = () => {
    return (
      <div className="space-y-8">
        {/* Platform Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-conservation-100 rounded-lg mr-4">
              <Zap className="h-6 w-6 text-conservation-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🌱 Conservation Platform - Enhanced</h2>
              <p className="text-gray-600">Production-ready components with full functionality</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Settings className="h-5 w-5 text-green-600" />
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">READY</span>
              </div>
              <h3 className="font-semibold text-gray-900">Dependencies</h3>
              <p className="text-sm text-gray-600">Updated to latest versions</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ENHANCED</span>
              </div>
              <h3 className="font-semibold text-gray-900">Survey System</h3>
              <p className="text-sm text-gray-600">GPS, photos, validations</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">NEW</span>
              </div>
              <h3 className="font-semibold text-gray-900">Form Builder</h3>
              <p className="text-sm text-gray-600">Dynamic, drag & drop</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">GPS</span>
              </div>
              <h3 className="font-semibold text-gray-900">Site Manager</h3>
              <p className="text-sm text-gray-600">Polygon drawing & mapping</p>
            </div>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">✅ Phase 1 & 2 Features Complete</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Phase 1: Core Data Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Enhanced survey system with GPS & media</li>
                <li>✅ Dynamic form builder (16 field types)</li>
                <li>✅ Project site manager with polygon drawing</li>
                <li>✅ Complete stakeholder CRM system</li>
                <li>✅ Data validation & offline sync</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Phase 2: Advanced Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Interactive GIS mapping with heatmaps</li>
                <li>✅ Timeline change tracking & analytics</li>
                <li>✅ Role-based access control system</li>
                <li>✅ Automated email campaigns</li>
                <li>✅ Complete activity logging & audit trail</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Production Ready</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              All core features implemented and ready for any conservation organization to deploy immediately.
            </p>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🚀 Test Enhanced Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.slice(1).map(module => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-conservation-300 hover:bg-conservation-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-2">
                    <Icon className="h-5 w-5 text-conservation-600 mr-2" />
                    <h4 className="font-medium text-gray-900">{module.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-conservation-50 to-conservation-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-conservation-900 mb-4">🎯 Ready for Production Deployment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <Database className="h-5 w-5 text-conservation-600 mb-2" />
              <h4 className="font-medium text-gray-900">Connect Supabase</h4>
              <p className="text-sm text-gray-600">Link to your actual database</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Users className="h-5 w-5 text-conservation-600 mb-2" />
              <h4 className="font-medium text-gray-900">Onboard Team</h4>
              <p className="text-sm text-gray-600">Add users & set permissions</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Zap className="h-5 w-5 text-conservation-600 mb-2" />
              <h4 className="font-medium text-gray-900">Go Live</h4>
              <p className="text-sm text-gray-600">Deploy to production</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'surveys':
        return <EnhancedSurveyDataManager />
      case 'forms':
        return <EnhancedCustomFormBuilder />
      case 'projects':
        return <EnhancedProjectSiteManager />
      case 'crm':
        return <EnhancedStakeholderCRM />
      case 'gis':
        return <InteractiveGISMapping />
      case 'timeline':
        return <TimelineChangeTracking />
      case 'security':
        return <RoleBasedAccessControl />
      case 'email':
        return <AutomatedEmailSystem />
      case 'audit':
        return <ActivityLogger />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-conservation-100 rounded-lg">
                <Database className="h-6 w-6 text-conservation-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Conservation Platform Test Suite</h1>
                <p className="text-sm text-gray-600">Enhanced components testing interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Server: localhost:3000
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Phases 1 & 2 Complete
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {modules.map(module => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeModule === module.id
                      ? 'border-conservation-500 text-conservation-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{module.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveModule()}
      </main>
    </div>
  )
}
