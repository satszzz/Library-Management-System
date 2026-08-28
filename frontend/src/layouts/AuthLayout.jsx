import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import analyticsArt from '../assets/analytics-art.jpg';

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0">
          <img src={analyticsArt} alt="Background Art" className="w-full h-full object-cover opacity-25 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-white">LibraVerse</span>
          </Link>

          <div className="space-y-4 max-w-lg">
            <span className="badge-info text-xs"><Sparkles size={12} /> Digital Library Platform</span>
            <h2 className="text-4xl font-display font-bold leading-tight">
              Manage your reading & borrowing journey effortlessly.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sign in to browse the book catalog, check active issues, reserve upcoming releases, and view your reading history.
            </p>
          </div>

          <div className="flex items-center gap-8 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
            <div><p className="text-lg font-bold text-white font-display">1,000+</p><p>Books Available</p></div>
            <div><p className="text-lg font-bold text-white font-display">Instant</p><p>Issue & Return</p></div>
            <div><p className="text-lg font-bold text-white font-display">100%</p><p>Automated Fines</p></div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 bg-slate-950">
        <div className="flex justify-between items-center">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">LibraVerse</span>
          </Link>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <Outlet />
        </div>

        <div className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LibraVerse System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
