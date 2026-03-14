"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { Loader2, Trash2, RefreshCcw } from 'lucide-react'
import { Booking } from '@/lib/types'

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
      if (error) throw error
      if (data) setBookings(data)
    } catch (err: unknown) {
      alert("Error fetching bookings: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      await fetchBookings()
    } catch (err: unknown) {
      alert("Error updating status: " + (err as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    
    setLoading(true)
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id)
      if (error) throw error
      await fetchBookings()
    } catch (err: unknown) {
      alert("Error deleting booking: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Manage Bookings</h3>
        <button onClick={fetchBookings} className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1.5 transition-colors">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service & Message</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{booking.name}</div>
                    <div className="text-sm text-gray-500">{booking.company}</div>
                    <div className="text-xs text-gray-500 mb-1">{booking.contact_number}</div>
                    <a href={`mailto:${booking.email}`} className="text-xs text-primary hover:underline">{booking.email}</a>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm font-medium text-gray-900 mb-1">{booking.service}</div>
                    <div className="text-sm text-gray-500 truncate" title={booking.message}>{booking.message || "No message provided."}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(booking.created_at), 'PPPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <select 
                        value={booking.status || 'New'} 
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ring-1 ring-inset cursor-pointer outline-none transition-all ${
                          booking.status === 'New' ? 'bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100' :
                          booking.status === 'Contacted' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 hover:bg-yellow-100' :
                          'bg-gray-50 text-gray-700 ring-gray-600/20 hover:bg-gray-100'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
