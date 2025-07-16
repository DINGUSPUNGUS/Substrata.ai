import { useState, useEffect } from 'react'
import { MapPin, Thermometer, Activity, AlertTriangle } from 'lucide-react'

// Generate realistic conservation heat map data
const generateHeatMapData = () => {
  const data = []
  const regions = [
    'Amazon Basin', 'Congo Basin', 'Great Barrier Reef', 'Yellowstone',
    'Serengeti', 'Borneo Rainforest', 'Madagascar', 'Galapagos Islands',
    'Arctic Tundra', 'Sahara Desert Edge', 'Rocky Mountains', 'Himalayas'
  ]
  
  regions.forEach((region, index) => {
    data.push({
      id: index + 1,
      region,
      latitude: (Math.random() - 0.5) * 160,
      longitude: (Math.random() - 0.5) * 360,
      threatLevel: Math.floor(Math.random() * 10) + 1,
      biodiversityIndex: Math.floor(Math.random() * 100) + 1,
      conservationStatus: ['Critical', 'High Priority', 'Moderate', 'Stable'][Math.floor(Math.random() * 4)],
      lastSurvey: `${Math.floor(Math.random() * 30) + 1} days ago`,
      species: Math.floor(Math.random() * 150) + 50,
      temperature: Math.floor(Math.random() * 40) + 5,
      humidity: Math.floor(Math.random() * 80) + 20
    })
  })
  return data
}

export default function ConservationHeatMap() {
  const [heatMapData, setHeatMapData] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    setHeatMapData(generateHeatMapData())
  }, [])

  const getThreatColor = (level) => {
    if (level >= 8) return 'bg-red-500'
    if (level >= 6) return 'bg-orange-500'
    if (level >= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'High Priority': return 'text-orange-600 bg-orange-100'
      case 'Moderate': return 'text-yellow-600 bg-yellow-100'
      case 'Stable': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredData = filterStatus === 'All' 
    ? heatMapData 
    : heatMapData.filter(item => item.conservationStatus === filterStatus)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Thermometer className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold">Conservation Threat Heat Map</h3>
        </div>
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-conservation-500"
          >
            <option value="All">All Regions</option>
            <option value="Critical">Critical</option>
            <option value="High Priority">High Priority</option>
            <option value="Moderate">Moderate</option>
            <option value="Stable">Stable</option>
          </select>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Visualization */}
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-lg p-4 h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200">
              {filteredData.map((region) => (
                <div
                  key={region.id}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${getThreatColor(region.threatLevel)} hover:scale-150 transition-transform`}
                  style={{
                    left: `${((region.longitude + 180) / 360) * 100}%`,
                    top: `${((90 - region.latitude) / 180) * 100}%`,
                  }}
                  onClick={() => setSelectedRegion(region)}
                  title={`${region.region} - Threat Level: ${region.threatLevel}/10`}
                />
              ))}
            </div>
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md">
              <div className="text-xs font-semibold mb-1">Threat Level</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Low (1-3)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Medium (4-6)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>High (7-8)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Critical (9-10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Region Details */}
        <div className="space-y-4">
          {selectedRegion ? (
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">{selectedRegion.region}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedRegion.conservationStatus)}`}>
                  {selectedRegion.conservationStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Threat Level</span>
                    <span className="font-semibold">{selectedRegion.threatLevel}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Biodiversity Index</span>
                    <span className="font-semibold">{selectedRegion.biodiversityIndex}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Species Count</span>
                    <span className="font-semibold">{selectedRegion.species}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temperature</span>
                    <span className="font-semibold">{selectedRegion.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Humidity</span>
                    <span className="font-semibold">{selectedRegion.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Survey</span>
                    <span className="font-semibold">{selectedRegion.lastSurvey}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Immediate Actions Required</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedRegion.threatLevel >= 7 && <li>• Deploy emergency conservation team</li>}
                  {selectedRegion.threatLevel >= 5 && <li>• Increase monitoring frequency</li>}
                  <li>• Schedule next survey within 30 days</li>
                  <li>• Review habitat protection measures</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Click on a region in the map to view detailed information</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="font-semibold mb-3">Regional Summary</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Regions Monitored</span>
                <span className="font-semibold">{heatMapData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Critical Status Regions</span>
                <span className="font-semibold text-red-600">
                  {heatMapData.filter(r => r.conservationStatus === 'Critical').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Threat Level</span>
                <span className="font-semibold">
                  {(heatMapData.reduce((sum, r) => sum + r.threatLevel, 0) / heatMapData.length).toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
