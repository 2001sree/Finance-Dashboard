import React, { useMemo, useState } from 'react'
// useFinance reads/writes shared state from React Context (requirement #7).
import { useFinance } from './context/FinanceContext.jsx'
// Pure helpers keep math out of JSX so tests and reuse stay easy.
import { useEffect } from 'react';

import {
  compareMonths,
  computeBalanceSeries,
  computeSummary,
  filterTransactions,
  groupExpensesByCategory,
  sortTransactions,
} from './utils/analytics'
import { SummaryCards } from './components/SummaryCards'
import { LineChart } from './components/LineChart'
import { SpendingPieChart } from './components/SpendingPieChart'
import { RoleAndThemeBar } from './components/RoleAndThemeBar'
import { TransactionsPanel } from './components/TransactionsPanel'
import { InsightsPanel } from './components/InsightsPanel'

export default function App() {
  // Pull everything the dashboard needs from context in one place.
  const {
    transactions,
    filters,
    setFilters,
    resetFilters,
    role,
    setRole,
    ui,
    setDarkMode,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetData,
  } = useFinance()

  // activeTab is local UI state: which nav section is visible (not persisted).
  const [activeTab, setActiveTab] = useState('dashboard')

  // Derived data recomputes only when transactions or filters change — avoids extra work each render.
  const derived = useMemo(() => {
    const filtered = filterTransactions(transactions, filters)
    const sorted = sortTransactions(filtered, filters.sort)
    const summary = computeSummary(filtered)
    const series = computeBalanceSeries(sorted)
    const breakdown = groupExpensesByCategory(filtered)
    const monthCompare = compareMonths(filtered)
    return { filtered, sorted, summary, series, breakdown, monthCompare }
  }, [transactions, filters])

  return (
    // Full-height column background comes from body; this ensures inner layout can grow.
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Centered content column with responsive horizontal padding. */}
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
        {/* Requirement #1 — header row: title + role/theme controls. */}
        <header className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50">
              Finance Dashboard
            </h1>
          </div>
          <RoleAndThemeBar
            role={role}
            onRoleChange={setRole}
            darkMode={ui.darkMode}
            onDarkMode={setDarkMode}
          />
        </header>

        {/* Requirement #1 — primary navigation between main sections. */}
        <nav
          className="grid min-w-0 grid-cols-3 gap-2 sm:flex sm:flex-wrap"
          aria-label="Main"
        >
          {[
            { key: 'dashboard', label: 'Dashboard' },
            { key: 'transactions', label: 'Transactions' },
            { key: 'insights', label: 'Insights' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={[
                'min-h-11 touch-manipulation rounded-full px-2 py-2 text-center text-xs font-medium transition-all duration-200 ease-out sm:min-h-0 sm:px-4 sm:py-1.5 sm:text-sm',
                activeTab === t.key
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 sm:scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Main content switches by tab — keeps each view modular. */}
        <main className="flex min-w-0 flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {activeTab === 'dashboard' && (
            <div className="flex animate-fadeIn flex-col gap-4">
              {/* Requirement #3 — summary KPI cards. */}
              <SummaryCards summary={derived.summary} />

              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                {/* Requirement #3 — balance trend over time. */}
                <LineChart
                  title="Balance trend"
                  subtitle="Running balance from visible transactions (chronological)"
                  series={derived.series}
                />
                {/* Requirement #3 — category pie chart for spending. */}
                <SpendingPieChart items={derived.breakdown} />
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="animate-fadeIn">
              {/* Requirement #4 — list + search/filter/sort; #5 — role gates edits. */}
              <TransactionsPanel
                role={role}
                transactions={derived.sorted}
                filters={filters}
                onFiltersChange={setFilters}
                onResetFilters={resetFilters}
                onAdd={addTransaction}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
                onResetData={resetData}
              />
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="animate-fadeIn">
              {/* Requirement #6 — highlights + monthly comparison text. */}
              <InsightsPanel transactions={derived.filtered} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}