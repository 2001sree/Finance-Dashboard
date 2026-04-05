// Lightweight SVG line chart — no chart library; path built from balance series indices and scaled Y.
import React, { useMemo } from 'react'
import { Card } from './Card'
import { formatMoney } from '../utils/money'

function pathFromPoints(points, width, height, padding) {
  if (points.length === 0) return ''
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const scaleX = (x) =>
    padding +
    ((x - minX) / Math.max(1, maxX - minX)) * (width - padding * 2)
  const scaleY = (y) =>
    padding +
    (1 - (y - minY) / Math.max(1, maxY - minY)) * (height - padding * 2)

  const d = points
    .map((p, i) => {
      const X = scaleX(p.x)
      const Y = scaleY(p.y)
      return `${i === 0 ? 'M' : 'L'} ${X.toFixed(1)} ${Y.toFixed(1)}`
    })
    .join(' ')

  return { d, minY, maxY }
}

export function LineChart({ title, subtitle, series }) {
  const { d, minY, maxY, lastValue } = useMemo(() => {
    const points = series.map((p, idx) => ({ x: idx, y: p.balance }))
    const out = pathFromPoints(points, 520, 180, 18)
    const last = series.at(-1)?.balance ?? 0
    return { d: out.d, minY: out.minY ?? 0, maxY: out.maxY ?? 0, lastValue: last }
  }, [series])

  return (
    <Card
      title={title}
      subtitle={subtitle}
      right={
        <div className="text-left sm:text-right">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Latest
          </div>
          <div className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {formatMoney(lastValue)}
          </div>
        </div>
      }
    >
      {series.length < 2 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          Not enough data to draw a trend yet.
        </div>
      ) : (
        <div className="w-full min-w-0">
          <svg
            viewBox="0 0 520 180"
            preserveAspectRatio="xMidYMid meet"
            className="aspect-26/9 h-auto w-full max-h-50 min-h-30 sm:max-h-55"
            role="img"
            aria-label="Balance trend"
          >
            <defs>
              <linearGradient id="lineGlow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Baseline grid */}
            <rect
              x="0"
              y="0"
              width="520"
              height="180"
              fill="transparent"
            />
            <line x1="18" y1="150" x2="502" y2="150" stroke="#334155" strokeOpacity="0.3" />

            {/* Area fill under the line */}
            <path
              d={`${d} L 502 162 L 18 162 Z`}
              fill="url(#lineGlow)"
            />
            {/* Stroke path */}
            <path
              d={d}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Min/Max labels — quick scale context */}
            <text x="18" y="14" fontSize="10" fill="#94a3b8">
              {formatMoney(maxY)}
            </text>
            <text x="18" y="175" fontSize="10" fill="#94a3b8">
              {formatMoney(minY)}
            </text>
          </svg>
        </div>
      )}
    </Card>
  )
}
