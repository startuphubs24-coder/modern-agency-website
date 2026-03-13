"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Project } from '@/lib/types'

export default function ManagePortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newProject, setNewProject] = useState<Partial<Project>>({ title: '', description: '', industry: '', image_url: '', project_url: '' })
  const [uploading, setUploading] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    
    setUploading(true)
    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      if (data && data.publicUrl) {
        setNewProject(prev => ({ ...prev, [fieldName]: data.publicUrl }))
      } else {
        throw new Error("Could not generate public URL")
      }
    } catch (err: unknown) {
      alert('Upload failed: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('projects').insert([newProject])
      if (error) throw error
      setIsAdding(false)
      setNewProject({ title: '', description: '', industry: '', image_url: '', project_url: '' })
      await fetchProjects()
    } catch (err: unknown) {
      alert("Error adding project: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) throw error
        await fetchProjects()
      } catch (err: unknown) {
        alert("Error deleting project: " + (err as Error).message)
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Projects</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow hover:shadow-lg transition-all">
          <Plus className="w-4 h-4 mr-2" /> {isAdding ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Add New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Project Title" className="border p-2 rounded w-full" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
            <input required placeholder="Industry" className="border p-2 rounded w-full" value={newProject.industry} onChange={e => setNewProject({...newProject, industry: e.target.value})} />
            
            <div className="md:col-span-2 border p-3 rounded bg-gray-50 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Project Image (Upload or URL)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="file" accept="image/*" className="border p-1.5 rounded bg-white flex-1 text-sm text-gray-700" onChange={e => handleFileUpload(e, 'image_url')} disabled={uploading} />
                <span className="flex items-center justify-center text-xs font-bold text-gray-500">OR</span>
                <input placeholder="Image URL" className="border p-2 rounded flex-1 text-sm w-full" value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} />
              </div>
              {uploading && <div className="text-xs text-primary font-medium flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Uploading image...</div>}
              {newProject.image_url && !uploading && <div className="text-xs text-green-600 truncate">Selected: {newProject.image_url}</div>}
            </div>

            <input placeholder="Project URL" className="border p-2 rounded w-full md:col-span-2" value={newProject.project_url} onChange={e => setNewProject({...newProject, project_url: e.target.value})} />
            <textarea required placeholder="Description" className="border p-2 rounded w-full md:col-span-2" rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg" disabled={uploading}>Save Project</button>
        </form>
      )}

      {loading ? <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{project.industry}</span>
                </div>
                <p className="text-sm text-gray-500 flex-1">{project.description}</p>
                <div className="mt-4 flex justify-between items-center border-t pt-4">
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700 flex items-center text-sm"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && !isAdding && <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl border border-dashed">No projects found. Add one!</div>}
        </div>
      )}
    </div>
  )
}
