import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import TrustedBy from "@/components/TrustedBy"
import ServicesSection from "@/components/ServicesSection"
import PortfolioSection from "@/components/PortfolioSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ConsultationBooking from "@/components/ConsultationBooking"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TrustedBy />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ConsultationBooking />
      <Footer />
    </main>
  )
}
