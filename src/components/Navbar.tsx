"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LayoutGrid, Briefcase, MessageSquare, FileText, PhoneCall, Menu, X, Users } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

export default function Navbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !scrolled) {
      setScrolled(true)
    } else if (latest <= 50 && scrolled) {
      setScrolled(false)
    }
  })

  const navItems = [
    { name: 'Services', href: '/#services', icon: LayoutGrid },
    { name: 'Portfolio', href: '/#portfolio', icon: Briefcase },
    { name: 'Testimonials', href: '/#testimonials', icon: MessageSquare },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Careers', href: '/careers', icon: Users },
  ]

  const isDark = variant === 'dark' || scrolled

  return (
    <div className={`fixed top-0 inset-x-0 w-full z-[100] flex justify-center transition-all duration-500 ease-in-out ${scrolled ? 'py-0' : 'py-4 sm:py-6'} pointer-events-none`}>
      
      {/* Navbar Container */}
      <nav 
        className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between transition-all duration-500 px-6 sm:px-10 py-3 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-none max-w-none' 
            : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full mx-4 sm:mx-6 lg:mx-8'
        }`}
      >
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className={`font-extrabold text-2xl tracking-tighter group transition-colors duration-300 ${isDark ? 'text-blue-950' : 'text-white'}`}>
            Agency<span className="text-primary group-hover:scale-125 inline-block transition-transform duration-300">.</span>
          </Link>
        </div>
        
        {/* Desktop Navigation Central Pill */}
        <div className="hidden lg:flex items-center gap-1">
          <div className={`flex items-center gap-1 p-1 border rounded-full transition-all duration-500 ${isDark ? 'bg-gray-900/5 border-gray-900/10' : 'bg-white/10 border-white/20'}`}>
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
              >
                {/* Hover Background Pill */}
                <div className={`absolute inset-0 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 rounded-full z-0 ${isDark ? 'bg-primary/10' : 'bg-white/20'}`} />
                
                <span className={`relative z-10 font-bold text-[11px] tracking-[0.15em] uppercase transition-colors ${isDark ? 'text-gray-600 group-hover:text-primary' : 'text-white/90 group-hover:text-white'}`}>
                  {item.name}
                </span>
                <item.icon className={`relative z-10 w-3.5 h-3.5 transition-all duration-300 ${isDark ? 'text-gray-400 group-hover:text-primary' : 'text-white/40 group-hover:text-white'}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block transition-all duration-500">
            <Link 
              href="/#contact" 
              className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 overflow-hidden active:scale-95"
            >
               <span className="relative z-10">Consultation</span>
               <PhoneCall className="relative z-10 w-3.5 h-3.5 group-hover:rotate-[15deg] transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-2 rounded-full border transition-all duration-300 ${isDark ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute left-4 right-4 sm:left-auto sm:right-6 sm:w-[350px] lg:hidden pointer-events-auto bg-white/90 backdrop-blur-3xl border border-gray-200 shadow-2xl rounded-[2rem] overflow-hidden p-3 transition-all duration-500 ${scrolled ? 'top-16' : 'top-24'}`}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-primary/5"
                >
                  <span className="text-[14px] font-bold tracking-tight text-gray-900 group-hover:text-primary">{item.name}</span>
                  <div className="bg-gray-50 group-hover:bg-primary/10 p-2 rounded-xl transition-all duration-300">
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2 mx-4" />
              <Link 
                href="/#contact" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-center gap-3 px-6 py-4 text-[13px] font-bold tracking-widest uppercase text-white bg-primary rounded-2xl mt-1 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
              >
                <span>Book Consultation</span>
                <PhoneCall className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
