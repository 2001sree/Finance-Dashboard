// Narrative insights — recomputes category breakdown and month-over-month deltas from filtered transactions.
import React, { useMemo } from 'react'
import { Card } from './Card'
import { formatMoney } from '../utils/money'
import { compareMonths, groupExpensesByCategory } from '../utils/analytics'

function pctChange(current, previous) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function InsightsPanel({ transactions }) {
  const insights = useMemo(() => {
    const breakdown = groupExpensesByCategory(transactions)
    const top = breakdown[0] ?? null
    const monthCompare = compareMonths(transactions)
    return { breakdown, top, monthCompare }
  }, [transactions])

  const latest = insights.monthCompare?.latest
  const prev = insights.monthCompare?.previous

  const expenseDelta =
    latest && prev ? pctChange(latest.expenses, prev.expenses) : null
  const incomeDelta = latest && prev ? pctChange(latest.income, prev.income) : null

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Key Insights" subtitle="A few useful observations from your data">
        <div className="space-y-3 text-sm">
          {insights.top ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Highest spending category
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <div className="font-semibold text-slate-900 dark:text-slate-50">
                  {insights.top.category}
                </div>
                <div className="font-semibold text-rose-700 dark:text-rose-300">
                  {formatMoney(insights.top.amount)}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Add an expense transaction to see category insights.
            </div>
          )}

          {latest ? (
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Monthly comparison
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Latest month ({latest.key})
                  </div>
                  <div className="mt-1 text-xs text-slate-700 dark:text-slate-200">
                    Income: <span className="font-semibold">{formatMoney(latest.income)}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">
                    Expenses:{' '}
                    <span className="font-semibold">{formatMoney(latest.expenses)}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Previous month ({prev?.key ?? '—'})
                  </div>
                  <div className="mt-1 text-xs text-slate-700 dark:text-slate-200">
                    Income: <span className="font-semibold">{formatMoney(prev?.income ?? 0)}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">
                    Expenses:{' '}
                    <span className="font-semibold">{formatMoney(prev?.expenses ?? 0)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  Income change:{' '}
                  <span className="font-semibold">
                    {incomeDelta == null ? '—' : `${incomeDelta.toFixed(0)}%`}
                  </span>
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  Expense change:{' '}
                  <span className="font-semibold">
                    {expenseDelta == null ? '—' : `${expenseDelta.toFixed(0)}%`}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Not enough data to compute monthly comparisons yet.
            </div>
          )}
        </div>
      </Card>

      <Card title="Spending Notes" subtitle="Small helpful heuristics">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <li className="wrap-break-word rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            If your <span className="font-semibold">top category</span> is stable, you may have a predictable budget.
          </li>
          <li className="wrap-break-word rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            Try filtering by <span className="font-semibold">Expense</span> and sorting by <span className="font-semibold">Amount (high to low)</span> to spot big-ticket items quickly.
          </li>
          <li className="wrap-break-word rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            Use the <span className="font-semibold">Admin</span> role to add recurring bills so your trend becomes more accurate.
          </li>
        </ul>
      </Card>
    </div>
  )
}
