// localStorage JSON helpers — isolates try/catch and key names so the store stays readable.

export const STORAGE_KEYS = {
  transactions: 'finance_transactions_v1',
  role: 'finance_role_v1',
  ui: 'finance_ui_v1',
}

export function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore quota / privacy failures for a prototype
  }
}
