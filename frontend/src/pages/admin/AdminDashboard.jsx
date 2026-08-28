import { useState, useEffect } from 'react';
import { reportService } from '../../services/services';
import StatCard from '../../components/dashboard/StatCard';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { BookOpen, BookCopy, Users, AlertTriangle, BookmarkCheck, Receipt, TrendingUp, Library } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16', '#6366f1'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, reportRes] = await Promise.all([
        reportService.getDashboardStats(),
        reportService.getBorrowingReport(),
      ]);
      setStats(statsRes.data);
      setReport(reportRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <PageLoader />;

  const issuesChartData = report?.issuesPerMonth?.map(item => ({
    month: MONTHS[item._id.month - 1],
    issues: item.count,
  })) || [];

  const categoryChartData = report?.booksByCategory?.map(item => ({
    name: item.name || 'Unknown',
    value: item.count,
  })) || [];

  const mostBorrowed = report?.mostBorrowed?.slice(0, 5) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Admin Dashboard</h1><p className="page-subtitle">Library overview and analytics.</p></div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Books" value={stats?.totalBooks || 0} icon={BookOpen} gradient="stat-gradient-1" />
        <StatCard title="Issued Books" value={stats?.issuedBooks || 0} icon={BookCopy} gradient="stat-gradient-3" />
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} gradient="stat-gradient-4" />
        <StatCard title="Overdue" value={stats?.overdueBooks || 0} icon={AlertTriangle} gradient="stat-gradient-2" />
        <StatCard title="Available Copies" value={stats?.availableCopies || 0} icon={Library} gradient="stat-gradient-6" />
        <StatCard title="Reservations" value={stats?.pendingReservations || 0} icon={BookmarkCheck} gradient="stat-gradient-5" />
        <StatCard title="Total Fines" value={`₹${stats?.totalFines || 0}`} icon={Receipt} gradient="stat-gradient-2" />
        <StatCard title="Unpaid Fines" value={`₹${stats?.unpaidFines || 0}`} icon={TrendingUp} gradient="stat-gradient-5" />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Issues Per Month */}
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Books Issued Per Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={issuesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-200 dark:text-surface-700" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="issues" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Books By Category */}
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Books by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Borrowed Books */}
      <div className="card p-6">
        <h3 className="font-semibold text-surface-900 dark:text-white mb-4">🏆 Most Borrowed Books</h3>
        <div className="space-y-3">
          {mostBorrowed.map((book, i) => (
            <div key={book._id} className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-sm font-bold text-primary-600">#{i + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-surface-900 dark:text-white text-sm">{book.title}</p>
                <p className="text-xs text-surface-400">{book.author}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-600">{book.borrowCount}</p>
                <p className="text-[10px] text-surface-400">borrows</p>
              </div>
              <div className="w-24 h-2 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-400 to-accent-500 rounded-full" style={{ width: `${(book.borrowCount / (mostBorrowed[0]?.borrowCount || 1)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
