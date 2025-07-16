import { useState, useEffect } from 'react'
import { 
  Folder, Plus, Calendar, Users, DollarSign, CheckCircle, 
  AlertCircle, Clock, MapPin, FileText, Target, TrendingUp,
  Filter, Search, MoreVertical, Edit, Trash2, Eye
} from 'lucide-react'

// Sample project data - in real app this would come from Supabase
const generateProjectData = () => [
  {
    id: 1,
    name: "Amazon Rainforest Restoration",
    status: "Active",
    priority: "High",
    progress: 65,
    budget: 250000,
    spent: 162500,
    startDate: "2024-03-15",
    endDate: "2025-12-31",
    location: "Amazon Basin, Brazil",
    manager: "Dr. Maria Santos",
    team: ["John Doe", "Sarah Wilson", "Carlos Rodriguez", "Emma Thompson"],
    description: "Large-scale reforestation project to restore 1000 hectares of degraded rainforest",
    objectives: [
      { id: 1, text: "Plant 50,000 native trees", completed: true },
      { id: 2, text: "Establish 3 research stations", completed: true },
      { id: 3, text: "Train 20 local conservationists", completed: false },
      { id: 4, text: "Create wildlife corridors", completed: false }
    ],
    milestones: [
      { id: 1, name: "Site preparation", date: "2024-03-15", completed: true },
      { id: 2, name: "Initial planting phase", date: "2024-06-01", completed: true },
      { id: 3, name: "Research station setup", date: "2024-09-15", completed: true },
      { id: 4, name: "Community training program", date: "2024-12-01", completed: false },
      { id: 5, name: "Wildlife corridor completion", date: "2025-06-01", completed: false }
    ],
    risks: [
      { id: 1, risk: "Extreme weather events", probability: "Medium", impact: "High" },
      { id: 2, risk: "Funding shortfall", probability: "Low", impact: "High" },
      { id: 3, risk: "Local community resistance", probability: "Low", impact: "Medium" }
    ]
  },
  {
    id: 2,
    name: "Coral Reef Monitoring System",
    status: "Planning",
    priority: "High",
    progress: 25,
    budget: 180000,
    spent: 45000,
    startDate: "2024-07-01",
    endDate: "2025-12-31",
    location: "Great Barrier Reef, Australia",
    manager: "Dr. James Mitchell",
    team: ["Alice Chen", "Bob Taylor", "Diana Kumar"],
    description: "Deploy advanced monitoring technology to track coral reef health and restoration progress",
    objectives: [
      { id: 1, text: "Install 20 underwater sensors", completed: false },
      { id: 2, text: "Develop monitoring dashboard", completed: true },
      { id: 3, text: "Train marine biologists", completed: false },
      { id: 4, text: "Establish data collection protocols", completed: false }
    ],
    milestones: [
      { id: 1, name: "Equipment procurement", date: "2024-07-01", completed: true },
      { id: 2, name: "Sensor deployment", date: "2024-10-01", completed: false },
      { id: 3, name: "System testing", date: "2024-12-01", completed: false }
    ],
    risks: [
      { id: 1, risk: "Equipment failure underwater", probability: "Medium", impact: "Medium" },
      { id: 2, risk: "Technical complexity", probability: "High", impact: "Medium" }
    ]
  },
  {
    id: 3,
    name: "Wildlife Corridor Protection",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    budget: 120000,
    spent: 115000,
    startDate: "2023-01-15",
    endDate: "2024-06-30",
    location: "Serengeti, Tanzania",
    manager: "Dr. Amara Johnson",
    team: ["Peter Adams", "Lisa Wong", "Mike Hassan"],
    description: "Establish protected corridors for wildlife migration between national parks",
    objectives: [
      { id: 1, text: "Map migration routes", completed: true },
      { id: 2, text: "Secure land agreements", completed: true },
      { id: 3, text: "Install protective barriers", completed: true },
      { id: 4, text: "Monitor wildlife usage", completed: true }
    ],
    milestones: [
      { id: 1, name: "Route mapping complete", date: "2023-03-15", completed: true },
      { id: 2, name: "Land agreements signed", date: "2023-06-01", completed: true },
      { id: 3, name: "Barrier installation", date: "2023-12-01", completed: true },
      { id: 4, name: "Monitoring system active", date: "2024-03-01", completed: true }
    ],
    risks: []
  }
]

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [view, setView] = useState('overview') // overview, details, create
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setProjects(generateProjectData())
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Planning': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const calculateBudgetHealth = (budget, spent) => {
    const percentage = (spent / budget) * 100
    if (percentage > 90) return 'text-red-600'
    if (percentage > 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (view === 'details' && selectedProject) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setView('overview')}
            className="text-conservation-600 hover:text-conservation-700 flex items-center"
          >
            ← Back to Projects
          </button>
          <div className="flex gap-2">
            <button className="btn-secondary">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </button>
            <button className="btn-primary">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Priority</span>
                  <div className={`font-medium ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-conservation-500 h-2 rounded-full" 
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Project Objectives
              </h3>
              <div className="space-y-2">
                {selectedProject.objectives.map(objective => (
                  <div key={objective.id} className="flex items-center">
                    <CheckCircle className={`h-4 w-4 mr-2 ${objective.completed ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={objective.completed ? 'line-through text-gray-500' : ''}>{objective.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Project Milestones
              </h3>
              <div className="space-y-3">
                {selectedProject.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={milestone.completed ? 'line-through text-gray-500' : ''}>{milestone.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{milestone.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            {selectedProject.risks.length > 0 && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Risk Assessment
                </h3>
                <div className="space-y-2">
                  {selectedProject.risks.map(risk => (
                    <div key={risk.id} className="border rounded p-3">
                      <div className="font-medium">{risk.risk}</div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Probability: <span className="font-medium">{risk.probability}</span></span>
                        <span>Impact: <span className="font-medium">{risk.impact}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Project Details</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">{selectedProject.location}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Project Manager</span>
                  <div className="text-sm font-medium">{selectedProject.manager}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Duration</span>
                  <div className="text-sm">{selectedProject.startDate} to {selectedProject.endDate}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget Overview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="font-medium">${selectedProject.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className={`font-medium ${calculateBudgetHealth(selectedProject.budget, selectedProject.spent)}`}>
                    ${selectedProject.spent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium">${(selectedProject.budget - selectedProject.spent).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${calculateBudgetHealth(selectedProject.budget, selectedProject.spent).includes('red') ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(selectedProject.spent / selectedProject.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Team Members
              </h4>
              <div className="space-y-2">
                {selectedProject.team.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-conservation-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Folder className="h-5 w-5 text-conservation-500 mr-2" />
          <h3 className="text-lg font-semibold">Project Management</h3>
        </div>
        <button 
          onClick={() => setView('create')}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-conservation-500"
            />
          </div>
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-conservation-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Planning">Planning</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-lg">{project.name}</h4>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setSelectedProject(project)
                    setView('details')
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>

            <div className="flex items-center gap-4 mb-3 text-sm">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority} Priority
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-conservation-500 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{project.location.split(',')[0]}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{project.team.length} members</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span>Budget: ${project.budget.toLocaleString()}</span>
              <span className={calculateBudgetHealth(project.budget, project.spent)}>
                {Math.round((project.spent / project.budget) * 100)}% used
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No projects found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
