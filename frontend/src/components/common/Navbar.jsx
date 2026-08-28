import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/services';
import {
  Bell, Sun, Moon, Menu, X, LogOut, User, BookOpen, ChevronDown
} from 'lucide-react';

const Navbar = ({ onMenuToggle, showMenuButton = false }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getNotifications();
      setNotifications(data.notifications?.slice(0, 5) || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/student/dashboard';

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-700/50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button onClick={onMenuToggle} className="lg:hidden btn-ghost p-2 rounded-lg">
              <Menu size={20} />
            </button>
          )}
          <Link to={dashboardLink} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block text-surface-900 dark:text-white">
              LibraVerse
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative p-2.5 rounded-xl text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 card p-0 overflow-hidden animate-slide-down z-50">
                  <div className="p-4 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
                    <h3 className="font-semibold text-surface-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-surface-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 border-b border-surface-50 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors ${
                            !notif.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{notif.message}</p>
                          <p className="text-[10px] text-surface-400 mt-1.5">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <Link
                      to={isAdmin ? '/admin/dashboard' : '/student/notifications'}
                      className="block p-3 text-center text-sm text-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Notifications
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-surface-700 dark:text-surface-300 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="hidden md:block text-surface-400" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 card p-1.5 animate-slide-down z-50">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-surface-500 truncate">{user.email}</p>
                    <span className="badge-info mt-1.5 text-[10px]">{user.role}</span>
                  </div>
                  <hr className="border-surface-100 dark:border-surface-700 my-1" />
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/student/profile'}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <User size={15} />
                    {isAdmin ? 'Dashboard' : 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
