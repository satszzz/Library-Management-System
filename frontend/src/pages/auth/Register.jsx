import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    year: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
        Create an account
      </h1>
      <p className="text-surface-400 dark:text-surface-500 mb-8">
        Join LibraVerse and start your reading journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="input-label">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              required
              placeholder="Your full name"
              className="input pl-11"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="input-label">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="email"
              required
              placeholder="you@university.edu"
              className="input pl-11"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type={showPass ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="input pl-11 pr-11"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="input-label">Phone (Optional)</label>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="input pl-11"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Department & Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Department</label>
            <select
              className="input"
              value={form.department}
              onChange={(e) => update('department', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="input-label">Year</label>
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
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-3 text-base"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-surface-400 dark:text-surface-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
