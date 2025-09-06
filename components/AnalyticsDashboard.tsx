'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type Analytics = Database['public']['Tables']['analytics']['Row']

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    // Mock data for demonstration - in production, this would fetch real analytics
    const mockData = {
      activeUsers: [
        { day: 'Mon', users: 120 },
        { day: 'Tue', users: 150 },
        { day: 'Wed', users: 180 },
        { day: 'Thu', users: 200 },
        { day: 'Fri', users: 220 },
        { day: 'Sat', users: 190 },
        { day: 'Sun', users: 160 },
      ],
      contributionsByDialect: [
        { name: 'Spanish (Mexico)', value: 45, color: '#3b82f6' },
        { name: 'Spanish (Spain)', value: 30, color: '#10b981' },
        { name: 'French (Canada)', value: 15, color: '#f59e0b' },
        { name: 'Portuguese (Brazil)', value: 10, color: '#ef4444' },
      ],
      leaderboard: [
        { name: 'User1', points: 1840 },
        { name: 'User2', points: 1650 },
        { name: 'User3', points: 1420 },
        { name: 'User4', points: 1280 },
        { name: 'User5', points: 1150 },
      ]
    }
    
    setAnalytics(mockData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">U</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Active Users</p>
                <p className="text-2xl font-bold text-blue-900">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">C</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Contributions</p>
                <p className="text-2xl font-bold text-green-900">5,678</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold">D</span>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Dialects</p>
                <p className="text-2xl font-bold text-purple-900">42</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">V</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Verified</p>
                <p className="text-2xl font-bold text-yellow-900">3,456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users (Daily)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.activeUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Contributions by Dialect */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contributions per Dialect</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.contributionsByDialect}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.contributionsByDialect.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.contributionsByDialect.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {analytics.leaderboard.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <span className="font-bold text-gray-900">{user.points} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
