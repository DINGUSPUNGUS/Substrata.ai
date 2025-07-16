import Head from 'next/head'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ProjectManagement from '../components/ProjectManagement'

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>Projects - Substrata.ai Conservation</title>
        <meta name="description" content="Comprehensive project management for conservation initiatives" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                <p className="text-gray-600 mt-2">Manage all your conservation projects from planning to completion</p>
              </div>
              
              <ProjectManagement />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
