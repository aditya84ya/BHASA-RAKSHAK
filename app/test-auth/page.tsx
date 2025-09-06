'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function TestAuth() {
  const [status, setStatus] = useState('Testing...')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        
        // Test basic connection
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          setError(`Auth error: ${userError.message}`)
        } else {
          setUser(user)
          setStatus('Connected successfully!')
        }
      } catch (err: any) {
        setError(`Connection error: ${err.message}`)
        setStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  const testSignUp = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      setError(`Sign up error: ${error.message}`)
    } else {
      setStatus('Sign up successful! Check your email.')
    }
  }

  const testSignIn = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      setError(`Sign in error: ${error.message}`)
    } else {
      setStatus('Sign in successful!')
      setUser(data.user)
    }
  }

  const testSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setError(`Sign out error: ${error.message}`)
    } else {
      setStatus('Signed out successfully!')
      setUser(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Supabase Auth Test</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Status:</h2>
              <p className={`p-3 rounded ${status.includes('success') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {status}
              </p>
            </div>

            {error && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Error:</h2>
                <p className="p-3 bg-red-100 text-red-800 rounded">
                  {error}
                </p>
              </div>
            )}

            {user && (
              <div>
                <h2 className="text-lg font-semibold mb-2">User:</h2>
                <pre className="p-3 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={testSignUp}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Sign Up
              </button>
              <button
                onClick={testSignIn}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Sign In
              </button>
              <button
                onClick={testSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Test Sign Out
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </p>
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
