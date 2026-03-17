"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { HeroBanner } from '@/lib/types'

export default function ManageHero() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchBanners = async () => {
    setLoading(true)
    const { data } = await supabase.from('hero_banners').select('*').order('created_at', { ascending: false })
    if (data) setBanners(data)
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `hero_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    
    setUploading(true)
    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      if (data && data.publicUrl) {
        // Upload successful, add to database
        const { error: insertError } = await supabase.from('hero_banners').insert([{ 
          image_url: data.publicUrl, 
          is_active: banners.length === 0, 
          text_color: '#1e3a8a',
          secondary_text_color: '#ec4899',
          accent_text_color: '#1e3a8a'
        }])
        
        if (insertError) throw insertError
        
        await fetchBanners()
      } else {
        throw new Error("Could not generate public URL")
      }
    } catch (err: unknown) {
      alert('Upload failed: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, isActive: boolean) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      setLoading(true)
      try {
        const { error } = await supabase.from('hero_banners').delete().eq('id', id)
        if (error) throw error
        
        // If deleted active banner, let's try to make another one active if possible
        if (isActive) {
          const remaining = banners.filter(b => b.id !== id)
          if (remaining.length > 0) {
            await handleSetActive(remaining[0].id)
          } else {
            await fetchBanners()
          }
        } else {
           await fetchBanners()
        }
      } catch (err: unknown) {
        alert("Error deleting banner: " + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSetActive = async (id: string) => {
    setLoading(true)
    try {
      // 1. Deactivate all active banners
      const { error: deactivateError } = await supabase
        .from('hero_banners')
        .update({ is_active: false })
        .eq('is_active', true)
      
      if (deactivateError) throw deactivateError

      // 2. Activate the selected one
      const { error: activateError } = await supabase
        .from('hero_banners')
        .update({ is_active: true })
        .eq('id', id)
      
      if (activateError) throw activateError

      await fetchBanners()
    } catch (err: unknown) {
      alert("Error setting active banner: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (id: string, color: string, field: 'text_color' | 'secondary_text_color' | 'accent_text_color') => {
    setBanners(banners.map(b => b.id === id ? { ...b, [field]: color } : b))
  }

  const saveColor = async (id: string, color: string, field: 'text_color' | 'secondary_text_color' | 'accent_text_color') => {
    try {
      const { error } = await supabase.from('hero_banners').update({ [field]: color }).eq('id', id)
      if (error) throw error
    } catch (err: unknown) {
      alert("Error saving color: " + (err as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section Manager</h2>
          <p className="text-gray-500 text-sm mt-1">Upload and manage the background banner image for the homepage hero section.</p>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            id="banner-upload"
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={uploading} 
          />
          <label 
            htmlFor="banner-upload"
            className={`cursor-pointer bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-all ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
            {uploading ? 'Uploading...' : 'Upload New Banner'}
          </label>
        </div>
      </div>

      {loading && !uploading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className={`bg-white rounded-xl border-2 transition-all shadow-sm overflow-hidden flex flex-col ${banner.is_active ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
              
              <div className="relative h-48 bg-gray-100 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.image_url} alt="Banner Preview" className="w-full h-full object-cover" />
                 
                 {/* Overlay preview button */}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-sm font-medium flex items-center bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Preview
                    </span>
                 </div>

                 {banner.is_active && (
                   <div className="absolute top-3 right-3 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center">
                     <CheckCircle className="w-4 h-4 mr-1.5" /> Active Banner
                   </div>
                 )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-3 bg-gray-50/50">
                 {!banner.is_active ? (
                   <button 
                     onClick={() => handleSetActive(banner.id)} 
                     className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                   >
                     Set as Active Banner
                   </button>
                 ) : (
                   <div className="w-full bg-primary/10 text-primary py-2 rounded-lg text-sm font-semibold flex items-center justify-center border border-primary/20">
                     Currently Displaying on Homepage
                   </div>
                 )}

                 <div className="space-y-3 border-t border-gray-200 pt-3 mt-1">
                   {/* Color 1: Primary Heading */}
                   <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <label className="text-xs text-gray-700 font-bold uppercase tracking-wider">Primary Text</label>
                       <span className="text-[10px] text-gray-400">Heading Line 1</span>
                     </div>
                     <input 
                       type="color" 
                       value={banner.text_color || '#1e3a8a'} 
                       onChange={(e) => handleColorChange(banner.id, e.target.value, 'text_color')}
                       onBlur={(e) => saveColor(banner.id, e.target.value, 'text_color')}
                       className="w-8 h-8 rounded-lg cursor-pointer border shadow-sm p-0 overflow-hidden"
                     />
                   </div>

                   {/* Color 2: Secondary Heading */}
                   <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <label className="text-xs text-gray-700 font-bold uppercase tracking-wider">Secondary Text</label>
                       <span className="text-[10px] text-gray-400">Heading Line 2</span>
                     </div>
                     <input 
                       type="color" 
                       value={banner.secondary_text_color || '#ec4899'} 
                       onChange={(e) => handleColorChange(banner.id, e.target.value, 'secondary_text_color')}
                       onBlur={(e) => saveColor(banner.id, e.target.value, 'secondary_text_color')}
                       className="w-8 h-8 rounded-lg cursor-pointer border shadow-sm p-0 overflow-hidden"
                     />
                   </div>

                   {/* Color 3: Accent/Paragraph */}
                   <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <label className="text-xs text-gray-700 font-bold uppercase tracking-wider">Accent Text</label>
                       <span className="text-[10px] text-gray-400">Paragraph/Subtitle</span>
                     </div>
                     <input 
                       type="color" 
                       value={banner.accent_text_color || '#1e3a8a'} 
                       onChange={(e) => handleColorChange(banner.id, e.target.value, 'accent_text_color')}
                       onBlur={(e) => saveColor(banner.id, e.target.value, 'accent_text_color')}
                       className="w-8 h-8 rounded-lg cursor-pointer border shadow-sm p-0 overflow-hidden"
                     />
                   </div>
                 </div>

                 <button 
                   onClick={() => handleDelete(banner.id, banner.is_active)} 
                   className="text-red-500 hover:text-red-700 flex items-center justify-center text-sm py-2 hover:bg-red-50 rounded-lg transition-colors mt-2 border border-transparent"
                 >
                   <Trash2 className="w-4 h-4 mr-1.5" /> Delete Image
                 </button>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No banners found</h3>
              <p className="text-sm">Upload your first hero banner image above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
