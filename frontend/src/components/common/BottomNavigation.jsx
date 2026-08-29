import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/my-books', icon: BookOpen, label: 'My Books' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-surface-950/90 backdrop-blur-xl border-t border-surface-200/60 dark:border-[#263248]/60 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                size={20}
                className={
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-surface-400 dark:text-surface-500'
                }
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-surface-400 dark:text-surface-500'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
