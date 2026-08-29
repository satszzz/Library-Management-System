import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Trash2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { wishlistBooks as initialWishlist } from '../../data/user';
import { getBookById } from '../../data/books';

const Wishlist = () => {
  const [items, setItems] = useState(initialWishlist);

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <PageHeader
        title="My Wishlist ❤️"
        subtitle={`${items.length} books saved for later`}
      />

      {items.length === 0 ? (
        <EmptyState preset="no-wishlist" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/books/${item.bookId}`}
                  className="card card-hover group block overflow-hidden"
                >
                  {/* Cover */}
                  <div className="relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-800">
                    {getBookById(item.bookId)?.coverImage ? (
                      <img
                        src={getBookById(item.bookId).coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${item.coverGradient[0]}, ${item.coverGradient[1]})`,
                        }}
                      >
                        <BookOpen size={40} className="text-white/40" />
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-surface-900/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                    >
                      <Heart size={14} className="fill-rose-500" />
                    </button>

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                      {item.author}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
