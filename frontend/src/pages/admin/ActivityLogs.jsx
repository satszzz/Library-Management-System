import { useState, useEffect } from 'react';
import { reportService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ScrollText } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    try { setLoading(true); const { data } = await reportService.getActivityLogs({ page, limit: 20 }); setLogs(data.logs); setPages(data.pages); }
    catch (err) {} finally { setLoading(false); }
  };

  const actionColor = (action) => {
    if (action.includes('Delete') || action.includes('Deactivated')) return 'text-red-500';
    if (action.includes('Created') || action.includes('Issued')) return 'text-emerald-600';
    if (action.includes('Updated') || action.includes('return')) return 'text-primary-600';
    return 'text-surface-600 dark:text-surface-400';
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Activity Logs</h1><p className="page-subtitle">Track all admin actions.</p></div>

      {logs.length === 0 ? <EmptyState icon={ScrollText} title="No activity logs" message="Actions will be recorded here." /> : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log._id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-400">
                <ScrollText size={18} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${actionColor(log.action)}`}>{log.action}</p>
                <p className="text-xs text-surface-400">{log.details || `${log.entity} ${log.entityId || ''}`}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-surface-500">{log.user?.name}</p>
                <p className="text-[10px] text-surface-400">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default ActivityLogs;
