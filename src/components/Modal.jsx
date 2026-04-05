// Accessible overlay — Escape closes; backdrop click closes; fixed positioning above page content.
import React, { useEffect } from 'react'

export function Modal({ title, isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-3">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <section className="relative max-h-[min(92dvh,720px)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-2xl border border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-soft sm:rounded-2xl sm:pb-4 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0 pr-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Press Esc to close.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 shrink-0 touch-manipulation rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 sm:min-h-0 sm:min-w-0 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          >
            ✕
          </button>
        </header>

        <div className="mt-3 min-w-0">{children}</div>
      </section>
    </div>
  )
}
