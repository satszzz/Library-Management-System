import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4">LibraVerse</h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Discover. Borrow. Read.
          </p>
          <p className="text-sm text-white/50 text-center mt-4 max-w-sm">
            A modern digital library management platform for managing books, issues, and reservations.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-xs text-white/60 mt-1">Books</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-xs text-white/60 mt-1">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-xs text-white/60 mt-1">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-surface-900 dark:text-white">LibraVerse</span>
          </div>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ml-auto">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
