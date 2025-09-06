'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { User, Mail, MapPin, Globe, Save, Upload, LogOut, Shield, Trophy, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ProfileSettings() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const supabase = createClient()

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    region: '',
    dialects: [] as string[],
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
      setFormData({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        region: data.region || '',
        dialects: data.dialects || [],
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setProfile(prev => prev ? { ...prev, ...formData } : null)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDialectAdd = (dialect: string) => {
    if (dialect.trim() && !formData.dialects.includes(dialect.trim())) {
      setFormData(prev => ({
        ...prev,
        dialects: [...prev.dialects, dialect.trim()]
      }))
    }
  }

  const handleDialectRemove = (dialect: string) => {
    setFormData(prev => ({
      ...prev,
      dialects: prev.dialects.filter(d => d !== dialect)
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username || 'User'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {profile.username || 'Anonymous'}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your region"
                    />
                  </div>

                  {/* Dialects */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dialects
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.dialects.map((dialect, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {dialect}
                          <button
                            onClick={() => handleDialectRemove(dialect)}
                            className="ml-2 text-primary-500 hover:text-primary-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a dialect"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleDialectAdd(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleDialectAdd(input.value)
                          input.value = ''
                        }}
                        className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-primary-50 rounded-lg">
                    <Trophy className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Points</h4>
                    <p className="text-3xl font-bold text-primary-600">{profile.points}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Star className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Level</h4>
                    <p className="text-3xl font-bold text-green-600">{profile.level}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Streak</h4>
                    <p className="text-3xl font-bold text-yellow-600">{profile.streak_days} days</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Badges</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile.badges.map((badge, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-6 h-6 text-yellow-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{badge}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Public Profile</h4>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Contributions</h4>
                      <p className="text-sm text-gray-500">Display your contributions on your profile</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive email updates about your contributions</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
