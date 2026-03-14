"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, Smartphone, Cloud, Bot, ShoppingCart, Users, 
  Search, Target, TrendingUp, Briefcase, Mail, 
  PenTool, Image as ImageIcon, Camera, Video, LayoutTemplate,
  X, MonitorPlay, Megaphone, Palette
} from 'lucide-react'

const serviceCategories = [
  {
    title: 'Technology Development',
    description: 'Robust, scalable, and modern tech solutions to power your business.',
    mainIcon: MonitorPlay,
    services: [
      { title: 'Website/Web App Development', description: 'High-converting, lightning-fast modern websites and web applications.', icon: Code },
      { title: 'App Development', description: 'Intuitive native and cross-platform mobile experiences.', icon: Smartphone },
      { title: 'SaaS Development', description: 'Scalable cloud software solutions to power your subscription business.', icon: Cloud },
      { title: 'AI Integration', description: 'Streamline operations with intelligent AI models and automation.', icon: Bot },
      { title: 'E-commerce Development', description: 'Robust online storefronts optimized for maximum sales.', icon: ShoppingCart },
      { title: 'CRM Development', description: 'Custom relationship management systems tailored to your workflow.', icon: Users },
    ]
  },
  {
    title: 'Digital Marketing',
    description: 'Data-driven marketing campaigns that generate high-quality leads and drive growth.',
    mainIcon: Megaphone,
    services: [
      { title: 'SEO', description: 'Rank higher on Google and dominate your niche organically.', icon: Search },
      { title: 'Google Ads', description: 'Highly targeted search and display campaigns with maximized ROI.', icon: Target },
      { title: 'Meta/Facebook Ads', description: 'Scroll-stopping creative advertising to find your exact audience.', icon: TrendingUp },
      { title: 'LinkedIn Ads', description: 'B2B lead generation targeting key decision-makers and professionals.', icon: Briefcase },
      { title: 'Email Marketing', description: 'Automated nurture sequences and engaging campaigns that convert.', icon: Mail },
    ]
  },
  {
    title: 'Creative Studio',
    description: 'Stunning visual assets that build trust and elevate your brand identity.',
    mainIcon: Palette,
    services: [
      { title: 'Brand Logo', description: 'Memorable and modern visual identities that set you apart.', icon: PenTool },
      { title: 'Poster & Banner', description: 'Eye-catching graphic design for digital and print campaigns.', icon: ImageIcon },
      { title: 'Product Photoshoot', description: 'High-quality, professional imagery for your products.', icon: Camera },
      { title: 'Video Production', description: 'Engaging motion graphics and video content that tells your story.', icon: Video },
      { title: 'Social Media Content', description: 'Viral, highly engaging organic content for all platforms.', icon: LayoutTemplate },
    ]
  }
]

export default function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedCategory !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedCategory])

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-blue-50/50 via-blue-100/40 to-indigo-50/50 relative overflow-hidden">
      {/* Ambient glowing orbs for glassmorphism effect */}
      {/* Optimized ambient glowing orbs for performance */}
      <div className="absolute top-20 -left-10 w-[25rem] h-[25rem] bg-blue-500/15 rounded-full blur-3xl opacity-80 pointer-events-none transform-gpu" />
      <div className="absolute bottom-10 -right-20 w-[30rem] h-[30rem] bg-indigo-500/15 rounded-full blur-3xl opacity-80 pointer-events-none transform-gpu" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Services</h2>
          <p 
            className="mt-2 text-4xl sm:text-5xl font-medium tracking-wide text-blue-900 drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            Everything you need to grow
          </p>
          <p 
            className="mt-4 max-w-2xl text-xl text-gray-700 mx-auto font-medium"
            style={{ fontFamily: "'Tektur', sans-serif" }}
          >
            We offer full-cycle digital services in technology, marketing, and creative design to take your business from ideation to scale.
          </p>
        </div>

        {/* Glassmorphism Capsule Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
              onClick={() => setSelectedCategory(index)}
              className="group relative w-full flex items-center p-3 pr-4 xl:pr-6 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] cursor-pointer hover:shadow-[0_8px_40px_rgba(31,38,135,0.15)] hover:-translate-y-1 hover:bg-white/60 transition-all duration-300 overflow-hidden"
            >
              {/* Internal subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Capsule Icon Circle */}
              <div className="relative flex-shrink-0 w-[4rem] h-[4rem] rounded-full bg-white border border-white/50 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500 z-10">
                <category.mainIcon className="w-7 h-7" />
              </div>
              
              {/* Capsule Text Area */}
              <div className="ml-4 text-left z-10 py-2 overflow-hidden">
                <h3 className="text-lg xl:text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors tracking-tight truncate">{category.title}</h3>
                <p className="text-gray-500 text-xs xl:text-sm font-medium mt-0.5 line-clamp-1 transition-colors">{category.description}</p>
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3D Pop Up Modal */}
      <AnimatePresence>
        {selectedCategory !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1200px' }}>
            {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
               onClick={() => setSelectedCategory(null)}
            />

            {/* Modal Content */}
            <motion.div
               initial={{ opacity: 0, scale: 0.8, rotateY: -15, rotateX: 10, y: 40 }}
               animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, y: 0 }}
               exit={{ opacity: 0, scale: 0.8, rotateY: 15, rotateX: -10, y: 40 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="relative w-full max-w-5xl bg-white/60 backdrop-blur-2xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/80 rounded-[2.5rem] overflow-hidden flex flex-col"
            >
              {/* Decorative Glowing Elements inside the modal window */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

              {/* Header */}
              <div className="px-6 py-8 sm:px-10 relative shrink-0 border-b border-white/30">
                <div className="relative z-10 flex justify-between items-start">
                  <div className="pr-12">
                    <h3 
                      className="text-4xl sm:text-5xl font-medium mb-4 tracking-wide text-blue-900 drop-shadow-sm"
                      style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
                    >
                      {serviceCategories[selectedCategory].title}
                    </h3>
                    <p className="text-gray-600 text-lg font-medium max-w-2xl">
                      {serviceCategories[selectedCategory].description}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="absolute right-0 top-0 w-12 h-12 rounded-full bg-white/50 hover:bg-white/80 text-gray-700 flex justify-center items-center transition-all duration-300 backdrop-blur-md shadow-sm border border-white/60 hover:shadow-md hover:rotate-90 origin-center z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Grid of Services */}
              <div className="p-6 sm:p-10 w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {serviceCategories[selectedCategory].services.map((service, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05), duration: 0.5, type: "spring", stiffness: 100 }}
                      key={service.title}
                      className="bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/40 hover:bg-white/80 transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="h-7 w-7 text-primary group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h4 className="text-lg font-extrabold text-gray-900 mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">{service.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
