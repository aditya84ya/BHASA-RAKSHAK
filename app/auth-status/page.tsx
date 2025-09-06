'use client'

import { useAuth } from '@/app/providers'
import { useEffect, useState } from 'react'

export default function AuthStatusPage() {
  const { user, loading, signOut } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Check environment variables
    setDebugInfo({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">🔍 Authentication Status Debug</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auth State */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">🔐 Authentication State</h2>
              <div className="space-y-2">
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}</p>
                {user && (
                  <>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                    <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Environment */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">🌍 Environment</h2>
              <div className="space-y-2">
                <p><strong>Supabase URL:</strong> {debugInfo.supabaseUrl}</p>
                <p><strong>Supabase Key:</strong> {debugInfo.supabaseKey}</p>
                <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">⚡ Actions</h2>
              <div className="space-y-2">
                <a
                  href="/auth"
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                >
                  Go to Auth Page
                </a>
                <a
                  href="/simple-auth"
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                >
                  Simple Auth Test
                </a>
                {user && (
                  <button
                    onClick={signOut}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>

            {/* Raw Data */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">📊 Raw User Data</h2>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📝 Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>If you see "Not Logged In", try going to the <a href="/auth" className="text-blue-600 underline">Auth Page</a> to sign up or sign in</li>
              <li>If you see "Loading: Yes" for a long time, there might be an issue with the Supabase connection</li>
              <li>Check the browser console (F12) for any error messages</li>
              <li>Make sure your .env.local file has the correct Supabase credentials</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
