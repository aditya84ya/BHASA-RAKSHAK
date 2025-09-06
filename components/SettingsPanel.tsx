'use client'

import { useState } from 'react'
import { Save, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    enableContributions: true,
    enableLearning: true,
    enableGamification: true,
    enableComments: true,
    enableSocialLogin: true,
    enableEmailNotifications: true,
    enablePushNotifications: false,
    enableAnalytics: true,
    maxFileSize: 100, // MB
    maxContributionsPerDay: 10,
    autoApproveContributions: false,
    requireEmailVerification: true,
  })

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // In production, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Contributions</h4>
              <p className="text-sm text-gray-500">Allow users to upload dialect content</p>
            </div>
            <button
              onClick={() => toggleSetting('enableContributions')}
              className="text-2xl"
            >
              {settings.enableContributions ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Learning Features</h4>
              <p className="text-sm text-gray-500">Allow users to access learning modules</p>
            </div>
            <button
              onClick={() => toggleSetting('enableLearning')}
              className="text-2xl"
            >
              {settings.enableLearning ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Gamification</h4>
              <p className="text-sm text-gray-500">Points, badges, and leaderboards</p>
            </div>
            <button
              onClick={() => toggleSetting('enableGamification')}
              className="text-2xl"
            >
              {settings.enableGamification ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Comments</h4>
              <p className="text-sm text-gray-500">Allow users to comment on contributions</p>
            </div>
            <button
              onClick={() => toggleSetting('enableComments')}
              className="text-2xl"
            >
              {settings.enableComments ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Contributions per Day
            </label>
            <input
              type="number"
              value={settings.maxContributionsPerDay}
              onChange={(e) => updateSetting('maxContributionsPerDay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-approve Contributions</h4>
              <p className="text-sm text-gray-500">Automatically approve new contributions</p>
            </div>
            <button
              onClick={() => toggleSetting('autoApproveContributions')}
              className="text-2xl"
            >
              {settings.autoApproveContributions ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Authentication Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Social Login</h4>
              <p className="text-sm text-gray-500">Allow Google and GitHub login</p>
            </div>
            <button
              onClick={() => toggleSetting('enableSocialLogin')}
              className="text-2xl"
            >
              {settings.enableSocialLogin ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Require Email Verification</h4>
              <p className="text-sm text-gray-500">Users must verify their email address</p>
            </div>
            <button
              onClick={() => toggleSetting('requireEmailVerification')}
              className="text-2xl"
            >
              {settings.requireEmailVerification ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Send email notifications to users</p>
            </div>
            <button
              onClick={() => toggleSetting('enableEmailNotifications')}
              className="text-2xl"
            >
              {settings.enableEmailNotifications ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-500">Send push notifications to users</p>
            </div>
            <button
              onClick={() => toggleSetting('enablePushNotifications')}
              className="text-2xl"
            >
              {settings.enablePushNotifications ? (
                <ToggleRight className="text-primary-600" />
              ) : (
                <ToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}
