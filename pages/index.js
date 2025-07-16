import Head from 'next/head'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import DashboardCard from '../components/DashboardCard'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import ConservationMetrics from '../components/ConservationMetrics'
import ConservationHeatMap from '../components/ConservationHeatMap'
import ProjectManagement from '../components/ProjectManagement'
import { BarChart3, Users, MapPin, FileText, Calendar, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSurveys: 24,
    activeDonors: 156,
    projectsActive: 8,
    upcomingDeadlines: 3,
    speciesMonitored: 42,
    conservationImpact: 95.2
  })

  const quickStats = [
    {
      title: "Active Surveys",
      value: dashboardData.totalSurveys,
      icon: BarChart3,
      change: "+12%",
      changeType: "positive",
      color: "conservation"
    },
    {
      title: "Donor Base", 
      value: dashboardData.activeDonors,
      icon: Users,
      change: "+8%",
      changeType: "positive",
      color: "blue"
    },
    {
      title: "Active Projects",
      value: dashboardData.projectsActive,
      icon: MapPin,
      change: "+2",
      changeType: "positive", 
      color: "earth"
    },
    {
      title: "Pending Reports",
      value: dashboardData.upcomingDeadlines,
      icon: FileText,
      change: "-1",
      changeType: "negative",
      color: "orange"
    }
  ]

  return (
    <>
      <Head>
        <title>Dashboard - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Conservation data management and automation dashboard" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 ml-64">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back to your Conservation Hub
              </h1>
              <p className="text-gray-600">
                Track your impact, manage field operations, and automate conservation workflows.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <DashboardCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Conservation Metrics */}
              <div className="lg:col-span-2">
                <ConservationMetrics />
              </div>
              
              {/* Quick Actions */}
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Heat Map Section */}
            <div className="mb-8">
              <ConservationHeatMap />
            </div>

            {/* Project Management Section */}
            <div className="mb-8">
              <ProjectManagement />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              
              {/* Upcoming Deadlines */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-900">Wildlife Survey Report</p>
                      <p className="text-sm text-orange-600">Due in 3 days</p>
                    </div>
                    <div className="text-orange-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Grant Application</p>
                      <p className="text-sm text-yellow-600">Due in 1 week</p>
                    </div>
                    <div className="text-yellow-500">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Volunteer Training</p>
                      <p className="text-sm text-blue-600">Due in 2 weeks</p>
                    </div>
                    <div className="text-blue-500">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
