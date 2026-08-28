import { useState, useEffect } from 'react';
import { reservationService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => { fetchReservations(); }, [page, status]);

  const fetchReservations = async () => {
    try { setLoading(true); const { data } = await reservationService.getAllReservations({ page, limit: 15, status }); setReservations(data.reservations); setPages(data.pages); }
    catch (err) {} finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    try { await reservationService.cancelReservation(id); toast.success('Reservation cancelled'); fetchReservations(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusBadge = (s) => ({ pending: 'badge-warning', ready: 'badge-success', completed: 'badge-info', cancelled: 'badge-neutral', expired: 'badge-danger' }[s] || 'badge-neutral');

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Manage Reservations</h1></div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'ready', 'completed', 'cancelled', 'expired'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={`btn text-xs ${status === s ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'btn-ghost'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : reservations.length === 0 ? <EmptyState icon={BookmarkCheck} title="No reservations" /> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Student</th><th>Book</th><th>Date</th><th>Queue</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r._id}>
                  <td className="text-sm">{r.user?.name}</td>
                  <td className="text-sm">{r.book?.title}</td>
                  <td className="text-sm">{new Date(r.reservationDate || r.createdAt).toLocaleDateString()}</td>
                  <td>#{r.queuePosition}</td>
                  <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td>{['pending', 'ready'].includes(r.status) && <button onClick={() => handleCancel(r._id)} className="text-xs text-red-500 hover:underline">Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default ManageReservations;
