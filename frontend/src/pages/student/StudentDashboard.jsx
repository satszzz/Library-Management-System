import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  BookOpenCheck,
  Heart,
  Flame,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import {
  readingStats,
  borrowedBooks,
  readingActivity,
} from '../../data/user';
import { recentlyAdded } from '../../data/books';

const StudentDashboard = () => {
  const { user } = useAuth();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentBook = borrowedBooks[0];
  const userName = user?.name ? user.name.split(' ')[0] : 'Reader';

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${userName} 👋`}
        subtitle="Ready to continue your reading journey?"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={BookOpen}
          value={readingStats.booksBorrowed}
          label="Books Borrowed"
          color="primary"
          index={0}
        />
        <StatCard
          icon={BookOpenCheck}
          value={readingStats.currentlyReading}
          label="Currently Reading"
          color="emerald"
          index={1}
        />
        <StatCard
          icon={Heart}
          value={readingStats.wishlistCount}
          label="In Wishlist"
          color="rose"
          index={2}
        />
        <StatCard
          icon={Flame}
          value={`${readingStats.readingStreak} days`}
          label="Reading Streak"
          color="amber"
          index={3}
        />
      </div>

      {/* Continue Reading */}
      {currentBook && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
            Continue Your Journey
          </h2>
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Book cover */}
            <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl shadow-lg flex-shrink-0 overflow-hidden bg-surface-100 dark:bg-surface-800">
              {currentBook.coverImage ? (
                <img
                  src={currentBook.coverImage}
                  alt={currentBook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${currentBook.coverGradient[0]}, ${currentBook.coverGradient[1]})`,
                  }}
                >
                  <BookOpen size={28} className="text-white/40" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                {currentBook.title}
              </h3>
              <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">
                by {currentBook.author}
              </p>
              <span className="badge-info mt-2">{currentBook.category}</span>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-400 font-medium">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {currentBook.progress}%
                  </span>
                </div>
                <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentBook.progress}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"
                  />
                </div>
              </div>

              <Link
                to={`/books/${currentBook.bookId}`}
                className="btn-primary mt-4 text-sm"
              >
                <Eye size={16} />
                View Book
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two columns on desktop */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recently Added */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Recently Added
            </h2>
            <Link
              to="/explore"
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              See all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentlyAdded.slice(0, 4).map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
              >
                <div className="w-10 h-14 rounded-lg flex-shrink-0 overflow-hidden bg-surface-100 dark:bg-surface-800">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})`,
                      }}
                    >
                      <BookOpen size={14} className="text-white/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-xs text-surface-400 truncate">
                    {book.author}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    book.availableCopies > 0
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {book.availableCopies > 0 ? 'Available' : 'Out'}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Reading Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
            Reading Activity
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readingActivity}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-surface-100 dark:text-surface-800"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-surface-400"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-surface-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid var(--tooltip-border, #e2e8f0)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="pages"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPages)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
