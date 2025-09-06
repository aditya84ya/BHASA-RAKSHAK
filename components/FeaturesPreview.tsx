'use client'

import { Mic, Brain, Trophy, Archive, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Record & Upload',
    description: 'Easily record and upload audio, video, and text content in your native dialect',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Brain,
    title: 'Learn with AI',
    description: 'AI-powered transcription, translation, and pronunciation feedback',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Trophy,
    title: 'Community & Gamification',
    description: 'Earn points, badges, and compete with other contributors',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Archive,
    title: 'Archive Access',
    description: 'Browse and search through thousands of dialect recordings and texts',
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
]

export function FeaturesPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful tools and features that make BHASA-RAKSHAK the ultimate platform for dialect preservation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <button className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
