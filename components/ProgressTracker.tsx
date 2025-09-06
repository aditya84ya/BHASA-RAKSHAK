'use client'

import { Database } from '@/lib/supabase'
import { Trophy, Star, Target, TrendingUp } from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProgressTrackerProps {
  profile: Profile | null
}

export function ProgressTracker({ profile }: ProgressTrackerProps) {
  if (!profile) return null

  const badges = [
    { name: 'First Upload', earned: profile.points > 0, icon: Star },
    { name: 'Storyteller', earned: profile.points > 100, icon: Trophy },
    { name: 'Word Collector', earned: profile.points > 500, icon: Target },
    { name: 'Community Champion', earned: profile.points > 1000, icon: TrendingUp },
  ]

  const nextLevelPoints = (profile.level + 1) * 100
  const progressToNextLevel = (profile.points % 100) / 100

  return (
    <div className="space-y-6">
      {/* Activity Points Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <Trophy className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Activity Points</h3>
            <p className="text-2xl font-bold text-primary-600">{profile.points} Points</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Level {profile.level}</span>
            <span>{nextLevelPoints - profile.points} to next level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressToNextLevel * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Level {profile.level} Contributor</p>
          <p>{profile.streak_days} day streak</p>
        </div>
      </div>

      {/* Badges Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Badges</h3>
        <div className="space-y-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg ${
                badge.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                badge.earned ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <badge.icon className={`w-4 h-4 ${
                  badge.earned ? 'text-yellow-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${
                  badge.earned ? 'text-yellow-800' : 'text-gray-500'
                }`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${
                  badge.earned ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {badge.earned ? 'Earned' : 'Not earned'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Points</span>
            <span className="font-semibold text-gray-900">{profile.points}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Level</span>
            <span className="font-semibold text-gray-900">{profile.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Streak Days</span>
            <span className="font-semibold text-gray-900">{profile.streak_days}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Badges Earned</span>
            <span className="font-semibold text-gray-900">
              {badges.filter(b => b.earned).length}/{badges.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
