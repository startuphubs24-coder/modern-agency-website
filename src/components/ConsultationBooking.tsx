"use client"
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Sparkles, X, ChevronDown } from 'lucide-react'
import { Booking } from '@/lib/types'

const SERVICE_OPTIONS = [
  {
    group: "Services",
    items: [
      "Technology Development",
      "Digital Marketing",
      "Creative Studio",
      "Other"
    ]
  }
]


export default function ConsultationBooking() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<Partial<Booking>>({
    defaultValues: {
      service: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedService = watch('service')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const onSubmit = async (data: Partial<Booking>) => {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const { error } = await supabase.from('bookings').insert([
        { ...data, status: 'New' }
      ])
      if (error) throw error
      setIsSuccess(true)
      reset()
      setTimeout(() => {
        setIsSuccess(false)
        setIsModalOpen(false)
      }, 3000)
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-100/60 via-white to-rose-100/60 flex items-center justify-center min-h-[70vh]">
      {/* Light gradient base background */}
      <div className="absolute inset-0 bg-white/20" />

      {/* Optimized Ambient Spheres - Reduced and simplified */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-[25rem] h-[25rem] bg-sky-200/50 rounded-full blur-[100px] pointer-events-none transform-gpu" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-rose-200/50 rounded-full blur-[100px] pointer-events-none transform-gpu" 
      />

      <div className="relative z-10 w-full" style={{ perspective: 1500 }}>
        
        {/* 3D Floating Objects */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute top-20 left-10 lg:left-32 w-24 h-24 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] items-center justify-center transform -rotate-12 z-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 shadow-[0_0_30px_rgba(56,189,248,0.5)]" style={{ transform: "translateZ(30px)" }} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden md:flex absolute bottom-32 left-16 lg:left-40 w-32 h-32 bg-white/40 backdrop-blur-lg border border-white/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] items-center justify-center z-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-300 to-yellow-500 shadow-[0_0_30px_rgba(253,224,71,0.5)]" style={{ transform: "translateZ(40px) rotate(45deg)" }} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 25, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="hidden md:flex absolute top-40 right-10 lg:right-32 w-20 h-20 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] items-center justify-center z-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-pink-300 to-pink-500 shadow-[0_0_30px_rgba(244,114,182,0.5)]" style={{ transform: "translateZ(20px)" }} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotateZ: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="hidden md:flex absolute bottom-20 right-20 lg:right-40 w-28 h-28 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] items-center justify-center transform rotate-12 z-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-16 h-16 rounded-xl bg-white/60 backdrop-blur border border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.8)]" style={{ transform: "translateZ(50px)" }} />
        </motion.div>
        
        <div className="text-center mb-12 max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ready to scale your business?</span>
          </motion.div>
          <h2 
            className="text-4xl md:text-5xl lg:text-5xl font-medium tracking-wide text-blue-900 mb-6 drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            So tell us about your project...
          </h2>
          <p 
            className="text-gray-700 text-lg mx-auto font-medium mb-10"
            style={{ fontFamily: "'Tektur', sans-serif" }}
          >
            Let&apos;s analyze your digital presence and build a custom strategy for growth.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative overflow-hidden rounded-full bg-primary text-white font-bold py-4 px-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center">
              Book Consultation Now
            </span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
            style={{ perspective: "2000px" }}
          >
            <motion.div 
              initial={{ x: "-50vw", scale: 0.8, rotateY: -30, opacity: 0 }}
              animate={{ x: 0, scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ x: "50vw", scale: 0.8, rotateY: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20, mass: 1 }}
              className="relative w-full max-w-2xl max-h-[90vh] my-4 sm:my-8 rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-col overflow-hidden origin-center"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-gray-600 hover:text-gray-900 z-30"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="absolute top-0 inset-x-0 h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <h3 
                  className="text-2xl sm:text-4xl font-medium text-blue-900 mb-4 sm:mb-6 text-center pt-2 tracking-wide drop-shadow-sm pb-1"
                  style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
                >
                  Schedule Your Session
                </h3>
                
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-green-50 backdrop-blur-md rounded-2xl flex items-start border border-green-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                    <p className="text-green-700 text-sm font-medium leading-relaxed">Thank you! Your booking has been received. Our team will contact you shortly.</p>
                  </motion.div>
                )}
                
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-red-50 backdrop-blur-md rounded-2xl flex items-start border border-red-200 shadow-sm"
                  >
                    <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Name</label>
                      <input 
                        type="text" 
                        {...register('name', { required: true })} 
                        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all outline-none backdrop-blur-md hover:bg-white/90" 
                        placeholder="John Doe" 
                      />
                      {errors.name && <span className="text-red-500 text-xs mt-1 ml-1 block">Name is required</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Company</label>
                      <input 
                        type="text" 
                        {...register('company', { required: true })} 
                        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none backdrop-blur-md hover:bg-white/90" 
                        placeholder="Acme Inc" 
                      />
                      {errors.company && <span className="text-red-500 text-xs mt-1 ml-1 block">Company is required</span>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                      <input 
                        type="email" 
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })} 
                        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 transition-all outline-none backdrop-blur-md hover:bg-white/90" 
                        placeholder="john@example.com" 
                      />
                      {errors.email && <span className="text-red-500 text-xs mt-1 ml-1 block">Valid email is required</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Contact Number</label>
                      <input 
                        type="tel" 
                        {...register('contact_number', { required: true })} 
                        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all outline-none backdrop-blur-md hover:bg-white/90" 
                        placeholder="+1 (555) 000-0000" 
                      />
                      {errors.contact_number && <span className="text-red-500 text-xs mt-1 ml-1 block">Contact number is required</span>}
                    </div>
                  </div>
                  
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Service Interested In</label>
                    <input type="hidden" {...register('service', { required: true })} />
                    
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full px-4 py-3 rounded-xl bg-white/70 border cursor-pointer flex justify-between items-center transition-all backdrop-blur-md hover:bg-white/90 ${isDropdownOpen ? 'border-primary ring-4 ring-primary/20' : 'border-white/80'} ${errors.service ? 'border-red-400 ring-4 ring-red-400/20' : ''}`}
                    >
                      <span className={`font-medium ${!selectedService ? 'text-gray-400' : 'text-gray-900'}`}>
                        {selectedService || 'Option example'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                    </div>
                    {errors.service && <span className="text-red-500 text-xs mt-1 ml-1 block">Please select a service</span>}
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 p-2 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] max-h-[220px] overflow-y-auto"
                        >
                          {SERVICE_OPTIONS.map((group, i) => (
                            <div key={i} className="mb-3 last:mb-0">
                              {group.group !== "Other" && (
                                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                  {group.group}
                                </div>
                              )}
                              <div className="space-y-1">
                                {group.items.map(item => (
                                  <div 
                                    key={item}
                                    onClick={() => {
                                      setValue('service', item);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                                      selectedService === item 
                                        ? 'bg-gradient-to-r from-blue-500 to-primary text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-primary/10 hover:text-primary hover:shadow-sm'
                                    }`}
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Message</label>
                    <textarea 
                      rows={3} 
                      {...register('message')} 
                      className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all outline-none resize-none backdrop-blur-md hover:bg-white/90" 
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <motion.button 
                      type="submit" 
                      disabled={isSubmitting} 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full overflow-hidden rounded-2xl bg-white text-gray-800 py-4 px-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed border border-white/60"
                      style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
                    >
                      {/* Animated multi-color gradient background (Yellow, Pink, Light Blue, White) */}
                      <motion.div 
                        animate={{ 
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-sky-200 opacity-70 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundSize: "200% auto" }}
                      />

                      {/* Glass shine overlay in white */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent/10 pointer-events-none" />
                      
                      <span className="relative z-10 flex items-center justify-center text-lg md:text-xl tracking-widest font-normal uppercase drop-shadow-sm pb-1 text-gray-900">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-3 text-gray-700" /> : <Sparkles className="w-5 h-5 mr-3 text-pink-500 group-hover:text-blue-500 transition-colors duration-500" />}
                        {isSubmitting ? 'Sending...' : 'Submit Request'}
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
