"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function HeroSection() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [textColor, setTextColor] = useState<string>('#1e3a8a')

  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        // First try to get the active banner
        const { data, error } = await supabase
          .from('hero_banners')
          .select('image_url, text_color')
          .eq('is_active', true)
          .maybeSingle()
        
        if (error) {
          console.error('Error fetching active banner:', error)
        }

        if (data && data.image_url) {
          setBannerUrl(data.image_url)
          if (data.text_color) setTextColor(data.text_color)
        } else {
          // Fallback: If no active banner, get the most recent one
          const { data: recentData } = await supabase
            .from('hero_banners')
            .select('image_url, text_color')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          
          if (recentData && recentData.image_url) {
            setBannerUrl(recentData.image_url)
            if (recentData.text_color) setTextColor(recentData.text_color)
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero banner:', err)
      }
    }
    
    fetchActiveBanner()
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-white">
      {/* Dynamic Background Image Layer - Optimized with next/image */}
      {bannerUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700">
          <Image 
            src={bannerUrl}
            alt="Hero Banner"
            fill
            priority
            className="object-cover object-center"
            quality={85}
            unoptimized
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center z-20 py-8 sm:py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl tracking-wide font-medium drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif", color: textColor }}
          >
            <span className="block mb-1">Stop Losing Customers Online. </span>
            <span className="block" style={{ color: 'var(--color-primary, #ec4899)' }}>Start Growing Digitally!</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-sm sm:text-base sm:max-w-2xl mx-auto md:text-lg font-medium drop-shadow-md"
            style={{ fontFamily: "'Tektur', sans-serif", color: textColor }}
          >
            Websites, marketing, automation, and analytics — everything you need to scale online. Join the companies that trust us for growth.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 sm:max-w-lg mx-auto flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#contact" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200">
              Book Free Consultation
            </Link>
            <Link href="#portfolio" className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-base font-medium rounded-full text-foreground bg-white/80 hover:bg-white backdrop-blur transition-colors shadow-sm">
              View Our Work <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Optimized Abstract Background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-20 transform-gpu blur-2xl pointer-events-none" aria-hidden="true">
        <div className="aspect-[1155/678] w-[50rem] bg-gradient-to-tr from-[#2563EB] to-[#93C5FD] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </section>
  )
}
