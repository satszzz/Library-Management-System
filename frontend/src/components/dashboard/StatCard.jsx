const StatCard = ({ title, value, icon: Icon, gradient = 'from-indigo-500 to-purple-500', subtitle, trend }) => (
  <div className="card p-5 overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            <span>{trend > 0 ? '▲' : '▼'}</span> {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

export default StatCard;
