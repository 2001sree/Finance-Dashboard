// Currency display and sign rules — income adds to balance, expenses subtract (amounts stored positive).

export function formatMoney(amount, currency = 'USD') {
  try {
    // Intl.NumberFormat — locale-aware currency strings (commas, symbol) without a charting library.
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `$${Math.round(amount)}`
  }
}

export function signedAmount(txn) {
  return txn.type === 'income' ? txn.amount : -txn.amount
}
