import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Heart,
  Bell,
  User,
  LogOut,
  BookOpenCheck,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/explore', icon: Compass, label: 'Explore Books' },
  { to: '/my-books', icon: BookOpenCheck, label: 'My Books' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const DashboardSidebar = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-[#121a2b] border-r border-surface-200 dark:border-[#263248]">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-surface-200 dark:border-[#263248]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            LibraVerse
          </span>
        </div>
      </div>

      {/* User profile card */}
      {user && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200/60 dark:border-[#263248]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-surface-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10'
                  : 'text-surface-600 dark:text-surface-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-primary-600 to-secondary-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-surface-200 dark:border-[#263248] space-y-1">
        <div className="flex items-center justify-between px-4 py-1">
          <span className="text-xs text-surface-400">Theme</span>
          <ThemeToggle />
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 w-full transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
