'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function SimpleAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage(`Success! Check your email for verification. User ID: ${data.user?.id}`)
      }
    } catch (err: any) {
      setMessage(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage(`Success! Logged in as: ${data.user?.email}`)
        setUser(data.user)
      }
    } catch (err: any) {
      setMessage(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Successfully signed out!')
        setUser(null)
      }
    } catch (err: any) {
      setMessage(`Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        setMessage(`Error getting user: ${error.message}`)
      } else {
        setMessage(`Current user: ${user ? user.email : 'No user logged in'}`)
        setUser(user)
      }
    } catch (err: any) {
      setMessage(`Exception: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Simple Auth Test</h1>
          
          {message && (
            <div className={`p-3 rounded mb-4 ${
              message.includes('Error') || message.includes('Exception') 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {message}
            </div>
          )}

          {user && (
            <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">
              <p><strong>Logged in as:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          )}

          <div className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-3">
              <h2 className="text-lg font-semibold">Sign Up</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>

            <form onSubmit={handleSignIn} className="space-y-3">
              <h2 className="text-lg font-semibold">Sign In</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>

            <div className="flex space-x-2">
              <button
                onClick={checkUser}
                className="flex-1 bg-gray-600 text-white py-2 rounded"
              >
                Check User
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/auth" className="text-blue-600 hover:underline">
              Go to Main Auth Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
