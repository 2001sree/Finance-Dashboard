/**
 * Pie chart for expense breakdown (requirement #3 — category-based chart).
 * Pure SVG: no chart library, easy to read and tweak.
 */
import React, { useMemo } from 'react'
import { Card } from './Card'
import { formatMoney } from '../utils/money'

/** Distinct slice colors (cycles if there are many categories). */
const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#14b8a6', '#6366f1']

/**
 * Converts degrees to radians (SVG arcs use radians internally in some APIs; here we use cos/sin with radians).
 */
function degToRad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Builds an SVG path for one pie slice from center (cx,cy), radius r, start/end angles in degrees (0° = 3 o'clock; we offset so 0 starts at top).
 */
function slicePath(cx, cy, r, startDeg, endDeg) {
  const start = degToRad(startDeg - 90)
  const end = degToRad(endDeg - 90)
  const x1 = cx + r * Math.cos(start)
  const y1 = cy + r * Math.sin(start)
  const x2 = cx + r * Math.cos(end)
  const y2 = cy + r * Math.sin(end)
  const sweep = endDeg - startDeg
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export function SpendingPieChart({ items }) {
  // Precompute total spend and top category for the card header.
  const { total, top, slices } = useMemo(() => {
    const t = items.reduce((sum, i) => sum + i.amount, 0)
    const first = items[0] ?? null
    if (t <= 0 || items.length === 0) {
      return { total: 0, top: null, slices: [] }
    }

    // One category with ~100%: draw a full circle (single arc cannot be 360° cleanly).
    if (items.length === 1) {
      return {
        total: t,
        top: first,
        slices: [
          {
            category: items[0].category,
            amount: items[0].amount,
            color: COLORS[0],
            path: null,
            full: true,
          },
        ],
      }
    }

    let angle = 0
    const built = items.map((item, idx) => {
      const sweep = (item.amount / t) * 360
      const start = angle
      const end = angle + sweep
      angle = end
      return {
        category: item.category,
        amount: item.amount,
        color: COLORS[idx % COLORS.length],
        path: slicePath(100, 100, 90, start, end),
        full: false,
      }
    })
    return { total: t, top: first, slices: built }
  }, [items])

  return (
    <Card
      title="Spending by category"
      subtitle="Pie chart of expenses (filtered data)"
      right={
        top ? (
          <div className="text-left transition-opacity duration-300 sm:text-right">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Top category
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {top.category}
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 || total <= 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          No expense data to chart yet. Add expenses or adjust filters.
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="mx-auto shrink-0 transition-transform duration-300 ease-out hover:scale-[1.02] sm:mx-0">
            <svg
              viewBox="0 0 200 200"
              className="mx-auto h-40 w-40 max-w-[min(100%,11rem)] sm:h-44 sm:w-44"
              role="img"
              aria-label="Spending breakdown pie chart"
            >
              {slices.map((s, i) =>
                s.full ? (
                  <circle
                    key={s.category}
                    cx={100}
                    cy={100}
                    r={90}
                    fill={s.color}
                    opacity={0.92}
                  />
                ) : (
                  <path
                    key={`${s.category}-${i}`}
                    d={s.path}
                    fill={s.color}
                    stroke="white"
                    strokeWidth="1"
                    className="dark:stroke-slate-900"
                    opacity={0.92}
                  />
                ),
              )}
            </svg>
          </div>

          <ul className="w-full min-w-0 flex-1 space-y-2 text-sm">
            {slices.map((s, idx) => {
              const pct = total > 0 ? (s.amount / total) * 100 : 0
              return (
                <li
                  key={`${s.category}-${idx}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: s.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-slate-800 dark:text-slate-100">
                      {s.category}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {formatMoney(s.amount)}{' '}
                    <span className="text-slate-400">({pct.toFixed(0)}%)</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Card>
  )
}
