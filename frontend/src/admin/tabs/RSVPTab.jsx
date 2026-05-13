import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { getRSVPs } from '../../services/content'

function formatAttendanceDetail(attendanceJson) {
  if (!attendanceJson) return ''
  try {
    const arr = JSON.parse(attendanceJson)
    if (!Array.isArray(arr)) return ''
    return arr.map((a) => `${a.name}: ${a.attending ? 'Yes' : 'No'}`).join('; ')
  } catch {
    return ''
  }
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function buildRsvpCsv(rows) {
  const headers = [
    'id',
    'created_at',
    'guest_name',
    'email',
    'num_attendees',
    'per_person_attendance',
    'attendance_json',
    'dietary_restrictions',
    'song_request',
    'message',
  ]
  const lines = [headers.join(',')]
  for (const r of rows) {
    const line = [
      r.id,
      r.created_at,
      r.guest_name,
      r.email,
      r.num_attendees,
      formatAttendanceDetail(r.attendance_json),
      r.attendance_json || '',
      r.dietary_restrictions || '',
      r.song_request || '',
      r.message || '',
    ].map(escapeCsvField)
    lines.push(line.join(','))
  }
  return lines.join('\r\n')
}

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

  const handleExportCsv = () => {
    const csv = buildRsvpCsv(rsvps)
    const bom = '\uFEFF'
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const iso = new Date().toISOString()
    const stamp = `${iso.slice(0, 10)}_${iso.slice(11, 13)}-${iso.slice(14, 16)}-${iso.slice(17, 19)}`
    a.download = `rsvp-submissions-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-display text-dusty-rose tracking-wide">RSVP Submissions</h2>
          <p className="text-dusty-rose/70 font-body text-sm mt-2 max-w-xl">
            Export a CSV backup before changing the guest list or for your records. Includes every field
            stored at submit time.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={handleExportCsv}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-body font-semibold border border-gold/50 bg-champagne/40 text-dusty-rose hover:bg-champagne/70"
        >
          <Download size={18} />
          Export CSV
        </motion.button>
      </div>

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
                  Per person
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Food allergies
                </th>
                <th className="text-left py-3 px-4 font-body font-semibold text-dusty-rose">
                  Song request
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
                  <td className="py-3 px-4 font-body text-dusty-rose/70 text-sm max-w-xs">
                    {formatAttendanceDetail(rsvp.attendance_json) || '—'}
                  </td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">
                    {rsvp.dietary_restrictions || '-'}
                  </td>
                  <td className="py-3 px-4 font-body text-dusty-rose/70">
                    {rsvp.song_request || '-'}
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

