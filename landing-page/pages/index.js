import Head from 'next/head'
import Link from 'next/link'
import { 
  Leaf, 
  BarChart3, 
  Users, 
  MapPin, 
  Camera, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: 'Field Survey Tools',
      description: 'Mobile-friendly data collection with GPS tagging, photo uploads, and species identification'
    },
    {
      icon: MapPin,
      title: 'GIS Mapping Dashboard',
      description: 'Visualize survey data, habitat zones, and conservation progress on interactive maps'
    },
    {
      icon: Users,
      title: 'Volunteer Management',
      description: 'Schedule teams, track participation, and manage training with automated reminders'
    },
    {
      icon: BarChart3,
      title: 'Impact Reporting',
      description: 'Generate professional reports for grants, donors, and stakeholders automatically'
    },
    {
      icon: Calendar,
      title: 'Project Automation',
      description: 'Automate routine tasks, compliance tracking, and stakeholder communications'
    },
    {
      icon: Leaf,
      title: 'Conservation Metrics',
      description: 'Track species populations, habitat restoration, and long-term conservation outcomes'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Martinez',
      role: 'Wildlife Biologist, Yellowstone Research Center',
      quote: 'Substrata has transformed how we collect and analyze field data. What used to take weeks now takes hours.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Conservation Director, Pacific Marine Institute',
      quote: 'The automated reporting feature alone has saved us 20 hours per month on grant compliance.',
      rating: 5
    },
    {
      name: 'Jennifer Williams',
      role: 'Program Manager, Forest Conservation Alliance',
      quote: 'Our volunteer coordination is now seamless. The platform handles everything from scheduling to training.',
      rating: 5
    }
  ]

  return (
    <>
      <Head>
        <title>Substrata.AI – Automating Conservation Operations</title>
        <meta name="description" content="The complete conservation management platform for data collection, stakeholder relations, and impact reporting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-conservation-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Substrata.AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-conservation-600">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-conservation-600">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-conservation-600">Pricing</a>
              <Link href="/dashboard" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="bg-gradient-to-br from-conservation-50 to-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Your <span className="text-conservation-600">Conservation</span> Operations
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The complete platform for conservation organizations to streamline data collection, 
              manage volunteers, track impact, and automate administrative tasks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="flex items-center text-conservation-600 hover:text-conservation-700">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo (2 min)
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-sm text-gray-500 mb-8">
              Trusted by 150+ conservation organizations worldwide
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Conservation Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From field data collection to stakeholder reporting, Substrata automates 
              your entire conservation workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-conservation-300 hover:shadow-lg transition-all">
                <div className="p-3 bg-conservation-100 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-conservation-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Save 20+ Hours Per Week on Administrative Tasks
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Automated Reporting</h3>
                    <p className="text-gray-600">Generate grant reports, impact assessments, and donor updates automatically.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Data Collection</h3>
                    <p className="text-gray-600">Mobile-first survey tools with offline capability and automatic sync.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Stakeholder Engagement</h3>
                    <p className="text-gray-600">Manage donors, volunteers, and partners with automated communications.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Compliance Tracking</h3>
                    <p className="text-gray-600">Never miss a deadline with automated compliance monitoring and alerts.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Free Trial</h3>
                <p className="text-gray-600 mb-6">Join 150+ organizations already using Substrata</p>
                
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="your-email@organization.org"
                    className="input-field w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Organization Name"
                    className="input-field w-full"
                    required
                  />
                  <select className="input-field w-full" required>
                    <option value="">Organization Type</option>
                    <option value="npo">Non-Profit Organization</option>
                    <option value="research">Research Institution</option>
                    <option value="government">Government Agency</option>
                    <option value="corporate">Corporate Foundation</option>
                  </select>
                  <button type="submit" className="btn-primary w-full">
                    Start Free 30-Day Trial
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 mt-4">
                  No credit card required • 30-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Conservation Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See how organizations worldwide are transforming their operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-conservation-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Conservation Work?
          </h2>
          <p className="text-xl text-conservation-100 mb-8">
            Join the conservation organizations already saving 20+ hours per week with Substrata
          </p>
          <Link href="/dashboard" className="bg-white text-conservation-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-conservation-400" />
                <span className="ml-2 text-xl font-bold">Substrata.AI</span>
              </div>
              <p className="text-gray-400">
                Empowering conservation organizations with intelligent automation and data-driven insights.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Field Surveys</a></li>
                <li><a href="#" className="hover:text-white">GIS Mapping</a></li>
                <li><a href="#" className="hover:text-white">Volunteer Management</a></li>
                <li><a href="#" className="hover:text-white">Impact Reporting</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Best Practices</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Substrata.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
