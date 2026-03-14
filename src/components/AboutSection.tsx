"use client"
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function AboutSection() {
  return (
    <section id="about" className="py-12 relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/80">
      {/* 3D Floating Abstract Blobs Background - Soft Pastel Version */}
      
      {/* Ambient Lighting Gradient */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px] pointer-events-none z-0" />

      {/* Blob 1: Soft Red */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-red-300/50 rounded-full z-0 pointer-events-none blur-[120px]"
        style={{ willChange: "transform" }}
      />

      {/* Blob 2: Soft Blue */}
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 80, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] right-[-10%] w-[50rem] h-[50rem] bg-blue-300/50 rounded-full z-0 pointer-events-none blur-[120px]"
        style={{ willChange: "transform" }}
      />

      {/* Blob 3: Soft Green */}
      <motion.div
        animate={{
          x: [0, 90, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] right-[0%] w-[40rem] h-[40rem] bg-green-300/50 rounded-full z-0 pointer-events-none blur-[120px]"
        style={{ willChange: "transform" }}
      />

      {/* Blob 4: Soft Yellow */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -80, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-yellow-200/60 rounded-full z-0 pointer-events-none blur-[120px]"
        style={{ willChange: "transform" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Text Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>Who We Are</span>
            </div>
            
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-wide text-blue-900 drop-shadow-sm mb-4"
              style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
            >
              Building Digital Excellence
            </h2>
            
            <p 
              className="text-gray-700 text-lg sm:text-xl font-medium mb-0 leading-relaxed"
              style={{ fontFamily: "'Tektur', sans-serif" }}
            >
              We are a passionate team of creators, developers, and strategists dedicated to transforming brands for the digital era. With a focus on cutting-edge technology and stunning design, we bridge the gap between imagination and scaling your business.
            </p>
          </motion.div>

          {/* Lottie Animation Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:h-[400px] flex items-center justify-center"
          >
            <div className="w-full max-w-md lg:max-w-none">
              <DotLottieReact
                src="https://lottie.host/50e60245-bfba-4253-b505-bdfb07955a87/ak0cXkSQKr.lottie"
                loop
                autoplay
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
