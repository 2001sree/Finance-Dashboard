// Pure analytics helpers — used by App (charts/summary) and InsightsPanel; no React imports so logic stays reusable.
import { signedAmount } from './money'

export function sortTransactions(transactions, sort) {
  const copy = [...transactions]
  copy.sort((a, b) => {
    const ad = new Date(a.date).getTime()
    const bd = new Date(b.date).getTime()
    if (sort === 'date_desc') return bd - ad
    if (sort === 'date_asc') return ad - bd
    if (sort === 'amount_desc') return b.amount - a.amount
    if (sort === 'amount_asc') return a.amount - b.amount
    return bd - ad
  })
  return copy
}

export function filterTransactions(transactions, filters) {
  const q = filters.query.trim().toLowerCase()
  return transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category)
      return false

    if (q) {
      const inDesc = (t.description ?? '').toLowerCase().includes(q)
      const inCat = (t.category ?? '').toLowerCase().includes(q)
      const inType = (t.type ?? '').toLowerCase().includes(q)
      if (!inDesc && !inCat && !inType) return false
    }
    return true
  })
}

export function computeSummary(transactions) {
  let income = 0
  let expenses = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expenses += t.amount
  }
  const balance = income - expenses
  return { balance, income, expenses }
}

export function groupExpensesByCategory(transactions) {
  const map = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

// Running balance over chronological order — feeds the SVG line chart.
export function computeBalanceSeries(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  let running = 0
  const points = sorted.map((t) => {
    running += signedAmount(t)
    return { date: t.date, balance: running }
  })
  return points
}

export function monthKey(iso) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function compareMonths(transactions) {
  // Bucket by calendar month, then compare the last two months that appear in the filtered data.
  const byMonth = new Map()
  for (const t of transactions) {
    const key = monthKey(t.date)
    const current = byMonth.get(key) ?? { income: 0, expenses: 0 }
    if (t.type === 'income') current.income += t.amount
    else current.expenses += t.amount
    byMonth.set(key, current)
  }

  const months = Array.from(byMonth.keys()).sort()
  const latest = months.at(-1)
  const previous = months.at(-2)
  if (!latest) return null
  return {
    latest: { key: latest, ...byMonth.get(latest) },
    previous: previous ? { key: previous, ...byMonth.get(previous) } : null,
  }
}
