import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Leads from './pages/Leads';
import Revenue from './pages/Revenue';
import Sidebar from './components/Sidebar';
import { DashboardDataProvider, useDashboardData, DATE_RANGE_OPTIONS } from './context/DashboardDataContext';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview' },
  '/users': { title: 'Users', subtitle: 'Geography & devices' },
  '/leads': { title: 'Leads', subtitle: 'VAP registrations · live from Google Sheets' },
  '/revenue': { title: 'Revenue', subtitle: 'All-time · Stripe' },
};

// The date range selector only affects GA4-backed pages (Dashboard, Users) —
// Leads (Sheets) and Revenue (Stripe, intentionally all-time) don't use it.
const RANGE_AWARE_PATHS = new Set(['/', '/users']);

function Header({ isDark, setIsDark, setIsMobileMenuOpen }) {
  const location = useLocation();
  const { dateRange, setDateRange } = useDashboardData();
  const meta = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];
  const showRangePicker = RANGE_AWARE_PATHS.has(location.pathname);
  const rangeLabel = DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label || 'Last 30 days';

  return (
    <header
      className="h-16 px-4 md:px-8 flex items-center justify-between border-b flex-shrink-0 sticky top-0 z-20"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--header-bg)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-md transition-colors flex-shrink-0"
          style={{ color: 'var(--text)' }}
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight truncate" style={{ color: 'var(--text)' }}>{meta.title}</h1>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {meta.subtitle}{showRangePicker ? ` · ${rangeLabel.toLowerCase()}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {showRangePicker && (
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-medium rounded-lg border px-2.5 py-1.5 cursor-pointer focus:outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--input-bg)' }}
            aria-label="Date range"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
        <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
          Live
        </span>
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text)',
            backgroundColor: 'var(--toggle-bg)',
          }}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  return (
    <Router>
      <DashboardDataProvider>
        <div className="h-screen flex font-sans" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Header isDark={isDark} setIsDark={setIsDark} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/revenue" element={<Revenue />} />
              </Routes>
            </main>
          </div>
        </div>
      </DashboardDataProvider>
    </Router>
  );
}

export default App;
