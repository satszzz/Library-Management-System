import { useState, useEffect } from 'react';
import { issueService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/Modal';
import { RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageReturns = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [returnId, setReturnId] = useState(null);

  useEffect(() => { fetchIssues(); }, [page]);

  const fetchIssues = async () => {
    try { setLoading(true); const { data } = await issueService.getAllIssues({ page, limit: 15, status: 'issued' }); setIssues([...data.issues]); setPages(data.pages); }
    catch (err) {} finally { setLoading(false); }
  };

  // Also fetch overdue
  useEffect(() => {
    issueService.getAllIssues({ page: 1, limit: 100, status: 'overdue' }).then(({ data }) => {
      setIssues(prev => [...prev, ...data.issues]);
    }).catch(() => {});
  }, [page]);

  const handleReturn = async () => {
    try {
      const { data } = await issueService.returnBook(returnId);
      const fineMsg = data.fine > 0 ? ` Fine: ₹${data.fine}` : '';
      toast.success(`Book returned!${fineMsg}`);
      setReturnId(null); fetchIssues();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Process Returns</h1><p className="page-subtitle">Return borrowed and overdue books.</p></div>

      {loading ? <PageLoader /> : issues.length === 0 ? <EmptyState icon={RotateCcw} title="No pending returns" message="All books have been returned." /> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {issues.map(i => (
                <tr key={i._id}>
                  <td><p className="font-medium text-surface-900 dark:text-white text-sm">{i.user?.name}</p></td>
                  <td><p className="text-sm">{i.book?.title}</p></td>
                  <td className="text-sm">{new Date(i.issueDate).toLocaleDateString()}</td>
                  <td className="text-sm">{new Date(i.dueDate).toLocaleDateString()}</td>
                  <td><span className={i.status === 'overdue' ? 'badge-danger' : 'badge-info'}>{i.status}</span></td>
                  <td><button onClick={() => setReturnId(i._id)} className="btn-success text-xs py-1.5 px-3"><RotateCcw size={14} /> Return</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!returnId} onClose={() => setReturnId(null)} onConfirm={handleReturn} title="Process Return" message="Confirm return? Fine will be auto-calculated if overdue." confirmText="Process Return" />
    </div>
  );
};

export default ManageReturns;
