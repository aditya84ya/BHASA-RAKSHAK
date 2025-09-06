'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'

export default function DebugPage() {
  const { user, loading, signOut } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    const runTests = async () => {
      const supabase = createClient()
      
      // Test 1: Basic connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        setTestResults(prev => ({
          ...prev,
          databaseConnection: error ? `Error: ${error.message}` : 'Success'
        }))
      } catch (err: any) {
        setTestResults(prev => ({
          ...prev,
          databaseConnection: `Exception: ${err.message}`
        }))
      }

      // Test 2: Auth status
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        setTestResults(prev => ({
          ...prev,
          authStatus: error ? `Error: ${error.message}` : `User: ${user?.id || 'No user'}`
        }))
      } catch (err: any) {
        setTestResults(prev => ({
          ...prev,
          authStatus: `Exception: ${err.message}`
        }))
      }

      // Test 3: Environment variables
      setDebugInfo({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not set'
      })
    }

    runTests()
  }, [])

  const testSignUp = async () => {
    const supabase = createClient()
    const testEmail = `test-${Date.now()}@example.com`
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      })
      
      setTestResults(prev => ({
        ...prev,
        signUpTest: error ? `Error: ${error.message}` : `Success: ${data.user?.id}`
      }))
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        signUpTest: `Exception: ${err.message}`
      }))
    }
  }

  const testSignIn = async () => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      setTestResults(prev => ({
        ...prev,
        signInTest: error ? `Error: ${error.message}` : `Success: ${data.user?.id}`
      }))
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        signInTest: `Exception: ${err.message}`
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">🔧 BHASA-RAKSHAK Debug Center</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auth Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">🔐 Authentication Status</h2>
              <div className="space-y-2">
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? user.id : 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                {user && (
                  <button
                    onClick={signOut}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">🌍 Environment Variables</h2>
              <div className="space-y-2">
                <p><strong>Supabase URL:</strong> {debugInfo.supabaseUrl}</p>
                <p><strong>Supabase Key:</strong> {debugInfo.supabaseKey}</p>
                <p><strong>Site URL:</strong> {debugInfo.siteUrl}</p>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">🧪 Test Results</h2>
              <div className="space-y-2">
                <p><strong>Database:</strong> {testResults.databaseConnection || 'Not tested'}</p>
                <p><strong>Auth Status:</strong> {testResults.authStatus || 'Not tested'}</p>
                <p><strong>Sign Up:</strong> {testResults.signUpTest || 'Not tested'}</p>
                <p><strong>Sign In:</strong> {testResults.signInTest || 'Not tested'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">⚡ Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={testSignUp}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test Sign Up
                </button>
                <button
                  onClick={testSignIn}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Test Sign In
                </button>
                <a
                  href="/auth"
                  className="block w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
                >
                  Go to Auth Page
                </a>
              </div>
            </div>
          </div>

          {/* Console Logs */}
          <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📝 Console Logs</h3>
            <p className="text-sm">Check your browser's developer console for detailed logs.</p>
            <p className="text-sm mt-1">Press F12 → Console tab to see authentication logs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
