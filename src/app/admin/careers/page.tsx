"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit2, Loader2, Users, Calendar, MapPin, X } from 'lucide-react'
import { format } from 'date-fns'
import { Job, JobApplication } from '@/lib/types'

export default function CareerManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [filterJobId, setFilterJobId] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs')

  // Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    deadline: '',
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: jobsData, error: jobsError } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
      const { data: appsData, error: appsError } = await supabase.from('job_applications').select('*, jobs(title)').order('created_at', { ascending: false })
      
      if (jobsError) throw jobsError
      if (appsError) throw appsError
      
      if (jobsData) setJobs(jobsData)
      if (appsData) setApplications(appsData)
    } catch (err: unknown) {
      console.error("Error fetching data:", (err as Error).message)
      alert("Failed to fetch data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (editingJob) {
        const { error } = await supabase.from('jobs').update(jobForm).eq('id', editingJob.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('jobs').insert([jobForm])
        if (error) throw error
      }
      
      setShowJobModal(false)
      setEditingJob(null)
      setJobForm({ title: '', department: '', location: '', description: '', deadline: '', is_active: true })
      await fetchData()
    } catch (err: unknown) {
      alert("Error saving job: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure? This will also delete all applications for this job.")) {
      setLoading(true)
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id)
        if (error) throw error
        await fetchData()
      } catch (err: unknown) {
        alert("Error deleting job: " + (err as Error).message)
        setLoading(false)
      }
    }
  }

  const updateAppStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('job_applications').update({ status }).eq('id', id)
      if (error) throw error
      await fetchData()
    } catch (err: unknown) {
      alert("Error updating application status: " + (err as Error).message)
    }
  }

  const filteredApps = filterJobId === 'all' 
    ? applications 
    : applications.filter(app => app.job_id === filterJobId)

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage job openings and track candidate applications.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Job Openings
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'applications' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Applications ({applications.length})
          </button>
        </div>

        {activeTab === 'jobs' && (
          <button 
            onClick={() => { setEditingJob(null); setJobForm({ title: '', department: '', location: '', description: '', deadline: '', is_active: true }); setShowJobModal(true); }}
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Post New Job
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === 'jobs' ? (
        /* Jobs List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-primary font-medium">{job.department}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {job.is_active ? 'Active' : 'Draft'}
                </div>
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" /> {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" /> Deadline: {job.deadline ? format(new Date(job.deadline), 'PP') : 'No deadline'}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => { setEditingJob(job); setJobForm({ ...job, deadline: job.deadline || '' }); setShowJobModal(true); }}
                  className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Applications List */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" /> Candidate Applications
            </h3>
            <select 
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
              className="text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="all">All Positions</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">CV / Resume</th>
                  <th className="px-6 py-4">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{app.full_name}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                      <div className="text-xs text-gray-400">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{app.jobs?.title || 'Unknown Position'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={app.cv_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-sm font-bold hover:underline flex items-center"
                      >
                         View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status}
                        onChange={(e) => updateAppStatus(app.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg border-0 ring-1 ring-inset px-3 py-1.5 ${
                          app.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                          'bg-gray-50 text-gray-700 ring-gray-600/20'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">{editingJob ? 'Edit Job Posting' : 'Post New Opening'}</h3>
              <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleJobSubmit} className="p-8 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input required value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" placeholder="e.g. Engineering" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" placeholder="e.g. Remote / New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input type="date" value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea required rows={6} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary resize-none" placeholder="Enter detailed job description, requirements, etc." />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={jobForm.is_active} onChange={e => setJobForm({...jobForm, is_active: e.target.checked})} className="rounded text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Make this job posting live</label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-4">
                 <button type="button" onClick={() => setShowJobModal(false)} className="px-6 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                 <button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all" disabled={loading}>
                   {editingJob ? 'Update Job' : 'Post Opening'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
