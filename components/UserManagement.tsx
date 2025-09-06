'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Search, Filter, CheckCircle, XCircle, Ban, UserCheck, UserX } from 'lucide-react'
import toast from 'react-hot-toast'

type Profile = Database['public']['Tables']['profiles']['Row']

export function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', userId)

      if (error) {
        throw error
      }

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ))
      toast.success('User role updated successfully!')
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return

    setActionLoading(userId)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'banned' as any })
        .eq('id', userId)

      if (error) {
        throw error
      }

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: 'banned' as any } : user
      ))
      toast.success('User banned successfully!')
    } catch (error) {
      console.error('Error banning user:', error)
      toast.error('Failed to ban user')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'linguist':
        return 'bg-purple-100 text-purple-800'
      case 'researcher':
        return 'bg-blue-100 text-blue-800'
      case 'contributor':
        return 'bg-green-100 text-green-800'
      case 'learner':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
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
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="linguist">Linguist</option>
            <option value="researcher">Researcher</option>
            <option value="contributor">Contributor</option>
            <option value="learner">Learner</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Points</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-600 font-semibold">
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.username || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.full_name || 'No name provided'}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{user.points}</span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className="text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {user.role !== 'admin' && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={actionLoading === user.id}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="learner">Learner</option>
                            <option value="contributor">Contributor</option>
                            <option value="linguist">Linguist</option>
                            <option value="researcher">Researcher</option>
                          </select>
                          
                          <button
                            onClick={() => handleBanUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}
