import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/services';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '', year: user?.year || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(profile);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Min 6 characters');
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div><h1 className="page-title">Profile</h1><p className="page-subtitle">Manage your account settings.</p></div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</div>
        <div>
          <p className="font-semibold text-surface-900 dark:text-white">{user?.name}</p>
          <p className="text-sm text-surface-500">{user?.email}</p>
          <span className="badge-info text-[10px] mt-1">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('profile')} className={`btn ${tab === 'profile' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'btn-ghost'}`}><User size={16} /> Profile</button>
        <button onClick={() => setTab('password')} className={`btn ${tab === 'password' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'btn-ghost'}`}><Lock size={16} /> Password</button>
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleProfileUpdate} className="card p-6 space-y-4">
          <div><label className="input-label">Name</label><input className="input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required /></div>
          <div><label className="input-label">Phone</label><input className="input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="input-label">Department</label><input className="input" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} /></div>
            <div><label className="input-label">Year</label><select className="input" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})}><option value="">Select</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary"><Save size={16} /> Save Changes</button>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange} className="card p-6 space-y-4">
          <div><label className="input-label">Current Password</label><input type="password" className="input" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required /></div>
          <div><label className="input-label">New Password</label><input type="password" className="input" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required /></div>
          <div><label className="input-label">Confirm New Password</label><input type="password" className="input" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} required /></div>
          <button type="submit" disabled={loading} className="btn-primary"><Lock size={16} /> Change Password</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
