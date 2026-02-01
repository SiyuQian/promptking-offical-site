import { ExplorePage } from '@/components/explore/page'
import { fetchExploreData } from '@/components/explore/utils'
import { calculateTypeCounts } from '@/components/explore/utils/search'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Explore Community Prompts | PromptKing',
  description: 'Discover curated skills, commands, and prompts shared by the community.',
}

export default async function ExploreRoute() {
  const response = await fetchExploreData()
  const typeCounts = response.typeCounts || calculateTypeCounts(response.data)

  return (
    <main className="min-h-screen">
      <Navigation />
      <ExplorePage initialData={response.data} initialTypeCounts={typeCounts} />
      <Footer />
    </main>
  )
}
