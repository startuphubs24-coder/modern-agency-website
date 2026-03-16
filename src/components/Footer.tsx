"use client"
import Link from 'next/link'
import { Facebook, Linkedin, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png" alt="Startup Hub" className="h-12 w-auto" />
              <span className="font-gagalin text-2xl tracking-tight text-gray-900 ml-1">
                Startup<span className="text-red-600">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              Helping businesses scale intelligently through modern websites, design, and growth marketing.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="text-base text-gray-500 hover:text-gray-900">Home</Link></li>
              <li><Link href="/#services" className="text-base text-gray-500 hover:text-gray-900">Services</Link></li>
              <li><Link href="/#portfolio" className="text-base text-gray-500 hover:text-gray-900">Portfolio</Link></li>
              <li><Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Socials</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1CFiwagJxG/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/startup-hub24/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/startup_hub24?igsh=MXc4bTEwZXBzZXh6Mg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:startuphubs24@gmail.com" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" title="Email Us">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-100 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} Digital Startup Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
