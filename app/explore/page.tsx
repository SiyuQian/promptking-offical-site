import { ExplorePage } from '@/components/explore/page'
import { calculateTypeCounts } from '@/components/explore/utils/search'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { ExploreApiResponse } from '@/components/explore/types'

export const metadata = {
  title: 'Explore Community Prompts | PromptKing',
  description: 'Discover curated skills, commands, and prompts shared by the community.',
}

export async function fetchExploreData(): Promise<ExploreApiResponse | undefined> {
  try {
    const res = await fetch(`${process.env.API_URL}?limit=500&include_counts=true&group_by_name=true`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      console.warn(`API returned ${res.status}, using fallback data`);
    }

    return res.json()
  } catch (error) {
    console.warn('Failed to fetch explore data, using fallback:', error)
  }
}

export default async function ExploreRoute() {
  const response = await fetchExploreData()
  const typeCounts = response?.typeCounts || calculateTypeCounts(response?.data || [])

  return (
    <main className="min-h-screen">
      <Navigation />
      <ExplorePage initialData={response?.data || []} initialTypeCounts={typeCounts} />
      <Footer />
    </main>
  )
}
