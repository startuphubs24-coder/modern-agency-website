"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
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

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Manage Bookings</h3>
        <button onClick={fetchBookings} className="text-sm text-primary hover:text-primary-hover font-medium">Refresh</button>
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
                    <div className="flex flex-col gap-2 relative z-50 overflow-visible">
                      <select 
                        value={booking.status || 'New'} 
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ring-1 ring-inset ${
                          booking.status === 'New' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          booking.status === 'Contacted' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                          'bg-gray-50 text-gray-700 ring-gray-600/20'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
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
