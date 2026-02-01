import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import Features from '@/components/features'
import { ExploreSection } from '@/components/explore/section'
import { fetchExploreData } from '@/components/explore/utils'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default async function Home() {
  const response = await fetchExploreData()

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <ExploreSection items={response.data} />
      <CTASection />
      <Footer />
    </main>
  )
}
