import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/services';
import {
  Bell, Sun, Moon, Menu, LogOut, User, BookOpen, ChevronDown, Check
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
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/student/dashboard';

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button onClick={onMenuToggle} className="lg:hidden btn-ghost p-2 rounded-xl">
              <Menu size={20} />
            </button>
          )}
          <Link to={dashboardLink} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              LibraVerse
            </span>
          </Link>
        </div>

        {/* Right Menu Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {/* Notifications */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 card p-0 overflow-hidden animate-slide-down z-50 shadow-2xl">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 transition-colors ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                        >
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="hidden md:block text-slate-400" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-56 card p-2 animate-slide-down z-50 shadow-2xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    <span className="badge-info text-[10px] mt-2 capitalize">{user.role}</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-800 my-1" />
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/student/profile'}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <User size={16} />
                    {isAdmin ? 'Dashboard' : 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={16} />
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
