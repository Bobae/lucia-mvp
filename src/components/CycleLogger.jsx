// src/components/CycleLogger.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getReflection } from '../lib/toneResponses'

export default function CycleLogger({ userId }) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)

  // cycle-logging fields
  const [cycleDay, setCycleDay] = useState('')
  const [moods, setMoods] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [note, setNote] = useState('')

  // Tone reflection state
  const [reflection, setReflection] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Helper for toggling selections
  const toggleSelection = (item, list, setter) =>
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Build payload with all form inputs
    const payload = {
      user_id: userId,
      start_date: date,
      cycle_day: cycleDay,
      moods,
      symptoms,
      journal_note: note,
    }

    // Insert into Supabase
    const { data, error: supaError } = await supabase
      .from('cycle_logs')
      .insert([payload])

    setLoading(false)
    if (supaError) {
      console.error(supaError)
      setError(supaError.message)
    } else {
      // Compute and store the tone reflection
      const text = getReflection({ cycleDay: Number(cycleDay), moods, symptoms })
      setReflection(text)

      // Optionally, clear the form
      setCycleDay('')
      setMoods([])
      setSymptoms([])
      setNote('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Log Your Cycle</h2>

      {/* Period Start Date */}
      <div>
        <label htmlFor="period-date" className="block text-sm font-medium text-gray-700 mb-2">
          Period Start Date
        </label>
        <input
          type="date"
          id="period-date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Cycle Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cycle Day</label>
        <input
          type="number"
          value={cycleDay}
          onChange={e => setCycleDay(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          placeholder="e.g. 14"
        />
      </div>

      {/* Moods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Moods</label>
        <div className="flex flex-wrap gap-2">
          {['anxious', 'low energy', 'irritable', 'motivated'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => toggleSelection(m, moods, setMoods)}
              className={`px-3 py-1 rounded-full border text-sm ${
                moods.includes(m) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
        <div className="flex flex-wrap gap-2">
          {['bloating', 'cramps', 'poor sleep', 'breast pain'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSelection(s, symptoms, setSymptoms)}
              className={`px-3 py-1 rounded-full border text-sm ${
                symptoms.includes(s) ? 'bg-pink-500 text-white' : 'bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          placeholder="Thoughts or observations…"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Log Entry'}
      </button>

      {/* Tone Reflection Display */}
      {reflection && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-800">
          {reflection}
        </div>
      )}
    </form>
  )
}
