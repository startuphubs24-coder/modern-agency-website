"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Blog } from '@/lib/types'
import Masonry from 'react-masonry-css'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    async function fetchBlogs() {
      // We retrieve all published blogs for the dedicated page, ordered by creation date
      const { data } = await supabase.from('blogs').select('*').eq('published', true).order('created_at', { ascending: false })
      if (data) setBlogs(data)
    }
    fetchBlogs()
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background - Mesh Gradient Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
        {/* Purple Blob */}
        <motion.div 
          animate={{
            x: [0, 150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] left-[-5%] w-[45rem] h-[45rem] bg-purple-400/30 rounded-full blur-[120px]"
        />
        {/* Yellow Blob */}
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, 150, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] right-[-10%] w-[35rem] h-[35rem] bg-yellow-300/30 rounded-full blur-[120px]"
        />
        {/* Blue Blob */}
        <motion.div 
          animate={{
            x: [0, 80, 0],
            y: [0, -120, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] left-[10%] w-[50rem] h-[50rem] bg-blue-400/30 rounded-full blur-[120px]"
        />
        {/* Red Blob */}
        <motion.div 
          animate={{
            x: [0, -120, 0],
            y: [0, -80, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[5%] w-[30rem] h-[30rem] bg-red-400/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-[100]">
        <Navbar variant="dark" />
      </div>

      <div className="relative z-10 flex-1 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-base text-primary font-bold tracking-widest uppercase mb-4"
            >
              Insights & Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold text-blue-950 leading-tight tracking-tighter"
              style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
            >
              Latest from our experts
            </motion.p>
          </div>

          {blogs.length > 0 ? (
            <Masonry
              breakpointCols={{
                default: 3,
                1100: 3,
                768: 2,
                500: 1
              }}
              className="flex -ml-8 w-auto"
              columnClassName="pl-8 bg-clip-padding"
            >
              {blogs.map((blog, index) => (
                <Link href={`/blog/${blog.id}`} key={blog.id} className="block mb-8 break-inside-avoid">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden block cursor-pointer group"
                  >
                    {blog.thumbnail && (
                      <div className="w-full relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blog.thumbnail} alt={blog.title} className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <CalendarDays className="w-3 h-3 justify-center mr-1" />
                        {format(new Date(blog.created_at || new Date()), 'MMM d, yyyy')}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">{blog.title}</h2>
                      <p className="text-gray-500 text-sm line-clamp-3 my-4">{blog.content?.replace(/<[^>]*>?/gm, '')}</p>
                      
                      <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-primary-hover">
                        Read article 
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </Masonry>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
              Blog posts will appear here. Add them in the Admin panel.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
