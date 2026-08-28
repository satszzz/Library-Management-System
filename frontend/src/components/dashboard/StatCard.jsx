const StatCard = ({ title, value, icon: Icon, gradient = 'stat-gradient-1', subtitle, trend }) => (
  <div className="card overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
    <div className="p-5 flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
        <p className="text-3xl font-bold font-display text-surface-900 dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1.5 ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
