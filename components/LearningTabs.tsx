'use client'

import { BookOpen, HelpCircle, Gamepad2 } from 'lucide-react'

interface LearningTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function LearningTabs({ activeTab, onTabChange }: LearningTabsProps) {
  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'games', label: 'Games', icon: Gamepad2 },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
