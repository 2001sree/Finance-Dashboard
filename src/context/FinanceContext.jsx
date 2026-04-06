/**
 * FinanceContext — holds transactions, filters, role, and theme.
 * Requirement #7: React Context API instead of a third-party store (readable, easy to follow).
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { seedTransactions } from 'src/data/seedTransactions.js'
import { STORAGE_KEYS, loadJson, saveJson } from 'src/utils/storage.js'

/** Default role: Viewer cannot edit transactions (requirement #5). */
const initialRole = 'viewer'

/** UI flags persisted to localStorage (optional dark mode). */
const initialUi = { darkMode: false }

/** Default filter shape used by the Transactions view (requirement #4). */
export const initialFilters = {
  query: '',
  type: 'all',
  category: 'all',
  sort: 'date_desc',
}

/**
 * Normalizes one transaction so amount is always a number and description is a string.
 * Keeps localStorage and the UI consistent even if data is hand-edited.
 */
function normalizeTxn(txn) {
  return {
    id: txn.id,
    date: txn.date,
    type: txn.type,
    category: txn.category,
    description: txn.description ?? '',
    amount: Number(txn.amount ?? 0),
  }
}

/** React context object; consumers get this via useFinance(). */
const FinanceContext = createContext(null)

/**
 * Provider: wraps the app so any child can read/update finance state.
 */
export function FinanceProvider({ children }) {
  // --- Transactions: lazy init reads localStorage once on first client render ---
  const [transactions, setTransactions] = useState(() => {
    const persisted = loadJson(STORAGE_KEYS.transactions, null)
    const source = persisted ?? seedTransactions
    return source.map(normalizeTxn)
  })

  // --- Role: Admin vs Viewer (requirement #5) ---
  const [role, setRoleState] = useState(() =>
    loadJson(STORAGE_KEYS.role, initialRole),
  )

  // --- Theme + small UI prefs ---
  const [ui, setUiState] = useState(() => loadJson(STORAGE_KEYS.ui, initialUi))

  // --- Filters live in memory only (reset on full page reload is OK for this demo) ---
  const [filters, setFiltersState] = useState(() => ({ ...initialFilters }))

  // --- Persist transactions whenever the list changes (optional localStorage, requirement) ---
  useEffect(() => {
    saveJson(STORAGE_KEYS.transactions, transactions)
  }, [transactions])

  // --- Persist role when user switches Admin / Viewer ---
  useEffect(() => {
    saveJson(STORAGE_KEYS.role, role)
  }, [role])

  // --- Persist dark mode flag ---
  useEffect(() => {
    saveJson(STORAGE_KEYS.ui, ui)
  }, [ui])

  /** Updates role from the dropdown in RoleAndThemeBar. */
  const setRole = useCallback((next) => {
    setRoleState(next)
  }, [])

  /** Toggles dark mode; RoleAndThemeBar also syncs the `dark` class on <html>. */
  const setDarkMode = useCallback((darkMode) => {
    setUiState((prev) => ({ ...prev, darkMode }))
  }, [])

  /** Merges partial filter updates (search text, type, sort, etc.). */
  const setFilters = useCallback((partial) => {
    setFiltersState((prev) => ({ ...prev, ...partial }))
  }, [])

  /** Restores filters to defaults. */
  const resetFilters = useCallback(() => {
    setFiltersState({ ...initialFilters })
  }, [])

  /** Prepends a new transaction (Admin only in UI, but context allows any caller). */
  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => [normalizeTxn(txn), ...prev])
  }, [])

  /** Patches one transaction by id. */
  const updateTransaction = useCallback((id, patch) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? normalizeTxn({ ...t, ...patch, id }) : t,
      ),
    )
  }, [])

  /** Removes one transaction by id. */
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /** Resets list to built-in mock data (handy for demos / testing). */
  const resetData = useCallback(() => {
    saveJson(STORAGE_KEYS.transactions, seedTransactions)
    setTransactions(seedTransactions.map(normalizeTxn))
  }, [])

  // Memoize the public API so consumers do not re-render from a new object identity every time.
  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

/**
 * Hook used by screens (App, panels) to access finance state.
 * Throws if used outside FinanceProvider so mistakes fail fast during development.
 */
export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return ctx
}
