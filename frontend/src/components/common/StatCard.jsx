import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, description, color = 'primary', index = 0 }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-500/10',
      icon: 'text-primary-600 dark:text-primary-400',
      border: 'border-primary-100 dark:border-primary-500/20',
    },
    secondary: {
      bg: 'bg-secondary-500/10 dark:bg-secondary-500/10',
      icon: 'text-secondary-600 dark:text-secondary-400',
      border: 'border-secondary-100 dark:border-secondary-500/20',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-500/20',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      icon: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-500/20',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500 truncate">
          {label || description}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
