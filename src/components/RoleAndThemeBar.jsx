// Role selector (viewer vs admin) and dark-mode toggle — persists via Context + localStorage.
import React, { useEffect } from 'react'

export function RoleAndThemeBar({ role, onRoleChange, darkMode, onDarkMode }) {
  // Tailwind darkMode: 'class' — we toggle `dark` on <html> so `dark:` utilities apply app-wide.
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [darkMode])

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Role
        </span>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="min-h-11 w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300 sm:min-h-0 sm:w-auto sm:py-1 sm:text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          aria-label="Select role"
        >
          <option value="viewer">Viewer (read-only)</option>
          <option value="admin">Admin (can edit)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onDarkMode(!darkMode)}
        className="min-h-11 w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:min-h-0 sm:w-auto sm:py-1 sm:text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  )
}
