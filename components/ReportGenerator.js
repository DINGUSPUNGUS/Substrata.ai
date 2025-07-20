import { useState, useEffect } from 'react'
import { 
  FileText, Download, Share2, Eye, Settings, BarChart3, PieChart,
  Calendar, Filter, Search, RefreshCw, CheckCircle, Clock,
  Users, MapPin, Leaf, Camera, TrendingUp, TrendingDown,
  FileDown, Printer, Mail, Save, Plus, Edit3, Trash2
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         PieChart as RechartsPieChart, Cell, LineChart, Line, 
         AreaChart, Area, ResponsiveContainer } from 'recharts'
import { dataManager } from '../utils/supabaseManager'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

export default function ReportGenerator() {
  const [surveys, setSurveys] = useState([])
  const [projects, setProjects] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [sites, setSites] = useState([])
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportTemplates, setReportTemplates] = useState([])
  const [generatedReports, setGeneratedReports] = useState([])
  const [activeTemplate, setActiveTemplate] = useState(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    projectId: '',
    siteId: '',
    reportType: 'all',
    search: ''
  })

  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'survey_summary', // 'survey_summary', 'project_report', 'donor_factsheet', 'volunteer_summary', 'species_analysis'
    sections: [],
    filters: {},
    charts: [],
    customFields: [],
    layout: 'standard',
    branding: {
      logo: '',
      organizationName: '',
      headerColor: '#10B981',
      footerText: ''
    }
  })

  const reportTypes = [
    { value: 'survey_summary', label: 'Survey Summary', icon: BarChart3 },
    { value: 'project_report', label: 'Project Report', icon: FileText },
    { value: 'donor_factsheet', label: 'Donor Factsheet', icon: Users },
    { value: 'volunteer_summary', label: 'Volunteer Summary', icon: Clock },
    { value: 'species_analysis', label: 'Species Analysis', icon: Leaf },
    { value: 'site_assessment', label: 'Site Assessment', icon: MapPin },
    { value: 'impact_report', label: 'Impact Report', icon: TrendingUp },
    { value: 'custom', label: 'Custom Report', icon: Settings }
  ]

  const sectionTypes = [
    { value: 'executive_summary', label: 'Executive Summary' },
    { value: 'data_overview', label: 'Data Overview' },
    { value: 'charts_graphs', label: 'Charts & Graphs' },
    { value: 'species_list', label: 'Species List' },
    { value: 'photo_gallery', label: 'Photo Gallery' },
    { value: 'volunteer_stats', label: 'Volunteer Statistics' },
    { value: 'project_timeline', label: 'Project Timeline' },
    { value: 'recommendations', label: 'Recommendations' },
    { value: 'appendix', label: 'Appendix' },
    { value: 'custom_text', label: 'Custom Text' }
  ]

  const chartTypes = [
    { value: 'bar_chart', label: 'Bar Chart', component: BarChart },
    { value: 'pie_chart', label: 'Pie Chart', component: RechartsPieChart },
    { value: 'line_chart', label: 'Line Chart', component: LineChart },
    { value: 'area_chart', label: 'Area Chart', component: AreaChart },
    { value: 'trend_chart', label: 'Trend Analysis', component: LineChart }
  ]

  const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  useEffect(() => {
    loadData()
    loadTemplates()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [surveysResult, projectsResult, volunteersResult, sitesResult, speciesResult] = await Promise.all([
        dataManager.read('surveys'),
        dataManager.read('projects'),
        dataManager.read('volunteers'),
        dataManager.read('survey_sites'),
        dataManager.read('species_observations')
      ])

      if (surveysResult.success) setSurveys(surveysResult.data)
      if (projectsResult.success) setProjects(projectsResult.data)
      if (volunteersResult.success) setVolunteers(volunteersResult.data)
      if (sitesResult.success) setSites(sitesResult.data)
      if (speciesResult.success) setSpecies(speciesResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const result = await dataManager.read('report_templates')
      if (result.success) {
        setReportTemplates(result.data)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  // Generate report data based on filters
  const generateReportData = () => {
    const filteredSurveys = surveys.filter(survey => {
      const surveyDate = new Date(survey.date)
      const startDate = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01')
      const endDate = filters.endDate ? new Date(filters.endDate) : new Date('2100-12-31')
      
      const dateMatch = surveyDate >= startDate && surveyDate <= endDate
      const projectMatch = !filters.projectId || survey.project_id === filters.projectId
      const siteMatch = !filters.siteId || survey.site_id === filters.siteId
      
      return dateMatch && projectMatch && siteMatch
    })

    const totalSurveys = filteredSurveys.length
    const totalSpeciesObserved = species.filter(s => 
      filteredSurveys.some(survey => survey.id === s.survey_id)
    ).length
    const uniqueSpecies = [...new Set(species.filter(s => 
      filteredSurveys.some(survey => survey.id === s.survey_id)
    ).map(s => s.species_name))].length

    // Species frequency data
    const speciesFrequency = species
      .filter(s => filteredSurveys.some(survey => survey.id === s.survey_id))
      .reduce((acc, obs) => {
        acc[obs.species_name] = (acc[obs.species_name] || 0) + (obs.count || 1)
        return acc
      }, {})

    const speciesData = Object.entries(speciesFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Survey timeline data
    const surveyTimeline = filteredSurveys
      .reduce((acc, survey) => {
        const date = survey.date.split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

    const timelineData = Object.entries(surveyTimeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    // Site distribution
    const siteDistribution = filteredSurveys
      .reduce((acc, survey) => {
        const site = sites.find(s => s.id === survey.site_id)
        const siteName = site?.name || 'Unknown Site'
        acc[siteName] = (acc[siteName] || 0) + 1
        return acc
      }, {})

    const siteData = Object.entries(siteDistribution)
      .map(([name, count]) => ({ name, count }))

    // Conservation status analysis
    const conservationStatusData = species
      .filter(s => filteredSurveys.some(survey => survey.id === s.survey_id))
      .reduce((acc, obs) => {
        const status = obs.conservation_status || 'Unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

    const statusData = Object.entries(conservationStatusData)
      .map(([status, count]) => ({ status, count }))

    // Project impact metrics
    const projectImpact = projects.map(project => {
      const projectSurveys = filteredSurveys.filter(s => s.project_id === project.id)
      const projectSpecies = species.filter(s => 
        projectSurveys.some(survey => survey.id === s.survey_id)
      )
      
      return {
        name: project.name,
        surveys: projectSurveys.length,
        species: [...new Set(projectSpecies.map(s => s.species_name))].length,
        volunteers: [...new Set(projectSurveys.map(s => s.surveyor_id))].length
      }
    }).filter(p => p.surveys > 0)

    return {
      summary: {
        totalSurveys,
        totalSpeciesObserved,
        uniqueSpecies,
        sitesVisited: [...new Set(filteredSurveys.map(s => s.site_id))].length,
        volunteersActive: [...new Set(filteredSurveys.map(s => s.surveyor_id))].length,
        dateRange: {
          start: filters.startDate || filteredSurveys[0]?.date?.split('T')[0],
          end: filters.endDate || filteredSurveys[filteredSurveys.length - 1]?.date?.split('T')[0]
        }
      },
      charts: {
        speciesFrequency: speciesData,
        surveyTimeline: timelineData,
        siteDistribution: siteData,
        conservationStatus: statusData,
        projectImpact: projectImpact
      },
      rawData: {
        surveys: filteredSurveys,
        species: species.filter(s => filteredSurveys.some(survey => survey.id === s.survey_id)),
        sites: sites.filter(s => filteredSurveys.some(survey => survey.site_id === s.id))
      }
    }
  }

  // Save report template
  const saveTemplate = async () => {
    try {
      const templateData = {
        ...templateForm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await dataManager.create('report_templates', templateData)
      if (result.success) {
        setReportTemplates(prev => [...prev, result.data])
        setShowTemplateModal(false)
        resetTemplateForm()
        alert('Template saved successfully!')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template: ' + error.message)
    }
  }

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      type: 'survey_summary',
      sections: [],
      filters: {},
      charts: [],
      customFields: [],
      layout: 'standard',
      branding: {
        logo: '',
        organizationName: '',
        headerColor: '#10B981',
        footerText: ''
      }
    })
  }

  // Generate PDF report
  const generatePDF = async (data, template) => {
    const pdf = new jsPDF()
    
    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(40, 40, 40)
    pdf.text(template?.name || 'Conservation Report', 20, 30)
    
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40)
    
    if (data.summary.dateRange.start && data.summary.dateRange.end) {
      pdf.text(`Data Period: ${data.summary.dateRange.start} to ${data.summary.dateRange.end}`, 20, 50)
    }

    // Executive Summary
    pdf.setFontSize(16)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Executive Summary', 20, 70)
    
    const summaryY = 80
    pdf.setFontSize(10)
    pdf.text(`Total Surveys Conducted: ${data.summary.totalSurveys}`, 20, summaryY)
    pdf.text(`Unique Species Observed: ${data.summary.uniqueSpecies}`, 20, summaryY + 10)
    pdf.text(`Total Species Observations: ${data.summary.totalSpeciesObserved}`, 20, summaryY + 20)
    pdf.text(`Sites Visited: ${data.summary.sitesVisited}`, 20, summaryY + 30)
    pdf.text(`Active Volunteers: ${data.summary.volunteersActive}`, 20, summaryY + 40)

    // Species Data Table
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.text('Species Observations Summary', 20, 30)

    const tableData = data.charts.speciesFrequency.slice(0, 20).map((item, index) => [
      index + 1,
      item.name,
      item.count,
      ((item.count / data.summary.totalSpeciesObserved) * 100).toFixed(1) + '%'
    ])

    pdf.autoTable({
      head: [['Rank', 'Species Name', 'Observations', 'Percentage']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] }
    })

    // Site Distribution
    if (data.charts.siteDistribution.length > 0) {
      const siteTableY = pdf.lastAutoTable.finalY + 20
      pdf.setFontSize(14)
      pdf.text('Survey Distribution by Site', 20, siteTableY)

      const siteTableData = data.charts.siteDistribution.map((item, index) => [
        index + 1,
        item.name,
        item.count,
        ((item.count / data.summary.totalSurveys) * 100).toFixed(1) + '%'
      ])

      pdf.autoTable({
        head: [['Rank', 'Site Name', 'Surveys', 'Percentage']],
        body: siteTableData,
        startY: siteTableY + 10,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      })
    }

    // Conservation Status Analysis
    if (data.charts.conservationStatus.length > 0) {
      pdf.addPage()
      pdf.setFontSize(16)
      pdf.text('Conservation Status Analysis', 20, 30)

      const statusTableData = data.charts.conservationStatus.map((item, index) => [
        index + 1,
        item.status,
        item.count,
        ((item.count / data.summary.totalSpeciesObserved) * 100).toFixed(1) + '%'
      ])

      pdf.autoTable({
        head: [['Rank', 'Conservation Status', 'Observations', 'Percentage']],
        body: statusTableData,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [239, 68, 68] }
      })
    }

    // Project Impact Summary
    if (data.charts.projectImpact.length > 0) {
      const projectTableY = pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 20 : 40
      pdf.setFontSize(14)
      pdf.text('Project Impact Summary', 20, projectTableY)

      const projectTableData = data.charts.projectImpact.map((item, index) => [
        index + 1,
        item.name,
        item.surveys,
        item.species,
        item.volunteers
      ])

      pdf.autoTable({
        head: [['Rank', 'Project Name', 'Surveys', 'Species', 'Volunteers']],
        body: projectTableData,
        startY: projectTableY + 10,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] }
      })
    }

    // Footer
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10)
      pdf.text('Generated by Conservation Platform', 20, pdf.internal.pageSize.height - 10)
    }

    return pdf
  }

  // Export functions
  const exportToPDF = async () => {
    const data = generateReportData()
    const pdf = await generatePDF(data, activeTemplate)
    pdf.save(`conservation_report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportToCSV = () => {
    const data = generateReportData()
    
    // Prepare CSV data
    const csvData = [
      ['Survey Reports Summary'],
      [''],
      ['Generated:', new Date().toLocaleDateString()],
      ['Period:', `${data.summary.dateRange.start} to ${data.summary.dateRange.end}`],
      [''],
      ['Summary Statistics'],
      ['Total Surveys:', data.summary.totalSurveys],
      ['Unique Species:', data.summary.uniqueSpecies],
      ['Total Observations:', data.summary.totalSpeciesObserved],
      ['Sites Visited:', data.summary.sitesVisited],
      ['Active Volunteers:', data.summary.volunteersActive],
      [''],
      ['Species Frequency Data'],
      ['Rank', 'Species Name', 'Observation Count', 'Percentage'],
      ...data.charts.speciesFrequency.map((item, index) => [
        index + 1,
        item.name,
        item.count,
        ((item.count / data.summary.totalSpeciesObserved) * 100).toFixed(1) + '%'
      ]),
      [''],
      ['Site Distribution'],
      ['Site Name', 'Survey Count', 'Percentage'],
      ...data.charts.siteDistribution.map(item => [
        item.name,
        item.count,
        ((item.count / data.summary.totalSurveys) * 100).toFixed(1) + '%'
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `conservation_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const data = generateReportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `conservation_report_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Generate report preview
  const generateReportPreview = () => {
    const data = generateReportData()
    setReportData(data)
    setShowGenerateModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Generator</h1>
          <p className="text-gray-600">Create professional conservation reports and factsheets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </button>
          <button
            onClick={generateReportPreview}
            className="btn-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
            <select
              value={filters.siteId}
              onChange={(e) => setFilters(prev => ({ ...prev, siteId: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map(template => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                activeTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveTemplate(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {reportTypes.find(t => t.value === template.type)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Edit template logic
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete template "${template.name}"?`)) {
                        dataManager.delete('report_templates', template.id)
                        setReportTemplates(prev => prev.filter(t => t.id !== template.id))
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportToPDF}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <FileDown className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Export to PDF</h3>
              <p className="text-gray-600">Generate professional PDF reports</p>
            </div>
          </div>
        </button>

        <button
          onClick={exportToCSV}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <Download className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Export to CSV</h3>
              <p className="text-gray-600">Download data in spreadsheet format</p>
            </div>
          </div>
        </button>

        <button
          onClick={exportToJSON}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Export to JSON</h3>
              <p className="text-gray-600">Raw data for further analysis</p>
            </div>
          </div>
        </button>
      </div>

      {/* Report Preview Modal */}
      {showGenerateModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Report Preview</h2>
              <div className="flex space-x-3">
                <button onClick={exportToPDF} className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button onClick={exportToCSV} className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </button>
                <button onClick={() => setShowGenerateModal(false)} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>

            <div className="p-6" id="report-content">
              {/* Report Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTemplate?.name || 'Conservation Report'}
                </h1>
                <p className="text-gray-600">
                  Generated on {new Date().toLocaleDateString()}
                </p>
                {reportData.summary.dateRange.start && reportData.summary.dateRange.end && (
                  <p className="text-gray-600">
                    Data Period: {reportData.summary.dateRange.start} to {reportData.summary.dateRange.end}
                  </p>
                )}
              </div>

              {/* Executive Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.summary.totalSurveys}</h3>
                    <p className="text-gray-600">Total Surveys</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.summary.uniqueSpecies}</h3>
                    <p className="text-gray-600">Unique Species</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.summary.sitesVisited}</h3>
                    <p className="text-gray-600">Sites Visited</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.summary.totalSpeciesObserved}</h3>
                    <p className="text-gray-600">Total Observations</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900">{reportData.summary.volunteersActive}</h3>
                    <p className="text-gray-600">Active Volunteers</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Analysis</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Species Frequency Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Species Observed</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.charts.speciesFrequency.slice(0, 8)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          fontSize={10}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Survey Timeline */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Timeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.charts.surveyTimeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Site Distribution */}
                  {reportData.charts.siteDistribution.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Distribution by Site</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={reportData.charts.siteDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {reportData.charts.siteDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Conservation Status */}
                  {reportData.charts.conservationStatus.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservation Status</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.charts.conservationStatus}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="status" fontSize={10} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#EF4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Tables */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Data</h2>
                
                {/* Top Species Table */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Top 10 Species by Observation Count</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observations</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.charts.speciesFrequency.slice(0, 10).map((species, index) => (
                          <tr key={species.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{species.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{species.count}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {((species.count / reportData.summary.totalSpeciesObserved) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Project Impact Table */}
                {reportData.charts.projectImpact.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Impact Summary</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surveys</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteers</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reportData.charts.projectImpact.map((project) => (
                            <tr key={project.name}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.surveys}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.species}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.volunteers}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Report Template</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Describe this template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
                <select
                  value={templateForm.type}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={templateForm.branding.organizationName}
                  onChange={(e) => setTemplateForm(prev => ({ 
                    ...prev, 
                    branding: { ...prev.branding, organizationName: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Your organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Color</label>
                <input
                  type="color"
                  value={templateForm.branding.headerColor}
                  onChange={(e) => setTemplateForm(prev => ({ 
                    ...prev, 
                    branding: { ...prev.branding, headerColor: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  resetTemplateForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="btn-primary"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
