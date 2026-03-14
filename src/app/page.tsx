import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import TrustedBy from "@/components/TrustedBy"
import ServicesSection from "@/components/ServicesSection"
import PortfolioSection from "@/components/PortfolioSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ConsultationBooking from "@/components/ConsultationBooking"
import Footer from "@/components/Footer"

// Cache the page for 60 seconds (ISR)
export const revalidate = 60

export default async function Home() {
  // Fetch all data in parallel on the server
  const [heroRes, portfolioRes, testimonialsRes] = await Promise.all([
    supabase.from('hero_banners').select('image_url, text_color').eq('is_active', true).single(),
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(6)
  ])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection initialData={heroRes.data} />
      <AboutSection />
      <TrustedBy />
      <ServicesSection />
      <PortfolioSection initialProjects={portfolioRes.data || []} />
      <TestimonialsSection initialTestimonials={testimonialsRes.data || []} />
      <ConsultationBooking />
      <Footer />
    </main>
  )
}
