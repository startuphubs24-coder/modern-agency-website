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
      const { data } = await supabase
        .from('hero_banners')
        .select('image_url, text_color')
        .eq('is_active', true)
        .single()
      
      if (data && data.image_url) {
        setBannerUrl(data.image_url)
        if (data.text_color) setTextColor(data.text_color)
      }
    }
    
    fetchActiveBanner()
  }, [])

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Optimized Background Image Layer */}
      {bannerUrl && (
        <div className="absolute inset-0 z-0 transition-opacity duration-700">
          <Image 
            src={bannerUrl} 
            alt="Hero Background" 
            fill
            priority
            quality={90}
            className="object-cover object-center"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center z-20 py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl tracking-wide font-medium drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif", color: textColor }}
          >
            <span className="block">We Help Businesses </span>
            <span className="block" style={{ color: 'var(--color-primary, #ec4899)' }}>Grow Digitally</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg sm:max-w-2xl mx-auto md:text-xl font-medium drop-shadow-md"
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
      
      {/* Abstract Background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-30 transform-gpu blur-3xl" aria-hidden="true">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#2563EB] to-[#93C5FD] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </section>
  )
}
