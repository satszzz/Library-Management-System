import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { bookService, categoryService } from '../../services/services';
import { BookOpen, Search, ArrowRight, Sun, Moon, Star, Users, BookCopy, Shield, Sparkles, BarChart3, QrCode } from 'lucide-react';
import heroBanner from '../../assets/hero-banner.jpg';
import analyticsArt from '../../assets/analytics-art.jpg';

const Home = () => {
  const { user, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    bookService.getBooks({ limit: 8, sort: '-borrowCount' }).then(r => setFeaturedBooks(r.data.books)).catch(() => {});
    categoryService.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const dashboardLink = user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-ambient-mesh">
      {/* Navbar */}
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              LibraVerse
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <Link to={dashboardLink} className="btn-primary text-sm">
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Interactive Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="text-indigo-400 animate-pulse" /> Next-Gen Digital Library System
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight">
                Discover. Borrow.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Read Anything.
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                Access thousands of physical & digital books with instant availability tracking, automatic fine management, QR book scans, and real-time reservation queues.
              </p>

              {/* Interactive Search Bar */}
              <div className="relative max-w-xl pt-2">
                <div className="relative group">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search titles, authors, or ISBN..."
                    className="w-full pl-12 pr-36 py-4 rounded-2xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm shadow-2xl transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Link
                    to={user ? `/student/books${search ? `?search=${search}` : ''}` : '/login'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-5 text-xs font-semibold py-2.5"
                  >
                    Search <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-time Inventory</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode size={14} className="text-indigo-400" />
                  <span>QR Scan Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-purple-400" />
                  <span>Automated Fines</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Image Banner */}
            <div className="lg:col-span-5 relative animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl shadow-indigo-500/10 group">
                <img
                  src={heroBanner}
                  alt="Digital Library Preview"
                  className="w-full h-auto object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/10">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-indigo-300 font-display">✨ Digital Archive 2.0</span>
                    <span className="badge-success text-[10px]">Active System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Total Books', value: '1,000+', color: 'from-indigo-500 to-blue-500' },
            { icon: Users, label: 'Registered Readers', value: '500+', color: 'from-purple-500 to-pink-500' },
            { icon: BookCopy, label: 'Issues Processed', value: '5,000+', color: 'from-cyan-500 to-teal-500' },
            { icon: Shield, label: 'Active Categories', value: `${categories.length || 9}+`, color: 'from-amber-500 to-rose-500' },
          ].map((item) => (
            <div key={item.label} className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                <item.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold font-display text-white">{item.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Visual Showcase */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center card p-8 md:p-12 border-slate-800/80 bg-slate-900/40">
          <div className="space-y-5">
            <span className="badge-info">Interactive Dashboard</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Real-time Analytics & Circulation Reports
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track borrow rates by category, monthly issue volume, overdue fine collection, and student leaderboards with interactive Recharts visual representations.
            </p>
            <div className="pt-2 flex flex-col gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                <span>Monthly borrowing vs returning comparative charts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                <span>Automatic reservation queue notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                <span>Export reports directly to CSV for administrative record-keeping</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img src={analyticsArt} alt="Analytics Visual Preview" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Featured Books Catalog */}
      {featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Popular Titles</h2>
              <p className="text-xs text-slate-400 mt-1">Most frequently issued books in the collection</p>
            </div>
            <Link to={user ? '/student/books' : '/login'} className="btn-outline text-xs">
              View Catalog <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {featuredBooks.map((book) => (
              <Link key={book._id} to={user ? `/books/${book._id}` : '/login'} className="card overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="h-48 bg-slate-800 overflow-hidden relative">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen size={40} className="text-slate-600" /></div>
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Copies` : 'Unavailable'}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-semibold text-white truncate">{book.title}</h3>
                  <p className="text-xs text-slate-400">{book.author}</p>
                  <p className="text-[10px] text-indigo-400 font-medium pt-1">{book.category?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">LibraVerse LMS</span>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} LibraVerse. Built with Node.js, Express, React, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
