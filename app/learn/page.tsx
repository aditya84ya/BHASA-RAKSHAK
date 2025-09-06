'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LearningTabs } from '@/components/LearningTabs'
import { FlashcardsSection } from '@/components/FlashcardsSection'
import { QuizzesSection } from '@/components/QuizzesSection'
import { GamesSection } from '@/components/GamesSection'
import { Leaderboard } from '@/components/Leaderboard'

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('flashcards')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn & Practice
          </h1>
          <p className="text-xl text-gray-600">
            Enhance your dialect knowledge through interactive learning modules and gamified experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <LearningTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'flashcards' && <FlashcardsSection />}
            {activeTab === 'quizzes' && <QuizzesSection />}
            {activeTab === 'games' && <GamesSection />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
