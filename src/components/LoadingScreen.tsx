"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + Math.random() * 15
      })
    }, 150)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
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
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-10"
          >
            {/* Logo Image */}
            <div className="relative flex items-center justify-center w-48 h-48">
              <div className="relative z-10 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.png" alt="Startup Hub Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]" />
              </div>
              
              {/* Outer glow rings */}
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
              />
            </div>
            
            {/* Animated Logo Text - Letter by Letter Reveal */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {"Startup".split("").map((char, i) => (
                    <motion.span
                      key={`s-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.1 + (i * 0.05),
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="text-6xl font-extrabold text-[#001D4A] tracking-tighter"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="flex ml-1">
                  {"Hub".split("").map((char, i) => (
                    <motion.span
                      key={`h-${i}`}
                      initial={{ opacity: 0, scale: 0.5, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 0.5 + (i * 0.08),
                        duration: 0.5,
                        type: "spring",
                        stiffness: 260,
                        damping: 15
                      }}
                      className="text-6xl font-extrabold text-red-600 tracking-tighter"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Futuristic Progress Bar */}
              <div className="relative w-72 flex flex-col items-center gap-3">
                <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-primary to-red-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  >
                    {/* Animated shine effect */}
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 bg-white/30 skew-x-[-20deg] blur-sm"
                    />
                  </motion.div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span 
                    className="text-xs font-mono font-bold text-gray-400 tracking-widest uppercase"
                  >
                    System Initializing
                  </motion.span>
                  <span className="text-xs font-mono font-bold text-blue-600 min-w-[3ch]">
                    {Math.floor(Math.min(progress, 100))}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
