import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import Features from '@/components/features'
import { ExploreSection } from '@/components/explore/section'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <ExploreSection />
      <CTASection />
      <Footer />
    </main>
  )
}
