"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react'
import { Project } from '@/lib/types'

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(6)
      if (data) setProjects(data)
    }
    fetchProjects()
  }, [])

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section id="portfolio" className="pt-28 pb-20 md:pt-40 md:pb-24 overflow-hidden relative bg-white">
      {/* Scroll Animated Layered Curved Shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[80px] md:h-[150px]"
        >
          {/* Background subtle curve */}
          <motion.path 
            initial={{ d: "M0,0 L1200,0 L1200,0 C800,0 400,0 0,0 Z" }}
            whileInView={{ d: "M0,0 L1200,0 L1200,60 C800,160 400,-10 0,60 Z" }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.6, ease: "backOut", delay: 0.1 }}
            fill="rgba(255, 255, 255, 0.4)"
          />
          {/* Main front morphing curve */}
          <motion.path 
            initial={{ d: "M0,0 L1200,0 L1200,0 C800,0 400,0 0,0 Z" }}
            whileInView={{ d: "M0,0 L1200,0 L1200,40 C800,120 400,0 0,40 Z" }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.2, ease: "backOut" }}
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Soft pastel gradient background base */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-100/80 via-pink-100/80 to-orange-100/80 pointer-events-none" />
      
      {/* Ambient glowing abstract colors */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-purple-300/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-300/40 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-orange-300/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Portfolio</h2>
          <p 
            className="mt-2 text-4xl sm:text-5xl font-medium tracking-wide text-blue-900 drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            Our Work That Drives Growth
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="relative h-[650px] w-full flex items-center justify-center">
            
            {/* Controls */}
            {projects.length > 1 && (
              <div className="absolute top-1/2 -mt-6 w-full flex justify-between px-4 sm:px-12 z-50 pointer-events-none">
                <button 
                  onClick={prevProject} 
                  className="w-14 h-14 bg-white/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:text-primary transition-all pointer-events-auto border border-gray-100 transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextProject} 
                  className="w-14 h-14 bg-white/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:text-primary transition-all pointer-events-auto border border-gray-100 transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => {
                
                // Calculate position relative to current index
                let offset = index - currentIndex
                if (offset < 0) offset += projects.length

                // Center card
                const isCenter = offset === 0
                // Background cards (fan deck effect)
                const isRight = offset === 1 || offset === projects.length - 1
                const isFar = !isCenter && !isRight

                if (isFar && projects.length > 3) return null // Hide far cards if there are many

                // Setup the animation styles
                const zIndex = isCenter ? 40 : 10 - offset
                const rotate = isCenter ? 0 : offset === 1 ? 6 : -6
                const scale = isCenter ? 1 : 0.9
                const x = isCenter ? 0 : offset === 1 ? 120 : -120
                const y = isCenter ? 0 : 40
                const opacity = isCenter ? 1 : 0.6

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{
                      zIndex,
                      rotate,
                      scale,
                      x,
                      y,
                      opacity
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      mass: 0.8
                    }}
                    className={`absolute w-full max-w-[420px] sm:max-w-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden ${isCenter ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (!isCenter) {
                         if (offset === 1) nextProject()
                         else prevProject()
                      }
                    }}
                  >
                    
                    {/* Image Area - Instagram style */}
                    <div className="relative aspect-[4/4] sm:aspect-[4/3] w-full bg-gray-100 overflow-hidden group">
                      {project.image_url ? (
                        <Image 
                          src={project.image_url} 
                          alt={project.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, 480px"
                          className={`object-cover transition-transform duration-700 ${isCenter ? 'group-hover:scale-105' : ''}`}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">No Image</div>
                      )}
                      
                      {/* Industry Badge */}
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm tracking-wide uppercase z-10">
                        {project.industry}
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{project.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>
                      
                      <a 
                        href={project.project_url || "#"} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center bg-gray-50 hover:bg-primary hover:text-white px-6 py-4 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 transition-colors duration-300 group shadow-sm hover:shadow-md"
                      >
                        View Full Project
                        <ExternalLink className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
            Projects will dynamically appear here when added from the Admin Panel.
          </div>
        )}
      </div>
    </section>
  )
}
