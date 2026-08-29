import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left — Gradient branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-500">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          {/* Logo */}
          <div className="w-16 h-16 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <BookOpen size={32} className="text-white" />
          </div>

          <h1 className="text-4xl font-display font-bold text-white text-center mb-4">
            LibraVerse
          </h1>
          <p className="text-lg text-white/70 text-center max-w-sm">
            Discover. Borrow. Read.
          </p>
          <p className="text-sm text-white/50 text-center mt-2 max-w-xs">
            Your Digital Library Platform — access thousands of books from our curated collection.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12">
            {[
              { value: '1000+', label: 'Books' },
              { value: '500+', label: 'Students' },
              { value: '50+', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form area */}
      <div className="flex-1 flex flex-col bg-surface-50 dark:bg-surface-950">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 lg:invisible">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white">
              LibraVerse
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
