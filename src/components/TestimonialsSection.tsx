"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  company: string
  review: string
  rating: number
  photo_url?: string
}

export default function TestimonialsSection({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)

  useEffect(() => {
    if (initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials)
    }
  }, [initialTestimonials])

  return (
    <section id="testimonials" className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p 
            className="mt-2 text-4xl sm:text-5xl font-medium tracking-wide text-blue-900 drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            What our clients say
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-md w-full"
            >
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-600 text-lg mb-8 italic">&quot;{testimonial.review}&quot;</p>
              
              <div className="flex items-center">
                {testimonial.photo_url ? (
                  <Image src={testimonial.photo_url} alt={testimonial.client_name} width={48} height={48} className="h-12 w-12 rounded-full object-cover mr-4" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mr-4">
                    {testimonial.client_name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.client_name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-12 text-gray-500 w-full">
              Testimonials will appear here dynamically.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
