import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Check,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { notifications as initialNotifications } from '../../data/notifications';

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  info: {
    icon: Info,
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-500/10',
    border: 'border-primary-200 dark:border-primary-500/20',
  },
};

const formatTime = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

const Notifications = () => {
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setItems(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
      >
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState preset="no-notifications" />
      ) : (
        <div className="space-y-3">
          {items.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.info;
            const TypeIcon = config.icon;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => markRead(notif.id)}
                className={`card p-5 flex gap-4 cursor-pointer transition-all duration-200 ${
                  !notif.read
                    ? 'border-l-4 border-l-primary-500 bg-primary-50/20 dark:bg-primary-500/5'
                    : 'hover:bg-surface-50 dark:hover:bg-surface-800/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}
                >
                  <TypeIcon size={18} className={config.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          !notif.read
                            ? 'text-slate-900 dark:text-white'
                            : 'text-surface-600 dark:text-surface-300'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <p className="text-sm text-surface-400 dark:text-surface-500 mt-0.5">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-surface-300 dark:text-surface-600 mt-2">
                    {formatTime(notif.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
