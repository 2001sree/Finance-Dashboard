// Static mock data (editable by Admin role) to make the dashboard feel real.
// Amount convention: positive numbers; type determines +/-

function isoDaysAgo(daysAgo) {
  // Stable noon UTC-ish timestamps so date inputs and sorting behave predictably across timezones.
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

export const seedTransactions = [
  // Income
  { id: 't-1', date: isoDaysAgo(2), type: 'income', category: 'Salary', description: 'Monthly salary', amount: 5200 },
  { id: 't-2', date: isoDaysAgo(15), type: 'income', category: 'Freelance', description: 'Landing page project', amount: 900 },
  { id: 't-3', date: isoDaysAgo(32), type: 'income', category: 'Salary', description: 'Monthly salary', amount: 5200 },
  { id: 't-4', date: isoDaysAgo(45), type: 'income', category: 'Investments', description: 'Dividend payout', amount: 120 },

  // Housing / bills
  { id: 't-5', date: isoDaysAgo(1), type: 'expense', category: 'Rent', description: 'Apartment rent', amount: 1800 },
  { id: 't-6', date: isoDaysAgo(12), type: 'expense', category: 'Utilities', description: 'Electricity bill', amount: 140 },
  { id: 't-7', date: isoDaysAgo(28), type: 'expense', category: 'Utilities', description: 'Internet bill', amount: 65 },
  { id: 't-8', date: isoDaysAgo(31), type: 'expense', category: 'Rent', description: 'Apartment rent', amount: 1800 },

  // Daily spend
  { id: 't-9', date: isoDaysAgo(0), type: 'expense', category: 'Groceries', description: 'Weekly groceries', amount: 110 },
  { id: 't-10', date: isoDaysAgo(3), type: 'expense', category: 'Transport', description: 'Metro card top-up', amount: 35 },
  { id: 't-11', date: isoDaysAgo(5), type: 'expense', category: 'Dining', description: 'Dinner with friends', amount: 58 },
  { id: 't-12', date: isoDaysAgo(6), type: 'expense', category: 'Shopping', description: 'New headphones', amount: 79 },
  { id: 't-13', date: isoDaysAgo(8), type: 'expense', category: 'Groceries', description: 'Grocery run', amount: 62 },
  { id: 't-14', date: isoDaysAgo(9), type: 'expense', category: 'Health', description: 'Pharmacy', amount: 24 },
  { id: 't-15', date: isoDaysAgo(10), type: 'expense', category: 'Entertainment', description: 'Movie night', amount: 28 },
  { id: 't-16', date: isoDaysAgo(13), type: 'expense', category: 'Dining', description: 'Lunch', amount: 18 },
  { id: 't-17', date: isoDaysAgo(16), type: 'expense', category: 'Transport', description: 'Ride share', amount: 14 },
  { id: 't-18', date: isoDaysAgo(18), type: 'expense', category: 'Groceries', description: 'Groceries', amount: 73 },
  { id: 't-19', date: isoDaysAgo(20), type: 'expense', category: 'Shopping', description: 'Clothes', amount: 120 },
  { id: 't-20', date: isoDaysAgo(22), type: 'expense', category: 'Entertainment', description: 'Concert ticket', amount: 95 },
  { id: 't-21', date: isoDaysAgo(24), type: 'expense', category: 'Dining', description: 'Cafe', amount: 9 },
  { id: 't-22', date: isoDaysAgo(26), type: 'expense', category: 'Transport', description: 'Fuel', amount: 52 },
  { id: 't-23', date: isoDaysAgo(29), type: 'expense', category: 'Groceries', description: 'Groceries', amount: 88 },
  { id: 't-24', date: isoDaysAgo(33), type: 'expense', category: 'Dining', description: 'Takeout', amount: 32 },
  { id: 't-25', date: isoDaysAgo(35), type: 'expense', category: 'Health', description: 'Doctor visit', amount: 60 },
  { id: 't-26', date: isoDaysAgo(37), type: 'expense', category: 'Shopping', description: 'Home supplies', amount: 44 },
  { id: 't-27', date: isoDaysAgo(40), type: 'expense', category: 'Groceries', description: 'Groceries', amount: 91 },
  { id: 't-28', date: isoDaysAgo(42), type: 'expense', category: 'Transport', description: 'Train', amount: 22 },
  { id: 't-29', date: isoDaysAgo(47), type: 'expense', category: 'Entertainment', description: 'Streaming subscription', amount: 15 },
  { id: 't-30', date: isoDaysAgo(55), type: 'expense', category: 'Utilities', description: 'Water bill', amount: 32 },
]
