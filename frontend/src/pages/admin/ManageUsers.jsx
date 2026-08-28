import { useState, useEffect } from 'react';
import { userService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { Search, Users, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchUsers(); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400); return () => clearTimeout(t); }, [search]);

  const fetchUsers = async () => {
    try { setLoading(true); const { data } = await userService.getUsers({ page, limit: 15, search, role: 'student' }); setUsers(data.users); setPages(data.pages); }
    catch (err) {} finally { setLoading(false); }
  };

  const toggleActive = async (user) => {
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) { toast.error('Failed'); }
  };

  const viewUser = async (id) => {
    try { const { data } = await userService.getUser(id); setSelectedUser(data); }
    catch (err) { toast.error('Failed to load user'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Manage Users</h1><p className="page-subtitle">View and manage student accounts.</p></div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input className="input pl-10" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <PageLoader /> : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="font-medium text-surface-900 dark:text-white">{u.name}</td>
                  <td className="text-sm">{u.email}</td>
                  <td><span className="badge-neutral text-[10px]">{u.department || '—'}</span></td>
                  <td className="text-sm">{u.year || '—'}</td>
                  <td><span className={u.isActive ? 'badge-success' : 'badge-danger'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => viewUser(u._id)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-600"><Eye size={15} /></button>
                      <button onClick={() => toggleActive(u)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-amber-600">
                        {u.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xl font-bold">{selectedUser.name?.charAt(0)}</div>
              <div><p className="font-semibold text-surface-900 dark:text-white">{selectedUser.name}</p><p className="text-sm text-surface-500">{selectedUser.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-surface-400">Phone:</span> <span className="text-surface-700 dark:text-surface-300">{selectedUser.phone || '—'}</span></div>
              <div><span className="text-surface-400">Department:</span> <span className="text-surface-700 dark:text-surface-300">{selectedUser.department || '—'}</span></div>
              <div><span className="text-surface-400">Year:</span> <span className="text-surface-700 dark:text-surface-300">{selectedUser.year || '—'}</span></div>
              <div><span className="text-surface-400">Status:</span> <span className={selectedUser.isActive ? 'text-emerald-600' : 'text-red-500'}>{selectedUser.isActive ? 'Active' : 'Inactive'}</span></div>
            </div>
            {selectedUser.stats && (
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-surface-100 dark:border-surface-700">
                <div className="text-center p-3 rounded-xl bg-surface-50 dark:bg-surface-700"><p className="text-xl font-bold text-primary-600">{selectedUser.stats.totalIssued}</p><p className="text-[10px] text-surface-400">Total Issued</p></div>
                <div className="text-center p-3 rounded-xl bg-surface-50 dark:bg-surface-700"><p className="text-xl font-bold text-amber-600">{selectedUser.stats.currentlyBorrowed}</p><p className="text-[10px] text-surface-400">Currently Borrowed</p></div>
                <div className="text-center p-3 rounded-xl bg-surface-50 dark:bg-surface-700"><p className="text-xl font-bold text-red-500">₹{selectedUser.stats.totalFines}</p><p className="text-[10px] text-surface-400">Total Fines</p></div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
