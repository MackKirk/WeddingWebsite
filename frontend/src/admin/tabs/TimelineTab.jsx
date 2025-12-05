import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from '../../services/content'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

const TimelineTab = () => {
  const [events, setEvents] = useState([])
  const [editingEvent, setEditingEvent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getTimelineEvents()
      setEvents(response.data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching timeline events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteTimelineEvent(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Timeline Events</h2>
        <button
          onClick={() => {
            setEditingEvent(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false)
            setEditingEvent(null)
          }}
          onSave={fetchData}
        />
      )}

      <div className="space-y-4">
        {events.map((event) => {
          const timeStr = event.time
            ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            : ''
          return (
            <div
              key={event.id}
              className="p-4 border border-gold/20 rounded-lg bg-champagne/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-gold font-body font-medium mb-1">{timeStr}</div>
                  <h3 className="text-xl font-display text-dusty-rose">{event.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event)
                      setShowForm(true)
                    }}
                    className="text-gold hover:text-gold/80"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {event.description && (
                <p className="text-dusty-rose/70 font-body">{event.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EventForm = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    time: event?.time || '',
    title: event?.title || '',
    description: event?.description || '',
    icon: event?.icon || '',
    order: event?.order || 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (event) {
        await updateTimelineEvent(event.id, formData)
      } else {
        await createTimelineEvent(formData)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 border border-gold/30 rounded-lg bg-champagne/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <input
          type="text"
          placeholder="Icon (optional)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50"
          >
            <Save size={18} />
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default TimelineTab

