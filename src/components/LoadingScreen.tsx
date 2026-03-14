"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Artificial delay to show the beautiful loading screen
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white overflow-hidden pointer-events-auto"
        >
          {/* Subtle animated background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Ambient colored glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Spinning concentric rings with center icon */}
            <div className="relative flex items-center justify-center w-28 h-28">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-primary/50"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border-b-2 border-r-2 border-blue-400 opacity-60"
              />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-6 rounded-full border-t-2 border-l-2 border-pink-500 opacity-80"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
              </div>
            </div>
            
            {/* Animated Logo Text reveal */}
            <div className="overflow-hidden flex flex-col items-center justify-center">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-5xl font-extrabold text-blue-950 tracking-tighter"
              >
                Agency<span className="text-primary inline-block">.</span>
              </motion.h1>
            </div>
            
            {/* Expanding loading progress line */}
            <div className="relative w-48 h-1 rounded-full overflow-hidden bg-gray-100">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-400 via-primary to-pink-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
