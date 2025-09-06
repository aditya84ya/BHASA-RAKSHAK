'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Play, Clock } from 'lucide-react'
import Link from 'next/link'

type Contribution = Database['public']['Tables']['contributions']['Row']

interface RelatedContentProps {
  dialect: string
  currentId: string
}

export function RelatedContent({ dialect, currentId }: RelatedContentProps) {
  const [relatedContributions, setRelatedContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRelatedContent()
  }, [dialect, currentId])

  const fetchRelatedContent = async () => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('dialect', dialect)
      .neq('id', currentId)
      .eq('privacy_setting', 'public')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) {
      console.error('Error fetching related content:', error)
    } else {
      setRelatedContributions(data || [])
    }
    setLoading(false)
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Play className="w-4 h-4 text-blue-500" />
      case 'video':
        return <Play className="w-4 h-4 text-red-500" />
      case 'text':
        return <Play className="w-4 h-4 text-green-500" />
      case 'image':
        return <Play className="w-4 h-4 text-purple-500" />
      default:
        return <Play className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Related Content</h2>

      {relatedContributions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No related content found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {relatedContributions.map((contribution) => (
            <Link
              key={contribution.id}
              href={`/contribution/${contribution.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                {/* Content Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getContentIcon(contribution.content_type)}
                  </div>
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {contribution.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="capitalize">{contribution.content_type}</span>
                    {contribution.duration && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(contribution.duration)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex-shrink-0">
                  <button className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View All Link */}
      {relatedContributions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href={`/explore?dialect=${encodeURIComponent(dialect)}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all {dialect} content →
          </Link>
        </div>
      )}
    </div>
  )
}
