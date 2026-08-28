import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', department: '', year: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-2">Create Account</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-6">Join the digital library today.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="input-label">Full Name</label>
          <input type="text" name="name" className="input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="input-label">Email Address</label>
          <input type="email" name="email" className="input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" className="input pr-10" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="input-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="input" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="input-label">Phone</label>
          <input type="text" name="phone" className="input" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Department</label>
            <input type="text" name="department" className="input" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} />
          </div>
          <div>
            <label className="input-label">Year</label>
            <select name="year" className="input" value={formData.year} onChange={handleChange}>
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><UserPlus size={18} />Create Account</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
