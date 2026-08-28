import { useState, useEffect } from 'react';
import { notificationService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Bell, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {} finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { toast.error('Failed'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) { toast.error('Failed'); }
  };

  const typeIcon = { issue: '📗', return: '📘', due_soon: '⏰', overdue: '🔴', reservation: '🔖', fine: '💰', general: '📢' };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">Stay updated with your library activity.</p></div>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm"><Check size={14} /> Mark All Read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You'll be notified about book issues, due dates, and more." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n._id} className={`card p-4 flex items-start gap-3 cursor-pointer transition-all ${!n.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''}`} onClick={() => !n.isRead && handleMarkRead(n._id)}>
              <span className="text-xl">{typeIcon[n.type] || '📢'}</span>
              <div className="flex-1">
                <p className="font-medium text-surface-900 dark:text-white text-sm">{n.title}</p>
                <p className="text-xs text-surface-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-surface-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
