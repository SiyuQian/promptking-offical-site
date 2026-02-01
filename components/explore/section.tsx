import Link from 'next/link'
import { ExplorePromptGroup } from './types'
import { ExploreCard } from './card'

interface ExploreSectionProps {
  items: ExplorePromptGroup[]
}

export function ExploreSection({ items }: ExploreSectionProps) {
  // Take top 12 items by stars
  const topItems = items.slice(0, 12)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Community</span>
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy mb-4 text-balance">
            Explore Community
            <br />
            <span className="text-blue-600">Prompts</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover curated skills, commands, and prompts shared by the community.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-12">
          {topItems.map((item) => (
            <ExploreCard key={item.id} item={item} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Prompts
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
