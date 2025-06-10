// src/App.jsx
import './styles/index.css'
import React from 'react'
import CycleLogger from './components/CycleLogger.jsx'

// For now you can hard-code a test UUID until you wire up Auth:
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <CycleLogger userId={TEST_USER_ID} />
      </div>
    </div>
  )
}
