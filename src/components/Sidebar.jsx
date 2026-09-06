import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, CircleDollarSign, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Sidebar = ({ isDark, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const bgColor = isDark ? '#14201A' : '#FFFFFF';
  const borderColor = isDark ? '#26382E' : '#E1E9E3';
  const textColor = isDark ? '#F1F5F9' : '#1A2B22';
  const mutedColor = isDark ? '#7A9284' : '#6B8577';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/leads', label: 'Leads', icon: ClipboardList },
    { path: '/revenue', label: 'Revenue', icon: CircleDollarSign },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
    md:relative md:translate-x-0 border-r
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isCollapsed ? 'md:w-[72px]' : 'md:w-[248px]'}
    w-[248px]
  `;

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={sidebarClasses} style={{ backgroundColor: bgColor, color: textColor, borderColor }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b" style={{ borderColor }}>
          {!isCollapsed ? (
            <div className="min-w-0">
              <img src="/thrive-logo.png" alt="Thrive" className="h-6 w-auto object-contain object-left mb-1" />
              <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#2E7D52' }}>
                Web Analytics Dashboard
              </p>
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mx-auto flex-shrink-0"
              style={{ backgroundColor: '#2E7D52' }}
            >
              T
            </div>
          )}

          <button className="md:hidden p-1 rounded hover:bg-black hover:bg-opacity-10 flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#2E7D52' : 'transparent',
                      color: isActive ? '#FFFFFF' : textColor,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = isDark ? '#1B2A22' : '#EDF6F0';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t hidden md:flex" style={{ borderColor }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center p-2 rounded-md transition-colors"
            style={{ color: mutedColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#1B2A22' : '#EDF6F0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
