import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}
    >
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </motion.div>
  );
};

export default PageHeader;
