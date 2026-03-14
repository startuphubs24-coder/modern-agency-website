"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDays, ArrowLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Blog } from '@/lib/types'

export default function BlogPostPage() {
  const params = useParams()
  const id = params.id as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
      
      if (error || !data) {
        console.error("Error fetching blog", error)
        // Optionally handle 404 here
      } else {
        setBlog(data)
      }
      setLoading(false)
    }
    fetchBlog()
  }, [id])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background - Mesh Gradient Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
        <motion.div 
          animate={{ x: [0, 150, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] left-[-5%] w-[45rem] h-[45rem] bg-purple-400/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 150, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] right-[-10%] w-[35rem] h-[35rem] bg-yellow-300/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, -120, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] left-[10%] w-[50rem] h-[50rem] bg-blue-400/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -120, 0], y: [0, -80, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[5%] w-[30rem] h-[30rem] bg-red-400/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-50">
        <Navbar variant="dark" />
      </div>
      
      <div className="relative z-10 flex-1 pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-hover mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !blog ? (
            <div className="text-center py-32">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
              <p className="text-gray-500 mb-8">The article you are looking for does not exist or has been removed.</p>
              <Link href="/blog" className="bg-primary text-white px-6 py-3 rounded-xl font-medium">Browse other articles</Link>
            </div>
          ) : (
            <article>
              <div className="mb-10 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {format(new Date(blog.created_at || new Date()), 'MMMM d, yyyy')}
                  
                  {blog.tags && blog.tags.length > 0 && (
                     <>
                       <span className="mx-3 text-gray-300">•</span>
                       <span className="text-primary font-medium">{blog.tags[0]}</span>
                     </>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                  {blog.title}
                </h1>
              </div>

              {blog.thumbnail && (
                <div className="w-full relative rounded-3xl overflow-hidden mb-12 shadow-xl border border-gray-100/50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.thumbnail} alt={blog.title} className="w-full h-auto max-h-[600px] object-cover" />
                </div>
              )}

              {/* Render HTML Content */}
              <div 
                className="prose prose-lg prose-blue max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary-hover prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-medium rounded-full border border-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
          
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
