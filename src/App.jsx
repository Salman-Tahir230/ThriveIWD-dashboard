import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Leads from './pages/Leads';
import Revenue from './pages/Revenue';
import Sidebar from './components/Sidebar';
import { DashboardDataProvider } from './context/DashboardDataContext';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const containerStyle = {
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    color: isDark ? '#F1F5F9' : '#0F172A',
  };

  const accentColor = '#14B8A6';

  return (
    <Router>
      <DashboardDataProvider>
      <div
        className="min-h-screen flex transition-colors duration-200"
        style={containerStyle}
      >
        <Sidebar 
          isDark={isDark} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header 
            className="h-16 px-4 flex items-center justify-between border-b" 
            style={{ borderColor: isDark ? '#334155' : '#CBD5E1' }}
          >
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-slate-500 hover:bg-opacity-20 transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={24} />
              </button>
            </div>
            
            {/* Desktop spacer to keep toggle on the right */}
            <div className="hidden md:block flex-1"></div>
            
            <button 
              onClick={() => setIsDark(!isDark)}
              style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
              className="px-4 py-2 rounded shadow hover:opacity-90 transition-opacity flex items-center justify-center ml-auto font-medium"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
              {isDark ? 'Light' : 'Dark'} Mode
            </button>
          </header>
          
          <main className="flex-1 p-8 overflow-y-auto">
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
