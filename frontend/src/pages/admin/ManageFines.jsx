import { useState, useEffect } from 'react';
import { issueService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Receipt, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageFines = () => {
  const [fines, setFines] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFines(); }, []);

  const fetchFines = async () => {
    try {
      const { data } = await (await import('../../services/services')).reportService.getFineReport();
      setFines(data.fines); setStats(data.stats);
    } catch (err) {} finally { setLoading(false); }
  };

  const handlePayFine = async (id) => {
    try { await issueService.payFine(id); toast.success('Fine marked as paid'); fetchFines(); }
    catch (err) { toast.error('Failed'); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Manage Fines</h1></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center"><p className="text-2xl font-bold text-surface-900 dark:text-white">₹{stats.totalFines || 0}</p><p className="text-xs text-surface-400 mt-1">Total Fines</p></div>
        <div className="card p-5 text-center"><p className="text-2xl font-bold text-emerald-600">₹{stats.paidFines || 0}</p><p className="text-xs text-surface-400 mt-1">Paid</p></div>
        <div className="card p-5 text-center"><p className="text-2xl font-bold text-red-500">₹{stats.unpaidFines || 0}</p><p className="text-xs text-surface-400 mt-1">Unpaid</p></div>
      </div>

      {fines.length === 0 ? <EmptyState icon={Receipt} title="No fines" message="No fines have been generated yet." /> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Student</th><th>Book</th><th>Fine</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {fines.map(f => (
                <tr key={f._id}>
                  <td className="text-sm">{f.user?.name}</td>
                  <td className="text-sm">{f.book?.title}</td>
                  <td><span className="text-red-500 font-semibold">₹{f.fine}</span></td>
                  <td><span className={f.finePaid ? 'badge-success' : 'badge-danger'}>{f.finePaid ? 'Paid' : 'Pending'}</span></td>
                  <td>{!f.finePaid && <button onClick={() => handlePayFine(f._id)} className="btn-success text-xs py-1.5 px-3"><Check size={14} /> Mark Paid</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageFines;
