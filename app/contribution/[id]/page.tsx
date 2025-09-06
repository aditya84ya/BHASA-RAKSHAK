'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContentPlayer } from '@/components/ContentPlayer'
import { TranscriptSection } from '@/components/TranscriptSection'
import { TranslationSection } from '@/components/TranslationSection'
import { CommentsSection } from '@/components/CommentsSection'
import { RelatedContent } from '@/components/RelatedContent'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Play, Heart, MessageCircle, Share, CheckCircle, Clock, Flag } from 'lucide-react'

type Contribution = Database['public']['Tables']['contributions']['Row']

export default function ContributionDetailPage() {
  const params = useParams()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchContribution()
      checkUserLike()
    }
  }, [params.id, checkUserLike])

  const fetchContribution = async () => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching contribution:', error)
    } else {
      setContribution(data)
    }
    setLoading(false)
  }

  const checkUserLike = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !params.id) return

    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('contribution_id', params.id)
      .eq('user_id', user.id)
      .single()

    setLiked(!!existingLike)
  }

  const handleLike = async () => {
    if (!contribution) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (liked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('contribution_id', contribution.id)
        .eq('user_id', user.id)

      if (!error) {
        setLiked(false)
        setContribution(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null)
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          contribution_id: contribution.id,
          user_id: user.id
        })

      if (!error) {
        setLiked(true)
        setContribution(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'flagged':
        return <Flag className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'flagged':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!contribution) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Contribution not found</h1>
                  <p className="text-gray-600">The contribution you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
              </div>
            )
          }
        

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Content Player */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <ContentPlayer contribution={contribution} />
            </div>

            {/* Content Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {contribution.title}
                  </h1>
                  {contribution.description && (
                    <p className="text-gray-600 text-lg">
                      {contribution.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contribution.verification_status)}`}>
                    {getStatusIcon(contribution.verification_status)}
                    <span className="ml-1 capitalize">{contribution.verification_status}</span>
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Dialect</h3>
                  <p className="text-gray-900">{contribution.dialect}</p>
                </div>
                {contribution.region && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Region</h3>
                    <p className="text-gray-900">{contribution.region}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Content Type</h3>
                  <p className="text-gray-900 capitalize">{contribution.content_type}</p>
                </div>
              </div>

              {/* Tags */}
              {contribution.tags && contribution.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contribution.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      liked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{contribution.likes_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{contribution.comments_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share className="w-5 h-5" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Contribute to verification
                </button>
              </div>
            </div>

            {/* Transcript and Translation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TranscriptSection contribution={contribution} />
              <TranslationSection contribution={contribution} />
            </div>

            {/* Comments */}
            <CommentsSection contributionId={contribution.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedContent dialect={contribution.dialect} currentId={contribution.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
