const saved = localStorage.getItem('ui.darkMode');
if (saved === 'true') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
import React from 'react'
// createRoot is the React 18 API (replaces render); better for concurrent features.
import ReactDOM from 'react-dom/client'
// Root component that composes layout + routes between Dashboard / Transactions / Insights.
import App from './App.jsx'
// Global Tailwind layers + small polish (focus, color-scheme).
import './index.css'
// Context provider wraps the tree so any component can call useFinance().
import { FinanceProvider } from './context/FinanceContext.jsx'
const rootEl = document.getElementById('root')

// Create a React root bound to that DOM node.
const root = ReactDOM.createRoot(rootEl)

// Render the app: StrictMode helps catch side-effect bugs in development.
root.render(
  <React.StrictMode>
    {/* FinanceProvider holds transactions, filters, role, theme + localStorage sync. */}
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>,
)

