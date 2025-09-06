import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { FeaturesPreview } from '@/components/FeaturesPreview'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FeaturesPreview />
      <Testimonials />
      <Footer />
    </main>
  )
}
