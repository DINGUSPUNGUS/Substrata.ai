import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, memo, useMemo } from 'react'
import { Leaf, MapPin, Users, BarChart3, Database, Calendar, FileText, Globe, Shield, Zap, ChevronRight, Play, CheckCircle, Star, ArrowRight } from 'lucide-react'

// Memoized feature card component for better performance
const FeatureCard = memo(function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="group p-8 rounded-2xl border border-gray-200 hover:border-conservation-300 transition-all duration-300 hover:shadow-xl bg-white">
      <div className={`inline-flex p-3 rounded-xl ${color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-conservation-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
})

// Memoized stats component
const StatCard = memo(function StatCard({ number, label, suffix = '' }) {
  return (
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-conservation-600 mb-2">
        {number}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
})

// Memoized testimonial component
const TestimonialCard = memo(function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 text-lg mb-6">
        "{testimonial.quote}"
      </blockquote>
      <div>
        <div className="font-semibold text-gray-900">{testimonial.author}</div>
        <div className="text-gray-600">{testimonial.role}</div>
        <div className="text-green-600 font-medium">{testimonial.organization}</div>
      </div>
    </div>
  )
})

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Memoize features array to prevent re-renders
  const features = useMemo(() => [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Interactive GIS Mapping",
      description: "Advanced geographic information systems with real-time species tracking, habitat monitoring, and conservation site management.",
      color: "bg-green-500"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Biodiversity Database",
      description: "Comprehensive species observation tracking, population monitoring, and ecological data management with advanced analytics.",
      color: "bg-blue-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Stakeholder CRM",
      description: "Complete relationship management for donors, volunteers, researchers, and community partners with automated engagement.",
      color: "bg-purple-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time conservation metrics, impact reporting, and predictive insights for data-driven conservation decisions.",
      color: "bg-orange-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Custom Survey Builder",
      description: "Flexible survey creation tools for field research, community engagement, and conservation impact assessment.",
      color: "bg-red-500"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Project Timeline Tracking",
      description: "Comprehensive project management with milestone tracking, resource allocation, and automated progress reporting.",
      color: "bg-indigo-500"
    }
  ], [])

  // Memoize stats array
  const stats = useMemo(() => [
    { number: "50+", label: "Conservation Organizations" },
    { number: "10,000+", label: "Species Tracked" },
    { number: "1M+", label: "Data Points Collected" },
    { number: "99.9%", label: "Platform Uptime" }
  ], [])

  // Memoize testimonials array
  const testimonials = useMemo(() => [
    {
      quote: "Substrata.ai has revolutionized how we manage our conservation projects. The real-time data insights have been game-changing.",
      author: "Dr. Sarah Chen",
      role: "Marine Conservation Director",
      organization: "Ocean Alliance"
    },
    {
      quote: "The stakeholder management and automated reporting features have saved us countless hours every week.",
      author: "Michael Rodriguez",
      role: "Wildlife Program Manager",
      organization: "Forest Guardians"
    }
  ], [])

  return (
    <>
      <Head>
        <title>Substrata.ai - Advanced Conservation Management Platform</title>
        <meta name="description" content="Comprehensive conservation management platform with GIS mapping, biodiversity tracking, stakeholder CRM, and advanced analytics for environmental organizations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Substrata.ai - Conservation Management Platform" />
        <meta property="og:description" content="Advanced conservation technology for environmental organizations" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://substrata-ai.xyz" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center h-10 w-10 bg-green-600 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Substrata.ai</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                <Link href="/platform" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Access Platform
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                The Future of
                <span className="block text-green-600">Conservation Technology</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive platform for conservation organizations to manage projects, track biodiversity, 
                engage stakeholders, and measure environmental impact with advanced analytics and GIS mapping.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/platform" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Access Platform
                </Link>
                <a href="#features" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center">
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} number={stat.number} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Conservation Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage, monitor, and measure your conservation efforts in one integrated platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Conservation Leaders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Conservation Work?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the leading conservation organizations using Substrata.ai to make a bigger impact on environmental protection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/platform" className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                Access Platform
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <a href="mailto:contact@substrata-ai.xyz" className="border border-green-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center h-10 w-10 bg-green-600 rounded-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">Substrata.ai</span>
                </div>
                <p className="text-gray-400">
                  Advanced conservation management platform for environmental organizations worldwide.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/platform" className="hover:text-white">Platform</Link></li>
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#about" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">API Reference</a></li>
                  <li><a href="#" className="hover:text-white">Status</a></li>
                  <li><a href="mailto:support@substrata-ai.xyz" className="hover:text-white">Email Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Substrata.ai. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
