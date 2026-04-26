import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  isUp?: boolean;
  icon: LucideIcon;
  color?: string;
  variant?: 'light' | 'dark';
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  trend, 
  isUp = true, 
  icon: Icon, 
  color = 'bg-blue-500',
  variant = 'light'
}) => {
  const iconColor = variant === 'dark' ? 'text-slate-900' : color.replace('bg-', 'text-');
  const iconBg = variant === 'dark' ? 'bg-slate-100' : `${color} bg-opacity-10`;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${iconBg} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={iconColor} size={20} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{value}</h3>
        {subValue && <p className="text-[10px] font-bold text-slate-400 mt-1 line-clamp-1">{subValue}</p>}
      </div>
    </div>
  );
};

export default StatCard;
