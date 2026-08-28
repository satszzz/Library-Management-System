import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, RotateCcw,
  BookmarkCheck, Receipt, FolderTree, BarChart3, ScrollText, X
} from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/books', label: 'Manage Books', icon: BookOpen },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/issues', label: 'Issue Books', icon: ArrowLeftRight },
  { to: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { to: '/admin/reservations', label: 'Reservations', icon: BookmarkCheck },
  { to: '/admin/fines', label: 'Fines', icon: Receipt },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/activity-logs', label: 'Activity Logs', icon: ScrollText },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-surface-100 dark:border-surface-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-surface-900 dark:text-white">Admin Panel</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-100 dark:border-surface-700/50">
          <p className="text-[10px] text-surface-400 text-center">LibraVerse Admin v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
