import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ user: propUser }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            LibraVerse
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                {user.name ? user.name[0].toUpperCase() : <User size={12} />}
              </div>
              <span>{user.name ? user.name.split(' ')[0] : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-gradient text-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-surface-200/60 dark:border-[#263248]/60 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-sm justify-center flex items-center gap-2"
                >
                  <User size={16} />
                  Dashboard ({user.name || 'Account'})
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary w-full text-sm justify-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-gradient w-full text-sm justify-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
