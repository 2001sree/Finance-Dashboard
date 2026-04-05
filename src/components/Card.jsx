// Reusable panel shell — shared border, title, optional subtitle, and optional right slot (actions/summary).
import React from 'react'

export function Card({ title, subtitle, children, right }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:p-4 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:max-w-[42ch]">
              {subtitle}
            </p>
          )}
        </div>
        {right ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {right}
          </div>
        ) : null}
      </header>
      <div className="mt-3 min-w-0">{children}</div>
    </section>
  )
}
