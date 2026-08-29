import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  Star,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/common/SearchBar';
import BookCard from '../../components/common/BookCard';
import CategoryCard from '../../components/common/CategoryCard';
import { trendingBooks, bookOfTheDay } from '../../data/books';
import { categories } from '../../data/categories';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Home = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/explore${search ? `?q=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-ambient-mesh" />
        <div className="absolute top-10 right-[15%] w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[10%] w-64 h-64 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-36 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6"
            >
              <Sparkles size={14} />
              Your Digital Library Platform
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            >
              Discover. Borrow.{' '}
              <span className="gradient-text">Read.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10"
            >
              Access thousands of books from our curated collection. Discover, explore,
              and manage your reading journey — all in one place.
            </motion.p>

            {/* Search */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="max-w-xl mx-auto"
            >
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
              />
            </motion.div>
          </div>

          {/* Floating book cards decoration */}
          <div className="hidden lg:block">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-24 right-[8%] w-28 h-36 rounded-xl shadow-xl overflow-hidden opacity-20 dark:opacity-15 rotate-12"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={24} className="text-white/60" />
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-24 left-[6%] w-24 h-32 rounded-xl shadow-xl overflow-hidden opacity-15 dark:opacity-10 -rotate-6"
              style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={20} className="text-white/60" />
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-40 left-[12%] w-20 h-28 rounded-lg shadow-lg overflow-hidden opacity-10 dark:opacity-8 rotate-6"
              style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={16} className="text-white/60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-2 mb-20">
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
          {[
            { icon: BookOpen, value: '1000+', label: 'Books', color: 'primary' },
            { icon: Users, value: '500+', label: 'Students', color: 'secondary' },
            { icon: Layers, value: '50+', label: 'Categories', color: 'emerald' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-5 text-center"
            >
              <p className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TRENDING BOOKS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
              Trending This Week
            </h2>
            <p className="text-sm text-surface-400 dark:text-surface-500 mt-1.5">
              Discover what readers are exploring right now.
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View All <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {trendingBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/explore" className="btn-secondary text-sm">
            View All Books <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Explore Categories
          </h2>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1.5">
            Browse our collection by your favorite topics
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* ===== BOOK OF THE DAY ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-500 p-8 md:p-12"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Book cover */}
            <div className="w-40 h-56 md:w-48 md:h-64 rounded-2xl shadow-2xl overflow-hidden flex-shrink-0 bg-black/20">
              {bookOfTheDay.coverImage ? (
                <img
                  src={bookOfTheDay.coverImage}
                  alt={bookOfTheDay.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${bookOfTheDay.coverGradient[0]}, ${bookOfTheDay.coverGradient[1]})`,
                  }}
                >
                  <BookOpen size={48} className="text-white/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-4">
                <Star size={12} className="fill-white/80" />
                Book of the Day
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                {bookOfTheDay.title}
              </h3>
              <p className="text-white/70 text-sm mb-2">
                by {bookOfTheDay.author}
              </p>
              <p className="text-white/60 text-sm max-w-lg mb-4 line-clamp-3">
                {bookOfTheDay.description}
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-lg">
                  {bookOfTheDay.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(bookOfTheDay.rating)
                          ? 'text-amber-300 fill-amber-300'
                          : 'text-white/30'
                      }
                    />
                  ))}
                  <span className="text-xs text-white/70 ml-1">
                    {bookOfTheDay.rating}
                  </span>
                </div>
              </div>
              <Link
                to={`/books/${bookOfTheDay.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg"
              >
                Explore Book <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card p-10 md:p-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Start Your Reading Journey
          </h2>
          <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-8">
            Join LibraVerse today and get access to thousands of books at your
            fingertips.
          </p>
          <Link to="/register" className="btn-gradient px-8 py-3 text-base">
            Get Started <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
