"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, Calendar, Clock, ChevronRight, X, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { format } from 'date-fns'
import { Job } from '@/lib/types'

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  
  // Application Form State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (data) setJobs(data)
    setLoading(false)
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvFile || !selectedJob) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // 1. Upload CV to Storage
      const fileExt = cvFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `applications/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, cvFile)

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(filePath)

      // 2. Insert Application Record
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([{
          job_id: selectedJob.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          cv_url: publicUrl,
          status: 'New'
        }])

      if (insertError) throw insertError

      setSubmitSuccess(true)
      setTimeout(() => {
        setSelectedJob(null)
        setSubmitSuccess(false)
        setFormData({ full_name: '', email: '', phone: '' })
        setCvFile(null)
      }, 3000)
    } catch (err: unknown) {
      setSubmitError((err as Error).message || "Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      
      {/* Dynamic Animated Background - Mesh Gradient Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
        {/* Purple Blob */}
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 150, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-400/30 rounded-full blur-[120px]"
        />
        {/* Yellow Blob */}
        <motion.div 
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-yellow-300/30 rounded-full blur-[120px]"
        />
        {/* Blue Blob */}
        <motion.div 
          animate={{
            x: [0, 120, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-blue-400/30 rounded-full blur-[120px]"
        />
        {/* Red Blob */}
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, -150, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-red-500/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-[100]">
        <Navbar variant="dark" />
      </div>

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 drop-shadow-sm"
            style={{ fontFamily: "'Bitcount Grid Single Ink', sans-serif" }}
          >
            Join Our <span className="text-primary italic">Global</span> Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-medium"
            style={{ fontFamily: "'Tektur', sans-serif" }}
          >
            Looking for passionate creators to build the future of digital growth.
          </motion.p>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {loading ? (
             <div className="flex justify-center p-20">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
             </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-20 bg-white rounded-3xl border border-dashed border-gray-300">
               <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
               <h2 className="text-2xl font-bold text-gray-900">No Open Positions</h2>
               <p className="text-gray-500 mt-2">Check back later or follow us for updates!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Job Openings</h2>
              {jobs.map((job, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={job.id}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">{job.department}</span>
                       <span className="text-gray-400 text-sm flex items-center"><Clock className="w-4 h-4 mr-1"/> Posted {format(new Date(job.created_at), 'PP')}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-600 text-sm font-medium">
                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> {job.location}</span>
                       {job.deadline && <span className="flex items-center text-rose-600"><Calendar className="w-4 h-4 mr-1.5"/> Apply by {format(new Date(job.deadline), 'PP')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform">
                    Apply Now <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5 h-full max-h-[90vh]">
                {/* Job Info Sidebar */}
                <div className="lg:col-span-2 bg-gray-50 p-8 border-r border-gray-100 overflow-y-auto">
                   <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Application for</h4>
                   <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedJob.title}</h3>
                   
                   <div className="space-y-6">
                      <div className="text-sm">
                         <p className="font-bold text-gray-900 mb-1 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Department</p>
                         <p className="text-gray-600">{selectedJob.department}</p>
                      </div>
                      <div className="text-sm">
                         <p className="font-bold text-gray-900 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</p>
                         <p className="text-gray-600">{selectedJob.location}</p>
                      </div>
                   </div>

                   <hr className="my-8 border-gray-200" />
                   
                   <div className="prose prose-sm prose-primary">
                      <h4 className="text-sm font-bold text-gray-900 mb-4">Role Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                   </div>
                </div>

                {/* Application Form */}
                <div className="lg:col-span-3 p-8 md:p-12 overflow-y-auto">
                  {submitSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                       <CheckCircle2 className="w-20 h-20 text-green-500" />
                       <h3 className="text-2xl font-bold text-gray-900">Application Sent!</h3>
                       <p className="text-gray-600">Thank you for applying. Our talent team will review your application and get in touch shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-6">
                       <h3 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Application</h3>
                       
                       {submitError && (
                         <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center">
                            <AlertCircle className="w-5 h-5 mr-3" /> {submitError}
                         </div>
                       )}

                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-primary focus:border-primary font-medium" placeholder="Jane Doe" />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-primary focus:border-primary font-medium" placeholder="jane@example.com" />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                             <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-primary focus:border-primary font-medium" placeholder="+1 (555) 000-0000" />
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">CV / Resume (PDF)</label>
                          <div className="relative group">
                             <input 
                              required 
                              type="file" 
                              accept=".pdf,.doc,.docx"
                              onChange={e => setCvFile(e.target.files?.[0] || null)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                             />
                             <div className="w-full px-5 py-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-sm font-bold">{cvFile ? cvFile.name : 'Upload your CV'}</span>
                                <span className="text-xs mt-1">PDF, DOCX up to 10MB</span>
                             </div>
                          </div>
                       </div>

                       <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center"
                       >
                          {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Processing...</> : 'Submit Application'}
                       </button>

                       <p className="text-xs text-gray-400 text-center px-4">By applying, you agree to our privacy policy and terms of service regarding data processing.</p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
