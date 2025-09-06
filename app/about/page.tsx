import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Shield, Users, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About BHASA-RAKSHAK
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are on a mission to preserve and celebrate the world's linguistic diversity through community-driven technology and AI-powered tools.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every 14 days, a language dies. With it goes centuries of cultural knowledge, stories, and unique ways of understanding the world. BHASA-RAKSHAK is our response to this global challenge.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe that technology can be a force for cultural preservation, not just cultural homogenization. By combining community contributions with AI-powered tools, we're creating a sustainable ecosystem for dialect preservation and learning.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
            <p className="text-gray-600">
              Native speakers and language enthusiasts are at the heart of everything we do. Their knowledge and passion drive our platform.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Impact</h3>
            <p className="text-gray-600">
              We're building tools that work for languages and dialects from every corner of the world, respecting local contexts and needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Respect</h3>
            <p className="text-gray-600">
              We approach language preservation with deep respect for cultural traditions and the communities that speak these languages.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Team Krishna</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We're a diverse team of linguists, technologists, and cultural preservation advocates who believe in the power of community-driven solutions. Our backgrounds span from academic linguistics to software engineering, united by a shared passion for preserving linguistic diversity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                A world where no language dies in silence, where every dialect has a voice, and where technology amplifies rather than replaces human cultural expression.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Approach</h3>
              <p className="text-gray-600">
                We combine cutting-edge AI technology with deep community engagement, ensuring that our tools serve the needs of native speakers and learners alike.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-gray-700 mb-6">
            Whether you're a native speaker, language learner, researcher, or simply someone who cares about cultural preservation, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Join Our Community
            </a>
            <a
              href="/explore"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              Explore Content
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
