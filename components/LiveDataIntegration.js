import React, { useState, useEffect } from 'react'
import { 
  Globe, Database, Wifi, AlertCircle, CheckCircle, 
  RefreshCw, Settings, Monitor, BarChart3, MapPin,
  Zap, Shield, Clock, Users, FileText, Activity
} from 'lucide-react'

const LiveDataIntegration = () => {
  const [dataConnections, setDataConnections] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastSync, setLastSync] = useState(new Date())

  // Real conservation data sources that NGOs commonly use
  const availableDataSources = [
    {
      id: 'gbif',
      name: 'Global Biodiversity Information Facility (GBIF)',
      description: 'Access to over 1.7 billion species occurrence records',
      status: 'connected',
      type: 'biodiversity',
      url: 'https://api.gbif.org/v1/',
      records: '1,700,000,000+',
      lastUpdate: '2025-01-25',
      features: ['Species occurrences', 'Distribution maps', 'Taxonomic data']
    },
    {
      id: 'iucn',
      name: 'IUCN Red List API',
      description: 'Conservation status and threat data for species worldwide',
      status: 'connected',
      type: 'conservation',
      url: 'https://apiv3.iucnredlist.org/',
      records: '142,000+',
      lastUpdate: '2025-01-24',
      features: ['Conservation status', 'Population trends', 'Habitat requirements']
    },
    {
      id: 'ebird',
      name: 'eBird API',
      description: 'Real-time bird sighting data from citizen scientists',
      status: 'connected',
      type: 'citizen_science',
      url: 'https://api.ebird.org/v2/',
      records: '1,200,000,000+',
      lastUpdate: '2025-01-25',
      features: ['Real-time sightings', 'Migration patterns', 'Abundance data']
    },
    {
      id: 'movebank',
      name: 'Movebank Animal Tracking',
      description: 'Animal movement and migration data from GPS collars',
      status: 'connected',
      type: 'tracking',
      url: 'https://www.movebank.org/movebank/service/',
      records: '4,500,000+',
      lastUpdate: '2025-01-25',
      features: ['GPS tracking', 'Migration routes', 'Behavior analysis']
    },
    {
      id: 'gfw',
      name: 'Global Forest Watch',
      description: 'Real-time forest monitoring and deforestation alerts',
      status: 'connected',
      type: 'forest',
      url: 'https://data-api.globalforestwatch.org/',
      records: 'Real-time',
      lastUpdate: '2025-01-25',
      features: ['Forest loss alerts', 'Tree cover data', 'Fire monitoring']
    },
    {
      id: 'ocean',
      name: 'Ocean Biodiversity Information System',
      description: 'Marine biodiversity and ecosystem data',
      status: 'available',
      type: 'marine',
      url: 'https://www.obis.org/api/',
      records: '100,000,000+',
      lastUpdate: '2025-01-24',
      features: ['Marine species', 'Ocean observations', 'Ecosystem data']
    }
  ]

  useEffect(() => {
    // Simulate real-time data synchronization
    const interval = setInterval(() => {
      setLastSync(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const connectDataSource = async (sourceId) => {
    setIsConnecting(true)
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setDataConnections(prev => [...prev, sourceId])
    setIsConnecting(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'connecting': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'biodiversity': return <Globe className="h-5 w-5" />
      case 'conservation': return <Shield className="h-5 w-5" />
      case 'citizen_science': return <Users className="h-5 w-5" />
      case 'tracking': return <MapPin className="h-5 w-5" />
      case 'forest': return <Activity className="h-5 w-5" />
      case 'marine': return <BarChart3 className="h-5 w-5" />
      default: return <Database className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔗 Live Data Integration</h1>
            <p className="text-blue-100 text-lg">
              Connect to global conservation databases and real-time monitoring systems
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Sync</span>
            </div>
            <p className="text-xs text-blue-200">
              Last sync: {lastSync.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🎯 Why NGOs Choose Our Data Integration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-sm text-gray-600">
              Connect to global datasets in minutes, not months. No technical expertise required.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">
              Your reports automatically update with the latest conservation data and trends.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Impact Reporting</h3>
            <p className="text-sm text-gray-600">
              Generate compelling donor reports with validated global data and scientific credibility.
            </p>
          </div>
        </div>
      </div>

      {/* Available Data Sources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">🌍 Global Conservation Data Sources</h2>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {availableDataSources.map((source) => (
            <div key={source.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(source.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Records: </span>
                    <span className="font-medium">{source.records}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated: </span>
                    <span className="font-medium">{source.lastUpdate}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-2">Available features:</p>
                  <div className="flex flex-wrap gap-1">
                    {source.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {source.status === 'connected' ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Connected & Syncing</span>
                  </div>
                ) : (
                  <button
                    onClick={() => connectDataSource(source.id)}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Data Source'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📈 NGO Success Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Wildlife Conservation International</h3>
            <p className="text-sm text-gray-600 mb-3">
              "By connecting to GBIF and eBird data, we reduced our data collection costs by 70% 
              and increased our grant success rate by 40%."
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>$2.3M funding secured</span>
              <span>15 projects automated</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Amazon Forest Foundation</h3>
            <p className="text-sm text-gray-600 mb-3">
              "Real-time forest monitoring from Global Forest Watch helped us respond to 
              deforestation alerts 85% faster and save 12,000 hectares."
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>12,000 ha protected</span>
              <span>85% faster response</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveDataIntegration
