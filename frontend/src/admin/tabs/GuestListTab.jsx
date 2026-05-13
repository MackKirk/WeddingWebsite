import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, Sparkles } from 'lucide-react'
import {
  previewGuestListParse,
  replaceGuestInvitations,
  getGuestInvitations,
} from '../../services/content'

const mapApiRows = (list) =>
  (list || []).map((r) => ({
    display_label: r.display_label,
    participants: [...(r.participants || [])],
  }))

const GuestListTab = () => {
  const [pasteText, setPasteText] = useState('')
  const [rows, setRows] = useState([])
  const [saving, setSaving] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  const loadCurrentList = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await getGuestInvitations()
      const mapped = mapApiRows(res.data)
      setRows(mapped)
      setPasteText(mapped.map((r) => r.display_label).join('\n'))
    } catch (e) {
      console.error(e)
      alert('Could not load the current guest list.')
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    loadCurrentList()
  }, [loadCurrentList])

  const handleAnalyze = async () => {
    if (!pasteText.trim()) return
    setParsing(true)
    try {
      const res = await previewGuestListParse({ text: pasteText })
      setRows(mapApiRows(res.data.rows))
    } catch (e) {
      console.error(e)
      alert('Failed to parse preview')
    } finally {
      setParsing(false)
    }
  }

  const updateRowLabel = (index, value) => {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], display_label: value }
      return next
    })
  }

  const updateParticipant = (rowIndex, pIndex, value) => {
    setRows((prev) => {
      const next = [...prev]
      const parts = [...next[rowIndex].participants]
      parts[pIndex] = value
      next[rowIndex] = { ...next[rowIndex], participants: parts }
      return next
    })
  }

  const addParticipant = (rowIndex) => {
    setRows((prev) => {
      const next = [...prev]
      next[rowIndex] = {
        ...next[rowIndex],
        participants: [...next[rowIndex].participants, ''],
      }
      return next
    })
  }

  const removeParticipant = (rowIndex, pIndex) => {
    setRows((prev) => {
      const next = [...prev]
      const parts = next[rowIndex].participants.filter((_, i) => i !== pIndex)
      next[rowIndex] = { ...next[rowIndex], participants: parts.length ? parts : [''] }
      return next
    })
  }

  const handleSave = async () => {
    const invitations = rows
      .filter((r) => r.display_label.trim())
      .map((r) => ({
        display_label: r.display_label.trim(),
        participants: r.participants.map((p) => p.trim()).filter(Boolean),
      }))
      .filter((r) => r.participants.length > 0)

    if (!invitations.length) {
      alert('Add at least one invitation with a name and participants.')
      return
    }
    if (
      !confirm(
        `Save ${invitations.length} invitations and replace the current list?\n\n` +
          'Past RSVPs keep the names and Yes/No answers from when guests submitted; only this autocomplete list changes.'
      )
    )
      return

    setSaving(true)
    try {
      await replaceGuestInvitations({ invitations })
      alert('Guest list saved.')
      await loadCurrentList()
    } catch (e) {
      console.error(e)
      const msg =
        e?.response?.data?.detail ||
        (typeof e?.response?.data === 'string' ? e.response.data : null) ||
        e?.message ||
        'Failed to save guest list'
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <h2 className="text-4xl font-display text-dusty-rose mb-4 tracking-wide">Guest list (RSVP)</h2>
      <p className="text-dusty-rose/70 font-body mb-8 max-w-3xl">
        The list below loads what is already saved. You can edit rows directly, paste a new list and use
        Analyze to replace the review grid, or Save to update the database. The saved list powers RSVP
        autocomplete only. Each RSVP submission stores the invitation line and attendance as text at submit
        time — it is not tied to this list by ID, so you can change the list later without altering past
        RSVPs.
      </p>

      {loadingList ? (
        <p className="text-dusty-rose/80 font-body mb-8">Loading guest list…</p>
      ) : null}

      <div className={`mb-8 ${loadingList ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="block text-dusty-rose font-body font-medium mb-2">Paste guest list</label>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white font-body text-dusty-rose"
          placeholder="One line per invitation"
        />
        <motion.button
          type="button"
          onClick={handleAnalyze}
          disabled={parsing || !pasteText.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 flex items-center gap-2 px-6 py-3 bg-gold/20 text-dusty-rose rounded-xl font-body font-semibold border border-gold/40 disabled:opacity-50"
        >
          <Sparkles size={18} />
          {parsing ? 'Analyzing…' : 'Analyze'}
        </motion.button>
      </div>

      {!loadingList && rows.length === 0 && (
        <p className="text-dusty-rose/60 font-body mb-6">No invitations yet. Paste a list below and click Analyze.</p>
      )}

      {!loadingList && rows.length > 0 && (
        <>
          <h3 className="text-2xl font-display text-dusty-rose mb-4">Review & edit</h3>
          <div className="space-y-6">
            {rows.map((row, ri) => (
              <div key={ri} className="p-4 rounded-xl border border-gold/30 bg-champagne/30">
                <label className="block text-sm font-body text-dusty-rose/80 mb-1">Display line</label>
                <input
                  type="text"
                  value={row.display_label}
                  onChange={(e) => updateRowLabel(ri, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white/80 font-body mb-3"
                />
                <div className="flex flex-wrap gap-2 items-end">
                  {row.participants.map((p, pi) => (
                    <div key={pi} className="flex gap-1 items-center">
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => updateParticipant(ri, pi, e.target.value)}
                        placeholder={`Guest ${pi + 1}`}
                        className="w-48 px-3 py-2 rounded-lg border border-gold/40 bg-white/80 font-body text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeParticipant(ri, pi)}
                        className="text-dusty-rose/60 hover:text-red-600 text-sm px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addParticipant(ri)}
                    className="text-sm text-gold font-medium hover:underline"
                  >
                    + Add person
                  </button>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-xl font-body font-semibold shadow-lg disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving…' : 'Save guest list'}
          </motion.button>
        </>
      )}
    </div>
  )
}

export default GuestListTab
