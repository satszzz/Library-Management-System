import { Bell, Check, BookOpen, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    dot: 'bg-amber-500',
  },
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    dot: 'bg-emerald-500',
  },
  info: {
    icon: Info,
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-500/10',
    dot: 'bg-primary-500',
  },
};

const formatTime = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationPanel = ({ notifications = [], isOpen, onClose }) => {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 card shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-surface-200 dark:border-[#263248] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
                  <p className="text-sm text-surface-400">No notifications</p>
                </div>
              ) : (
                items.map((notif) => {
                  const config = typeConfig[notif.type] || typeConfig.info;
                  const TypeIcon = config.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`px-5 py-3.5 border-b border-surface-100 dark:border-[#263248]/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors flex gap-3 ${
                        !notif.read ? 'bg-primary-50/30 dark:bg-primary-500/5' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <TypeIcon size={15} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 mt-1.5`} />
                          )}
                        </div>
                        <p className="text-xs text-surface-400 dark:text-surface-500 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-surface-300 dark:text-surface-600 mt-1">
                          {formatTime(notif.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
