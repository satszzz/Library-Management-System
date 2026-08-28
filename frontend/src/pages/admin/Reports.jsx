import { useState, useEffect } from 'react';
import { reportService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Download } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [fineReport, setFineReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [s, r, f] = await Promise.all([reportService.getDashboardStats(), reportService.getBorrowingReport(), reportService.getFineReport()]);
      setStats(s.data); setReport(r.data); setFineReport(f.data);
    } catch (err) {} finally { setLoading(false); }
  };

  const exportCSV = () => {
    const rows = [['Metric', 'Value'], ['Total Books', stats?.totalBooks], ['Issued', stats?.issuedBooks], ['Overdue', stats?.overdueBooks], ['Students', stats?.totalStudents], ['Total Fines', stats?.totalFines]];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'library_report.csv'; a.click();
  };

  if (loading) return <PageLoader />;

  const issuesData = report?.issuesPerMonth?.map(i => ({ month: MONTHS[i._id.month-1], issues: i.count })) || [];
  const catData = report?.booksByCategory?.map(i => ({ name: i.name || 'Unknown', value: i.count })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Reports</h1><p className="page-subtitle">Library analytics and exports.</p></div>
        <button onClick={exportCSV} className="btn-primary"><Download size={16} /> Export CSV</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Total Books', stats?.totalBooks], ['Issued', stats?.issuedBooks], ['Overdue', stats?.overdueBooks], ['Total Fines', `₹${stats?.totalFines || 0}`]].map(([label, val]) => (
          <div key={label} className="card p-5 text-center"><p className="text-2xl font-bold text-surface-900 dark:text-white">{val}</p><p className="text-xs text-surface-400 mt-1">{label}</p></div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Issues Per Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={issuesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{fontSize:12}} /><YAxis tick={{fontSize:12}} /><Tooltip /><Bar dataKey="issues" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Books by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">{catData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fine breakdown */}
      <div className="card p-6">
        <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Fine Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-surface-50 dark:bg-surface-700"><p className="text-2xl font-bold">₹{fineReport?.stats?.totalFines || 0}</p><p className="text-xs text-surface-400 mt-1">Total</p></div>
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20"><p className="text-2xl font-bold text-emerald-600">₹{fineReport?.stats?.paidFines || 0}</p><p className="text-xs text-surface-400 mt-1">Paid</p></div>
          <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20"><p className="text-2xl font-bold text-red-500">₹{fineReport?.stats?.unpaidFines || 0}</p><p className="text-xs text-surface-400 mt-1">Unpaid</p></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
