// Filters + sortable table + modals for CRUD — `role` gates edit actions so viewer stays read-only.
import React, { useMemo, useState } from 'react'
import { Card } from './Card'
import { Modal } from './Modal'
import { TransactionForm } from './TransactionForm'
import { formatMoney } from '../utils/money'

function uniqCategories(transactions) {
  const set = new Set(transactions.map((t) => t.category))
  return Array.from(set).sort()
}

export function TransactionsPanel({
  role,
  transactions,
  filters,
  onFiltersChange,
  onResetFilters,
  onAdd,
  onUpdate,
  onDelete,
  onResetData,
}) {
  const categories = useMemo(() => uniqCategories(transactions), [transactions])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editTxn, setEditTxn] = useState(null)

  const canEdit = role === 'admin'

  const openAdd = () => {
    if (!canEdit) return
    setIsAddOpen(true)
  }

  const openEdit = (txn) => {
    if (!canEdit) return
    setEditTxn(txn)
  }

  const inputClass =
    'mt-1 min-h-[44px] w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300 sm:min-h-0 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500'

  const selectClass =
    'mt-1 min-h-[44px] w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300 sm:min-h-0 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50'

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card
        title="Transactions"
        subtitle="Search, filter and sort your activity"
        right={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={openAdd}
                  className="min-h-11 w-full touch-manipulation rounded-lg bg-sky-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 sm:w-auto sm:py-1.5 sm:text-xs"
                >
                  + Add
                </button>
                <button
                  type="button"
                  onClick={onResetData}
                  className="min-h-11 w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:py-1.5 sm:text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Reset data
                </button>
              </>
            )}
          </div>
        }
      >
        {/* Controlled inputs — each change merges into context filters via onFiltersChange */}
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Search
            </label>
            <input
              value={filters.query}
              onChange={(e) => onFiltersChange({ query: e.target.value })}
              placeholder="Try: groceries, rent, income…"
              className={inputClass}
            />
          </div>

          <div className="min-w-0">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFiltersChange({ type: e.target.value })}
              className={selectClass}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="min-w-0">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ category: e.target.value })}
              className={selectClass}
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Sort
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onFiltersChange({ sort: e.target.value })}
              className="min-h-11 w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300 sm:min-h-0 sm:w-auto sm:px-2 sm:py-1.5 sm:text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            >
              <option value="date_desc">Date (newest)</option>
              <option value="date_asc">Date (oldest)</option>
              <option value="amount_desc">Amount (high to low)</option>
              <option value="amount_asc">Amount (low to high)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-11 touch-manipulation text-left text-sm font-medium text-slate-600 hover:text-sky-600 sm:min-h-0 sm:text-xs dark:text-slate-300 dark:hover:text-sky-300"
          >
            Reset filters
          </button>
        </div>
      </Card>

      <Card
        title="Activity"
        subtitle={canEdit ? 'Tap a card or row to edit.' : 'Viewer mode: read-only.'}
      >
        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No transactions found for these filters.
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards (no horizontal scroll). */}
            <ul className="min-w-0 space-y-3 md:hidden">
              {transactions.map((t) => (
                <li
                  key={t.id}
                  className={[
                    'rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50',
                    canEdit ? 'cursor-pointer active:bg-slate-100 dark:active:bg-slate-800/60' : '',
                  ].join(' ')}
                  onClick={() => openEdit(t)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 wrap-break-word font-medium text-slate-900 dark:text-slate-50">
                      {t.description || '—'}
                    </p>
                    <p
                      className={[
                        'shrink-0 tabular-nums text-sm font-semibold',
                        t.type === 'income'
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-rose-700 dark:text-rose-300',
                      ].join(' ')}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatMoney(t.amount)}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <time dateTime={t.date}>
                      {new Date(t.date).toLocaleDateString()}
                    </time>
                    <span aria-hidden className="text-slate-300 dark:text-slate-600">
                      ·
                    </span>
                    <span className="max-w-[50%] truncate">{t.category}</span>
                    <span
                      className={[
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                        t.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
                      ].join(' ')}
                    >
                      {t.type}
                    </span>
                  </div>
                  {canEdit && (
                    <div className="mt-3 flex justify-end border-t border-slate-200 pt-3 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(t.id)
                        }}
                        className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Tablet/desktop: full table with horizontal scroll only when needed. */}
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="w-full min-w-160 text-left text-sm">
                <thead className="text-xs text-slate-500 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2 pr-2">Date</th>
                    <th className="py-2 pr-2">Description</th>
                    <th className="py-2 pr-2">Category</th>
                    <th className="py-2 pr-2">Type</th>
                    <th className="py-2 pr-2 text-right">Amount</th>
                    {canEdit && <th className="py-2 pl-2 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => openEdit(t)}
                      className={[
                        'border-b border-slate-100 dark:border-slate-800',
                        canEdit
                          ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          : '',
                      ].join(' ')}
                    >
                      <td className="py-2 pr-2 whitespace-nowrap text-slate-700 dark:text-slate-200">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="max-w-48 py-2 pr-2 wrap-break-word text-slate-900 dark:text-slate-50">
                        {t.description}
                      </td>
                      <td className="py-2 pr-2 text-slate-700 dark:text-slate-200">
                        {t.category}
                      </td>
                      <td className="py-2 pr-2">
                        <span
                          className={[
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            t.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
                          ].join(' ')}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={[
                          'py-2 pr-2 text-right font-semibold whitespace-nowrap tabular-nums',
                          t.type === 'income'
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-rose-700 dark:text-rose-300',
                        ].join(' ')}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatMoney(t.amount)}
                      </td>
                      {canEdit && (
                        <td className="py-2 pl-2 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(t.id)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Modal title="Add transaction" isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <TransactionForm
          categories={categories.length > 0 ? categories : ['Groceries', 'Rent', 'Utilities']}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={(values) => {
            const id = `t-${Date.now()}`
            onAdd({ id, ...values })
            setIsAddOpen(false)
          }}
        />
      </Modal>

      <Modal title="Edit transaction" isOpen={Boolean(editTxn)} onClose={() => setEditTxn(null)}>
        {editTxn && (
          <TransactionForm
            initial={editTxn}
            categories={categories.length > 0 ? categories : [editTxn.category]}
            onCancel={() => setEditTxn(null)}
            onSubmit={(values) => {
              onUpdate(editTxn.id, values)
              setEditTxn(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}
