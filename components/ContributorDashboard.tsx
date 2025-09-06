'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { UploadSection } from '@/components/UploadSection'
import { MyUploads } from '@/components/MyUploads'
import { ProgressTracker } from '@/components/ProgressTracker'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ContributorDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
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
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.username || 'Contributor'}!
              </h1>
              <p className="text-gray-600">
                Continue preserving your dialect and contributing to our community.
              </p>
            </div>

            <UploadSection />
            <MyUploads />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProgressTracker profile={profile} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
