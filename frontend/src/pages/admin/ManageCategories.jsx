import { useState, useEffect } from 'react';
import { categoryService } from '../../services/services';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/Modal';
import { FolderTree, Plus, Edit, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try { const { data } = await categoryService.getCategories(); setCategories(data); }
    catch (err) {} finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error('Name required');
    try {
      if (editId) { await categoryService.updateCategory(editId, form); toast.success('Updated'); }
      else { await categoryService.createCategory(form); toast.success('Created'); }
      setShowModal(false); setForm({ name: '', description: '' }); setEditId(null); fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await categoryService.deleteCategory(deleteId); toast.success('Deleted'); setDeleteId(null); fetchCategories(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openEdit = (cat) => { setEditId(cat._id); setForm({ name: cat.name, description: cat.description || '' }); setShowModal(true); };
  const openAdd = () => { setEditId(null); setForm({ name: '', description: '' }); setShowModal(true); };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Categories</h1><p className="page-subtitle">Manage book categories.</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Category</button>
      </div>

      {categories.length === 0 ? <EmptyState icon={FolderTree} title="No categories" /> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(c => (
            <div key={c._id} className="card p-5 flex items-start justify-between group">
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">{c.name}</h3>
                <p className="text-xs text-surface-400 mt-1">{c.description || 'No description'}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-600"><Edit size={14} /></button>
                <button onClick={() => setDeleteId(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null); }} title={editId ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="space-y-4">
          <div><label className="input-label">Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className="input-label">Description</label><textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button onClick={handleSubmit} className="btn-primary"><Save size={16} /> {editId ? 'Update' : 'Create'}</button></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Are you sure? Books using this category must be reassigned first." confirmText="Delete" danger />
    </div>
  );
};

export default ManageCategories;
