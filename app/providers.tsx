'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSupabaseError('Missing Supabase environment variables. Please check your .env.local file.')
      setLoading(false)
      return
    }

    const initializeAuth = async () => {
      try {
        const supabase = createClientComponentClient()

        // Get initial user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error getting user:', userError)
        }
        
        setUser(user)
        setLoading(false)

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id)
            setUser(session?.user ?? null)
            setLoading(false)
          }
        )

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Supabase initialization error:', error)
        setSupabaseError('Failed to initialize Supabase client.')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [supabaseUrl, supabaseAnonKey])

  const router = useRouter()
  
  const signOut = async () => {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClientComponentClient()
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600 mb-4">{supabaseError}</p>
          <div className="text-left bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Please check your .env.local file contains:</p>
            <code className="text-xs text-gray-600 block">
              NEXT_PUBLIC_SUPABASE_URL=https://zdtozitfyjtzudpkhjwx.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
            </code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthContext.Provider>
  )
}
