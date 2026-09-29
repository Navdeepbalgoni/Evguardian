import React from 'react';

export const ChartCard = ({
  title,
  subtitle,
  badge,
  badgeColor = 'cyan',
  children,
  actionRight,
  className = ''
}) => {
  const badgeClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className={`glass-panel rounded-2xl p-5 md:p-6 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeClasses[badgeColor] || badgeClasses.cyan}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actionRight && (
          <div className="flex items-center gap-2">
            {actionRight}
          </div>
        )}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
