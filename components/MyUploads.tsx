'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Play, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

type Contribution = Database['public']['Tables']['contributions']['Row']

export function MyUploads() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const fetchContributions = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contributions:', error)
      } else {
        setContributions(data || [])
      }
      setLoading(false)
    }

    fetchContributions()
  }, [user, supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contribution?')) return

    const { error } = await supabase
      .from('contributions')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete contribution')
    } else {
      setContributions(prev => prev.filter(c => c.id !== id))
      toast.success('Contribution deleted successfully')
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Play className="w-5 h-5 text-blue-500" />
      case 'video':
        return <Play className="w-5 h-5 text-red-500" />
      case 'text':
        return <Edit className="w-5 h-5 text-green-500" />
      case 'image':
        return <Eye className="w-5 h-5 text-purple-500" />
      default:
        return <Edit className="w-5 h-5 text-gray-500" />
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
      case 'rejected':
        return 'bg-gray-100 text-gray-800'
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
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Uploads</h2>

      {contributions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
          <p className="text-gray-500">Start contributing by uploading your first dialect content!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Content</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dialect</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Upload Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contribution) => (
                <tr key={contribution.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getContentIcon(contribution.content_type)}
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 truncate max-w-xs">
                          {contribution.title}
                        </p>
                        {contribution.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {contribution.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="capitalize text-gray-700">
                      {contribution.content_type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-700">{contribution.dialect}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.verification_status)}`}>
                      {contribution.verification_status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {new Date(contribution.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(contribution.file_url, '_blank')}
                        className="text-primary-600 hover:text-primary-700 p-1"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contribution.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
