import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService, categoryService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', category: '', publisher: '', publicationYear: '', description: '', coverImage: '', totalCopies: 1,
  });

  useEffect(() => { categoryService.getCategories().then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (isEdit) {
      bookService.getBook(id).then(({ data }) => {
        setForm({
          title: data.title, author: data.author, isbn: data.isbn, category: data.category?._id || data.category,
          publisher: data.publisher || '', publicationYear: data.publicationYear || '', description: data.description || '',
          coverImage: data.coverImage || '', totalCopies: data.totalCopies,
        });
      }).catch(() => toast.error('Failed to load book')).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, publicationYear: form.publicationYear ? parseInt(form.publicationYear) : undefined, totalCopies: parseInt(form.totalCopies) };
      if (isEdit) { await bookService.updateBook(id, payload); toast.success('Book updated!'); }
      else { await bookService.createBook(payload); toast.success('Book created!'); }
      navigate('/admin/books');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  if (fetching) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm"><ArrowLeft size={16} /> Back</button>
      <h1 className="page-title">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="input-label">Title *</label><input name="title" className="input" value={form.title} onChange={handleChange} required /></div>
          <div><label className="input-label">Author *</label><input name="author" className="input" value={form.author} onChange={handleChange} required /></div>
          <div><label className="input-label">ISBN *</label><input name="isbn" className="input" value={form.isbn} onChange={handleChange} required /></div>
          <div><label className="input-label">Category *</label><select name="category" className="input" value={form.category} onChange={handleChange} required><option value="">Select Category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
          <div><label className="input-label">Total Copies *</label><input name="totalCopies" type="number" min="1" className="input" value={form.totalCopies} onChange={handleChange} required /></div>
          <div><label className="input-label">Publisher</label><input name="publisher" className="input" value={form.publisher} onChange={handleChange} /></div>
          <div><label className="input-label">Publication Year</label><input name="publicationYear" type="number" className="input" value={form.publicationYear} onChange={handleChange} /></div>
          <div className="col-span-2"><label className="input-label">Cover Image URL</label><input name="coverImage" className="input" placeholder="https://..." value={form.coverImage} onChange={handleChange} /></div>
          <div className="col-span-2"><label className="input-label">Description</label><textarea name="description" className="input h-28 resize-none" value={form.description} onChange={handleChange} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary"><Save size={16} /> {isEdit ? 'Update' : 'Create'} Book</button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
