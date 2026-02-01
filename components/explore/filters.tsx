'use client'

import { ExplorePromptType, TypeCounts } from './types'

interface ExploreFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: ExplorePromptType | 'all'
  onFilterChange: (filter: ExplorePromptType | 'all') => void
  typeCounts: TypeCounts
  isSearching?: boolean
}

const filterOptions: { value: ExplorePromptType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'skill', label: 'Skills' },
  { value: 'command', label: 'Commands' },
  { value: 'prompt', label: 'Prompts' },
  { value: 'rule', label: 'Rules' },
]

export function ExploreFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  typeCounts,
  isSearching = false,
}: ExploreFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-2xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder="Search skills, commands, prompts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-gray-200 text-navy placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((option) => {
          const count = typeCounts[option.value]
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === option.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-navy hover:bg-gray-100'
              }`}
            >
              {option.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeFilter === option.value
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
