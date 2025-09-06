'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/AuthForm'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Tabs */}
            <div className="flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-center font-semibold rounded-lg transition-colors ${
                  isLogin
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-center font-semibold rounded-lg transition-colors ${
                  !isLogin
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Signup
              </button>
            </div>

            <AuthForm isLogin={isLogin} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
