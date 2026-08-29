import { motion } from 'framer-motion';
import { BookOpen, Search, InboxIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const presets = {
  'no-books': {
    icon: BookOpen,
    heading: 'Your library is waiting!',
    text: "You haven't borrowed any books yet.",
    actionText: 'Explore Books',
    actionLink: '/explore',
  },
  'no-results': {
    icon: Search,
    heading: 'No books found',
    text: 'Try searching for another title, author, or category.',
    actionText: null,
    actionLink: null,
  },
  'no-wishlist': {
    icon: BookOpen,
    heading: 'Your wishlist is empty',
    text: 'Start adding books you want to read later.',
    actionText: 'Explore Books',
    actionLink: '/explore',
  },
  'no-notifications': {
    icon: InboxIcon,
    heading: 'All caught up!',
    text: "You don't have any notifications right now.",
    actionText: null,
    actionLink: null,
  },
};

const EmptyState = ({
  preset,
  icon: CustomIcon,
  heading,
  text,
  actionText,
  actionLink,
  className = '',
}) => {
  const config = preset ? presets[preset] : {};
  const Icon = CustomIcon || config.icon || BookOpen;
  const h = heading || config.heading;
  const t = text || config.text;
  const aText = actionText || config.actionText;
  const aLink = actionLink || config.actionLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-5">
        <Icon size={36} className="text-primary-400 dark:text-primary-500" />
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
        {h}
      </h3>
      <p className="text-sm text-surface-400 dark:text-surface-500 max-w-sm">
        {t}
      </p>
      {aText && aLink && (
        <Link to={aLink} className="btn-primary mt-6 text-sm">
          {aText}
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;
