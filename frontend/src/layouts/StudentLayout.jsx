import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { LayoutDashboard, BookOpen, BookCopy, BookmarkCheck, History, Bell, UserCircle } from 'lucide-react';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/books', label: 'Browse Books', icon: BookOpen },
  { to: '/student/my-books', label: 'My Books', icon: BookCopy },
  { to: '/student/reservations', label: 'Reservations', icon: BookmarkCheck },
  { to: '/student/history', label: 'History', icon: History },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Navbar />
      {/* Student Tab Bar */}
      <div className="border-b border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-900 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <nav className="flex gap-1 -mb-px">
            {studentLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                      : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                  }`
                }
              >
                <link.icon size={16} />
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
