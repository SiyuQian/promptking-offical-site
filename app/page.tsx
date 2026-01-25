import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import Features from '@/components/features'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </main>
  )
}
