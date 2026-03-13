"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Booking } from '@/lib/types'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    bookings: 0,
    blogs: 0,
    testimonials: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      // Fetch counts
      const [{ count: bCount }, { count: plCount }, { count: tCount }, { data: recent }] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      setMetrics({
        bookings: bCount || 0,
        blogs: plCount || 0,
        testimonials: tCount || 0,
      })
      if (recent) setRecentBookings(recent)
      setLoading(false)
    }

    fetchDashboard()
  }, [])

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>

  const statCards = [
    { name: 'Total Bookings', value: metrics.bookings, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Blogs', value: metrics.blogs, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Testimonials', value: metrics.testimonials, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className={`mt-2 text-3xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</dd>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 mt-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                    <div className="text-sm text-gray-500">{booking.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'New' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No recent bookings</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
