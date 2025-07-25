import React, { useState, useEffect } from 'react'
import { 
  Shield, Users, Key, Lock, Unlock, Settings, 
  UserCheck, UserX, AlertTriangle, CheckCircle,
  Eye, Edit, Trash2, Plus, Search, Filter,
  Crown, Star, User, FileText, Database, Map
} from 'lucide-react'

// Role-Based Access Control System
export default function RoleBasedAccessControl() {
  const [activeTab, setActiveTab] = useState('users')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  // Initialize data
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@conservation.org',
        role: 'Administrator',
        status: 'active',
        lastLogin: '2025-07-25 09:30',
        permissions: ['all'],
        avatar: '👩‍🔬'
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.chen@fieldwork.org',
        role: 'Field Researcher',
        status: 'active',
        lastLogin: '2025-07-24 16:45',
        permissions: ['surveys', 'mapping', 'reports'],
        avatar: '👨‍🌾'
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        email: 'emma.r@conservation.org',
        role: 'Data Analyst',
        status: 'active',
        lastLogin: '2025-07-25 08:15',
        permissions: ['reports', 'analytics', 'export'],
        avatar: '👩‍💼'
      },
      {
        id: 4,
        name: 'James Wilson',
        email: 'j.wilson@volunteers.org',
        role: 'Volunteer Coordinator',
        status: 'active',
        lastLogin: '2025-07-23 14:20',
        permissions: ['volunteers', 'events', 'communication'],
        avatar: '👨‍💼'
      },
      {
        id: 5,
        name: 'Lisa Park',
        email: 'lisa.park@donor.org',
        role: 'Donor Relations',
        status: 'inactive',
        lastLogin: '2025-07-20 10:00',
        permissions: ['donors', 'reports_view'],
        avatar: '👩‍💰'
      }
    ])

    setRoles([
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access and user management',
        color: 'red',
        icon: Crown,
        userCount: 1,
        permissions: ['all']
      },
      {
        id: 'researcher',
        name: 'Field Researcher',
        description: 'Data collection, surveys, and field mapping',
        color: 'green',
        icon: User,
        userCount: 1,
        permissions: ['surveys', 'mapping', 'reports', 'sites']
      },
      {
        id: 'analyst',
        name: 'Data Analyst',
        description: 'Data analysis, reporting, and insights',
        color: 'blue',
        icon: FileText,
        userCount: 1,
        permissions: ['reports', 'analytics', 'export', 'dashboards']
      },
      {
        id: 'coordinator',
        name: 'Volunteer Coordinator',
        description: 'Volunteer management and event coordination',
        color: 'purple',
        icon: Users,
        userCount: 1,
        permissions: ['volunteers', 'events', 'communication']
      },
      {
        id: 'donor_relations',
        name: 'Donor Relations',
        description: 'Donor management and fundraising',
        color: 'yellow',
        icon: Star,
        userCount: 1,
        permissions: ['donors', 'reports_view', 'communication']
      }
    ])

    setPermissions([
      { id: 'surveys', name: 'Survey Management', category: 'Data Collection', description: 'Create, edit, and manage field surveys' },
      { id: 'mapping', name: 'GIS Mapping', category: 'Data Collection', description: 'Access mapping tools and GPS features' },
      { id: 'sites', name: 'Site Management', category: 'Data Collection', description: 'Manage conservation sites and boundaries' },
      { id: 'reports', name: 'Report Creation', category: 'Analytics', description: 'Create and edit detailed reports' },
      { id: 'reports_view', name: 'Report Viewing', category: 'Analytics', description: 'View existing reports only' },
      { id: 'analytics', name: 'Advanced Analytics', category: 'Analytics', description: 'Access to analytics dashboards' },
      { id: 'export', name: 'Data Export', category: 'Analytics', description: 'Export data in various formats' },
      { id: 'volunteers', name: 'Volunteer Management', category: 'Community', description: 'Manage volunteer profiles and schedules' },
      { id: 'donors', name: 'Donor Management', category: 'Community', description: 'Manage donor relationships and contributions' },
      { id: 'events', name: 'Event Management', category: 'Community', description: 'Create and manage conservation events' },
      { id: 'communication', name: 'Communications', category: 'Community', description: 'Send emails and notifications' },
      { id: 'user_management', name: 'User Management', category: 'Administration', description: 'Manage user accounts and permissions' },
      { id: 'system_settings', name: 'System Settings', category: 'Administration', description: 'Configure system-wide settings' }
    ])

    setAuditLogs([
      {
        id: 1,
        timestamp: '2025-07-25 09:30:15',
        user: 'Dr. Sarah Johnson',
        action: 'User Created',
        details: 'Created new user account for Mike Chen',
        category: 'user_management',
        ip: '192.168.1.100'
      },
      {
        id: 2,
        timestamp: '2025-07-25 08:45:22',
        user: 'Emma Rodriguez',
        action: 'Data Export',
        details: 'Exported biodiversity report (CSV format)',
        category: 'data_access',
        ip: '192.168.1.101'
      },
      {
        id: 3,
        timestamp: '2025-07-24 16:20:33',
        user: 'Mike Chen',
        action: 'Survey Created',
        details: 'Created new wildlife survey for Yellowstone area',
        category: 'data_collection',
        ip: '192.168.1.102'
      },
      {
        id: 4,
        timestamp: '2025-07-24 14:15:44',
        user: 'James Wilson',
        action: 'Permission Modified',
        details: 'Updated volunteer coordinator permissions',
        category: 'security',
        ip: '192.168.1.103'
      }
    ])
  }, [])

  const tabs = [
    { id: 'users', name: 'Users', icon: Users, count: users.length },
    { id: 'roles', name: 'Roles', icon: Shield, count: roles.length },
    { id: 'permissions', name: 'Permissions', icon: Key, count: permissions.length },
    { id: 'audit', name: 'Audit Log', icon: FileText, count: auditLogs.length }
  ]

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.name === role)
    return roleData?.color || 'gray'
  }

  const getRoleIcon = (role) => {
    const roleData = roles.find(r => r.name === role)
    const Icon = roleData?.icon || User
    return Icon
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getPermissionCategory = (category) => {
    const colors = {
      'Data Collection': 'bg-blue-100 text-blue-800',
      'Analytics': 'bg-green-100 text-green-800',
      'Community': 'bg-purple-100 text-purple-800',
      'Administration': 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const renderUsersTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => {
              const RoleIcon = getRoleIcon(user.role)
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{user.avatar}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <RoleIcon className={`h-4 w-4 mr-2 text-${getRoleColor(user.role)}-600`} />
                      <span className="text-sm text-gray-900">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderRolesTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">System Roles</h3>
        <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          <span>Create Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => {
          const Icon = role.icon
          return (
            <div key={role.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${role.color}-100 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${role.color}-600`} />
                </div>
                <span className="text-sm text-gray-500">{role.userCount} users</span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{role.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Permissions
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map(perm => (
                    <span key={perm} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="text-xs text-gray-500">+{role.permissions.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <button className="flex-1 text-sm text-blue-600 hover:text-blue-800">
                  Edit Role
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800">
                  View Users
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderPermissionsTab = () => {
    const categories = [...new Set(permissions.map(p => p.category))]
    
    return (
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-3 ${getPermissionCategory(category).split(' ')[0]}`} />
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissions.filter(p => p.category === category).map(permission => (
                <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{permission.name}</h4>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${getPermissionCategory(category)}`}>
                      {category}
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      View Roles →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderAuditTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Security Audit Log</h3>
        <div className="flex items-center space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Categories</option>
            <option>User Management</option>
            <option>Data Access</option>
            <option>Security</option>
            <option>Data Collection</option>
          </select>
          <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {log.category === 'user_management' && <UserCheck className="h-5 w-5 text-blue-600" />}
                    {log.category === 'data_access' && <Database className="h-5 w-5 text-green-600" />}
                    {log.category === 'security' && <Shield className="h-5 w-5 text-red-600" />}
                    {log.category === 'data_collection' && <Map className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{log.action}</div>
                    <div className="text-sm text-gray-600">{log.details}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      by {log.user} • {log.timestamp} • IP: {log.ip}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getPermissionCategory(
                  log.category === 'user_management' ? 'Administration' :
                  log.category === 'data_access' ? 'Analytics' :
                  log.category === 'security' ? 'Administration' : 'Data Collection'
                )}`}>
                  {log.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
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
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">🔐 Role-Based Access Control</h2>
              <p className="text-gray-600">Secure user management and permissions system</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Security Active
            </span>
          </div>
        </div>

        {/* Security Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{roles.length}</div>
            <div className="text-sm text-gray-600">System Roles</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{permissions.length}</div>
            <div className="text-sm text-gray-600">Permissions</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{auditLogs.length}</div>
            <div className="text-sm text-gray-600">Recent Activities</div>
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
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'roles' && renderRolesTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'audit' && renderAuditTab()}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{selectedUser.avatar}</span>
                <div>
                  <h4 className="text-xl font-semibold">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">{selectedUser.role}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Permissions</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.map(perm => (
                    <div key={perm} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
