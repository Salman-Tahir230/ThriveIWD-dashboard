import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Target, CircleDollarSign, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Sidebar = ({ isDark, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const asideStyle = {
    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
    color: isDark ? '#F1F5F9' : '#0F172A',
  };

  const accentColor = '#14B8A6';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/leads', label: 'Leads', icon: Target },
    { path: '/revenue', label: 'Revenue', icon: CircleDollarSign },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
    md:relative md:translate-x-0 border-r
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isCollapsed ? 'md:w-20' : 'md:w-64'}
    w-64
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={sidebarClasses} style={{ ...asideStyle, borderColor: isDark ? '#334155' : '#CBD5E1' }}>
        <div className="flex items-center justify-between p-4 border-b h-16" style={{ borderColor: isDark ? '#334155' : '#CBD5E1' }}>
          {!isCollapsed && <span className="text-xl font-bold">ThriveIWD</span>}
          {isCollapsed && <span className="text-xl font-bold mx-auto">T</span>}
          
          <button 
            className="md:hidden p-1 rounded hover:bg-black hover:bg-opacity-10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md p-2 transition-colors ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    } ${!isActive ? 'hover:bg-slate-500 hover:bg-opacity-20' : ''}`}
                    style={{
                      backgroundColor: isActive ? accentColor : 'transparent',
                      color: isActive ? '#FFFFFF' : 'inherit'
                    }}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t hidden md:flex" style={{ borderColor: isDark ? '#334155' : '#CBD5E1' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center p-2 rounded hover:bg-slate-500 hover:bg-opacity-20 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
