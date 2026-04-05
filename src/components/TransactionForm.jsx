// Controlled form for add/edit — validates before calling onSubmit; converts date input to ISO for the store.
import React, { useMemo, useState } from 'react'

function toDateInputValue(iso) {
  // YYYY-MM-DD for <input type="date">
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromDateInputValue(value) {
  const d = new Date(value)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

export function TransactionForm({ initial, categories, onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type ?? 'expense')
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? 'Misc')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [amount, setAmount] = useState(String(initial?.amount ?? ''))
  const [date, setDate] = useState(
    initial?.date ? toDateInputValue(initial.date) : toDateInputValue(new Date().toISOString()),
  )

  // useMemo — derive error list from fields without storing duplicate state.
  const errors = useMemo(() => {
    const errs = []
    if (!description.trim()) errs.push('Description is required.')
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) errs.push('Amount must be a positive number.')
    if (!date) errs.push('Date is required.')
    if (!category) errs.push('Category is required.')
    return errs
  }, [description, amount, date, category])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (errors.length > 0) return
    onSubmit({
      type,
      category,
      description: description.trim(),
      amount: Number(amount),
      date: fromDateInputValue(date),
    })
  }

  const field =
    'min-h-[44px] w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300 sm:min-h-0 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50'

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-3">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={field}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Description
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Grocery run, Rent, Salary"
          className={`${field} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Amount
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="e.g. 45"
            className={`${field} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          <ul className="list-disc pl-4">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-12 w-full touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:min-h-0 sm:w-auto sm:py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={errors.length > 0}
          className="min-h-12 w-full touch-manipulation rounded-lg bg-sky-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:w-auto sm:py-2"
        >
          Save
        </button>
      </div>
    </form>
  )
}
