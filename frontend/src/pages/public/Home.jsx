import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { bookService, categoryService } from '../../services/services';
import { BookOpen, Search, ArrowRight, Sun, Moon, Star, Users, BookCopy, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white">LibraVerse</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user ? (
              <Link to={dashboardLink} className="btn-primary text-sm">Dashboard</Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-accent-600/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 animate-fade-in">
            <Star size={14} /> Your Digital Library Platform
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-surface-900 dark:text-white mb-6 animate-slide-up">
            Discover. Borrow.{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Read.</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up">
            Access thousands of books from our curated collection. Issue, reserve, and manage your reading journey — all in one place.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto animate-slide-up">
            <div className="relative group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-lg shadow-surface-200/50 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-base transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link
                to={user ? `/student/books${search ? `?search=${search}` : ''}` : '/login'}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-5"
              >
                Search <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Books Available', value: '1000+', gradient: 'stat-gradient-1' },
            { icon: Users, label: 'Active Readers', value: '500+', gradient: 'stat-gradient-4' },
            { icon: BookCopy, label: 'Books Issued', value: '5000+', gradient: 'stat-gradient-3' },
            { icon: Shield, label: 'Categories', value: `${categories.length}+`, gradient: 'stat-gradient-2' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.gradient} rounded-xl flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-surface-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-surface-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white">Popular Books</h2>
            <Link to={user ? '/student/books' : '/login'} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {featuredBooks.map((book) => (
              <Link key={book._id} to={user ? `/books/${book._id}` : '/login'} className="card overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="h-44 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 overflow-hidden">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen size={36} className="text-primary-300" /></div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-surface-400 mt-0.5">{book.author}</p>
                  <span className={`text-[10px] mt-1.5 inline-block ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
          <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <div key={cat._id} className="card p-4 text-center hover:shadow-card-hover transition-all cursor-pointer group">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen size={20} className="text-primary-500" />
                </div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-white dark:bg-surface-900 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Search', desc: 'Explore our vast collection of books by title, author, or category.' },
              { step: '02', title: 'Issue or Reserve', desc: 'Issue available books instantly or reserve unavailable ones to get notified.' },
              { step: '03', title: 'Read & Return', desc: 'Enjoy your books and return them before the due date to avoid fines.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-display font-bold text-lg mb-4">{item.step}</div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-10 md:p-16 text-center text-white">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Start Your Reading Journey</h2>
            <p className="text-white/80 max-w-md mx-auto mb-6">Join LibraVerse today and get access to thousands of books at your fingertips.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-surface-700 dark:text-surface-300">LibraVerse</span>
          </div>
          <p className="text-sm text-surface-400">© {new Date().getFullYear()} LibraVerse. Built with MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
