import React, { useState, useEffect } from 'react'
import { 
  Globe, TrendingUp, Users, MapPin, AlertTriangle, CheckCircle,
  BarChart3, Calendar, Mail, FileText, Target, Zap, 
  Leaf, Fish, TreePine, Bird, Shield, DollarSign
} from 'lucide-react'
import conservationData from '../utils/conservationData'

const ConservationDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [realTimeUpdates])

  const { projects, surveys, species, stakeholders, impact_summary } = conservationData

  // Calculate dynamic metrics
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalSpeciesProtected = species.length
  const averageProjectSuccess = projects.reduce((acc, p) => acc + (p.impact_metrics ? 85 : 0), 0) / projects.length

  return (
    <div className="space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">🌍 Global Conservation Impact Dashboard</h1>
            <p className="text-green-100 text-lg">
              Real-time monitoring of conservation efforts worldwide
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Live Data</span>
            </div>
            <p className="text-xs text-green-200">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Protected Area</p>
              <p className="text-3xl font-bold text-gray-900">{impact_summary.total_area_protected.toLocaleString()}</p>
              <p className="text-green-600 text-sm">hectares</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Species Monitored</p>
              <p className="text-3xl font-bold text-gray-900">{impact_summary.species_monitored.toLocaleString()}</p>
              <p className="text-blue-600 text-sm">active tracking</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bird className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">+8% this quarter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Carbon Sequestered</p>
              <p className="text-3xl font-bold text-gray-900">{impact_summary.carbon_sequestered.toLocaleString()}</p>
              <p className="text-purple-600 text-sm">tons CO₂</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TreePine className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-600">+15% this year</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Funding Raised</p>
              <p className="text-3xl font-bold text-gray-900">${(impact_summary.funding_raised / 1000000).toFixed(1)}M</p>
              <p className="text-orange-600 text-sm">total impact</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm text-orange-600">+23% this year</span>
          </div>
        </div>
      </div>

      {/* Active Projects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🚀 Active Conservation Projects</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {activeProjects} Active
            </span>
          </div>
          
          <div className="space-y-4">
            {projects.slice(0, 3).map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.organization}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{project.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{project.area_hectares.toLocaleString()} ha</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      {project.species_count}
                    </span>
                    <p className="text-xs text-gray-500">species</p>
                  </div>
                </div>
                
                {/* Impact Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(project.impact_metrics || {}).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded px-2 py-1">
                      <span className="text-gray-600">{key.replace(/_/g, ' ')}: </span>
                      <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Survey Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">📊 Live Field Data Collection</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Real-time
            </span>
          </div>
          
          <div className="space-y-4">
            {surveys.map((survey, index) => (
              <div key={survey.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{survey.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{survey.completion_rate}%</span>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{survey.responses} responses</span>
                    <span className="text-gray-600">{survey.frequency}</span>
                  </div>
                  <span className="text-green-600 text-xs">
                    Updated {new Date(survey.last_updated).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${survey.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Species Conservation Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">🦎 Species Conservation Status</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Population Trends</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {species.map((sp, index) => (
            <div key={sp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{sp.name}</h3>
                  <p className="text-sm text-gray-600 italic">{sp.scientific_name}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  sp.conservation_status === 'Endangered' ? 'bg-red-100 text-red-800' :
                  sp.conservation_status === 'Near Threatened' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {sp.conservation_status}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recent Sightings:</span>
                  <span className="font-medium">{sp.recent_sightings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Habitat Quality:</span>
                  <span className="font-medium">{sp.habitat_quality}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Population Trend:</span>
                  <span className={`font-medium flex items-center ${
                    sp.population_trend === 'increasing' ? 'text-green-600' :
                    sp.population_trend === 'stable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {sp.population_trend === 'increasing' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {sp.population_trend}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Last sighting: {new Date(sp.last_sighting).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NGO Value Proposition */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-green-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 How Substrata.ai Transforms NGO Impact
          </h2>
          <p className="text-gray-600">
            See how our platform helps conservation organizations automate data collection, 
            streamline stakeholder management, and demonstrate real-world impact to donors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automated Data Collection</h3>
            <p className="text-sm text-gray-600">
              Streamline field surveys, GPS tracking, and species monitoring with real-time data validation
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Stakeholder Management</h3>
            <p className="text-sm text-gray-600">
              Manage donors, volunteers, and partners with automated communications and engagement tracking
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Impact Reporting</h3>
            <p className="text-sm text-gray-600">
              Generate compelling impact reports with real-time metrics to demonstrate conservation success
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConservationDashboard
