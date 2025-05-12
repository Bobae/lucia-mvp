// src/components/CycleLogger.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CycleLogger({ userId }) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: supaError } = await supabase
      .from('cycle_logs')
      .insert([{ user_id: userId, start_date: date }])

    setLoading(false)
    if (supaError) {
      console.error(supaError)
      setError(supaError.message)
    } else {
      alert(`Period saved: ${data[0].start_date}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">Log Your Cycle</h2>

      <div>
        <label
          htmlFor="period-date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Period Start Date
        </label>
        <input
          type="date"
          id="period-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Log Period'}
      </button>
    </form>
  )
}
