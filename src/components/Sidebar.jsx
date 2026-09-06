import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, CircleDollarSign, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/leads', label: 'Leads', icon: ClipboardList },
    { path: '/revenue', label: 'Revenue', icon: CircleDollarSign },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col flex-shrink-0 h-screen transition-all duration-300
    md:relative md:translate-x-0 border-r
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isCollapsed ? 'md:w-16' : 'md:w-56'}
    w-56
  `;

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside
        className={sidebarClasses}
        style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
      >
        <div
          className={`flex items-center gap-2 px-3 py-3.5 border-b flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          style={{ borderColor: 'var(--border)' }}
        >
          {!isCollapsed && (
            <div className="min-w-0">
              <img src="/thrive-logo.png" alt="Thrive" className="logo-mark h-6 w-auto object-contain object-left mb-1" />
              <p className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'var(--accent)' }}>
                Web Analytics Dashboard
              </p>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-[26px] h-[26px] rounded-md border flex-shrink-0 transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button
            className="md:hidden p-1 rounded hover:bg-black hover:bg-opacity-10 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 min-h-0">
          <ul className="space-y-1 px-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text-soft)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'var(--accent-soft)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={17} />
                    {!isCollapsed && <span className="ml-2.5">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="px-4 py-3 text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            Internal tool · v1.0
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
