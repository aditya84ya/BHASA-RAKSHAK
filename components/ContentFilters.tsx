'use client'

import { Filter, SortAsc } from 'lucide-react'

interface ContentFiltersProps {
  filters: {
    search: string
    contentType: string
    verificationStatus: string
    dialect: string
    region: string
  }
  onFiltersChange: (filters: any) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export function ContentFilters({ filters, onFiltersChange, sortBy, onSortChange }: ContentFiltersProps) {
  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'audio', label: 'Audio' },
    { value: 'video', label: 'Video' },
    { value: 'text', label: 'Text' },
    { value: 'image', label: 'Images' },
  ]

  const verificationStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'unverified', label: 'Unverified' },
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'verified', label: 'Verified Only' },
  ]

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Content Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content Type
        </label>
        <div className="flex space-x-2">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onFiltersChange({ ...filters, contentType: type.value })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.contentType === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Status Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Verification Status
        </label>
        <div className="flex space-x-2">
          {verificationStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onFiltersChange({ ...filters, verificationStatus: status.value })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.verificationStatus === status.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dialect Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dialect
        </label>
        <input
          type="text"
          value={filters.dialect}
          onChange={(e) => onFiltersChange({ ...filters, dialect: e.target.value })}
          placeholder="Enter dialect"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
