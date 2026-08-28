import { useState, useEffect } from 'react';
import { reservationService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await reservationService.getMyReservations();
      setReservations(data);
    } catch (err) {} finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    try {
      await reservationService.cancelReservation(id);
      toast.success('Reservation cancelled');
      fetchReservations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', ready: 'badge-success', completed: 'badge-info', cancelled: 'badge-neutral', expired: 'badge-danger' };
    return map[s] || 'badge-neutral';
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">My Reservations</h1><p className="page-subtitle">Track your book reservations.</p></div>
      {reservations.length === 0 ? (
        <EmptyState icon={BookmarkCheck} title="No reservations" message="Reserve unavailable books to get notified when they're available." />
      ) : (
        <div className="grid gap-4">
          {reservations.map((r) => (
            <div key={r._id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-surface-900 dark:text-white">{r.book?.title}</p>
                <p className="text-sm text-surface-500">{r.book?.author}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                  <span>Reserved: {new Date(r.reservationDate).toLocaleDateString()}</span>
                  {r.queuePosition && <span>Queue: #{r.queuePosition}</span>}
                  {r.expiresAt && <span>Expires: {new Date(r.expiresAt).toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusBadge(r.status)}>{r.status}</span>
                {['pending', 'ready'].includes(r.status) && (
                  <button onClick={() => handleCancel(r._id)} className="btn-ghost text-red-500 text-xs">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
