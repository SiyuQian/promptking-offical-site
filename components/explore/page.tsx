'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ExplorePromptGroup, ExplorePromptType, TypeCounts } from './types'
import { searchPrompts, filterByType, calculateTypeCounts, paginateItems } from './utils'
import { ExploreCard } from './card'
import { ExploreFilters } from './filters'

const PAGE_SIZE = 20

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

interface ExplorePageProps {
  initialData: ExplorePromptGroup[]
  initialTypeCounts: TypeCounts
}

export function ExplorePage({ initialData, initialTypeCounts }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ExplorePromptType | 'all'>('all')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [isSearching, setIsSearching] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Show searching indicator while debouncing
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery, debouncedSearchQuery])

  // Reset display count when filter or search changes
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [debouncedSearchQuery, activeFilter])

  // Filter and search
  const filteredItems = filterByType(
    searchPrompts(initialData, debouncedSearchQuery),
    activeFilter
  )

  const typeCounts = debouncedSearchQuery
    ? calculateTypeCounts(searchPrompts(initialData, debouncedSearchQuery))
    : initialTypeCounts

  const { items: displayedItems, hasMore } = paginateItems(filteredItems, 0, displayCount)

  // Load more
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => prev + PAGE_SIZE)
    }
  }, [hasMore])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Discover</span>
          </div>
          <h1 className="text-4xl font-bold text-navy mb-2">Explore</h1>
          <p className="text-gray-600">
            Curated skills, commands, and prompts from the community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ExploreFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            typeCounts={typeCounts}
            isSearching={isSearching}
          />
        </div>

        {/* Empty state */}
        {displayedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">No prompts found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Cards grid */}
        {displayedItems.length > 0 && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {displayedItems.map((item) => (
              <ExploreCard key={item.id} item={item} searchQuery={debouncedSearchQuery} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {displayedItems.length > 0 && (
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500 mb-4">
              Showing {displayedItems.length} of {filteredItems.length} resources
            </p>
            <div ref={sentinelRef} className="h-4" />
            {hasMore && (
              <button
                onClick={loadMore}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Load More
              </button>
            )}
            {!hasMore && displayedItems.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">You've reached the end</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
