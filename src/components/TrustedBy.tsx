"use client"
import { motion } from 'framer-motion'

const PARTNERS = [
  { name: 'Adobe', slug: 'adobe', localPath: '/assets/Adobe-logo-768x432.png' },
  { name: 'Google', slug: 'google', localPath: '/assets/google.png' },
  { name: 'Meta', slug: 'meta' },
  { name: 'GitHub', slug: 'github' },
  { name: 'VS Code', slug: 'visualstudiocode', localPath: '/assets/vs.png' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'Canva', slug: 'canva', localPath: '/assets/Canva-logo.png' },
  { name: 'Docker', slug: 'docker' },
  { name: 'Google Analytics', slug: 'googleanalytics' },
  { name: 'AWS', slug: 'amazonwebservices', localPath: '/assets/Amazon_Web_Services_Logo.svg.png' },
  { name: 'Power BI', slug: 'powerbi', localPath: '/assets/Power-BI-Logo-2013.png' },
  { name: 'Hostinger', slug: 'hostinger', localPath: '/assets/Hostinger logo.png' },
  { name: 'n8n', slug: 'n8n', localPath: '/assets/N8n-logo.png' },
  { name: 'GoDaddy', slug: 'godaddy', localPath: '/assets/Godaddy-logo.png' },
]

export default function TrustedBy() {
  // Duplicate the array to create a seamless loop
  const duplicatedPartners = [...PARTNERS, ...PARTNERS]

  return (
    <section className="bg-white py-20 overflow-hidden border-y border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 
            className="text-4xl sm:text-5xl font-medium text-blue-900 tracking-wide drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            Our Partners
          </h2>
          <p 
            className="mt-4 text-xl text-gray-700 font-medium"
            style={{ fontFamily: "'Tektur', sans-serif" }}
          >
            Tools and platforms we use to build high-quality digital solutions
          </p>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Gradients to fade out the edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          className="flex whitespace-nowrap gap-24 items-center py-8"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ width: "max-content" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.slug}-${index}`} 
              className="group flex flex-col items-center gap-4 transition-all duration-500 opacity-80 hover:opacity-100"
            >
              <div className="w-32 h-16 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.localPath || `https://cdn.simpleicons.org/${partner.slug}`}
                  alt={partner.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

