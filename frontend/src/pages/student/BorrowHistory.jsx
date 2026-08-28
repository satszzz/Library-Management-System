import { useState, useEffect } from 'react';
import { issueService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { History } from 'lucide-react';

const BorrowHistory = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await issueService.getMyIssues({});
        setIssues(data);
      } catch (err) {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statusBadge = (s) => {
    const map = { issued: 'badge-info', returned: 'badge-success', overdue: 'badge-danger' };
    return map[s] || 'badge-neutral';
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Borrowing History</h1><p className="page-subtitle">Complete history of all your borrowed books.</p></div>

      {issues.length === 0 ? (
        <EmptyState icon={History} title="No history" message="Your borrowing history will appear here." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Status</th><th>Fine</th></tr></thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>
                    <p className="font-medium text-surface-900 dark:text-white">{issue.book?.title}</p>
                    <p className="text-xs text-surface-400">{issue.book?.author}</p>
                  </td>
                  <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                  <td>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '—'}</td>
                  <td><span className={statusBadge(issue.status)}>{issue.status}</span></td>
                  <td>{issue.fine > 0 ? <span className="text-red-500 font-medium">₹{issue.fine}</span> : <span className="text-surface-400">₹0</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;
