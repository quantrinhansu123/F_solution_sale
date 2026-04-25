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
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${iconBg} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={iconColor} size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className={`text-xs font-black px-2 py-1 rounded-lg ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {subValue && <p className="text-xs font-bold text-slate-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

export default StatCard;
