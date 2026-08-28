import { useState, useEffect } from 'react';
import { issueService, userService, bookService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { ArrowLeftRight, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('issued');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issueForm, setIssueForm] = useState({ userId: '', bookId: '' });
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => { fetchIssues(); }, [page, status]);

  const fetchIssues = async () => {
    try { setLoading(true); const { data } = await issueService.getAllIssues({ page, limit: 15, status }); setIssues(data.issues); setPages(data.pages); }
    catch (err) {} finally { setLoading(false); }
  };

  const openIssueModal = async () => {
    try {
      const [u, b] = await Promise.all([userService.getUsers({ limit: 100, role: 'student' }), bookService.getBooks({ limit: 100, available: 'true' })]);
      setUsers(u.data.users); setBooks(b.data.books); setShowIssueModal(true);
    } catch (err) { toast.error('Failed to load data'); }
  };

  const handleIssue = async () => {
    if (!issueForm.userId || !issueForm.bookId) return toast.error('Select both user and book');
    setIssueLoading(true);
    try {
      await issueService.issueBook(issueForm);
      toast.success('Book issued successfully!');
      setShowIssueModal(false); setIssueForm({ userId: '', bookId: '' }); fetchIssues();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setIssueLoading(false); }
  };

  const statusBadge = (s) => ({ issued: 'badge-info', returned: 'badge-success', overdue: 'badge-danger' }[s] || 'badge-neutral');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h1 className="page-title">Issue Books</h1><p className="page-subtitle">Manage book issues.</p></div>
        <button onClick={openIssueModal} className="btn-primary"><Plus size={16} /> Issue New Book</button>
      </div>

      <div className="flex gap-2">
        {['issued', 'overdue', 'returned'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={`btn text-xs ${status === s ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'btn-ghost'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {loading ? <PageLoader /> : issues.length === 0 ? <EmptyState icon={ArrowLeftRight} title="No issues found" /> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead>
            <tbody>
              {issues.map(i => (
                <tr key={i._id}>
                  <td><p className="font-medium text-surface-900 dark:text-white text-sm">{i.user?.name}</p><p className="text-xs text-surface-400">{i.user?.email}</p></td>
                  <td><p className="text-sm">{i.book?.title}</p><p className="text-xs text-surface-400">{i.book?.author}</p></td>
                  <td className="text-sm">{new Date(i.issueDate).toLocaleDateString()}</td>
                  <td className="text-sm">{new Date(i.dueDate).toLocaleDateString()}</td>
                  <td><span className={statusBadge(i.status)}>{i.status}</span></td>
                  <td>{i.fine > 0 ? <span className="text-red-500 font-medium">₹{i.fine}</span> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} title="Issue a Book" size="md">
        <div className="space-y-4">
          <div><label className="input-label">Student</label><select className="input" value={issueForm.userId} onChange={e => setIssueForm({...issueForm, userId: e.target.value})}><option value="">Select Student</option>{users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}</select></div>
          <div><label className="input-label">Book (Available Only)</label><select className="input" value={issueForm.bookId} onChange={e => setIssueForm({...issueForm, bookId: e.target.value})}><option value="">Select Book</option>{books.map(b => <option key={b._id} value={b._id}>{b.title} — {b.availableCopies} left</option>)}</select></div>
          <div className="flex justify-end gap-3"><button onClick={() => setShowIssueModal(false)} className="btn-secondary">Cancel</button><button onClick={handleIssue} disabled={issueLoading} className="btn-primary">{issueLoading ? 'Issuing...' : 'Issue Book'}</button></div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageIssues;
