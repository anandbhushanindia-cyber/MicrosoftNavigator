import React from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { NavigatorPage } from './pages/NavigatorPage'
import { QuestionsTablePage } from './pages/QuestionsTablePage'

function App() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <div className="text-sm font-semibold text-slate-700">Microsoft Navigator</div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Navigator
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Questions
            </NavLink>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<NavigatorPage />} />
        <Route path="/questions" element={<QuestionsTablePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
