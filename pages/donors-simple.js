import { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DonorsSimple() {
  return (
    <>
      <Head>
        <title>Donor Management - Substrata.AI Conservation Platform</title>
        <meta name="description" content="Manage donor relationships and fundraising" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 ml-64">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
                <p className="text-gray-600 mt-1">
                  Build relationships and track conservation funding
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Donor Management System</h2>
              <p className="text-gray-600 mb-4">
                This page is temporarily in simplified mode to ensure deployment works.
                Full donor management features will be restored after successful deployment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Total Donors</h3>
                  <p className="text-2xl font-bold text-blue-600">124</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900">Total Raised</h3>
                  <p className="text-2xl font-bold text-green-600">$485,000</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Major Donors</h3>
                  <p className="text-2xl font-bold text-purple-600">18</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
