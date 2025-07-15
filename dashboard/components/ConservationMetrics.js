import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Leaf, MapPin, Camera } from 'lucide-react'

const surveyData = [
  { month: 'Jul', surveys: 15, species: 28 },
  { month: 'Aug', surveys: 22, species: 34 },
  { month: 'Sep', surveys: 18, species: 31 },
  { month: 'Oct', surveys: 25, species: 42 },
  { month: 'Nov', surveys: 20, species: 38 },
  { month: 'Dec', surveys: 24, species: 45 },
]

const habitatData = [
  { name: 'Forest', value: 45, color: '#16a34a' },
  { name: 'Wetland', value: 25, color: '#06b6d4' },
  { name: 'Grassland', value: 20, color: '#eab308' },
  { name: 'Desert', value: 10, color: '#f59e0b' },
]

export default function ConservationMetrics() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-conservation-500 mr-2" />
          <h3 className="text-lg font-semibold">Conservation Metrics</h3>
        </div>
        <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-conservation-500">
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-conservation-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Camera className="h-5 w-5 text-conservation-600" />
          </div>
          <div className="text-2xl font-bold text-conservation-700">124</div>
          <div className="text-sm text-conservation-600">Total Surveys</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Leaf className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">218</div>
          <div className="text-sm text-blue-600">Species Recorded</div>
        </div>
        <div className="text-center p-4 bg-earth-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="h-5 w-5 text-earth-600" />
          </div>
          <div className="text-2xl font-bold text-earth-700">42</div>
          <div className="text-sm text-earth-600">Active Sites</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Trends */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Survey Activity</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={surveyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="surveys" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Habitat Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Habitat Coverage</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={habitatData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {habitatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Species Diversity Trend */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Species Diversity Trend</h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={surveyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="species" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
