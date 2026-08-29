import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const CategoryCard = ({ category, index = 0 }) => {
  const IconComponent = Icons[category.icon] || Icons.BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card card-hover p-5 text-center cursor-pointer group"
    >
      <div
        className={`w-14 h-14 mx-auto rounded-2xl ${category.bgLight} ${category.bgDark} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
      >
        <IconComponent size={24} className={category.textColor} />
      </div>
      <p className="font-semibold text-sm text-slate-900 dark:text-white">
        {category.name}
      </p>
      <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
        {category.bookCount} books
      </p>
    </motion.div>
  );
};

export default CategoryCard;
