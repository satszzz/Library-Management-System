import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200 ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
