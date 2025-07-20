import { useState, useEffect } from 'react'
import { 
  Target, TrendingUp, Calendar, CheckCircle, AlertCircle, Clock,
  Plus, Edit3, Trash2, BarChart3, Users, MapPin, Leaf, Award,
  Filter, Search, Download, RefreshCw, Eye, Settings
} from 'lucide-react'
import { 
  ProgressChart, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { dataManager } from '../utils/supabaseManager'

export default function GoalProgressTracking() {
  const [goals, setGoals] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: ''
  })

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'species_conservation',
    priority: 'medium',
    target_value: '',
    target_unit: 'surveys',
    current_value: 0,
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    status: 'active',
    assigned_to: '',
    milestones: [],
    success_criteria: '',
    tags: []
  })

  const goalCategories = [
    { value: 'species_conservation', label: 'Species Conservation', icon: Leaf, color: 'text-green-600' },
    { value: 'habitat_protection', label: 'Habitat Protection', icon: MapPin, color: 'text-blue-600' },
    { value: 'research_surveys', label: 'Research & Surveys', icon: BarChart3, color: 'text-purple-600' },
    { value: 'volunteer_engagement', label: 'Volunteer Engagement', icon: Users, color: 'text-orange-600' },
    { value: 'funding_fundraising', label: 'Funding & Fundraising', icon: Target, color: 'text-pink-600' },
    { value: 'education_outreach', label: 'Education & Outreach', icon: Award, color: 'text-indigo-600' },
    { value: 'data_collection', label: 'Data Collection', icon: BarChart3, color: 'text-cyan-600' },
    { value: 'restoration_projects', label: 'Restoration Projects', icon: Leaf, color: 'text-emerald-600' }
  ]

  const targetUnits = [
    'surveys', 'species_count', 'hectares', 'volunteers', 'dollars', 'hours',
    'participants', 'reports', 'sites', 'observations', 'percentage', 'projects'
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [goalsResult, progressResult] = await Promise.all([
        dataManager.read('conservation_goals'),
        dataManager.read('goal_progress')
      ])

      if (goalsResult.success) setGoals(goalsResult.data)
      if (progressResult.success) setProgress(progressResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate goal progress and statistics
  const calculateGoalProgress = (goal) => {
    const progressPercentage = goal.target_value > 0 ? 
      Math.min((goal.current_value / goal.target_value) * 100, 100) : 0

    const daysTotal = goal.target_date ? 
      Math.ceil((new Date(goal.target_date) - new Date(goal.start_date)) / (1000 * 60 * 60 * 24)) : 0
    const daysElapsed = Math.ceil((new Date() - new Date(goal.start_date)) / (1000 * 60 * 60 * 24))
    const timeProgress = daysTotal > 0 ? Math.min((daysElapsed / daysTotal) * 100, 100) : 0

    const isOnTrack = progressPercentage >= timeProgress * 0.9 // 90% threshold
    const daysRemaining = goal.target_date ? 
      Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null

    return {
      progressPercentage: Math.round(progressPercentage * 10) / 10,
      timeProgress: Math.round(timeProgress * 10) / 10,
      isOnTrack,
      daysRemaining,
      isOverdue: daysRemaining !== null && daysRemaining < 0
    }
  }

  // Get goal statistics
  const getGoalStatistics = () => {
    const activeGoals = goals.filter(g => g.status === 'active')
    const completedGoals = goals.filter(g => g.status === 'completed')
    const overdue = goals.filter(g => {
      const calc = calculateGoalProgress(g)
      return calc.isOverdue && g.status === 'active'
    })
    const onTrack = goals.filter(g => {
      const calc = calculateGoalProgress(g)
      return calc.isOnTrack && g.status === 'active'
    })

    const avgProgress = activeGoals.length > 0 ? 
      activeGoals.reduce((sum, goal) => sum + calculateGoalProgress(goal).progressPercentage, 0) / activeGoals.length : 0

    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      overdue: overdue.length,
      onTrack: onTrack.length,
      avgProgress: Math.round(avgProgress * 10) / 10
    }
  }

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         goal.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || goal.status === filters.status
    const matchesCategory = filters.category === 'all' || goal.category === filters.category
    const matchesPriority = filters.priority === 'all' || goal.priority === filters.priority

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  // Handle form submission
  const saveGoal = async () => {
    try {
      const goalData = {
        ...goalForm,
        target_value: parseFloat(goalForm.target_value) || 0,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingGoal) {
        result = await dataManager.update('conservation_goals', editingGoal.id, goalData)
        setGoals(prev => prev.map(g => g.id === editingGoal.id ? result.data : g))
      } else {
        result = await dataManager.create('conservation_goals', {
          ...goalData,
          created_at: new Date().toISOString()
        })
        setGoals(prev => [...prev, result.data])
      }

      if (result.success) {
        setShowCreateModal(false)
        setEditingGoal(null)
        resetForm()
        alert('Goal saved successfully!')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save goal: ' + error.message)
    }
  }

  // Update goal progress
  const updateProgress = async (goalId, newValue, notes = '') => {
    try {
      const goal = goals.find(g => g.id === goalId)
      if (!goal) return

      // Update the goal's current value
      const updatedGoal = { ...goal, current_value: newValue, updated_at: new Date().toISOString() }
      const result = await dataManager.update('conservation_goals', goalId, updatedGoal)
      
      if (result.success) {
        setGoals(prev => prev.map(g => g.id === goalId ? result.data : g))

        // Log progress update
        const progressEntry = {
          goal_id: goalId,
          value: newValue,
          notes,
          recorded_at: new Date().toISOString(),
          recorded_by: 'current-user' // Would come from auth context
        }
        
        await dataManager.create('goal_progress', progressEntry)
        setProgress(prev => [...prev, progressEntry])
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Failed to update progress: ' + error.message)
    }
  }

  // Reset form
  const resetForm = () => {
    setGoalForm({
      title: '',
      description: '',
      category: 'species_conservation',
      priority: 'medium',
      target_value: '',
      target_unit: 'surveys',
      current_value: 0,
      start_date: new Date().toISOString().split('T')[0],
      target_date: '',
      status: 'active',
      assigned_to: '',
      milestones: [],
      success_criteria: '',
      tags: []
    })
  }

  // Export goals data
  const exportGoals = () => {
    const exportData = {
      goals: filteredGoals.map(goal => ({
        ...goal,
        progress: calculateGoalProgress(goal)
      })),
      statistics: getGoalStatistics(),
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `conservation_goals_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = getGoalStatistics()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goal Progress Tracking</h1>
          <p className="text-gray-600">Monitor and track conservation objectives and milestones</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={exportGoals} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Goals</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-xl font-semibold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">On Track</p>
              <p className="text-xl font-semibold text-gray-900">{stats.onTrack}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Progress</p>
              <p className="text-xl font-semibold text-gray-900">{stats.avgProgress}%</p>
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
              placeholder="Search goals..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              {goalCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Priorities</option>
              {priorityLevels.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredGoals.length} goals
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGoals.map(goal => {
          const calc = calculateGoalProgress(goal)
          const category = goalCategories.find(c => c.value === goal.category)
          const priority = priorityLevels.find(p => p.value === goal.priority)
          const status = statusOptions.find(s => s.value === goal.status)

          return (
            <div key={goal.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {category && <category.icon className={`h-5 w-5 mr-2 ${category.color}`} />}
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                        {status?.label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority?.color}`}>
                        {priority?.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal)
                        setGoalForm(goal)
                        setShowCreateModal(true)
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete goal "${goal.title}"?`)) {
                          dataManager.delete('conservation_goals', goal.id)
                          setGoals(prev => prev.filter(g => g.id !== goal.id))
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {goal.current_value} / {goal.target_value} {goal.target_unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        calc.isOnTrack ? 'bg-green-500' : 
                        calc.isOverdue ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${calc.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{calc.progressPercentage}% complete</span>
                    <span>
                      {calc.daysRemaining !== null && (
                        calc.isOverdue ? 
                          `${Math.abs(calc.daysRemaining)} days overdue` :
                          `${calc.daysRemaining} days left`
                      )}
                    </span>
                  </div>
                </div>

                {/* Target Date */}
                {goal.target_date && (
                  <div className="text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                )}

                {/* Update Progress */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Update value"
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseFloat(e.target.value)
                        if (!isNaN(value)) {
                          updateProgress(goal.id, value)
                          e.target.value = ''
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600 mb-4">Create your first conservation goal to start tracking progress.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </button>
        </div>
      )}

      {/* Create/Edit Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Describe the goal and its importance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={goalForm.category}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {goalCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={goalForm.priority}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {priorityLevels.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                  <input
                    type="number"
                    value={goalForm.target_value}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_value: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={goalForm.target_unit}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_unit: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {targetUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Value</label>
                  <input
                    type="number"
                    value={goalForm.current_value}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, current_value: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={goalForm.start_date}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.target_date}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Success Criteria</label>
                <textarea
                  value={goalForm.success_criteria}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, success_criteria: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={2}
                  placeholder="How will success be measured and defined?"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingGoal(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={saveGoal} className="btn-primary">
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Details Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedGoal.title}</h2>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Goal details and progress chart would go here */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Timeline</h3>
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                    <p className="text-gray-500">Progress chart would be displayed here</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Updates</h3>
                  <div className="space-y-2">
                    {progress
                      .filter(p => p.goal_id === selectedGoal.id)
                      .slice(-5)
                      .map((entry, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            {new Date(entry.recorded_at).toLocaleDateString()}
                          </span>
                          <span className="text-sm font-medium">{entry.value} {selectedGoal.target_unit}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
