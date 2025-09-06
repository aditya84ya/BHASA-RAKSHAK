'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/app/providers'
import { Mic, Video, FileText, Image, Upload, Users, Award, Globe, ArrowRight } from 'lucide-react'

export default function ContributePage() {
  const { user, loading } = useAuth()
  const contributionTypes = [
    {
      icon: Mic,
      title: 'Audio Recordings',
      description: 'Record stories, conversations, songs, or everyday speech in your dialect',
      examples: ['Folk tales and legends', 'Traditional songs', 'Daily conversations', 'Pronunciation guides']
    },
    {
      icon: Video,
      title: 'Video Content',
      description: 'Create videos showing cultural practices, ceremonies, or language use',
      examples: ['Cultural ceremonies', 'Cooking demonstrations', 'Storytelling sessions', 'Language lessons']
    },
    {
      icon: FileText,
      title: 'Written Content',
      description: 'Share written materials like stories, poems, or historical documents',
      examples: ['Traditional stories', 'Poems and songs', 'Historical documents', 'Grammar notes']
    },
    {
      icon: Image,
      title: 'Visual Materials',
      description: 'Upload images that illustrate cultural context or language use',
      examples: ['Cultural artifacts', 'Signage and text', 'Historical photos', 'Educational materials']
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Connect with Community',
      description: 'Join a global community of language enthusiasts and native speakers'
    },
    {
      icon: Award,
      title: 'Earn Recognition',
      description: 'Gain points, badges, and recognition for your contributions'
    },
    {
      icon: Globe,
      title: 'Make Global Impact',
      description: 'Help preserve linguistic diversity for future generations'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contribute to Dialect Preservation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your voice matters. Share your dialect, stories, and cultural knowledge to help preserve linguistic diversity for future generations.
          </p>
          {loading ? (
            <div className="w-48 h-12 bg-gray-200 animate-pulse rounded-xl mx-auto"></div>
          ) : user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span>Go to Dashboard</span>
              </a>
              <a
                href="/explore"
                className="inline-flex items-center space-x-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
              >
                <ArrowRight className="w-6 h-6" />
                <span>Explore Content</span>
              </a>
            </div>
          ) : (
            <a
              href="/auth"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span>Start Contributing</span>
            </a>
          )}
        </div>

        {/* How to Contribute */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Contribute</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contributionTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                  <type.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.examples.map((example, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Contribute?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contribution Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What We're Looking For</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Authentic dialect content from native speakers
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Clear audio/video quality for learning purposes
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cultural context and background information
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Respectful and culturally appropriate content
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Standards</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Minimum 30 seconds for audio content
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Clear pronunciation and natural speech
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Proper metadata (dialect, region, context)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Original content or properly attributed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            {user 
              ? `Welcome back, ${user.email}! Continue preserving your dialect and cultural heritage.`
              : 'Join thousands of contributors who are already preserving their dialects and cultural heritage.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loading ? (
              <div className="w-32 h-12 bg-white/20 animate-pulse rounded-lg mx-auto"></div>
            ) : user ? (
              <>
                <a
                  href="/dashboard"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Dashboard
                </a>
                <a
                  href="/explore"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Explore Contributions
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up Now
                </a>
                <a
                  href="/explore"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Explore Contributions
                </a>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
