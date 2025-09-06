'use client'

import { useState } from 'react'
import { Target, Zap, Award, Star, Lock } from 'lucide-react'
import { QuizGame } from './QuizGame'
import { useAuth } from '../app/providers'

export function GamesSection() {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const { user } = useAuth()

  const games = [
    {
      id: 'quiz',
      title: 'Demo Language Quiz',
      description: 'Try a demo quiz game with scores',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
      status: user ? 'Play Now' : 'Login Required'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Challenge',
      description: 'Test your pronunciation skills with audio recognition',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      status: 'Coming Soon'
    },
    {
      id: 'matching',
      title: 'Word Matching',
      description: 'Match dialect words with their meanings',
      icon: Zap,
      color: 'bg-green-100 text-green-600',
      status: 'Coming Soon'
    },
    {
      id: 'memory',
      title: 'Memory Game',
      description: 'Remember and match dialect phrases',
      icon: Award,
      color: 'bg-purple-100 text-purple-600',
      status: 'Coming Soon'
    },
    {
      id: 'speed',
      title: 'Speed Quiz',
      description: 'Answer questions as fast as you can',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
      status: 'Coming Soon'
    }
  ]

  const handleGameClick = (gameId: string, status: string) => {
    if (status === 'Login Required') {
      // Redirect to login or show login prompt
      window.location.href = '/login'
      return
    }
    if (status !== 'Coming Soon') {
      setActiveGame(gameId)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Games</h2>

      {activeGame === 'quiz' ? (
        <QuizGame onBack={() => setActiveGame(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.id, game.status)}
              className={`p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 ${
                game.status === 'Coming Soon' || game.status === 'Login Required'
                  ? 'opacity-75 cursor-pointer hover:shadow-md'
                  : 'cursor-pointer hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center flex-shrink-0 relative`}>
                <game.icon className="w-6 h-6" />
                {game.status === 'Login Required' && (
                  <Lock className="w-3 h-3 absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {game.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    game.status === 'Login Required'
                      ? 'bg-orange-100 text-orange-600'
                      : game.status === 'Coming Soon'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {game.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {game.description}
                </p>

                <button
                  disabled={game.status === 'Coming Soon'}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    game.status === 'Coming Soon'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : game.status === 'Login Required'
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {game.status === 'Coming Soon'
                    ? 'Coming Soon'
                    : game.status === 'Login Required'
                    ? 'Login to Play'
                    : 'Play Game'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-600 mr-2" />
          <p className="text-yellow-800">
            <strong>Coming Soon:</strong> Interactive games are being developed to make learning dialects more engaging and fun!
          </p>
        </div>
      </div>
    </div>
  )
}
