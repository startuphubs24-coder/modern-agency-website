"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Blog } from '@/lib/types'

export default function ManageBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', content: '', thumbnail: '', tags: '', published: true })
  const [uploading, setUploading] = useState(false)

  const fetchBlogs = async () => {
    setLoading(true)
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    if (data) setBlogs(data)
    setLoading(false)
  }

  useEffect(() => { fetchBlogs() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `blog_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    
    setUploading(true)
    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      if (data && data.publicUrl) {
        setNewBlog(prev => ({ ...prev, [fieldName]: data.publicUrl }))
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
    const { error } = await supabase.from('blogs').insert([{ ...newBlog, tags: newBlog.tags.split(',').map(t=>t.trim()) }])
    if (!error) {
      setIsAdding(false)
      setNewBlog({ title: '', content: '', thumbnail: '', tags: '', published: true })
      fetchBlogs()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('blogs').delete().eq('id', id)
      fetchBlogs()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow">
          <Plus className="w-4 h-4 mr-2" /> {isAdding ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Create New Post</h3>
          <div className="grid grid-cols-1 gap-4">
            <input required placeholder="Post Title" className="border p-2 rounded w-full" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
            <input placeholder="Tags (comma separated)" className="border p-2 rounded w-full" value={newBlog.tags} onChange={e => setNewBlog({...newBlog, tags: e.target.value})} />
            
            <div className="border p-3 rounded bg-gray-50 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Thumbnail Image (Upload or URL)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="file" accept="image/*" className="border p-1.5 rounded bg-white flex-1 text-sm text-gray-700" onChange={e => handleFileUpload(e, 'thumbnail')} disabled={uploading} />
                <span className="flex items-center justify-center text-xs font-bold text-gray-500">OR</span>
                <input placeholder="Thumbnail URL" className="border p-2 rounded flex-1 text-sm w-full" value={newBlog.thumbnail} onChange={e => setNewBlog({...newBlog, thumbnail: e.target.value})} />
              </div>
              {uploading && <div className="text-xs text-primary font-medium flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Uploading image...</div>}
              {newBlog.thumbnail && !uploading && <div className="text-xs text-green-600 truncate">Selected: {newBlog.thumbnail}</div>}
            </div>

            <textarea required placeholder="Content (HTML allowed)" className="border p-2 rounded w-full font-mono text-sm" rows={10} value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} />
            <div className="flex items-center">
              <input type="checkbox" id="published" checked={newBlog.published} onChange={e => setNewBlog({...newBlog, published: e.target.checked})} className="mr-2" />
              <label htmlFor="published">Publish immediately</label>
            </div>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg" disabled={uploading}>Publish Post</button>
        </form>
      )}

      {loading ? <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${blog.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && !isAdding && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No blog posts found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
