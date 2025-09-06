'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { CheckCircle, Flag, Trash2, Eye, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

type Contribution = Database['public']['Tables']['contributions']['Row']

export function ContentModeration() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchContributions()
  }, [])

  const fetchContributions = async () => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .in('verification_status', ['pending', 'flagged'])
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contributions:', error)
    } else {
      setContributions(data || [])
    }
    setLoading(false)
  }

  const handleModerate = async (contributionId: string, action: 'approve' | 'flag' | 'delete') => {
    setActionLoading(contributionId)
    try {
      let updateData: any = {}
      
      switch (action) {
        case 'approve':
          updateData = { verification_status: 'verified' }
          break
        case 'flag':
          updateData = { verification_status: 'flagged' }
          break
        case 'delete':
          updateData = { verification_status: 'rejected' }
          break
      }

      const { error } = await supabase
        .from('contributions')
        .update(updateData)
        .eq('id', contributionId)

      if (error) {
        throw error
      }

      setContributions(prev => prev.filter(c => c.id !== contributionId))
      toast.success(`Content ${action}d successfully!`)
    } catch (error) {
      console.error(`Error ${action}ing content:`, error)
      toast.error(`Failed to ${action} content`)
    } finally {
      setActionLoading(null)
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Moderation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {contributions.filter(c => c.verification_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Flag className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-800">Flagged Content</p>
                <p className="text-2xl font-bold text-red-900">
                  {contributions.filter(c => c.verification_status === 'flagged').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Total Reviewed</p>
                <p className="text-2xl font-bold text-green-900">
                  {contributions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Awaiting Review</h3>
        
        {contributions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-500">No content is currently awaiting moderation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => (
              <div key={contribution.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {contribution.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.verification_status)}`}>
                        {getStatusIcon(contribution.verification_status)}
                        <span className="ml-1 capitalize">{contribution.verification_status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {contribution.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Type: {contribution.content_type}</span>
                      <span>Dialect: {contribution.dialect}</span>
                      <span>Uploaded: {new Date(contribution.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open(contribution.file_url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Content"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleModerate(contribution.id, 'approve')}
                      disabled={actionLoading === contribution.id}
                      className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleModerate(contribution.id, 'flag')}
                      disabled={actionLoading === contribution.id}
                      className="p-2 text-yellow-600 hover:text-yellow-700 disabled:opacity-50 transition-colors"
                      title="Flag"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleModerate(contribution.id, 'delete')}
                      disabled={actionLoading === contribution.id}
                      className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
