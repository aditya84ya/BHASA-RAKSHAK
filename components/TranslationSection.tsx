'use client'

import { Database } from '@/lib/supabase'
import { useState } from 'react'
import { Edit, Save, X } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

type Contribution = Database['public']['Tables']['contributions']['Row']

interface TranslationSectionProps {
  contribution: Contribution
}

export function TranslationSection({ contribution }: TranslationSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [translation, setTranslation] = useState(contribution.translation || '')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const isExpert = user?.user_metadata?.role === 'linguist' || user?.user_metadata?.role === 'admin'

  const handleSave = async () => {
    if (!isExpert) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('contributions')
        .update({ translation })
        .eq('id', contribution.id)

      if (error) {
        throw error
      }

      toast.success('Translation updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating translation:', error)
      toast.error('Failed to update translation')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTranslation(contribution.translation || '')
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Translation</h2>
        {isExpert && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isEditing ? 'Cancel' : 'Edit'}
            </span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Enter translation..."
          />
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {translation ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {translation}
            </p>
          ) : (
            <p className="text-gray-500 italic">
              No translation available. {isExpert ? 'Click Edit to add one.' : 'Check back later for translation.'}
            </p>
          )}
        </div>
      )}

      {isExpert && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Expert User:</strong> You can edit this translation to improve accuracy and add cultural context.
          </p>
        </div>
      )}
    </div>
  )
}
