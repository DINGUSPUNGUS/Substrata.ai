import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseManager'
import { Database, CheckCircle, AlertCircle, Loader, Users, MapPin, FileText } from 'lucide-react'

export default function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [tables, setTables] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      
      // Test basic connection
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1)

      if (error) {
        console.error('Supabase connection error:', error)
        setError(error.message)
        setConnectionStatus('error')
      } else {
        console.log('✅ Supabase connection successful!')
        setConnectionStatus('connected')
        
        // Get table information
        await getTableInfo()
      }
    } catch (err) {
      console.error('Connection test failed:', err)
      setError(err.message)
      setConnectionStatus('error')
    }
  }

  const getTableInfo = async () => {
    try {
      const tableTests = [
        { name: 'projects', icon: MapPin, description: 'Conservation projects' },
        { name: 'sites', icon: MapPin, description: 'Conservation sites' },
        { name: 'survey_forms', icon: FileText, description: 'Survey forms' },
        { name: 'surveys', icon: Database, description: 'Survey data' },
        { name: 'stakeholders', icon: Users, description: 'Stakeholder CRM' },
        { name: 'species_observations', icon: Database, description: 'Species data' }
      ]

      const tableResults = []
      
      for (const table of tableTests) {
        try {
          const { count, error } = await supabase
            .from(table.name)
            .select('*', { count: 'exact', head: true })

          if (error) {
            tableResults.push({
              ...table,
              status: 'missing',
              count: 0,
              error: error.message
            })
          } else {
            tableResults.push({
              ...table,
              status: 'connected',
              count: count || 0
            })
          }
        } catch (err) {
          tableResults.push({
            ...table,
            status: 'error',
            count: 0,
            error: err.message
          })
        }
      }

      setTables(tableResults)
    } catch (err) {
      console.error('Error checking tables:', err)
    }
  }

  const createTables = async () => {
    alert('Please run the database_setup.sql file in your Supabase SQL Editor to create the required tables.')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔗 Supabase Connection Test</h1>
              <p className="text-gray-600">Testing connection to your conservation platform database</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {connectionStatus === 'testing' && <Loader className="h-5 w-5 text-blue-600 animate-spin" />}
              {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {connectionStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
              
              <span className={`font-medium ${
                connectionStatus === 'testing' ? 'text-blue-600' :
                connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                {connectionStatus === 'testing' && 'Testing connection...'}
                {connectionStatus === 'connected' && 'Connected successfully!'}
                {connectionStatus === 'error' && 'Connection failed'}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Project: lyvulonnashmukxedovq.supabase.co
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Database Tables Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Database Tables Status</h2>
            {tables.some(t => t.status === 'missing') && (
              <button
                onClick={createTables}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Setup Database
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tables.map(table => {
              const Icon = table.icon
              return (
                <div key={table.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{table.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {table.status === 'connected' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {table.status === 'missing' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {table.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      
                      <span className={`text-xs px-2 py-1 rounded ${
                        table.status === 'connected' ? 'bg-green-100 text-green-800' :
                        table.status === 'missing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {table.status === 'connected' ? `${table.count} records` :
                         table.status === 'missing' ? 'Missing' : 'Error'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{table.description}</p>
                  {table.error && (
                    <p className="text-xs text-red-600 mt-1">{table.error}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🔧 Setup Instructions</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to your Supabase dashboard: <a href="https://supabase.com/dashboard" target="_blank" className="underline">supabase.com/dashboard</a></li>
              <li>2. Open the SQL Editor</li>
              <li>3. Copy and paste the contents of <code>database_setup.sql</code> file</li>
              <li>4. Run the SQL to create all required tables</li>
              <li>5. Refresh this page to test the connection</li>
            </ol>
          </div>

          {connectionStatus === 'connected' && tables.every(t => t.status === 'connected') && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">🎉 Database Ready!</span>
              </div>
              <p className="text-sm text-green-800 mt-1">
                All tables are connected and ready. You can now use the full conservation platform!
              </p>
              <a 
                href="/test-platform" 
                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Open Conservation Platform →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
