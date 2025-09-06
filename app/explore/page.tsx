'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchBar } from '@/components/SearchBar'
import { ContentFilters } from '@/components/ContentFilters'
import { ContentGrid } from '@/components/ContentGrid'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Link from 'next/link'
import { Lock, ArrowRight } from 'lucide-react'

type Contribution = Database['public']['Tables']['contributions']['Row']

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    contentType: 'all',
    verificationStatus: 'all',
    dialect: '',
    region: ''
  })
  const [sortBy, setSortBy] = useState('recent')
  const itemsPerPage = 12

  const supabase = createClient()

  const fetchContributions = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('contributions')
      .select('*', { count: 'exact' })
      .eq('privacy_setting', 'public')

    // Apply filters
    if (filters.contentType !== 'all') {
      query = query.eq('content_type', filters.contentType)
    }

    if (filters.verificationStatus !== 'all') {
      query = query.eq('verification_status', filters.verificationStatus)
    }

    if (filters.dialect) {
      query = query.ilike('dialect', `%${filters.dialect}%`)
    }

    if (filters.region) {
      query = query.ilike('region', `%${filters.region}%`)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.order('likes_count', { ascending: false })
        break
      case 'verified':
        query = query.eq('verification_status', 'verified').order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching contributions:', error)
    } else {
      setContributions(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [filters, sortBy, currentPage, supabase])

  useEffect(() => {
    fetchContributions()
  }, [fetchContributions])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Login Required Message */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Login Required to Explore
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our community to access the full linguistic archive and contribute to preserving dialects worldwide.
              </p>
            </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Login / Sign Up</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Preview of Verified Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Preview of Verified Content
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Here's a glimpse of what you'll discover after logging in:
            </p>

            {/* Show some verified content preview */}
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contributions.slice(0, 6).map((contribution) => (
                  <div key={contribution.id} className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Verified</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {contribution.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {contribution.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{contribution.dialect}</span>
                      <span>{contribution.content_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Linguistic Contributions
          </h1>
          <p className="text-xl text-gray-600">
            Discover and learn from dialect recordings, stories, and linguistic content from around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters(prev => ({ ...prev, search }))}
          />
          
          <ContentFilters
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <ContentGrid contributions={contributions} />

            {/* Pagination */}
            {totalCount > itemsPerPage && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = Math.ceil(totalCount / itemsPerPage)
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {contributions.length} of {totalCount} contributions
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
