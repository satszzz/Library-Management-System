import { useState, useEffect } from 'react';
import { issueService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BookCopy, Clock } from 'lucide-react';

const MyBooks = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIssues(); }, []);

  const fetchIssues = async () => {
    try {
      const { data } = await issueService.getMyIssues({ status: 'issued' });
      setIssues(data.filter(i => i.status === 'issued' || i.status === 'overdue'));
    } catch (err) {} finally { setLoading(false); }
  };

  const getDueInfo = (dueDate) => {
    const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000*60*60*24));
    if (diff < 0) return { text: `Overdue by ${Math.abs(diff)} day(s)`, cls: 'badge-danger' };
    if (diff === 0) return { text: 'Due today', cls: 'badge-danger' };
    if (diff <= 3) return { text: `Due in ${diff} day(s)`, cls: 'badge-warning' };
    return { text: `Due in ${diff} days`, cls: 'badge-success' };
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Books</h1>
        <p className="page-subtitle">{issues.length} book(s) currently borrowed</p>
      </div>

      {issues.length === 0 ? (
        <EmptyState icon={BookCopy} title="No books borrowed" message="Browse the catalog to find and issue books." />
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => {
            const due = getDueInfo(issue.dueDate);
            return (
              <div key={issue._id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-20 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                  {issue.book?.coverImage ? (
                    <img src={issue.book.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center"><BookCopy size={20} className="text-surface-300" /></div>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-900 dark:text-white">{issue.book?.title}</p>
                  <p className="text-sm text-surface-500">{issue.book?.author}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                    <span>Issued: {new Date(issue.issueDate).toLocaleDateString()}</span>
                    <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={due.cls}><Clock size={12} className="mr-1" />{due.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
