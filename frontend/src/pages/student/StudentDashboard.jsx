import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/services';
import StatCard from '../../components/dashboard/StatCard';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { BookOpen, BookCopy, BookmarkCheck, Receipt, AlertTriangle, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data: res } = await reportService.getStudentDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: `Overdue by ${Math.abs(diffDays)} day(s)`, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (diffDays === 0) return { label: 'Due today', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (diffDays <= 3) return { label: `Due in ${diffDays} day(s)`, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    return { label: `Due in ${diffDays} days`, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Here's your library activity overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Borrowed" value={data?.currentlyBorrowed || 0} icon={BookCopy} gradient="stat-gradient-1" />
        <StatCard title="Returned" value={data?.totalReturned || 0} icon={BookOpen} gradient="stat-gradient-4" />
        <StatCard title="Reservations" value={data?.activeReservations || 0} icon={BookmarkCheck} gradient="stat-gradient-3" />
        <StatCard title="Pending Fines" value={`₹${data?.pendingFines || 0}`} icon={Receipt} gradient="stat-gradient-2" />
        <StatCard title="Overdue" value={data?.overdueBooks || 0} icon={AlertTriangle} gradient="stat-gradient-5" />
      </div>

      {/* Currently Borrowed Books */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-display text-surface-900 dark:text-white">Currently Borrowed</h2>
          <Link to="/student/my-books" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All →</Link>
        </div>

        {data?.currentBorrows?.length === 0 ? (
          <div className="text-center py-10 text-surface-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No books currently borrowed</p>
            <Link to="/student/books" className="btn-primary mt-4 inline-flex">Browse Books</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.currentBorrows?.map((issue) => {
              const status = getDueStatus(issue.dueDate);
              return (
                <div key={issue._id} className={`flex items-center gap-4 p-4 rounded-xl ${status.bg} transition-colors`}>
                  <div className="w-12 h-16 rounded-lg bg-white dark:bg-surface-700 shadow-sm overflow-hidden flex-shrink-0">
                    {issue.book?.coverImage ? (
                      <img src={issue.book.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={18} className="text-surface-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-white text-sm truncate">{issue.book?.title}</p>
                    <p className="text-xs text-surface-500">{issue.book?.author}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
                      <Clock size={14} />
                      {status.label}
                    </div>
                    <p className="text-[10px] text-surface-400 mt-0.5">
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold font-display text-surface-900 dark:text-white mb-4">Recent Activity</h2>
        {data?.recentActivity?.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-6">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {data?.recentActivity?.map((item) => (
              <div key={item._id} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'returned' ? 'bg-emerald-500' : item.status === 'overdue' ? 'bg-red-500' : 'bg-primary-500'}`} />
                <span className="font-medium text-surface-700 dark:text-surface-300">{item.book?.title}</span>
                <span className="badge-neutral text-[10px]">{item.status}</span>
                <span className="text-surface-400 text-xs ml-auto">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
