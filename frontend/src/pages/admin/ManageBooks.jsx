import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService, categoryService } from '../../services/services';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/Modal';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchBooks(); }, [page]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchBooks(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await bookService.getBooks({ page, limit: 15, search });
      setBooks(data.books); setPages(data.pages);
    } catch (err) { toast.error('Failed to load books'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await bookService.deleteBook(deleteId);
      toast.success('Book deleted');
      setDeleteId(null);
      fetchBooks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h1 className="page-title">Manage Books</h1><p className="page-subtitle">Add, edit, and manage library books.</p></div>
        <Link to="/admin/books/add" className="btn-primary"><Plus size={16} /> Add Book</Link>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input className="input pl-10" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <PageLoader /> : books.length === 0 ? (
        <EmptyState title="No books found" message="Add your first book to get started." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Book</th><th>ISBN</th><th>Category</th><th>Copies</th><th>Borrowed</th><th>Actions</th></tr></thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                        {b.coverImage ? <img src={b.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-surface-300" /></div>}
                      </div>
                      <div><p className="font-medium text-surface-900 dark:text-white text-sm">{b.title}</p><p className="text-xs text-surface-400">{b.author}</p></div>
                    </div>
                  </td>
                  <td className="text-xs font-mono">{b.isbn}</td>
                  <td><span className="badge-neutral text-[10px]">{b.category?.name}</span></td>
                  <td><span className={b.availableCopies > 0 ? 'text-emerald-600' : 'text-red-500'}>{b.availableCopies}</span>/{b.totalCopies}</td>
                  <td>{b.borrowCount}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/books/edit/${b._id}`} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-600"><Edit size={15} /></Link>
                      <button onClick={() => setDeleteId(b._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Book" message="Are you sure? This action cannot be undone." confirmText="Delete" danger />
    </div>
  );
};

export default ManageBooks;
