 'use client'

import { useState, useEffect } from 'react'
import { Database } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-client'
import { Play, FileText, Image, Eye, Heart, MessageCircle, Share, CheckCircle, Clock, Flag } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Contribution = Database['public']['Tables']['contributions']['Row']

interface ContentGridProps {
  contributions: Contribution[]
}

export function ContentGrid({ contributions }: ContentGridProps) {
  const [likedContributions, setLikedContributions] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    checkUserLikes()
  }, [contributions])

  const checkUserLikes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const contributionIds = contributions.map(c => c.id)
    const { data: likes } = await supabase
      .from('likes')
      .select('contribution_id')
      .eq('user_id', user.id)
      .in('contribution_id', contributionIds)

    const likedSet = new Set(likes?.map(like => like.contribution_id) || [])
    setLikedContributions(likedSet)
  }

  const handleLike = async (contributionId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please sign in to like contributions')
      return
    }

    const isLiked = likedContributions.has(contributionId)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('contribution_id', contributionId)
          .eq('user_id', user.id)

        if (!error) {
          setLikedContributions(prev => {
            const newSet = new Set(prev)
            newSet.delete(contributionId)
            return newSet
          })
          // Update the contribution's likes_count locally
          const contribution = contributions.find(c => c.id === contributionId)
          if (contribution) {
            contribution.likes_count = Math.max(0, contribution.likes_count - 1)
          }
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            contribution_id: contributionId,
            user_id: user.id
          })

        if (!error) {
          setLikedContributions(prev => new Set(prev).add(contributionId))
          // Update the contribution's likes_count locally
          const contribution = contributions.find(c => c.id === contributionId)
          if (contribution) {
            contribution.likes_count += 1
          }
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like')
    }
  }

  const handleShare = async (contribution: Contribution) => {
    const url = `${window.location.origin}/contribution/${contribution.id}`
    const shareData = {
      title: contribution.title,
      text: `Check out this ${contribution.dialect} contribution: ${contribution.title}`,
      url: url
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } catch (error) {
        // User cancelled share or error occurred
        fallbackShare(url, contribution.title)
      }
    } else {
      fallbackShare(url, contribution.title)
    }
  }

  const fallbackShare = (url: string, title: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Link copied to clipboard!')
    })
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Play className="w-6 h-6 text-blue-500" />
      case 'video':
        return <Play className="w-6 h-6 text-red-500" />
      case 'text':
        return <FileText className="w-6 h-6 text-green-500" />
      case 'image':
        return <Image className="w-6 h-6 text-purple-500" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'flagged':
        return <Flag className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
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

  if (contributions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions found</h3>
        <p className="text-gray-500">Try adjusting your search filters or check back later for new content.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contributions.map((contribution) => (
        <div
          key={contribution.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Content Preview */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            {contribution.file_url ? (
              <div className="relative w-full h-full group">
                {contribution.content_type === 'image' ? (
                  <img
                    src={contribution.file_url}
                    alt={contribution.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    {getContentIcon(contribution.content_type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100">
                    <Play className="w-6 h-6 text-primary-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">
                {getContentIcon(contribution.content_type)}
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.verification_status)}`}>
                {getStatusIcon(contribution.verification_status)}
                <span className="ml-1 capitalize">{contribution.verification_status}</span>
              </span>
            </div>
          </div>

          {/* Content Info */}
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {contribution.title}
              </h3>
              {contribution.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {contribution.description}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{contribution.dialect}</span>
                {contribution.region && (
                  <span>{contribution.region}</span>
                )}
              </div>
              <span>
                {new Date(contribution.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Tags */}
            {contribution.tags && contribution.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {contribution.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {contribution.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{contribution.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-500">
              <button
                onClick={() => handleLike(contribution.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  likedContributions.has(contribution.id)
                    ? 'text-red-500'
                    : 'hover:text-red-500'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{contribution.likes_count}</span>
              </button>
              <button
                onClick={() => window.location.href = `/contribution/${contribution.id}#comments`}
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{contribution.comments_count}</span>
              </button>
              <button
                onClick={() => window.location.href = `/contribution/${contribution.id}`}
                className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">{contribution.views_count}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShare(contribution)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Share className="w-4 h-4" />
              </button>
              <Link
                href={`/contribution/${contribution.id}`}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                View
              </Link>
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
