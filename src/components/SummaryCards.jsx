// Three KPI tiles — receives pre-aggregated summary from App (computeSummary) for balance / income / expenses.
import React from 'react'
import { Card } from './Card'
import { formatMoney } from '../utils/money'

function Stat({ label, value, tone = 'neutral' }) {
  const toneClasses =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-300'
      : tone === 'negative'
        ? 'text-rose-600 dark:text-rose-300'
        : 'text-slate-900 dark:text-slate-50'

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`text-lg font-semibold sm:text-xl ${toneClasses}`}>{value}</div>
    </div>
  )
}

export function SummaryCards({ summary }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Total Balance" subtitle="Income minus expenses">
        <Stat
          label="Current"
          value={formatMoney(summary.balance)}
          tone={summary.balance >= 0 ? 'positive' : 'negative'}
        />
      </Card>
      <Card title="Income" subtitle="All incoming transactions">
        <Stat label="Total" value={formatMoney(summary.income)} tone="positive" />
      </Card>
      <Card title="Expenses" subtitle="All outgoing transactions">
        <Stat
          label="Total"
          value={formatMoney(summary.expenses)}
          tone="negative"
        />
      </Card>
    </div>
  )
}
