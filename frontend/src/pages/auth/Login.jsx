import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
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
        Welcome back
      </h1>
      <p className="text-surface-400 dark:text-surface-500 mb-8">
        Sign in to continue your reading journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              placeholder="Enter your password"
              className="input pl-11 pr-11"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-3 text-base"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-surface-400 dark:text-surface-500 mt-8">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
