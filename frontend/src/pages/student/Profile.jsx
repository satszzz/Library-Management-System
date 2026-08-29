import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  BookOpen,
  Star,
  Clock,
  Edit3,
  Save,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { readingStats } from '../../data/user';
import api from '../../services/api';

const Profile = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        year: user.year || '',
      });
    }
  }, [user]);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Total Borrowed', value: readingStats.booksBorrowed, color: 'text-primary-600 dark:text-primary-400' },
    { icon: Star, label: 'Avg Rating', value: readingStats.averageRating, color: 'text-amber-500' },
    { icon: Clock, label: 'On-time Returns', value: readingStats.booksReturnedOnTime, color: 'text-emerald-500' },
    { icon: BookOpen, label: 'Pages Read', value: readingStats.totalPagesRead.toLocaleString(), color: 'text-secondary-500' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal information" />

      {/* Profile header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-primary-500/20 flex-shrink-0">
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-surface-400 dark:text-surface-500 mt-0.5">
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="badge-info">{user?.role || 'student'}</span>
              {user?.department && <span className="badge-neutral">{user.department}</span>}
              {user?.year && <span className="badge-neutral">{user.year}</span>}
            </div>
          </div>

          <button
            disabled={saving}
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className={editing ? 'btn-primary text-sm' : 'btn-secondary text-sm'}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editing ? (
              <>
                <Save size={16} /> Save Profile
              </>
            ) : (
              <>
                <Edit3 size={16} /> Edit Profile
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="input-label flex items-center gap-1.5">
                <User size={14} /> Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
              ) : (
                <p className="text-sm text-slate-900 dark:text-white py-2 font-medium">
                  {user?.name || 'N/A'}
                </p>
              )}
            </div>
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Mail size={14} /> Email
              </label>
              <p className="text-sm text-surface-400 py-2">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Phone size={14} /> Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  className="input"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              ) : (
                <p className="text-sm text-slate-900 dark:text-white py-2 font-medium">
                  {user?.phone || 'Not provided'}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <Building size={14} /> Department
                </label>
                {editing ? (
                  <select
                    className="input"
                    value={form.department}
                    onChange={(e) => update('department', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                ) : (
                  <p className="text-sm text-slate-900 dark:text-white py-2 font-medium">
                    {user?.department || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <GraduationCap size={14} /> Year
                </label>
                {editing ? (
                  <select
                    className="input"
                    value={form.year}
                    onChange={(e) => update('year', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                ) : (
                  <p className="text-sm text-slate-900 dark:text-white py-2 font-medium">
                    {user?.year || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Calendar size={14} /> Account Status
              </label>
              <span className="badge-success mt-1">Active Account</span>
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Reading Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
              Reading Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <stat.icon size={20} className={stat.color} />
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-surface-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
              Preferences
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  isDark ? 'bg-primary-600' : 'bg-surface-200'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
