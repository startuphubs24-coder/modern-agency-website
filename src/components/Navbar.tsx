"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LayoutGrid, Briefcase, MessageSquare, FileText, PhoneCall, Menu, X, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'Services', href: '/#services', icon: LayoutGrid },
    { name: 'Portfolio', href: '/#portfolio', icon: Briefcase },
    { name: 'Testimonials', href: '/#testimonials', icon: MessageSquare },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Careers', href: '/careers', icon: Users },
  ]

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDark = variant === 'dark' || scrolled

  return (
    <div className={`fixed top-0 inset-x-0 w-full z-[100] flex justify-center transition-all duration-500 ${scrolled ? 'mt-0 px-0' : 'mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8'} pointer-events-none`}>
      
      {/* Floating Navbar */}
      <nav 
        className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between transition-all duration-500 ease-out px-5 sm:px-8 py-3 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm rounded-none max-w-none' 
            : 'rounded-full'
        }`}
      >
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className={`font-extrabold text-2xl tracking-tighter drop-shadow-sm group transition-all duration-300 ${isDark ? 'text-blue-950' : 'text-white'}`}>
            Agency<span className="text-primary group-hover:animate-pulse transition-all">.</span>
          </Link>
        </div>
        
        {/* Right Side Items Container */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop Navigation */}
        <div className={`hidden lg:flex items-center gap-1.5 p-1 border rounded-full shadow-inner backdrop-blur-md ${isDark ? 'bg-blue-900/5 border-blue-900/10' : 'bg-white/20 border-white/30'}`}>
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300"
            >
              {/* Hover Background Pill Effect */}
              <div className={`absolute inset-0 transition-all duration-300 rounded-full z-0 pointer-events-none border ${isDark ? 'bg-primary/0 group-hover:bg-primary/5 border-transparent group-hover:border-primary/20' : 'bg-white/0 group-hover:bg-white/90 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] border-transparent group-hover:border-white/60'}`} />
              
              <span className={`relative z-10 font-bold text-xs tracking-widest uppercase transition-colors drop-shadow-md ${isDark ? 'text-blue-950/70 group-hover:text-primary' : 'text-white group-hover:text-primary'}`}>
                {item.name}
              </span>
              <item.icon className={`relative z-10 w-4 h-4 transition-all duration-300 drop-shadow-sm ${isDark ? 'text-blue-950/40 group-hover:text-primary' : 'text-white/70 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]'}`} />
            </Link>
          ))}
        </div>

        {/* CTA Button Desktop */}
        <div className={`hidden md:flex border p-1 rounded-full shadow-inner transition-all duration-300 ${isDark ? 'bg-blue-900/5 border-blue-900/10' : 'bg-white/20 border-white/30'}`}>
          <Link 
            href="/#contact" 
            className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 text-white font-bold text-xs tracking-widest uppercase shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-500 overflow-hidden"
          >
             <span className="relative z-10 drop-shadow-md">Consultation</span>
             <PhoneCall className="relative z-10 w-4 h-4 drop-shadow-md group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`focus:outline-none p-2.5 rounded-full border backdrop-blur-md shadow-sm transition-all ${isDark ? 'text-blue-950 bg-blue-900/10 border-blue-900/20' : 'text-white bg-white/20 hover:bg-white/90 border-white/30'}`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        </div>
      </nav>
      
      {/* Mobile Menu Dropdown - Floating Glass Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 w-[calc(100%-2rem)] sm:w-[400px] lg:hidden pointer-events-auto bg-white/80 backdrop-blur-[40px] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden p-3 transition-all duration-300 ${scrolled ? 'top-[90%]' : 'top-[120%]'}`}
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 bg-white/0 hover:bg-white/80 hover:shadow-sm"
                >
                  <span className="text-[15px] font-bold tracking-wide text-blue-950 group-hover:text-primary">{item.name}</span>
                  <div className="bg-blue-50 group-hover:bg-pink-50 p-2 rounded-xl transition-colors">
                    <item.icon className="w-5 h-5 text-blue-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
              <div className="h-px w-full bg-blue-900/10 my-2" />
              <Link 
                href="/#contact" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-center gap-3 px-6 py-4 text-[15px] font-bold tracking-wide uppercase text-white bg-gradient-to-r from-primary to-violet-500 rounded-2xl mt-1 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <span>Book Consultation</span>
                <PhoneCall className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
