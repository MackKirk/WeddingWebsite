import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRSVPs } from '../../services/content'

const RSVPTab = () => {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getRSVPs()
      setRsvps(response.data)
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <h2 className="text-4xl font-display text-dusty-rose mb-10 tracking-wide">RSVP Submissions</h2>

      {rsvps.length === 0 ? (
        <div className="text-center py-12 text-dusty-rose/60 font-body">
          No RSVPs yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Attendees
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Dietary Restrictions
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Message
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="border-b border-gold/10 hover:bg-champagne/30">
                  <td className="py-3 px-4 font-body text-dusty-rose">{rsvp.guest_name}</td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">{rsvp.email}</td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">
                    {rsvp.num_attendees}
                  </td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">
                    {rsvp.dietary_restrictions || '-'}
                  </td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">
                    {rsvp.message || '-'}
                  </td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70 text-sm">
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RSVPTab

