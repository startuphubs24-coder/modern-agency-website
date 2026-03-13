"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-[120px]" />
      </div>

      <Navbar variant="dark" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 pt-40 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[12rem] font-black text-blue-950/5 leading-none select-none">404</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
             <h2 className="text-4xl md:text-6xl font-extrabold text-blue-950 mb-6 tracking-tighter">Lost in Space?</h2>
             <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto mb-12 font-medium">
               The page you are looking for has been moved or doesn&apos;t exist. Let&apos;s get you back on track.
             </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-20"
        >
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
