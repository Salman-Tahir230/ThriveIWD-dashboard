import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Leads from './pages/Leads';
import Revenue from './pages/Revenue';
import Sidebar from './components/Sidebar';
import { DashboardDataProvider } from './context/DashboardDataContext';

const PAGE_META = {
  '/': { title: 'Dashboard', subtitle: 'Overview · last 30 days' },
  '/users': { title: 'Users', subtitle: 'Geography & devices · last 30 days' },
  '/leads': { title: 'Leads', subtitle: 'VAP registrations' },
  '/revenue': { title: 'Revenue', subtitle: 'All-time · Stripe' },
};

function Header({ isDark, setIsDark, setIsMobileMenuOpen }) {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || PAGE_META['/'];

  return (
    <header
      className="h-16 px-4 md:px-8 flex items-center justify-between border-b"
      style={{ borderColor: isDark ? '#26382E' : '#E1E9E3', backgroundColor: isDark ? '#14201A' : '#FFFFFF' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-md hover:bg-brand-600 hover:bg-opacity-10 transition-colors flex-shrink-0"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight truncate">{meta.title}</h1>
          <p className="text-xs text-slate-400 truncate">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          Live
        </span>
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
          style={{
            borderColor: isDark ? '#2E4437' : '#E1E9E3',
            color: isDark ? '#F1F5F9' : '#334155',
            backgroundColor: isDark ? '#1B2A22' : '#F7FAF8',
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

  const containerStyle = {
    backgroundColor: isDark ? '#0F1912' : '#F7FAF8',
    color: isDark ? '#F1F5F9' : '#1A2B22',
  };

  return (
    <Router>
      <DashboardDataProvider>
        <div className="min-h-screen flex font-sans transition-colors duration-200" style={containerStyle}>
          <Sidebar isDark={isDark} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

          <div className="flex-1 flex flex-col min-w-0">
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
