"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Trash2, Star } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  company: string
  review: string
  rating: number
  photo_url?: string
}

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({ client_name: '', company: '', review: '', rating: 5, photo_url: '' })
  const [uploading, setUploading] = useState(false)

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  useEffect(() => { fetchTestimonials() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    
    setUploading(true)
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
    
    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message)
      setUploading(false)
      return
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(fileName)
    if (data) {
      setNewTestimonial(prev => ({ ...prev, [fieldName]: data.publicUrl }))
    }
    setUploading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('testimonials').insert([newTestimonial])
      if (error) throw error
      setIsAdding(false)
      setNewTestimonial({ client_name: '', company: '', review: '', rating: 5, photo_url: '' })
      await fetchTestimonials()
    } catch (err: unknown) {
      alert("Error saving testimonial: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id)
        if (error) throw error
        await fetchTestimonials()
      } catch (err: unknown) {
        alert("Error deleting testimonial: " + (err as Error).message)
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow">
          <Plus className="w-4 h-4 mr-2" /> {isAdding ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Add New Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Client Name" className="border p-2 rounded w-full" value={newTestimonial.client_name} onChange={e => setNewTestimonial({...newTestimonial, client_name: e.target.value})} />
            <input placeholder="Company" className="border p-2 rounded w-full" value={newTestimonial.company} onChange={e => setNewTestimonial({...newTestimonial, company: e.target.value})} />
            <input required type="number" min="1" max="5" placeholder="Rating (1-5)" className="border p-2 rounded w-full" value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})} />
            
            <div className="md:col-span-1 border p-3 rounded bg-gray-50 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Client Photo (Upload or URL)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="file" accept="image/*" className="border p-1.5 rounded bg-white flex-1 text-sm text-gray-700" onChange={e => handleFileUpload(e, 'photo_url')} disabled={uploading} />
                <span className="flex items-center justify-center text-xs font-bold text-gray-500">OR</span>
                <input placeholder="Photo URL" className="border p-2 rounded flex-1 text-sm w-full" value={newTestimonial.photo_url} onChange={e => setNewTestimonial({...newTestimonial, photo_url: e.target.value})} />
              </div>
              {uploading && <div className="text-xs text-primary font-medium flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Uploading image...</div>}
              {newTestimonial.photo_url && !uploading && <div className="text-xs text-green-600 truncate">Selected: {newTestimonial.photo_url}</div>}
            </div>

            <textarea required placeholder="Review Text" className="border p-2 rounded w-full md:col-span-2" rows={3} value={newTestimonial.review} onChange={e => setNewTestimonial({...newTestimonial, review: e.target.value})} />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg" disabled={uploading}>Save Testimonial</button>
        </form>
      )}

      {loading ? <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />)}
              </div>
              <p className="text-gray-700 italic flex-1 mb-4">&quot;{testimonial.review}&quot;</p>
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 mr-2">{testimonial.client_name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-bold">{testimonial.client_name}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(testimonial.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && !isAdding && <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl border border-dashed">No testimonials yet.</div>}
        </div>
      )}
    </div>
  )
}
