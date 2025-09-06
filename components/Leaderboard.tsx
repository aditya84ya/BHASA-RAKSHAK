'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Trophy, Medal, Award, Crown } from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']

export function Leaderboard() {
  const [topLearners, setTopLearners] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTopLearners()
  }, [])

  const fetchTopLearners = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching top learners:', error)
    } else {
      setTopLearners(data || [])
    }
    setLoading(false)
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <Trophy className="w-5 h-5 text-gray-300" />
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-800'
      case 1:
        return 'bg-gray-100 text-gray-800'
      case 2:
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
      </div>

      {topLearners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No learners yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topLearners.map((learner, index) => (
            <div
              key={learner.id}
              className={`flex items-center p-3 rounded-lg ${
                index < 3 ? getRankColor(index) : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {learner.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Level {learner.level}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {learner.points}
                </p>
                <p className="text-xs text-gray-600">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Your Rank */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Your Rank</p>
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="w-4 h-4 text-primary-600" />
            <span className="font-semibold text-gray-900">#--</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Sign in to see your rank</p>
        </div>
      </div>
    </div>
  )
}
